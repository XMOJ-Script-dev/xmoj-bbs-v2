import { describe, it, expect } from 'vitest';
import { Result } from '../server/utils/resultUtils';

// Simulate EditBadge validation logic for control characters and length
function validateContent(content: string): Result {
  if (content.length > 20) return new Result(false, '标签内容过长');
  const allowedPattern = /^[\u0000-\u007F\u4E00-\u9FFF\u3400-\u4DBF\u2000-\u206F\u3000-\u303F\uFF00-\uFFEF\uD83C-\uDBFF\uDC00-\uDFFF]*$/;
  if (!allowedPattern.test(content)) return new Result(false, '内容包含不允许的字符，导致渲染问题');
  if (content.trim() === '') return new Result(false, '内容不能仅包含空格');
  const controlCharPattern = /[\u0000-\u001F\u007F-\u009F]/;
  if (controlCharPattern.test(content)) return new Result(false, '内容包含不允许的控制字符');
  return new Result(true, 'OK');
}

describe('EditBadge validation', () => {
  it('rejects long content', () => {
    expect(validateContent('a'.repeat(21)).Success).toBe(false);
  });
  it('rejects control characters', () => {
    expect(validateContent('hello\u0007world').Success).toBe(false);
  });
  it('rejects only spaces', () => {
    expect(validateContent('   ').Success).toBe(false);
  });
  it('accepts valid content', () => {
    expect(validateContent('管理员提示').Success).toBe(true);
  });
});
