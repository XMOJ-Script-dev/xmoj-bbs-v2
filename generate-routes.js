#!/usr/bin/env node

/**
 * Route Generator Script
 * 用于批量生成剩余的API路由文件
 * 
 * 使用方法:
 * node generate-routes.js
 */

const fs = require('fs');
const path = require('path');

const COPYRIGHT_HEADER = `/*
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
 */`;

// 待生成的路由配置
const routes = [
  {
    name: 'EditReply',
    params: { ReplyID: 'number', Content: 'string' },
    description: '编辑回复'
  },
  {
    name: 'DeletePost',
    params: { PostID: 'number' },
    description: '删除帖子'
  },
  {
    name: 'DeleteReply',
    params: { ReplyID: 'number' },
    description: '删除回复'
  },
  {
    name: 'LockPost',
    params: { PostID: 'number' },
    description: '锁定帖子'
  },
  {
    name: 'UnlockPost',
    params: { PostID: 'number' },
    description: '解锁帖子'
  },
  {
    name: 'GetBBSMentionList',
    params: {},
    description: '获取BBS提及列表'
  },
  {
    name: 'ReadBBSMention',
    params: { MentionID: 'number' },
    description: '标记BBS提及为已读'
  },
  {
    name: 'GetBoards',
    params: {},
    description: '获取板块列表'
  },
  {
    name: 'GetMailList',
    params: {},
    description: '获取短消息列表'
  },
  {
    name: 'SendMail',
    params: { ToUser: 'string', Content: 'string' },
    description: '发送短消息'
  },
  {
    name: 'GetMail',
    params: { OtherUser: 'string' },
    description: '获取与某用户的短消息'
  },
  // ... 添加更多路由
];

function generateRouteFile(route) {
  const paramsStr = JSON.stringify(route.params, null, 4);
  
  const template = `${COPYRIGHT_HEADER}

import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { CheckParams } from "~/utils/checkPrams";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth, requestMeta, cloudflare } = event.context;
  
  // ${route.description}
  ThrowErrorIfFailed(CheckParams(Data, ${paramsStr}));
  
  // TODO: 实现${route.description}的业务逻辑
  // 参考 old/Process.ts 中的 ${route.name} 函数
  
  return new Result(true, "${route.description}成功", {});
});
`;

  const filePath = path.join(__dirname, 'server', 'routes', `${route.name}.ts`);
  fs.writeFileSync(filePath, template, 'utf8');
  console.log(`✓ 生成 ${route.name}.ts`);
}

// 生成所有路由
console.log('开始生成路由文件...\n');
routes.forEach(generateRouteFile);
console.log('\n完成！请参考 old/Process.ts 实现具体业务逻辑。');
