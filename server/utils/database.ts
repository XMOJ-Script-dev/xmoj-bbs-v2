// @ts-nocheck
/*
 *     Copyright (C) 2023-2025  XMOJ-bbs contributors
 *     This file is part of XMOJ-bbs.
 *     XMOJ-bbs is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     XMOJ-bbs is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with XMOJ-bbs.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Result, ThrowErrorIfFailed } from "./resultUtils";
import { Output } from "./output";
import type { D1Database } from "@cloudflare/workers-types";

let readonly = false; // set to true to allow maintenance

// Whitelist of allowed tables and columns to prevent SQL injection
const ALLOWED_TABLES = [
  'bbs_post', 'bbs_reply', 'bbs_board', 'bbs_mention', 'bbs_lock',
  'badge', 'phpsessid', 'mail', 'image', 'std', 'std_answer', 'short_message',
  'bbs_admin', 'bbs_silenced', 'bbs_deny_message', 'bbs_deny_badge_edit', 'short_message_mention'
];

const ALLOWED_COLUMNS: Record<string, string[]> = {
  'bbs_post': ['post_id', 'user_id', 'problem_id', 'title', 'content', 'board_id', 'post_time', 'last_reply_time', 'edit_time', 'edit_person'],
  'bbs_reply': ['reply_id', 'post_id', 'user_id', 'content', 'reply_time', 'edit_time', 'edit_person'],
  'bbs_board': ['board_id', 'board_name'],
  'bbs_mention': ['bbs_mention_id', 'post_id', 'reply_id', 'to_user_id', 'from_user_id', 'bbs_mention_time'],
  'bbs_lock': ['post_id', 'lock_time', 'lock_person'],
  'badge': ['user_id', 'background_color', 'color', 'content'],
  'phpsessid': ['token', 'user_id', 'create_time'],
  'mail': ['mail_id', 'from_user_id', 'to_user_id', 'title', 'content', 'send_time', 'read'],
  'image': ['image_id', 'user_id', 'path', 'upload_time'],
  'std': ['std_id', 'user_id', 'problem_id', 'content', 'upload_time'],
  'std_answer': ['problem_id', 'std_code'],
  'short_message': ['message_id', 'message_from', 'message_to', 'content', 'send_time', 'is_read'],
  'bbs_admin': ['user_id'],
  'bbs_silenced': ['user_id', 'silenced_until'],
  'bbs_deny_message': ['user_id'],
  'bbs_deny_badge_edit': ['user_id'],
  'short_message_mention': ['mention_id', 'message_id', 'to_user_id', 'from_user_id', 'mention_time']
};

function validateTableName(table: string): void {
  if (!ALLOWED_TABLES.includes(table)) {
    throw new Error('Invalid table name');
  }
}

function validateColumnName(table: string, column: string): void {
  const allowedCols = ALLOWED_COLUMNS[table];
  if (!allowedCols || !allowedCols.includes(column)) {
    throw new Error('Invalid column name');
  }
}

export class Database {
  private RawDatabase: D1Database;

  constructor(RawDatabase: D1Database) {
    this.RawDatabase = RawDatabase;
  }

  private async Query(QueryString: string, BindData: string[]): Promise<Result> {
    Output.Debug("Executing SQL query: \n" +
      "    Query    : \"" + QueryString + "\"\n" +
      "    Arguments: " + JSON.stringify(BindData) + "\n");
    try {
      let SQLResult = await this.RawDatabase.prepare(QueryString).bind(...BindData).all()
      Output.Debug("SQL query returned with result: \n" +
        "    Result: \"" + JSON.stringify(SQLResult) + "\"\n");
      return new Result(true, "数据库查询成功", SQLResult);
    } catch (ErrorDetail) {
      Output.Warn("Error while executing SQL query: \n" +
        "    Query    : \"" + QueryString + "\"\n" +
        "    Arguments: " + JSON.stringify(BindData) + "\n" +
        "    Error    : \"" + ErrorDetail);
      return new Result(false, "数据库查询失败，请稍后重试");
    }
  }

  // (intentionally no public raw query method; complex reads should be carefully reviewed)

  /**
   * Execute a complex read-only query with parameterized bindings.
   * This is for queries that require JOINs, subqueries, or other complex operations
   * that can't be expressed through the standard Select() method.
   * IMPORTANT: Only use for SELECT queries. All parameters must be bound using ?.
   * @param sql The SQL query string with ? placeholders
   * @param bindParams Array of values to bind to the query
   * @returns Result containing the query results
   */
  public async ExecuteComplexQuery(sql: string, bindParams: any[]): Promise<Result> {
    // Validate that this is a read-only query
    const trimmedSql = sql.trim().toUpperCase();
    if (!trimmedSql.startsWith('SELECT')) {
      return new Result(false, "ExecuteComplexQuery only supports SELECT queries");
    }

    // Remove comments and string literals before pattern matching to prevent bypasses
    let cleanedSql = trimmedSql;
    // Remove single-line comments (-- ...)
    cleanedSql = cleanedSql.replace(/--[^\n]*\n/g, ' ');
    // Remove multi-line comments (/* ... */)
    cleanedSql = cleanedSql.replace(/\/\*[\s\S]*?\*\//g, ' ');
    // Remove single-quoted string literals
    cleanedSql = cleanedSql.replace(/'[^']*'/g, ' ');
    // Remove double-quoted identifiers/strings
    cleanedSql = cleanedSql.replace(/"[^"]*"/g, ' ');

    // Validate that query doesn't contain dangerous operations
    const dangerousPatterns = [
      'DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'TRUNCATE',
      'ATTACH', 'DETACH', 'PRAGMA', 'REPLACE', 'MERGE', 'EXEC', 'EXECUTE'
    ];
    for (const pattern of dangerousPatterns) {
      // Use word boundaries to match whole words only
      const regex = new RegExp('\\b' + pattern + '\\b', 'i');
      if (regex.test(cleanedSql)) {
        Output.Warn("ExecuteComplexQuery blocked dangerous pattern: " + pattern + " in query: " + sql.substring(0, 100));
        return new Result(false, "ExecuteComplexQuery detected potentially dangerous SQL operation");
      }
    }

    // Log all ExecuteComplexQuery usage for audit purposes
    Output.Log("ExecuteComplexQuery called: " + sql.substring(0, 100) + "...");

    Output.Debug("Executing complex SQL query: \n" +
      "    Query    : \"" + sql + "\"\n" +
      "    Arguments: " + JSON.stringify(bindParams) + "\n");

    try {
      const SQLResult = await this.RawDatabase.prepare(sql).bind(...bindParams).all();
      Output.Debug("Complex SQL query returned with result: \n" +
        "    Result: \"" + JSON.stringify(SQLResult) + "\"\n");
      return new Result(true, "数据库查询成功", SQLResult);
    } catch (ErrorDetail) {
      Output.Warn("Error while executing complex SQL query: \n" +
        "    Query    : \"" + sql + "\"\n" +
        "    Arguments: " + JSON.stringify(bindParams) + "\n" +
        "    Error    : \"" + ErrorDetail);
      return new Result(false, "数据库查询失败，请稍后重试");
    }
  }

  public async Insert(Table: string, Data: object): Promise<Result> {
    if (readonly) {
      return new Result(false, "数据库只读模式，无法写入");
    }
    validateTableName(Table);
    let QueryString = "INSERT INTO `" + Table + "` (";
    for (const key of Object.keys(Data)) {
      validateColumnName(Table, key);
      const i = key;
      QueryString += "`" + i + "`, ";
    }
    QueryString = QueryString.substring(0, QueryString.length - 2);
    QueryString += ") VALUES (";
    for (const _ of Object.keys(Data)) {
      QueryString += "?, ";
    }
    QueryString = QueryString.substring(0, QueryString.length - 2);
    QueryString += ");";
    let BindData = Array();
    for (const key of Object.keys(Data)) {
      BindData.push(Data[key]);
    }
    return new Result(true, "数据库插入成功", {
      "InsertID": ThrowErrorIfFailed(await this.Query(QueryString, BindData))["meta"]["last_row_id"]
    });
  }

  public async Select(Table: string, Data: string[], Condition?: object, Other?: object, Distinct?: boolean): Promise<Result> {
    validateTableName(Table);
    const allowedOperators = new Set(["=", "<>", "<", ">", "<=", ">=", "LIKE", "IN", "NOT IN"]);
    let QueryString = "SELECT ";
    if (Distinct !== undefined && Distinct) {
      QueryString += "DISTINCT ";
    }
    if (Data.length == 0) {
      QueryString += "*";
    } else {
      for (const col of Data) {
        validateColumnName(Table, col);
        QueryString += "`" + col + "`, ";
      }
      QueryString = QueryString.substring(0, QueryString.length - 2);
    }
    QueryString += " FROM `" + Table + "`";
    if (Condition !== undefined) {
      QueryString += " WHERE ";
      for (const key of Object.keys(Condition)) {
        validateColumnName(Table, key);
        const i = key;
        if (typeof Condition[i] != "object") {
          QueryString += "`" + i + "` = ? AND ";
        } else {
          const op = String(Condition[i]["Operator"]).toUpperCase();
          if (!allowedOperators.has(op)) {
            return new Result(false, "非法的SQL操作符");
          }
          QueryString += "`" + i + "` " + op + " ? AND ";
        }
      }
      QueryString = QueryString.substring(0, QueryString.length - 5);
    }
    if (Other !== undefined) {
      if ((Other["Order"] !== undefined && Other["OrderIncreasing"] === undefined) ||
        (Other["Order"] === undefined && Other["OrderIncreasing"] !== undefined)) {
        return new Result(false, "排序关键字和排序顺序必须同时定义或非定义");
      }
      if (Other["Order"] !== undefined && Other["OrderIncreasing"] !== undefined) {
        // Validate order column name against whitelist to prevent injection
        validateColumnName(Table, Other["Order"] as string);
        QueryString += " ORDER BY `" + Other["Order"] + "` " + (Other["OrderIncreasing"] ? "ASC" : "DESC");
      }
      if (Other["Limit"] !== undefined) {
        const limit = Number(Other["Limit"]);
        if (!Number.isInteger(limit) || limit < 0) {
          return new Result(false, "LIMIT必须是非负整数");
        }
        QueryString += " LIMIT " + limit;
      }
      if (Other["Offset"] !== undefined) {
        const offset = Number(Other["Offset"]);
        if (!Number.isInteger(offset) || offset < 0) {
          return new Result(false, "OFFSET必须是非负整数");
        }
        QueryString += " OFFSET " + offset;
      }
    }
    QueryString += ";";
    let BindData = Array();
    if (Condition !== undefined) {
      for (const key of Object.keys(Condition)) {
        if (typeof Condition[key] != "object") {
          BindData.push(Condition[key]);
        } else {
          BindData.push(Condition[key]["Value"]);
        }
      }
    }
    return new Result(true, "数据库查找成功", ThrowErrorIfFailed(await this.Query(QueryString, BindData))["results"]);
  }

  public async Update(Table: string, Data: object, Condition?: object): Promise<Result> {
    const allowedOperators = new Set(["=", "<>", "<", ">", "<=", ">=", "LIKE", "IN", "NOT IN"]);
    if (readonly) {
      return new Result(false, "数据库只读模式，无法写入");
    }
    validateTableName(Table);
    let QueryString = "UPDATE `" + Table + "` SET ";
    for (const key of Object.keys(Data)) {
      validateColumnName(Table, key);
      QueryString += "`" + key + "` = ?, ";
    }
    QueryString = QueryString.substring(0, QueryString.length - 2);
    if (Condition !== undefined) {
      QueryString += " WHERE ";
      for (const key of Object.keys(Condition)) {
        validateColumnName(Table, key);
        if (typeof Condition[key] != "object") {
          QueryString += "`" + key + "` = ? AND ";
        } else {
          const op = String(Condition[key]["Operator"]).toUpperCase();
          if (!allowedOperators.has(op)) {
            return new Result(false, "非法的SQL操作符");
          }
          QueryString += "`" + key + "` " + op + " ? AND ";
        }
      }
      QueryString = QueryString.substring(0, QueryString.length - 5);
    }
    QueryString += ";";
    let BindData = Array();
    for (const key of Object.keys(Data)) {
      BindData.push(Data[key]);
    }
    if (Condition !== undefined) {
      for (const key of Object.keys(Condition)) {
        if (typeof Condition[key] != "object") {
          BindData.push(Condition[key]);
        } else {
          BindData.push(Condition[key]["Value"]);
        }
      }
    }
    return new Result(true, "数据库更新成功", ThrowErrorIfFailed(await this.Query(QueryString, BindData))["results"]);
  }

  public async GetTableSize(Table: string, Condition?: object): Promise<Result> {
    validateTableName(Table);
    const allowedOperators = new Set(["=", "<>", "<", ">", "<=", ">=", "LIKE", "IN", "NOT IN"]);
    let QueryString = "SELECT COUNT(*) FROM `" + Table + "`";
    if (Condition !== undefined) {
      QueryString += " WHERE ";
      for (const key of Object.keys(Condition)) {
        validateColumnName(Table, key);
        if (typeof Condition[key] != "object") {
          QueryString += "`" + key + "` = ? AND ";
        } else {
          const op = String(Condition[key]["Operator"]).toUpperCase();
          if (!allowedOperators.has(op)) {
            return new Result(false, "非法的SQL操作符");
          }
          QueryString += "`" + key + "` " + op + " ? AND ";
        }
      }
      QueryString = QueryString.substring(0, QueryString.length - 5);
    }
    QueryString += ";";
    let BindData = Array();
    if (Condition !== undefined) {
      for (const key of Object.keys(Condition)) {
        if (typeof Condition[key] != "object") {
          BindData.push(Condition[key]);
        } else {
          BindData.push(Condition[key]["Value"]);
        }
      }
    }
    return new Result(true, "数据库获得大小成功", {
      "TableSize": ThrowErrorIfFailed(await this.Query(QueryString, BindData))["results"][0]["COUNT(*)"]
    });
  }

  public async Delete(Table: string, Condition?: object): Promise<Result> {
    const allowedOperators = new Set(["=", "<>", "<", ">", "<=", ">=", "LIKE", "IN", "NOT IN"]);
    if (readonly) {
      return new Result(false, "数据库只读模式，无法写入");
    }
    validateTableName(Table);
    let QueryString = "DELETE FROM `" + Table + "`";
    if (Condition !== undefined) {
      QueryString += " WHERE ";
      for (const key of Object.keys(Condition)) {
        validateColumnName(Table, key);
        if (typeof Condition[key] != "object") {
          QueryString += "`" + key + "` = ? AND ";
        } else {
          const op = String(Condition[key]["Operator"]).toUpperCase();
          if (!allowedOperators.has(op)) {
            return new Result(false, "非法的SQL操作符");
          }
          QueryString += "`" + key + "` " + op + " ? AND ";
        }
      }
      QueryString = QueryString.substring(0, QueryString.length - 5);
    }
    QueryString += ";";
    let BindData = Array();
    if (Condition !== undefined) {
      for (const key of Object.keys(Condition)) {
        if (typeof Condition[key] != "object") {
          BindData.push(Condition[key]);
        } else {
          BindData.push(Condition[key]["Value"]);
        }
      }
    }
    return new Result(true, "数据库删除成功", ThrowErrorIfFailed(await this.Query(QueryString, BindData))["results"]);
  }
}
