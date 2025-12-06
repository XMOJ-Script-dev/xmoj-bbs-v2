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

import { Output } from "./output";

/**
 * 处理C++代码字符串，正确转义换行符和引号
 * 用于GetStd端点，确保代码可以被正确解析
 */
export function processCppString(inputStr: string): string {
  let result = '';
  let i = 0;
  const len = inputStr.length;

  while (i < len) {
    // Check for a raw string literal: R"(
    if (inputStr.substring(i, i + 4) === 'R\\"(') {
      const rawStringStart = i;
      const rawStringEnd = inputStr.indexOf(')\\"', rawStringStart + 4);

      if (rawStringEnd !== -1) {
        // Append the entire raw string literal without modification
        result += inputStr.substring(rawStringStart, rawStringEnd + 3);
        i = rawStringEnd + 3;
        continue;
      }
    }

    // Check for a regular string literal: \"
    if (inputStr.substring(i, i + 2) === '\\"') {
      result += '\\"'; // Append the opening quote
      i += 2;

      // Process the content inside the regular string
      while (i < len) {
        // Case 1: An escaped backslash. This is key for handling \\\"
        if (inputStr.substring(i, i + 3) === '\\\\n') {
          result += '\\\\n'; // Keep it as is
          i += 3;
          Output.Debug("Escaped backslash found, keeping it as is");
        }
        if (inputStr.substring(i, i + 4) === '\\\\\\\"') {
          result += '\\\\\\\"'; // Keep it as is
          i += 4;
          Output.Debug("Escaped backslash found, keeping it as is");
        }
        // Case 2: A string-terminating quote. This is NOT preceded by another backslash.
        else if (inputStr.substring(i, i + 2) === '\\"') {
          result += '\\"'; // Append the closing quote
          i += 2;
          break; // Exit the inner string-processing loop
        }
        // Case 3: A newline character sequence '\n'
        else if (inputStr.substring(i, i + 2) === '\\n') {
          result += '\\\\n'; // Replace '\n' with '\\n'
          i += 2;
          Output.Debug("AT newline character, replacing with \\\\n: " + inputStr.substring(i - 4, i + 2));
        }
        // Case 4: Any other character
        else {
          result += inputStr[i];
          i++;
        }
      }
    } else {
      // Append any character that is not part of a string we're processing
      result += inputStr[i];
      i++;
    }
  }
  
  Output.Debug("Processed C++ string");
  return result;
}
