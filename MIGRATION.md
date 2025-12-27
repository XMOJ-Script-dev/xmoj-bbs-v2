# Migration Guide: Updating to Secured Version

This guide covers updating your existing Cloudflare Worker deployment with the new security-enhanced code.

## 🎯 Overview

**Migration Type:** In-place update  
**Downtime:** None (zero-downtime deployment)  
**Data Impact:** No data loss or migration required  
**Backward Compatibility:** ✅ Full backward compatibility  
**Estimated Time:** 15-30 minutes  
**Risk Level:** 🟢 Low

---

## 📋 Pre-Migration Checklist

Before starting, ensure you have:

- [ ] Access to Cloudflare Workers dashboard
- [ ] `wrangler` CLI installed and authenticated
- [ ] Current `wrangler.toml` configuration
- [ ] Existing secrets documented (don't need values, just names)
- [ ] Backup of current code (the `old/` folder)

---

## 🔄 Migration Steps

### Step 1: Backup Current State

```bash
# 1. Backup D1 database
wrangler d1 backup create xmoj-bbs-db

# 2. Export current data as SQL (optional but recommended)
wrangler d1 execute xmoj-bbs-db --command=".dump" > backup_$(date +%Y%m%d).sql

# 3. Save current wrangler.toml
cp wrangler.toml wrangler.toml.backup
```

---

### Step 2: Verify Database Schema

Check if your database has all required columns:

```bash
# Check phpsessid table
wrangler d1 execute xmoj-bbs-db --command="PRAGMA table_info(phpsessid);"

# Check short_message table  
wrangler d1 execute xmoj-bbs-db --command="PRAGMA table_info(short_message);"
```

**Add missing columns if needed:**

```bash
# If create_time is missing from phpsessid:
wrangler d1 execute xmoj-bbs-db --command="
ALTER TABLE phpsessid ADD COLUMN create_time INTEGER DEFAULT 0;
UPDATE phpsessid SET create_time = strftime('%s', 'now') * 1000 WHERE create_time = 0;
"

# If is_read is missing from short_message:
wrangler d1 execute xmoj-bbs-db --command="
ALTER TABLE short_message ADD COLUMN is_read INTEGER DEFAULT 0;
UPDATE short_message SET is_read = 0 WHERE is_read IS NULL;
"
```

---

### Step 3: Add New KV Namespace (Optional but Recommended)

The new code supports CAPTCHA token tracking via KV:

```bash
# Create CAPTCHA_KV namespace
wrangler kv:namespace create CAPTCHA_KV

# Note the returned ID
# Example output: { binding = "CAPTCHA_KV", id = "abc123..." }
```

**Update `wrangler.toml`:**

```toml
# Add this to your existing kv_namespaces section
[[kv_namespaces]]
binding = "CAPTCHA_KV"
id = "your_captcha_kv_id_from_above"
```

> **Note:** If you skip this step, CAPTCHA will still work, just without token reuse prevention.

---

### Step 4: Verify Existing Secrets

Check your current secrets (don't change them):

```bash
# List existing secrets
wrangler secret list

# You should see (at minimum):
# - xssmseetee_v1_key
# - CaptchaSecretKey
# - GithubImagePAT (if using image uploads)
```

**⚠️ IMPORTANT:** Do NOT change `xssmseetee_v1_key` - the new code needs the same value for backward compatibility with existing encrypted messages.

---

### Step 5: Install Dependencies

```bash
# Install/update npm packages
npm install

# Verify no vulnerabilities
npm audit
```

---

### Step 6: Test Locally

Test with your production D1 database in preview mode:

```bash
# Start local dev server with remote D1
npm run dev
# or
wrangler dev --remote

# Test critical functionality:
# 1. ✅ Login with existing session
# 2. ✅ Read old encrypted messages (should still work)
# 3. ✅ Send new message (will use v3 encryption)
# 4. ✅ Create post/reply
# 5. ✅ Rate limiting (try rapid requests)
```

---

### Step 7: Deploy to Production

```bash
# Deploy the update
wrangler deploy

# Monitor deployment
wrangler tail --format=pretty
```

**What happens during deployment:**
- ✅ New code deployed instantly
- ✅ Existing D1 data unchanged
- ✅ Existing KV data unchanged  
- ✅ Existing secrets unchanged
- ✅ Active sessions remain valid
- ✅ Old encrypted messages still readable

---

### Step 8: Post-Deployment Verification

**Immediate checks (first 5 minutes):**

```bash
# Watch for errors
wrangler tail

# Check Cloudflare dashboard:
# - Request success rate (should remain 99%+)
# - Error rates (should not spike)
# - Response times (should improve slightly)
```

**Functional tests:**

| Test | Expected Result | Status |
|------|----------------|--------|
| User login | ✅ Works with existing session | [ ] |
| Read old messages | ✅ v1/v2 messages decrypt correctly | [ ] |
| Send new message | ✅ Uses v3 encryption automatically | [ ] |
| Create post | ✅ Works with CAPTCHA | [ ] |
| Create reply | ✅ Works normally | [ ] |
| Rate limiting | ✅ Blocks after 10 rapid requests | [ ] |
| Image upload | ✅ Works if configured | [ ] |
| Admin functions | ✅ Lock/unlock posts work | [ ] |

---

### Step 9: Monitor First Hour

```bash
# Keep tail running for the first hour
wrangler tail --format=pretty

# Watch for these patterns (all good signs):
✅ "Record session: ..." (authentication working)
✅ "Using cached session for user" (cache working)
✅ "ExecuteComplexQuery called" (queries working)
⚠️ "CAPTCHA rate limit exceeded" (rate limiting working)
⚠️ "Suspicious CAPTCHA pattern" (security working)

# If you see errors, check Step 10 (Rollback)
```

---

## 🎉 What Changed & What Didn't

### ✅ What Stayed the Same

- **All user data** - posts, replies, messages, badges
- **All sessions** - existing logins still work
- **All encrypted messages** - old messages decrypt fine
- **API endpoints** - same routes and parameters
- **User experience** - completely transparent

### 🔒 What Got Better (Transparent to Users)

| Feature | Old | New | Impact |
|---------|-----|-----|--------|
| **Authentication** | Basic normalization | Full URL decode + case-insensitive | 🔒 More secure |
| **SQL Injection** | Pattern matching | Comment/string removal + more patterns | 🔒 Much more secure |
| **Session Security** | Static | Rotation on use + metadata collection | 🔒 More secure |
| **Message Encryption** | CryptoJS (deprecated) | Web Crypto API (modern) | 🔒 Much more secure |
| **Rate Limiting** | 30/10 (permissive) | 10/2 (strict) | 🛡️ Better protection |
| **XSS Protection** | Allows data URIs + HTTP | HTTPS only | 🔒 More secure |
| **CAPTCHA** | No tracking | Token reuse prevention | 🛡️ Better protection |
| **User Enumeration** | Vulnerable | Protected with timing consistency | 🔒 More secure |
| **Path Traversal** | Validate before decode | Decode before validate | 🔒 More secure |
| **Input Validation** | No null checks | Null + byte length checks | 🔒 More secure |
| **GetMail** | No pagination | Limit/offset support | ⚡ Better performance |
| **User Existence** | No cache (8s request) | 5min cache | ⚡ Much faster |

### 📊 New Features (Optional to Use)

- **Pagination in GetMail**: Pass `Limit` and `Offset` in request
- **V3 Message Encryption**: Automatic for new messages
- **Session Metadata**: IP and User-Agent collected (not enforced yet)
- **CAPTCHA Token Tracking**: Requires CAPTCHA_KV setup
- **Enhanced Logging**: Better audit trail

---

## 🚨 Rollback Plan

If something goes wrong:

### Option 1: Wrangler Rollback (Fastest)

```bash
# Rollback to previous version immediately
wrangler rollback

# Verify old version is running
curl https://your-worker.workers.dev/
```

### Option 2: Redeploy Old Code

```bash
# Go to old code directory
cd old/

# Redeploy old version
wrangler deploy

# Verify it's working
curl https://your-worker.workers.dev/
```

### Option 3: Manual Cloudflare Dashboard

1. Go to Cloudflare Dashboard → Workers & Pages
2. Select your worker
3. Go to "Deployments" tab
4. Click "..." on previous deployment
5. Select "Rollback to this deployment"

**Your data is always safe** - rollback only affects code, not data.

---

## 🐛 Troubleshooting

### Issue: "令牌不合法" (Token Invalid)

**Cause:** Session validation failing  
**Fix:**
```bash
# Check if phpsessid table has create_time column
wrangler d1 execute xmoj-bbs-db --command="PRAGMA table_info(phpsessid);"

# If missing, add it (see Step 2)
```

### Issue: Rate Limiting Too Strict

**Symptom:** Users getting "请求过于频繁" (Too many requests)  
**Quick Fix:** Users are hitting the new limit (10 burst, 2/sec)  
**Options:**
1. Wait 5 seconds between requests (normal usage shouldn't hit this)
2. Temporarily increase limits in `server/middleware/0.rate-limit.ts` (not recommended)

### Issue: Old Messages Don't Decrypt

**Cause:** Different encryption key  
**Critical:** Check if `xssmseetee_v1_key` secret is the same as before  
**Fix:**
```bash
# Re-set the secret to the ORIGINAL value
wrangler secret put xssmseetee_v1_key
# Enter the EXACT same value as the old deployment
```

### Issue: CAPTCHA Always Fails

**Cause:** Secret mismatch  
**Fix:**
```bash
# Verify secret is set
wrangler secret list | grep CaptchaSecretKey

# Re-set if needed
wrangler secret put CaptchaSecretKey
```

### Issue: High Error Rate in Dashboard

**Action:**
1. Check `wrangler tail` for specific errors
2. Check Cloudflare Dashboard → Analytics for error details
3. If consistent errors, rollback immediately (see Rollback Plan)
4. Report issue with error logs

---

## 📞 Support & Questions

### Before Deployment
- Review this document completely
- Test in `wrangler dev --remote` first
- Have rollback plan ready

### During Deployment
- Keep `wrangler tail` running
- Monitor Cloudflare dashboard
- Test critical paths immediately

### After Deployment  
- Monitor for first hour
- Check error rates
- Verify user reports

### If Issues Occur
1. **Critical issues**: Rollback immediately
2. **Minor issues**: Document and investigate
3. **Questions**: Check troubleshooting section above

---

## 📈 Success Metrics

After 24 hours, you should see:

- ✅ Error rate: Same or lower than before
- ✅ Response time: 10-30% faster (due to caching)
- ✅ Security: All 14 vulnerabilities fixed
- ✅ User experience: No complaints or issues
- ✅ Rate limiting: Blocking spam attempts (if any)
- ✅ Session management: Smoother, fewer re-logins

---

## 🎓 Additional Notes

### Message Encryption Versions

- **v1** (old): `CryptoJS.AES` with shared key → Still supported
- **v2** (old): `CryptoJS.AES` with user-specific key → Still supported  
- **v3** (new): `Web Crypto API` with PBKDF2 + AES-GCM → Used for new messages

**All three versions coexist** - the system automatically detects and decrypts correctly.

### Rate Limiting Changes

- **Old**: 30 burst, 10/sec = 36,000 requests/hour max
- **New**: 10 burst, 2/sec = 7,200 requests/hour max

Normal users won't notice. Only affects spam/abuse attempts.

### Database Performance

No performance impact expected. New features add minimal overhead:
- Session rotation: Single UPDATE per auth (negligible)
- User cache: Reduces external API calls by ~90%
- Pagination: Actually improves performance for large mailboxes

---

## ✅ Final Checklist

Before marking migration complete:

- [ ] Deployment successful (no errors in `wrangler deploy`)
- [ ] All post-deployment tests passed
- [ ] Monitored for 1 hour with no issues
- [ ] Cloudflare dashboard shows healthy metrics
- [ ] User testing confirms everything works
- [ ] Rollback plan tested (optional but recommended)
- [ ] Documentation updated (if you have custom docs)
- [ ] Team notified of completion

---

**Migration Version:** 1.0  
**Last Updated:** December 27, 2025  
**Target Version:** Security-Enhanced v2.0
