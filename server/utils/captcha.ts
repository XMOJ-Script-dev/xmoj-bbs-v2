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

import { Result } from "./resultUtils";

export async function VerifyCaptcha(
  CaptchaToken: string,
  CaptchaSecretKey: string | undefined,
  RemoteIP: string
): Promise<Result> {
  const ErrorDescriptions: Object = {
    "missing-input-secret": "密钥为空",
    "invalid-input-secret": "密钥不正确",
    "missing-input-response": "验证码令牌为空",
    "invalid-input-response": "验证码令牌不正确或已过期",
    "invalid-widget-id": "解析出的组件编号不正确",
    "invalid-parsed-secret": "解析出的密钥不正确",
    "bad-request": "请求格式错误",
    "timeout-or-duplicate": "相同验证码已经校验过",
    "internal-error": "服务器错误"
  };
  
  if (CaptchaSecretKey === undefined) {
    return new Result(false, "验证码系统配置错误");
  }
  
  if (CaptchaToken === "") {
    return new Result(false, "验证码没有完成");
  }
  
  const VerifyResult = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    body: JSON.stringify({
      secret: CaptchaSecretKey,
      response: CaptchaToken,
      remoteip: RemoteIP
    }),
    headers: {
      "Content-Type": "application/json"
    },
    method: 'POST',
  }).then((Response) => {
    return Response.json();
  });
  
  if (VerifyResult["success"]) {
    return new Result(true, "验证码通过");
  } else {
    let ErrorString: string = "验证没有通过：";
    for (let i = 0; i < VerifyResult["error-codes"].length; i++) {
      ErrorString += (ErrorDescriptions[VerifyResult["error-codes"][i]] == null ? VerifyResult["error-codes"][i] : ErrorDescriptions[VerifyResult["error-codes"][i]]) + " ";
    }
    ErrorString = ErrorString.trimEnd();
    return new Result(false, ErrorString);
  }
}
