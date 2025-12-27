# Client-Side Migration Guide (xmoj-script)

This document outlines the changes needed in `xmoj-script` to maintain compatibility with the updated xmoj-bbs-v2 server API.

## Breaking Changes

### 1. GetMail Response Format Change ⚠️ **CRITICAL**

**Status**: Breaking change requiring immediate update

**Previous Response**:

```javascript
// Old: Direct array
[
  { From: "user1", To: "user2", Content: "...", Time: 123456789 },
  { From: "user2", To: "user1", Content: "...", Time: 123456790 }
]
```

**New Response**:

```javascript
// New: Object with Mail array and Total count
{
  Mail: [
    { From: "user1", To: "user2", Content: "...", Time: 123456789 },
    { From: "user2", To: "user1", Content: "...", Time: 123456790 }
  ],
  Total: 2
}
```

**Required Changes**:

1. Update all code that processes GetMail responses to access `.Mail` property
2. Optionally use `.Total` for pagination UI

**Files to Update**:

- `xmoj-script/XMOJ.user.js` - Search for GetMail or GetMailList API calls
- Any backend files that process mail data

**Example Fix**:

```javascript
// Before
const messages = await GetMail(params);
messages.forEach(msg => { /* ... */ });

// After
const response = await GetMail(params);
response.Mail.forEach(msg => { /* ... */ });
// Optionally: const totalMessages = response.Total;
```

---

## New Features (Optional)

### 2. GetMail Pagination Support

**Status**: Optional enhancement

**New Parameters**:

- `Limit`: Number of messages to retrieve (default: 50, max: 100)
- `Offset`: Starting position for pagination (default: 0)

**Example Usage**:

```javascript
// Get first 50 messages
const page1 = await GetMail({ Limit: 50, Offset: 0 });

// Get next 50 messages
const page2 = await GetMail({ Limit: 50, Offset: 50 });

// Use Total for pagination UI
const totalPages = Math.ceil(page1.Total / 50);
```

**Enhancement Ideas**:

- Add pagination controls to mail list UI
- Implement "Load More" button
- Add page navigation (Previous/Next)
- Show "Showing X-Y of Z messages"

---

## Important Updates

### 3. Stricter Rate Limiting ⚠️ **IMPORTANT**

**Status**: May cause 429 errors if not handled

**Changes**:

- Capacity reduced: 30 → 10 requests
- Refill rate reduced: 10/sec → 2/sec
- Anonymous users must have valid IP (no shared bucket)

**Required Changes**:

1. **Add 429 Error Handling**:

```javascript
try {
  const response = await fetch(url, options);
  if (response.status === 429) {
    // Rate limited - wait and retry
    const retryAfter = response.headers.get('Retry-After') || 5;
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    return fetch(url, options); // Retry
  }
  return response;
} catch (error) {
  // Handle error
}
```

2. **Implement Request Throttling**:

```javascript
// Debounce rapid requests
const debouncedApiCall = debounce(apiCall, 500);

// Or use a rate limiter
const rateLimiter = new RateLimiter(5, 1000); // 5 requests per second
```

3. **Show User-Friendly Messages**:

```javascript
if (response.status === 429) {
  alert("请求过于频繁，请稍后再试");
  // Or show a nicer notification
}
```

---

## No Changes Required

### 4. Content Sanitization ✅

**Status**: Already compatible

The userscript already uses DOMPurify with appropriate settings. Server-side changes (no data URIs, HTTPS-only) align with existing client behavior.

**Current Code** (in XMOJ.user.js):

```javascript
let PurifyHTML = (Input) => {
    return DOMPurify.sanitize(Input, {
        "ALLOWED_TAGS": ["a", "b", "big", "blockquote", ...],
        "ALLOWED_ATTR": ["abbr", "accept", "href", ...]
    });
}
```

No changes needed - continue using existing sanitization.

---

### 5. Message Encryption (v3) ✅

**Status**: Transparent - no changes needed

The server now uses v3 encryption (Web Crypto API, PBKDF2, AES-GCM) but maintains full backward compatibility:

- Old v1/v2 encrypted messages still decrypt correctly
- New messages are encrypted with v3
- Client doesn't need to change encryption handling

**Why no changes?**:

- Server transparently decrypts all versions (v1, v2, v3)
- Client always receives decrypted content
- Encryption/decryption is server-side only

---

## Security Improvements (FYI)

The following security fixes were implemented on the server. No client changes needed, but good to be aware:

1. **Session Rotation**: Sessions are now rotated on each request to prevent fixation attacks
2. **User Validation**: GetMail now validates that both users exist before querying
3. **Path Traversal Protection**: Image paths are decoded before validation
4. **CAPTCHA Token Tracking**: Prevents token reuse
5. **SQL Injection Protection**: Enhanced query validation
6. **Authentication Bypass Fix**: Fixed URL normalization vulnerability

---

## Testing Checklist

After implementing changes, test:

- [ ] Mail list loads correctly with new response format
- [ ] Mail pagination works (if implemented)
- [ ] 429 errors are handled gracefully
- [ ] No console errors related to API responses
- [ ] All existing features continue to work
- [ ] Rate limit warnings/messages display properly

---

## Implementation Priority

1. **HIGH**: Update GetMail response handling (breaking change)
2. **MEDIUM**: Add 429 error handling (prevents poor UX)
3. **LOW**: Implement pagination UI (optional enhancement)

---

## Backward Compatibility

The server maintains backward compatibility for:

- ✅ Old encrypted messages (v1/v2)
- ✅ All existing API endpoints
- ✅ CAPTCHA verification
- ✅ Authentication methods

**Not backward compatible**:

- ❌ GetMail response format (requires update)

---

## Questions or Issues?

If you encounter problems after migration:

1. Check browser console for errors
2. Verify API responses match new format
3. Test with rate limit handling disabled first
4. Review [MIGRATION.md](MIGRATION.md) for server-side details

---

## Related Documentation

- [MIGRATION.md](MIGRATION.md) - Server-side migration guide
- [README.md](README.md) - General project documentation
- [Server Security Fixes Summary](MIGRATION.md#security-fixes) - Detailed security changes
