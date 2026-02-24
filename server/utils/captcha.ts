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
import { Output } from "./output";

// Track CAPTCHA failures for rate limiting
const captchaFailures: Map<string, { count: number; timestamp: number }> = new Map();
const CAPTCHA_FAILURE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_CAPTCHA_FAILURES = 5;

export async function VerifyCaptcha(
  CaptchaToken: string,
  CaptchaSecretKey: string | undefined,
  RemoteIP: string,
  // Optional KV for tracking used tokens
  KV?: { get: (key: string) => Promise<string | null>; put: (key: string, value: string, options?: any) => Promise<void> }
): Promise<Result> {
  const ErrorDescriptions: Record<string, string> = {
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
  
  // Check for too many CAPTCHA failures from this IP
  const failures = captchaFailures.get(RemoteIP);
  const now = Date.now();
  if (failures && (now - failures.timestamp) < CAPTCHA_FAILURE_WINDOW_MS) {
    if (failures.count >= MAX_CAPTCHA_FAILURES) {
      // Device IP-based rate limiting using in-memory map
      if (!KV) {
        Output.Warn(`CAPTCHA rate limiting is using in-memory storage (no KV available). ` +
          `This provides no protection across Cloudflare isolates. Deploy with KV binding for proper distributed rate limiting.`);
      }
      Output.Warn(`CAPTCHA rate limit exceeded for IP: ${RemoteIP}`);
      return new Result(false, "验证码失败次数过多，请稍后重试");
    }
  } else if (failures) {
    // Clean up expired entry
    captchaFailures.delete(RemoteIP);
  }
  
  // Check if this CAPTCHA token has been used before (if KV available)
  if (KV) {
    const tokenKey = `captcha:${CaptchaToken}`;
    const used = await KV.get(tokenKey);
    if (used) {
      Output.Warn(`CAPTCHA token reuse detected: ${CaptchaToken.substring(0, 20)}...`);
      return new Result(false, "验证码已被使用");
    }
  }
  
  const VerifyResult: any = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
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
    // Mark this CAPTCHA token as used (if KV available)
    if (KV) {
      try {
        const tokenKey = `captcha:${CaptchaToken}`;
        // Store for 24 hours (tokens typically expire in 5 minutes, but store longer for safety)
        await KV.put(tokenKey, "used", { expirationTtl: 86400 });
      } catch (e) {
        // Log but don't fail on KV errors
        Output.Error("Failed to store CAPTCHA token in KV: " + (e instanceof Error ? e.message : String(e)));
      }
    }
    // Clear failure count on success
    captchaFailures.delete(RemoteIP);
    return new Result(true, "验证码通过");
  } else {
    // Record failure
    const failures = captchaFailures.get(RemoteIP);
    if (failures && (now - failures.timestamp) < CAPTCHA_FAILURE_WINDOW_MS) {
      failures.count++;
      failures.timestamp = now;
    } else {
      captchaFailures.set(RemoteIP, { count: 1, timestamp: now });
    }
    
    // Log suspicious patterns
    if (failures && failures.count >= 3) {
      Output.Warn(`Suspicious CAPTCHA pattern from IP ${RemoteIP}: ${failures.count} failures`);
    }
    
    let ErrorString: string = "验证没有通过：";
    for (let i = 0; i < VerifyResult["error-codes"].length; i++) {
      ErrorString += (ErrorDescriptions[VerifyResult["error-codes"][i]] == null ? VerifyResult["error-codes"][i] : ErrorDescriptions[VerifyResult["error-codes"][i]]) + " ";
    }
    ErrorString = ErrorString.trimEnd();
    return new Result(false, ErrorString);
  }
}
