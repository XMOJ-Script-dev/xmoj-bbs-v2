var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// .wrangler/tmp/bundle-9V1pZ5/checked-fetch.js
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-9V1pZ5/checked-fetch.js"() {
    urls = /* @__PURE__ */ new Set();
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init] = argArray;
        checkURL(request, init);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// ../../../../../opt/homebrew/lib/node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../../../../../opt/homebrew/lib/node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// .output/server/chunks/routes/index.mjs
var routes_exports = {};
__export(routes_exports, {
  default: () => o
});
import "__STATIC_CONTENT_MANIFEST";
var o;
var init_routes = __esm({
  ".output/server/chunks/routes/index.mjs"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_runtime();
    o = Re((t2) => {
      throw 1;
    });
  }
});

// .output/server/chunks/runtime.mjs
import e from "__STATIC_CONTENT_MANIFEST";
function createNotImplementedError(e2) {
  throw new Error(`[unenv] ${e2} is not implemented yet!`);
}
function notImplemented(e2) {
  return Object.assign(() => {
    throw createNotImplementedError(e2);
  }, { __unenv__: true });
}
function toByteArray(e2) {
  let t2;
  const o3 = function(e3) {
    const t3 = e3.length;
    if (t3 % 4 > 0)
      throw new Error("Invalid string. Length must be a multiple of 4");
    let r2 = e3.indexOf("=");
    return -1 === r2 && (r2 = t3), [r2, r2 === t3 ? 0 : 4 - r2 % 4];
  }(e2), s2 = o3[0], i2 = o3[1], a2 = new n(function(e3, t3, r2) {
    return 3 * (t3 + r2) / 4 - r2;
  }(0, s2, i2));
  let c2 = 0;
  const u2 = i2 > 0 ? s2 - 4 : s2;
  let l2;
  for (l2 = 0; l2 < u2; l2 += 4)
    t2 = r[e2.charCodeAt(l2)] << 18 | r[e2.charCodeAt(l2 + 1)] << 12 | r[e2.charCodeAt(l2 + 2)] << 6 | r[e2.charCodeAt(l2 + 3)], a2[c2++] = t2 >> 16 & 255, a2[c2++] = t2 >> 8 & 255, a2[c2++] = 255 & t2;
  return 2 === i2 && (t2 = r[e2.charCodeAt(l2)] << 2 | r[e2.charCodeAt(l2 + 1)] >> 4, a2[c2++] = 255 & t2), 1 === i2 && (t2 = r[e2.charCodeAt(l2)] << 10 | r[e2.charCodeAt(l2 + 1)] << 4 | r[e2.charCodeAt(l2 + 2)] >> 2, a2[c2++] = t2 >> 8 & 255, a2[c2++] = 255 & t2), a2;
}
function encodeChunk(e2, r2, n2) {
  let o3;
  const s2 = [];
  for (let a2 = r2; a2 < n2; a2 += 3)
    o3 = (e2[a2] << 16 & 16711680) + (e2[a2 + 1] << 8 & 65280) + (255 & e2[a2 + 2]), s2.push(t[(i2 = o3) >> 18 & 63] + t[i2 >> 12 & 63] + t[i2 >> 6 & 63] + t[63 & i2]);
  var i2;
  return s2.join("");
}
function fromByteArray(e2) {
  let r2;
  const n2 = e2.length, o3 = n2 % 3, s2 = [], i2 = 16383;
  for (let t2 = 0, r3 = n2 - o3; t2 < r3; t2 += i2)
    s2.push(encodeChunk(e2, t2, t2 + i2 > r3 ? r3 : t2 + i2));
  return 1 === o3 ? (r2 = e2[n2 - 1], s2.push(t[r2 >> 2] + t[r2 << 4 & 63] + "==")) : 2 === o3 && (r2 = (e2[n2 - 2] << 8) + e2[n2 - 1], s2.push(t[r2 >> 10] + t[r2 >> 4 & 63] + t[r2 << 2 & 63] + "=")), s2.join("");
}
function read(e2, t2, r2, n2, o3) {
  let s2, i2;
  const a2 = 8 * o3 - n2 - 1, c2 = (1 << a2) - 1, u2 = c2 >> 1;
  let l2 = -7, f2 = r2 ? o3 - 1 : 0;
  const p2 = r2 ? -1 : 1;
  let h2 = e2[t2 + f2];
  for (f2 += p2, s2 = h2 & (1 << -l2) - 1, h2 >>= -l2, l2 += a2; l2 > 0; )
    s2 = 256 * s2 + e2[t2 + f2], f2 += p2, l2 -= 8;
  for (i2 = s2 & (1 << -l2) - 1, s2 >>= -l2, l2 += n2; l2 > 0; )
    i2 = 256 * i2 + e2[t2 + f2], f2 += p2, l2 -= 8;
  if (0 === s2)
    s2 = 1 - u2;
  else {
    if (s2 === c2)
      return i2 ? Number.NaN : (h2 ? -1 : 1) * Number.POSITIVE_INFINITY;
    i2 += Math.pow(2, n2), s2 -= u2;
  }
  return (h2 ? -1 : 1) * i2 * Math.pow(2, s2 - n2);
}
function write(e2, t2, r2, n2, o3, s2) {
  let i2, a2, c2, u2 = 8 * s2 - o3 - 1;
  const l2 = (1 << u2) - 1, f2 = l2 >> 1, p2 = 23 === o3 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  let h2 = n2 ? 0 : s2 - 1;
  const d2 = n2 ? 1 : -1, m2 = t2 < 0 || 0 === t2 && 1 / t2 < 0 ? 1 : 0;
  for (t2 = Math.abs(t2), Number.isNaN(t2) || t2 === Number.POSITIVE_INFINITY ? (a2 = Number.isNaN(t2) ? 1 : 0, i2 = l2) : (i2 = Math.floor(Math.log2(t2)), t2 * (c2 = Math.pow(2, -i2)) < 1 && (i2--, c2 *= 2), (t2 += i2 + f2 >= 1 ? p2 / c2 : p2 * Math.pow(2, 1 - f2)) * c2 >= 2 && (i2++, c2 /= 2), i2 + f2 >= l2 ? (a2 = 0, i2 = l2) : i2 + f2 >= 1 ? (a2 = (t2 * c2 - 1) * Math.pow(2, o3), i2 += f2) : (a2 = t2 * Math.pow(2, f2 - 1) * Math.pow(2, o3), i2 = 0)); o3 >= 8; )
    e2[r2 + h2] = 255 & a2, h2 += d2, a2 /= 256, o3 -= 8;
  for (i2 = i2 << o3 | a2, u2 += o3; u2 > 0; )
    e2[r2 + h2] = 255 & i2, h2 += d2, i2 /= 256, u2 -= 8;
  e2[r2 + h2 - d2] |= 128 * m2;
}
function createBuffer(e2) {
  if (e2 > i)
    throw new RangeError('The value "' + e2 + '" is invalid for option "size"');
  const t2 = new Uint8Array(e2);
  return Object.setPrototypeOf(t2, Buffer$1.prototype), t2;
}
function Buffer$1(e2, t2, r2) {
  if ("number" == typeof e2) {
    if ("string" == typeof t2)
      throw new TypeError('The "string" argument must be of type string. Received type number');
    return allocUnsafe(e2);
  }
  return from(e2, t2, r2);
}
function from(e2, t2, r2) {
  if ("string" == typeof e2)
    return function(e3, t3) {
      "string" == typeof t3 && "" !== t3 || (t3 = "utf8");
      if (!Buffer$1.isEncoding(t3))
        throw new TypeError("Unknown encoding: " + t3);
      const r3 = 0 | byteLength(e3, t3);
      let n3 = createBuffer(r3);
      const o4 = n3.write(e3, t3);
      o4 !== r3 && (n3 = n3.slice(0, o4));
      return n3;
    }(e2, t2);
  if (ArrayBuffer.isView(e2))
    return function(e3) {
      if (isInstance(e3, Uint8Array)) {
        const t3 = new Uint8Array(e3);
        return fromArrayBuffer(t3.buffer, t3.byteOffset, t3.byteLength);
      }
      return fromArrayLike(e3);
    }(e2);
  if (null == e2)
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e2);
  if (isInstance(e2, ArrayBuffer) || e2 && isInstance(e2.buffer, ArrayBuffer))
    return fromArrayBuffer(e2, t2, r2);
  if ("undefined" != typeof SharedArrayBuffer && (isInstance(e2, SharedArrayBuffer) || e2 && isInstance(e2.buffer, SharedArrayBuffer)))
    return fromArrayBuffer(e2, t2, r2);
  if ("number" == typeof e2)
    throw new TypeError('The "value" argument must not be of type number. Received type number');
  const n2 = e2.valueOf && e2.valueOf();
  if (null != n2 && n2 !== e2)
    return Buffer$1.from(n2, t2, r2);
  const o3 = function(e3) {
    if (Buffer$1.isBuffer(e3)) {
      const t3 = 0 | checked(e3.length), r3 = createBuffer(t3);
      return 0 === r3.length || e3.copy(r3, 0, 0, t3), r3;
    }
    if (void 0 !== e3.length)
      return "number" != typeof e3.length || numberIsNaN(e3.length) ? createBuffer(0) : fromArrayLike(e3);
    if ("Buffer" === e3.type && Array.isArray(e3.data))
      return fromArrayLike(e3.data);
  }(e2);
  if (o3)
    return o3;
  if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e2[Symbol.toPrimitive])
    return Buffer$1.from(e2[Symbol.toPrimitive]("string"), t2, r2);
  throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e2);
}
function assertSize(e2) {
  if ("number" != typeof e2)
    throw new TypeError('"size" argument must be of type number');
  if (e2 < 0)
    throw new RangeError('The value "' + e2 + '" is invalid for option "size"');
}
function allocUnsafe(e2) {
  return assertSize(e2), createBuffer(e2 < 0 ? 0 : 0 | checked(e2));
}
function fromArrayLike(e2) {
  const t2 = e2.length < 0 ? 0 : 0 | checked(e2.length), r2 = createBuffer(t2);
  for (let n2 = 0; n2 < t2; n2 += 1)
    r2[n2] = 255 & e2[n2];
  return r2;
}
function fromArrayBuffer(e2, t2, r2) {
  if (t2 < 0 || e2.byteLength < t2)
    throw new RangeError('"offset" is outside of buffer bounds');
  if (e2.byteLength < t2 + (r2 || 0))
    throw new RangeError('"length" is outside of buffer bounds');
  let n2;
  return n2 = void 0 === t2 && void 0 === r2 ? new Uint8Array(e2) : void 0 === r2 ? new Uint8Array(e2, t2) : new Uint8Array(e2, t2, r2), Object.setPrototypeOf(n2, Buffer$1.prototype), n2;
}
function checked(e2) {
  if (e2 >= i)
    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
  return 0 | e2;
}
function byteLength(e2, t2) {
  if (Buffer$1.isBuffer(e2))
    return e2.length;
  if (ArrayBuffer.isView(e2) || isInstance(e2, ArrayBuffer))
    return e2.byteLength;
  if ("string" != typeof e2)
    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e2);
  const r2 = e2.length, n2 = arguments.length > 2 && true === arguments[2];
  if (!n2 && 0 === r2)
    return 0;
  let o3 = false;
  for (; ; )
    switch (t2) {
      case "ascii":
      case "latin1":
      case "binary":
        return r2;
      case "utf8":
      case "utf-8":
        return utf8ToBytes(e2).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return 2 * r2;
      case "hex":
        return r2 >>> 1;
      case "base64":
        return base64ToBytes(e2).length;
      default:
        if (o3)
          return n2 ? -1 : utf8ToBytes(e2).length;
        t2 = ("" + t2).toLowerCase(), o3 = true;
    }
}
function slowToString(e2, t2, r2) {
  let n2 = false;
  if ((void 0 === t2 || t2 < 0) && (t2 = 0), t2 > this.length)
    return "";
  if ((void 0 === r2 || r2 > this.length) && (r2 = this.length), r2 <= 0)
    return "";
  if ((r2 >>>= 0) <= (t2 >>>= 0))
    return "";
  for (e2 || (e2 = "utf8"); ; )
    switch (e2) {
      case "hex":
        return hexSlice(this, t2, r2);
      case "utf8":
      case "utf-8":
        return utf8Slice(this, t2, r2);
      case "ascii":
        return asciiSlice(this, t2, r2);
      case "latin1":
      case "binary":
        return latin1Slice(this, t2, r2);
      case "base64":
        return base64Slice(this, t2, r2);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return utf16leSlice(this, t2, r2);
      default:
        if (n2)
          throw new TypeError("Unknown encoding: " + e2);
        e2 = (e2 + "").toLowerCase(), n2 = true;
    }
}
function swap(e2, t2, r2) {
  const n2 = e2[t2];
  e2[t2] = e2[r2], e2[r2] = n2;
}
function bidirectionalIndexOf(e2, t2, r2, n2, o3) {
  if (0 === e2.length)
    return -1;
  if ("string" == typeof r2 ? (n2 = r2, r2 = 0) : r2 > 2147483647 ? r2 = 2147483647 : r2 < -2147483648 && (r2 = -2147483648), numberIsNaN(r2 = +r2) && (r2 = o3 ? 0 : e2.length - 1), r2 < 0 && (r2 = e2.length + r2), r2 >= e2.length) {
    if (o3)
      return -1;
    r2 = e2.length - 1;
  } else if (r2 < 0) {
    if (!o3)
      return -1;
    r2 = 0;
  }
  if ("string" == typeof t2 && (t2 = Buffer$1.from(t2, n2)), Buffer$1.isBuffer(t2))
    return 0 === t2.length ? -1 : arrayIndexOf(e2, t2, r2, n2, o3);
  if ("number" == typeof t2)
    return t2 &= 255, "function" == typeof Uint8Array.prototype.indexOf ? o3 ? Uint8Array.prototype.indexOf.call(e2, t2, r2) : Uint8Array.prototype.lastIndexOf.call(e2, t2, r2) : arrayIndexOf(e2, [t2], r2, n2, o3);
  throw new TypeError("val must be string, number or Buffer");
}
function arrayIndexOf(e2, t2, r2, n2, o3) {
  let s2, i2 = 1, a2 = e2.length, c2 = t2.length;
  if (void 0 !== n2 && ("ucs2" === (n2 = String(n2).toLowerCase()) || "ucs-2" === n2 || "utf16le" === n2 || "utf-16le" === n2)) {
    if (e2.length < 2 || t2.length < 2)
      return -1;
    i2 = 2, a2 /= 2, c2 /= 2, r2 /= 2;
  }
  function read2(e3, t3) {
    return 1 === i2 ? e3[t3] : e3.readUInt16BE(t3 * i2);
  }
  if (o3) {
    let n3 = -1;
    for (s2 = r2; s2 < a2; s2++)
      if (read2(e2, s2) === read2(t2, -1 === n3 ? 0 : s2 - n3)) {
        if (-1 === n3 && (n3 = s2), s2 - n3 + 1 === c2)
          return n3 * i2;
      } else
        -1 !== n3 && (s2 -= s2 - n3), n3 = -1;
  } else
    for (r2 + c2 > a2 && (r2 = a2 - c2), s2 = r2; s2 >= 0; s2--) {
      let r3 = true;
      for (let n3 = 0; n3 < c2; n3++)
        if (read2(e2, s2 + n3) !== read2(t2, n3)) {
          r3 = false;
          break;
        }
      if (r3)
        return s2;
    }
  return -1;
}
function hexWrite(e2, t2, r2, n2) {
  r2 = Number(r2) || 0;
  const o3 = e2.length - r2;
  n2 ? (n2 = Number(n2)) > o3 && (n2 = o3) : n2 = o3;
  const s2 = t2.length;
  let i2;
  for (n2 > s2 / 2 && (n2 = s2 / 2), i2 = 0; i2 < n2; ++i2) {
    const n3 = Number.parseInt(t2.slice(2 * i2, 2 * i2 + 2), 16);
    if (numberIsNaN(n3))
      return i2;
    e2[r2 + i2] = n3;
  }
  return i2;
}
function utf8Write(e2, t2, r2, n2) {
  return blitBuffer(utf8ToBytes(t2, e2.length - r2), e2, r2, n2);
}
function asciiWrite(e2, t2, r2, n2) {
  return blitBuffer(function(e3) {
    const t3 = [];
    for (let r3 = 0; r3 < e3.length; ++r3)
      t3.push(255 & e3.charCodeAt(r3));
    return t3;
  }(t2), e2, r2, n2);
}
function base64Write(e2, t2, r2, n2) {
  return blitBuffer(base64ToBytes(t2), e2, r2, n2);
}
function ucs2Write(e2, t2, r2, n2) {
  return blitBuffer(function(e3, t3) {
    let r3, n3, o3;
    const s2 = [];
    for (let i2 = 0; i2 < e3.length && !((t3 -= 2) < 0); ++i2)
      r3 = e3.charCodeAt(i2), n3 = r3 >> 8, o3 = r3 % 256, s2.push(o3, n3);
    return s2;
  }(t2, e2.length - r2), e2, r2, n2);
}
function base64Slice(e2, t2, r2) {
  return 0 === t2 && r2 === e2.length ? fromByteArray(e2) : fromByteArray(e2.slice(t2, r2));
}
function utf8Slice(e2, t2, r2) {
  r2 = Math.min(e2.length, r2);
  const n2 = [];
  let o3 = t2;
  for (; o3 < r2; ) {
    const t3 = e2[o3];
    let s2 = null, i2 = t3 > 239 ? 4 : t3 > 223 ? 3 : t3 > 191 ? 2 : 1;
    if (o3 + i2 <= r2) {
      let r3, n3, a2, c2;
      switch (i2) {
        case 1:
          t3 < 128 && (s2 = t3);
          break;
        case 2:
          r3 = e2[o3 + 1], 128 == (192 & r3) && (c2 = (31 & t3) << 6 | 63 & r3, c2 > 127 && (s2 = c2));
          break;
        case 3:
          r3 = e2[o3 + 1], n3 = e2[o3 + 2], 128 == (192 & r3) && 128 == (192 & n3) && (c2 = (15 & t3) << 12 | (63 & r3) << 6 | 63 & n3, c2 > 2047 && (c2 < 55296 || c2 > 57343) && (s2 = c2));
          break;
        case 4:
          r3 = e2[o3 + 1], n3 = e2[o3 + 2], a2 = e2[o3 + 3], 128 == (192 & r3) && 128 == (192 & n3) && 128 == (192 & a2) && (c2 = (15 & t3) << 18 | (63 & r3) << 12 | (63 & n3) << 6 | 63 & a2, c2 > 65535 && c2 < 1114112 && (s2 = c2));
      }
    }
    null === s2 ? (s2 = 65533, i2 = 1) : s2 > 65535 && (s2 -= 65536, n2.push(s2 >>> 10 & 1023 | 55296), s2 = 56320 | 1023 & s2), n2.push(s2), o3 += i2;
  }
  return function(e3) {
    const t3 = e3.length;
    if (t3 <= a)
      return String.fromCharCode.apply(String, e3);
    let r3 = "", n3 = 0;
    for (; n3 < t3; )
      r3 += String.fromCharCode.apply(String, e3.slice(n3, n3 += a));
    return r3;
  }(n2);
}
function asciiSlice(e2, t2, r2) {
  let n2 = "";
  r2 = Math.min(e2.length, r2);
  for (let o3 = t2; o3 < r2; ++o3)
    n2 += String.fromCharCode(127 & e2[o3]);
  return n2;
}
function latin1Slice(e2, t2, r2) {
  let n2 = "";
  r2 = Math.min(e2.length, r2);
  for (let o3 = t2; o3 < r2; ++o3)
    n2 += String.fromCharCode(e2[o3]);
  return n2;
}
function hexSlice(e2, t2, r2) {
  const n2 = e2.length;
  (!t2 || t2 < 0) && (t2 = 0), (!r2 || r2 < 0 || r2 > n2) && (r2 = n2);
  let o3 = "";
  for (let n3 = t2; n3 < r2; ++n3)
    o3 += l[e2[n3]];
  return o3;
}
function utf16leSlice(e2, t2, r2) {
  const n2 = e2.slice(t2, r2);
  let o3 = "";
  for (let e3 = 0; e3 < n2.length - 1; e3 += 2)
    o3 += String.fromCharCode(n2[e3] + 256 * n2[e3 + 1]);
  return o3;
}
function checkOffset(e2, t2, r2) {
  if (e2 % 1 != 0 || e2 < 0)
    throw new RangeError("offset is not uint");
  if (e2 + t2 > r2)
    throw new RangeError("Trying to access beyond buffer length");
}
function checkInt(e2, t2, r2, n2, o3, s2) {
  if (!Buffer$1.isBuffer(e2))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (t2 > o3 || t2 < s2)
    throw new RangeError('"value" argument is out of bounds');
  if (r2 + n2 > e2.length)
    throw new RangeError("Index out of range");
}
function wrtBigUInt64LE(e2, t2, r2, n2, o3) {
  checkIntBI(t2, n2, o3, e2, r2, 7);
  let s2 = Number(t2 & BigInt(4294967295));
  e2[r2++] = s2, s2 >>= 8, e2[r2++] = s2, s2 >>= 8, e2[r2++] = s2, s2 >>= 8, e2[r2++] = s2;
  let i2 = Number(t2 >> BigInt(32) & BigInt(4294967295));
  return e2[r2++] = i2, i2 >>= 8, e2[r2++] = i2, i2 >>= 8, e2[r2++] = i2, i2 >>= 8, e2[r2++] = i2, r2;
}
function wrtBigUInt64BE(e2, t2, r2, n2, o3) {
  checkIntBI(t2, n2, o3, e2, r2, 7);
  let s2 = Number(t2 & BigInt(4294967295));
  e2[r2 + 7] = s2, s2 >>= 8, e2[r2 + 6] = s2, s2 >>= 8, e2[r2 + 5] = s2, s2 >>= 8, e2[r2 + 4] = s2;
  let i2 = Number(t2 >> BigInt(32) & BigInt(4294967295));
  return e2[r2 + 3] = i2, i2 >>= 8, e2[r2 + 2] = i2, i2 >>= 8, e2[r2 + 1] = i2, i2 >>= 8, e2[r2] = i2, r2 + 8;
}
function checkIEEE754(e2, t2, r2, n2, o3, s2) {
  if (r2 + n2 > e2.length)
    throw new RangeError("Index out of range");
  if (r2 < 0)
    throw new RangeError("Index out of range");
}
function writeFloat(e2, t2, r2, n2, o3) {
  return t2 = +t2, r2 >>>= 0, o3 || checkIEEE754(e2, 0, r2, 4), write(e2, t2, r2, n2, 23, 4), r2 + 4;
}
function writeDouble(e2, t2, r2, n2, o3) {
  return t2 = +t2, r2 >>>= 0, o3 || checkIEEE754(e2, 0, r2, 8), write(e2, t2, r2, n2, 52, 8), r2 + 8;
}
function E(e2, t2, r2) {
  c[e2] = class extends r2 {
    constructor() {
      super(), Object.defineProperty(this, "message", { value: Reflect.apply(t2, this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${e2}]`, this.stack, delete this.name;
    }
    get code() {
      return e2;
    }
    set code(e3) {
      Object.defineProperty(this, "code", { configurable: true, enumerable: true, value: e3, writable: true });
    }
    toString() {
      return `${this.name} [${e2}]: ${this.message}`;
    }
  };
}
function addNumericalSeparator(e2) {
  let t2 = "", r2 = e2.length;
  const n2 = "-" === e2[0] ? 1 : 0;
  for (; r2 >= n2 + 4; r2 -= 3)
    t2 = `_${e2.slice(r2 - 3, r2)}${t2}`;
  return `${e2.slice(0, r2)}${t2}`;
}
function checkIntBI(e2, t2, r2, n2, o3, s2) {
  if (e2 > r2 || e2 < t2) {
    const r3 = "bigint" == typeof t2 ? "n" : "";
    let n3;
    throw n3 = 0 === t2 || t2 === BigInt(0) ? `>= 0${r3} and < 2${r3} ** ${8 * (s2 + 1)}${r3}` : `>= -(2${r3} ** ${8 * (s2 + 1) - 1}${r3}) and < 2 ** ${8 * (s2 + 1) - 1}${r3}`, new c.ERR_OUT_OF_RANGE("value", n3, e2);
  }
  !function(e3, t3, r3) {
    validateNumber(t3, "offset"), void 0 !== e3[t3] && void 0 !== e3[t3 + r3] || boundsError(t3, e3.length - (r3 + 1));
  }(n2, o3, s2);
}
function validateNumber(e2, t2) {
  if ("number" != typeof e2)
    throw new c.ERR_INVALID_ARG_TYPE(t2, "number", e2);
}
function boundsError(e2, t2, r2) {
  if (Math.floor(e2) !== e2)
    throw validateNumber(e2, r2), new c.ERR_OUT_OF_RANGE("offset", "an integer", e2);
  if (t2 < 0)
    throw new c.ERR_BUFFER_OUT_OF_BOUNDS();
  throw new c.ERR_OUT_OF_RANGE("offset", `>= 0 and <= ${t2}`, e2);
}
function utf8ToBytes(e2, t2) {
  let r2;
  t2 = t2 || Number.POSITIVE_INFINITY;
  const n2 = e2.length;
  let o3 = null;
  const s2 = [];
  for (let i2 = 0; i2 < n2; ++i2) {
    if (r2 = e2.charCodeAt(i2), r2 > 55295 && r2 < 57344) {
      if (!o3) {
        if (r2 > 56319) {
          (t2 -= 3) > -1 && s2.push(239, 191, 189);
          continue;
        }
        if (i2 + 1 === n2) {
          (t2 -= 3) > -1 && s2.push(239, 191, 189);
          continue;
        }
        o3 = r2;
        continue;
      }
      if (r2 < 56320) {
        (t2 -= 3) > -1 && s2.push(239, 191, 189), o3 = r2;
        continue;
      }
      r2 = 65536 + (o3 - 55296 << 10 | r2 - 56320);
    } else
      o3 && (t2 -= 3) > -1 && s2.push(239, 191, 189);
    if (o3 = null, r2 < 128) {
      if ((t2 -= 1) < 0)
        break;
      s2.push(r2);
    } else if (r2 < 2048) {
      if ((t2 -= 2) < 0)
        break;
      s2.push(r2 >> 6 | 192, 63 & r2 | 128);
    } else if (r2 < 65536) {
      if ((t2 -= 3) < 0)
        break;
      s2.push(r2 >> 12 | 224, r2 >> 6 & 63 | 128, 63 & r2 | 128);
    } else {
      if (!(r2 < 1114112))
        throw new Error("Invalid code point");
      if ((t2 -= 4) < 0)
        break;
      s2.push(r2 >> 18 | 240, r2 >> 12 & 63 | 128, r2 >> 6 & 63 | 128, 63 & r2 | 128);
    }
  }
  return s2;
}
function base64ToBytes(e2) {
  return toByteArray(function(e3) {
    if ((e3 = (e3 = e3.split("=")[0]).trim().replace(u, "")).length < 2)
      return "";
    for (; e3.length % 4 != 0; )
      e3 += "=";
    return e3;
  }(e2));
}
function blitBuffer(e2, t2, r2, n2) {
  let o3;
  for (o3 = 0; o3 < n2 && !(o3 + r2 >= t2.length || o3 >= e2.length); ++o3)
    t2[o3 + r2] = e2[o3];
  return o3;
}
function isInstance(e2, t2) {
  return e2 instanceof t2 || null != e2 && null != e2.constructor && null != e2.constructor.name && e2.constructor.name === t2.name;
}
function numberIsNaN(e2) {
  return e2 != e2;
}
function defineBigIntMethod(e2) {
  return "undefined" == typeof BigInt ? BufferBigIntNotDefined : e2;
}
function BufferBigIntNotDefined() {
  throw new Error("BigInt not supported");
}
function defaultSetTimeout() {
  throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}
function runTimeout(e2) {
  if (h === setTimeout)
    return setTimeout(e2, 0);
  if ((h === defaultSetTimeout || !h) && setTimeout)
    return h = setTimeout, setTimeout(e2, 0);
  try {
    return h(e2, 0);
  } catch {
    try {
      return h.call(null, e2, 0);
    } catch {
      return h.call(this, e2, 0);
    }
  }
}
function cleanUpNextTick() {
  y && m && (y = false, m.length > 0 ? g = [...m, ...g] : w = -1, g.length > 0 && drainQueue());
}
function drainQueue() {
  if (y)
    return;
  const e2 = runTimeout(cleanUpNextTick);
  y = true;
  let t2 = g.length;
  for (; t2; ) {
    for (m = g, g = []; ++w < t2; )
      m && m[w].run();
    w = -1, t2 = g.length;
  }
  m = null, y = false, function(e3) {
    if (d === clearTimeout)
      return clearTimeout(e3);
    if ((d === defaultClearTimeout || !d) && clearTimeout)
      return d = clearTimeout, clearTimeout(e3);
    try {
      return d(e3);
    } catch {
      try {
        return d.call(null, e3);
      } catch {
        return d.call(this, e3);
      }
    }
  }(e2);
}
function Item(e2, t2) {
  this.fun = e2, this.array = t2;
}
function noop$1() {
  return p;
}
function encodeQueryValue(e2) {
  return (t2 = "string" == typeof e2 ? e2 : JSON.stringify(e2), encodeURI("" + t2).replace($, "|")).replace(T, "%2B").replace(j, "+").replace(I, "%23").replace(k, "%26").replace(S, "`").replace(C, "^").replace(A, "%2F");
  var t2;
}
function encodeQueryKey(e2) {
  return encodeQueryValue(e2).replace(R, "%3D");
}
function decode(e2 = "") {
  try {
    return decodeURIComponent("" + e2);
  } catch {
    return "" + e2;
  }
}
function decodeQueryValue(e2) {
  return decode(e2.replace(T, " "));
}
function parseQuery(e2 = "") {
  const t2 = {};
  "?" === e2[0] && (e2 = e2.slice(1));
  for (const r2 of e2.split("&")) {
    const e3 = r2.match(/([^=]+)=?(.*)/) || [];
    if (e3.length < 2)
      continue;
    const n2 = decode(e3[1].replace(T, " "));
    if ("__proto__" === n2 || "constructor" === n2)
      continue;
    const o3 = decodeQueryValue(e3[2] || "");
    void 0 === t2[n2] ? t2[n2] = o3 : Array.isArray(t2[n2]) ? t2[n2].push(o3) : t2[n2] = [t2[n2], o3];
  }
  return t2;
}
function stringifyQuery(e2) {
  return Object.keys(e2).filter((t2) => void 0 !== e2[t2]).map((t2) => {
    return r2 = t2, "number" != typeof (n2 = e2[t2]) && "boolean" != typeof n2 || (n2 = String(n2)), n2 ? Array.isArray(n2) ? n2.map((e3) => `${encodeQueryKey(r2)}=${encodeQueryValue(e3)}`).join("&") : `${encodeQueryKey(r2)}=${encodeQueryValue(n2)}` : encodeQueryKey(r2);
    var r2, n2;
  }).filter(Boolean).join("&");
}
function hasProtocol(e2, t2 = {}) {
  return "boolean" == typeof t2 && (t2 = { acceptRelative: t2 }), t2.strict ? O.test(e2) : N.test(e2) || !!t2.acceptRelative && M.test(e2);
}
function withoutTrailingSlash(e2 = "", t2) {
  return (function(e3 = "") {
    return e3.endsWith("/");
  }(e2) ? e2.slice(0, -1) : e2) || "/";
}
function withTrailingSlash(e2 = "", t2) {
  return e2.endsWith("/") ? e2 : e2 + "/";
}
function withoutBase(e2, t2) {
  if (isEmptyURL(t2))
    return e2;
  const r2 = withoutTrailingSlash(t2);
  if (!e2.startsWith(r2))
    return e2;
  const n2 = e2.slice(r2.length);
  return "/" === n2[0] ? n2 : "/" + n2;
}
function withQuery(e2, t2) {
  const r2 = parseURL(e2), n2 = { ...parseQuery(r2.search), ...t2 };
  return r2.search = stringifyQuery(n2), function(e3) {
    const t3 = e3.pathname || "", r3 = e3.search ? (e3.search.startsWith("?") ? "" : "?") + e3.search : "", n3 = e3.hash || "", o3 = e3.auth ? e3.auth + "@" : "", s2 = e3.host || "", i2 = e3.protocol || e3[U] ? (e3.protocol || "") + "//" : "";
    return i2 + o3 + s2 + t3 + r3 + n3;
  }(r2);
}
function getQuery(e2) {
  return parseQuery(parseURL(e2).search);
}
function isEmptyURL(e2) {
  return !e2 || "/" === e2;
}
function joinURL(e2, ...t2) {
  let r2 = e2 || "";
  for (const e3 of t2.filter((e4) => function(e5) {
    return e5 && "/" !== e5;
  }(e4)))
    if (r2) {
      const t3 = e3.replace(L, "");
      r2 = withTrailingSlash(r2) + t3;
    } else
      r2 = e3;
  return r2;
}
function parseURL(e2 = "", t2) {
  const r2 = e2.match(/^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i);
  if (r2) {
    const [, e3, t3 = ""] = r2;
    return { protocol: e3.toLowerCase(), pathname: t3, href: e3 + t3, auth: "", host: "", search: "", hash: "" };
  }
  if (!hasProtocol(e2, { acceptRelative: true }))
    return t2 ? parseURL(t2 + e2) : parsePath(e2);
  const [, n2 = "", o3, s2 = ""] = e2.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, i2 = "", a2 = ""] = s2.match(/([^#/?]*)(.*)?/) || [];
  "file:" === n2 && (a2 = a2.replace(/\/(?=[A-Za-z]:)/, ""));
  const { pathname: c2, search: u2, hash: l2 } = parsePath(a2);
  return { protocol: n2.toLowerCase(), auth: o3 ? o3.slice(0, Math.max(0, o3.length - 1)) : "", host: i2, pathname: c2, search: u2, hash: l2, [U]: !n2 };
}
function parsePath(e2 = "") {
  const [t2 = "", r2 = "", n2 = ""] = (e2.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return { pathname: t2, search: r2, hash: n2 };
}
function Mime$1() {
  this._types = /* @__PURE__ */ Object.create(null), this._extensions = /* @__PURE__ */ Object.create(null);
  for (let e2 = 0; e2 < arguments.length; e2++)
    this.define(arguments[e2]);
  this.define = this.define.bind(this), this.getType = this.getType.bind(this), this.getExtension = this.getExtension.bind(this);
}
function objectHash(e2, t2) {
  const r2 = createHasher(t2 = t2 ? { ...Q, ...t2 } : Q);
  return r2.dispatch(e2), r2.toString();
}
function createHasher(e2) {
  let t2 = "", r2 = /* @__PURE__ */ new Map();
  const write2 = (e3) => {
    t2 += e3;
  };
  return { toString: () => t2, getContext: () => r2, dispatch(t3) {
    e2.replacer && (t3 = e2.replacer(t3));
    return this[null === t3 ? "null" : typeof t3](t3);
  }, object(t3) {
    if (t3 && "function" == typeof t3.toJSON)
      return this.object(t3.toJSON());
    const n2 = Object.prototype.toString.call(t3);
    let o3 = "";
    const s2 = n2.length;
    o3 = s2 < 10 ? "unknown:[" + n2 + "]" : n2.slice(8, s2 - 1), o3 = o3.toLowerCase();
    let i2 = null;
    if (void 0 !== (i2 = r2.get(t3)))
      return this.dispatch("[CIRCULAR:" + i2 + "]");
    if (r2.set(t3, r2.size), void 0 !== f && f.isBuffer && f.isBuffer(t3))
      return write2("buffer:"), write2(t3.toString("utf8"));
    if ("object" !== o3 && "function" !== o3 && "asyncfunction" !== o3)
      this[o3] ? this[o3](t3) : e2.ignoreUnknown || this.unkown(t3, o3);
    else {
      let r3 = Object.keys(t3);
      e2.unorderedObjects && (r3 = r3.sort());
      let n3 = [];
      false === e2.respectType || isNativeFunction(t3) || (n3 = J), e2.excludeKeys && (r3 = r3.filter((t4) => !e2.excludeKeys(t4)), n3 = n3.filter((t4) => !e2.excludeKeys(t4))), write2("object:" + (r3.length + n3.length) + ":");
      const dispatchForKey = (r4) => {
        this.dispatch(r4), write2(":"), e2.excludeValues || this.dispatch(t3[r4]), write2(",");
      };
      for (const e3 of r3)
        dispatchForKey(e3);
      for (const e3 of n3)
        dispatchForKey(e3);
    }
  }, array(t3, n2) {
    if (n2 = void 0 === n2 ? false !== e2.unorderedArrays : n2, write2("array:" + t3.length + ":"), !n2 || t3.length <= 1) {
      for (const e3 of t3)
        this.dispatch(e3);
      return;
    }
    const o3 = /* @__PURE__ */ new Map(), s2 = t3.map((t4) => {
      const r3 = createHasher(e2);
      r3.dispatch(t4);
      for (const [e3, t5] of r3.getContext())
        o3.set(e3, t5);
      return r3.toString();
    });
    return r2 = o3, s2.sort(), this.array(s2, false);
  }, date: (e3) => write2("date:" + e3.toJSON()), symbol: (e3) => write2("symbol:" + e3.toString()), unkown(e3, t3) {
    if (write2(t3), e3)
      return write2(":"), e3 && "function" == typeof e3.entries ? this.array(Array.from(e3.entries()), true) : void 0;
  }, error: (e3) => write2("error:" + e3.toString()), boolean: (e3) => write2("bool:" + e3), string(e3) {
    write2("string:" + e3.length + ":"), write2(e3);
  }, function(t3) {
    write2("fn:"), isNativeFunction(t3) ? this.dispatch("[native]") : this.dispatch(t3.toString()), false !== e2.respectFunctionNames && this.dispatch("function-name:" + String(t3.name)), e2.respectFunctionProperties && this.object(t3);
  }, number: (e3) => write2("number:" + e3), xml: (e3) => write2("xml:" + e3.toString()), null: () => write2("Null"), undefined: () => write2("Undefined"), regexp: (e3) => write2("regex:" + e3.toString()), uint8array(e3) {
    return write2("uint8array:"), this.dispatch(Array.prototype.slice.call(e3));
  }, uint8clampedarray(e3) {
    return write2("uint8clampedarray:"), this.dispatch(Array.prototype.slice.call(e3));
  }, int8array(e3) {
    return write2("int8array:"), this.dispatch(Array.prototype.slice.call(e3));
  }, uint16array(e3) {
    return write2("uint16array:"), this.dispatch(Array.prototype.slice.call(e3));
  }, int16array(e3) {
    return write2("int16array:"), this.dispatch(Array.prototype.slice.call(e3));
  }, uint32array(e3) {
    return write2("uint32array:"), this.dispatch(Array.prototype.slice.call(e3));
  }, int32array(e3) {
    return write2("int32array:"), this.dispatch(Array.prototype.slice.call(e3));
  }, float32array(e3) {
    return write2("float32array:"), this.dispatch(Array.prototype.slice.call(e3));
  }, float64array(e3) {
    return write2("float64array:"), this.dispatch(Array.prototype.slice.call(e3));
  }, arraybuffer(e3) {
    return write2("arraybuffer:"), this.dispatch(new Uint8Array(e3));
  }, url: (e3) => write2("url:" + e3.toString()), map(t3) {
    write2("map:");
    const r3 = [...t3];
    return this.array(r3, false !== e2.unorderedSets);
  }, set(t3) {
    write2("set:");
    const r3 = [...t3];
    return this.array(r3, false !== e2.unorderedSets);
  }, file(e3) {
    return write2("file:"), this.dispatch([e3.name, e3.size, e3.type, e3.lastModfied]);
  }, blob() {
    if (e2.ignoreUnknown)
      return write2("[blob]");
    throw new Error('Hashing Blob objects is currently not supported\nUse "options.replacer" or "options.ignoreUnknown"\n');
  }, domwindow: () => write2("domwindow"), bigint: (e3) => write2("bigint:" + e3.toString()), process: () => write2("process"), timer: () => write2("timer"), pipe: () => write2("pipe"), tcp: () => write2("tcp"), udp: () => write2("udp"), tty: () => write2("tty"), statwatcher: () => write2("statwatcher"), securecontext: () => write2("securecontext"), connection: () => write2("connection"), zlib: () => write2("zlib"), context: () => write2("context"), nodescript: () => write2("nodescript"), httpparser: () => write2("httpparser"), dataview: () => write2("dataview"), signal: () => write2("signal"), fsevent: () => write2("fsevent"), tlswrap: () => write2("tlswrap") };
}
function isNativeFunction(e2) {
  return "function" == typeof e2 && Function.prototype.toString.call(e2).slice(-Y) === G;
}
function hash(e2, t2 = {}) {
  const r2 = "string" == typeof e2 ? e2 : objectHash(e2, t2);
  return (n2 = r2, new SHA256().finalize(n2).toString(Z)).slice(0, 10);
  var n2;
}
function createRouter$1(e2 = {}) {
  const t2 = { options: e2, rootNode: createRadixNode(), staticRoutesMap: {} }, normalizeTrailingSlash = (t3) => e2.strictTrailingSlash ? t3 : t3.replace(/\/$/, "") || "/";
  if (e2.routes)
    for (const r2 in e2.routes)
      insert(t2, normalizeTrailingSlash(r2), e2.routes[r2]);
  return { ctx: t2, lookup: (e3) => function(e4, t3) {
    const r2 = e4.staticRoutesMap[t3];
    if (r2)
      return r2.data;
    const n2 = t3.split("/"), o3 = {};
    let s2 = false, i2 = null, a2 = e4.rootNode, c2 = null;
    for (let e5 = 0; e5 < n2.length; e5++) {
      const t4 = n2[e5];
      null !== a2.wildcardChildNode && (i2 = a2.wildcardChildNode, c2 = n2.slice(e5).join("/"));
      const r3 = a2.children.get(t4);
      if (void 0 === r3) {
        if (a2 && a2.placeholderChildren.length > 1) {
          const t5 = n2.length - e5;
          a2 = a2.placeholderChildren.find((e6) => e6.maxDepth === t5) || null;
        } else
          a2 = a2.placeholderChildren[0] || null;
        if (!a2)
          break;
        a2.paramName && (o3[a2.paramName] = t4), s2 = true;
      } else
        a2 = r3;
    }
    null !== a2 && null !== a2.data || null === i2 || (a2 = i2, o3[a2.paramName || "_"] = c2, s2 = true);
    if (!a2)
      return null;
    if (s2)
      return { ...a2.data, params: s2 ? o3 : void 0 };
    return a2.data;
  }(t2, normalizeTrailingSlash(e3)), insert: (e3, r2) => insert(t2, normalizeTrailingSlash(e3), r2), remove: (e3) => function(e4, t3) {
    let r2 = false;
    const n2 = t3.split("/");
    let o3 = e4.rootNode;
    for (const e5 of n2)
      if (o3 = o3.children.get(e5), !o3)
        return r2;
    if (o3.data) {
      const e5 = n2.at(-1) || "";
      o3.data = null, 0 === Object.keys(o3.children).length && o3.parent && (o3.parent.children.delete(e5), o3.parent.wildcardChildNode = null, o3.parent.placeholderChildren = []), r2 = true;
    }
    return r2;
  }(t2, normalizeTrailingSlash(e3)) };
}
function insert(e2, t2, r2) {
  let n2 = true;
  const o3 = t2.split("/");
  let s2 = e2.rootNode, i2 = 0;
  const a2 = [s2];
  for (const e3 of o3) {
    let t3;
    if (t3 = s2.children.get(e3))
      s2 = t3;
    else {
      const r3 = getNodeType(e3);
      t3 = createRadixNode({ type: r3, parent: s2 }), s2.children.set(e3, t3), r3 === se.PLACEHOLDER ? (t3.paramName = "*" === e3 ? "_" + i2++ : e3.slice(1), s2.placeholderChildren.push(t3), n2 = false) : r3 === se.WILDCARD && (s2.wildcardChildNode = t3, t3.paramName = e3.slice(3) || "_", n2 = false), a2.push(t3), s2 = t3;
    }
  }
  for (const [e3, t3] of a2.entries())
    t3.maxDepth = Math.max(a2.length - e3, t3.maxDepth || 0);
  return s2.data = r2, true === n2 && (e2.staticRoutesMap[t2] = s2), s2;
}
function createRadixNode(e2 = {}) {
  return { type: e2.type || se.NORMAL, maxDepth: 0, parent: e2.parent || null, children: /* @__PURE__ */ new Map(), data: e2.data || null, paramName: e2.paramName || null, wildcardChildNode: null, placeholderChildren: [] };
}
function getNodeType(e2) {
  return e2.startsWith("**") ? se.WILDCARD : ":" === e2[0] || "*" === e2 ? se.PLACEHOLDER : se.NORMAL;
}
function toRouteMatcher(e2) {
  return function(e3, t2) {
    return { ctx: { table: e3 }, matchAll: (r2) => _matchRoutes(r2, e3, t2) };
  }(_routerNodeToTable("", e2.ctx.rootNode), e2.ctx.options.strictTrailingSlash);
}
function _matchRoutes(e2, t2, r2) {
  true !== r2 && e2.endsWith("/") && (e2 = e2.slice(0, -1) || "/");
  const n2 = [];
  for (const [r3, o4] of _sortRoutesMap(t2.wildcard))
    (e2 === r3 || e2.startsWith(r3 + "/")) && n2.push(o4);
  for (const [r3, o4] of _sortRoutesMap(t2.dynamic))
    if (e2.startsWith(r3 + "/")) {
      const t3 = "/" + e2.slice(r3.length).split("/").splice(2).join("/");
      n2.push(..._matchRoutes(t3, o4));
    }
  const o3 = t2.static.get(e2);
  return o3 && n2.push(o3), n2.filter(Boolean);
}
function _sortRoutesMap(e2) {
  return [...e2.entries()].sort((e3, t2) => e3[0].length - t2[0].length);
}
function _routerNodeToTable(e2, t2) {
  const r2 = { static: /* @__PURE__ */ new Map(), wildcard: /* @__PURE__ */ new Map(), dynamic: /* @__PURE__ */ new Map() };
  return function _addNode(e3, t3) {
    if (e3)
      if (t3.type !== se.NORMAL || e3.includes("*") || e3.includes(":")) {
        if (t3.type === se.WILDCARD)
          r2.wildcard.set(e3.replace("/**", ""), t3.data);
        else if (t3.type === se.PLACEHOLDER) {
          const n2 = _routerNodeToTable("", t3);
          return t3.data && n2.static.set("/", t3.data), void r2.dynamic.set(e3.replace(/\/\*|\/:\w+/, ""), n2);
        }
      } else
        t3.data && r2.static.set(e3, t3.data);
    for (const [r3, n2] of t3.children.entries())
      _addNode(`${e3}/${r3}`.replace("//", "/"), n2);
  }(e2, t2), r2;
}
function jsonParseTransform(e2, t2) {
  if (!("__proto__" === e2 || "constructor" === e2 && t2 && "object" == typeof t2 && "prototype" in t2))
    return t2;
  !function(e3) {
    console.warn(`[destr] Dropping "${e3}" key to prevent prototype pollution.`);
  }(e2);
}
function destr(e2, t2 = {}) {
  if ("string" != typeof e2)
    return e2;
  const r2 = e2.trim();
  if ('"' === e2[0] && e2.endsWith('"') && !e2.includes("\\"))
    return r2.slice(1, -1);
  if (r2.length <= 9) {
    const e3 = r2.toLowerCase();
    if ("true" === e3)
      return true;
    if ("false" === e3)
      return false;
    if ("undefined" === e3)
      return;
    if ("null" === e3)
      return null;
    if ("nan" === e3)
      return Number.NaN;
    if ("infinity" === e3)
      return Number.POSITIVE_INFINITY;
    if ("-infinity" === e3)
      return Number.NEGATIVE_INFINITY;
  }
  if (!ce.test(e2)) {
    if (t2.strict)
      throw new SyntaxError("[destr] Invalid JSON");
    return e2;
  }
  try {
    if (ie.test(e2) || ae.test(e2)) {
      if (t2.strict)
        throw new Error("[destr] Possible prototype pollution");
      return JSON.parse(e2, jsonParseTransform);
    }
    return JSON.parse(e2);
  } catch (r3) {
    if (t2.strict)
      throw r3;
    return e2;
  }
}
function isPlainObject(e2) {
  if (null === e2 || "object" != typeof e2)
    return false;
  const t2 = Object.getPrototypeOf(e2);
  return (null === t2 || t2 === Object.prototype || null === Object.getPrototypeOf(t2)) && (!(Symbol.iterator in e2) && (!(Symbol.toStringTag in e2) || "[object Module]" === Object.prototype.toString.call(e2)));
}
function _defu(e2, t2, r2 = ".", n2) {
  if (!isPlainObject(t2))
    return _defu(e2, {}, r2, n2);
  const o3 = Object.assign({}, t2);
  for (const t3 in e2) {
    if ("__proto__" === t3 || "constructor" === t3)
      continue;
    const s2 = e2[t3];
    null != s2 && (n2 && n2(o3, t3, s2, r2) || (Array.isArray(s2) && Array.isArray(o3[t3]) ? o3[t3] = [...s2, ...o3[t3]] : isPlainObject(s2) && isPlainObject(o3[t3]) ? o3[t3] = _defu(s2, o3[t3], (r2 ? `${r2}.` : "") + t3.toString(), n2) : o3[t3] = s2));
  }
  return o3;
}
function createDefu(e2) {
  return (...t2) => t2.reduce((t3, r2) => _defu(t3, r2, "", e2), {});
}
function _addListener(e2, t2, r2, n2) {
  _checkListener(r2), void 0 !== e2._events.newListener && e2.emit("newListener", t2, r2.listener || r2), e2._events[t2] || (e2._events[t2] = []), n2 ? e2._events[t2].unshift(r2) : e2._events[t2].push(r2);
  const o3 = _getMaxListeners(e2);
  if (o3 > 0 && e2._events[t2].length > o3 && !e2._events[t2].warned) {
    e2._events[t2].warned = true;
    const r3 = new Error(`[unenv] Possible EventEmitter memory leak detected. ${e2._events[t2].length} ${t2} listeners added. Use emitter.setMaxListeners() to increase limit`);
    r3.name = "MaxListenersExceededWarning", r3.emitter = e2, r3.type = t2, r3.count = e2._events[t2]?.length, console.warn(r3);
  }
  return e2;
}
function _wrapOnce(e2, t2, r2) {
  let n2 = false;
  const wrapper = (...o3) => {
    if (!n2)
      return e2.removeListener(t2, wrapper), n2 = true, 0 === o3.length ? r2.call(e2) : r2.apply(e2, o3);
  };
  return wrapper.listener = r2, wrapper;
}
function _getMaxListeners(e2) {
  return e2._maxListeners ?? pe.defaultMaxListeners;
}
function _listeners(e2, t2, r2) {
  let n2 = e2._events[t2];
  return "function" == typeof n2 && (n2 = [n2]), r2 ? n2.map((e3) => e3.listener || e3) : n2;
}
function _checkListener(e2) {
  if ("function" != typeof e2)
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e2);
}
function getDuplex() {
  return Object.assign(ge.prototype, de.prototype), Object.assign(ge.prototype, me.prototype), ge;
}
function _distinct(e2) {
  const t2 = {};
  for (const [r2, n2] of Object.entries(e2))
    r2 && (t2[r2] = (Array.isArray(n2) ? n2 : [n2]).filter(Boolean));
  return t2;
}
function hasProp(e2, t2) {
  try {
    return t2 in e2;
  } catch {
    return false;
  }
}
function createError(e2) {
  if ("string" == typeof e2)
    return new H3Error(e2);
  if (isError(e2))
    return e2;
  const t2 = new H3Error(e2.message ?? e2.statusMessage ?? "", { cause: e2.cause || e2 });
  if (hasProp(e2, "stack"))
    try {
      Object.defineProperty(t2, "stack", { get: () => e2.stack });
    } catch {
      try {
        t2.stack = e2.stack;
      } catch {
      }
    }
  if (e2.data && (t2.data = e2.data), e2.statusCode ? t2.statusCode = sanitizeStatusCode(e2.statusCode, t2.statusCode) : e2.status && (t2.statusCode = sanitizeStatusCode(e2.status, t2.statusCode)), e2.statusMessage ? t2.statusMessage = e2.statusMessage : e2.statusText && (t2.statusMessage = e2.statusText), t2.statusMessage) {
    const e3 = t2.statusMessage;
    sanitizeStatusMessage(t2.statusMessage) !== e3 && console.warn("[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default.");
  }
  return void 0 !== e2.fatal && (t2.fatal = e2.fatal), void 0 !== e2.unhandled && (t2.unhandled = e2.unhandled), t2;
}
function isError(e2) {
  return true === e2?.constructor?.__h3_error__;
}
function readRawBody(e2, t2 = "utf8") {
  !function(e3, t3) {
    if (!function(e4, t4) {
      if ("string" == typeof t4) {
        if (e4.method === t4)
          return true;
      } else if (t4.includes(e4.method))
        return true;
      return false;
    }(e3, t3))
      throw createError({ statusCode: 405, statusMessage: "HTTP method is not allowed." });
  }(e2, _e);
  const r2 = e2._requestBody || e2.web?.request?.body || e2.node.req[ve] || e2.node.req.rawBody || e2.node.req.body;
  if (r2) {
    const e3 = Promise.resolve(r2).then((e4) => f.isBuffer(e4) ? e4 : "function" == typeof e4.pipeTo ? new Promise((t3, r3) => {
      const n3 = [];
      e4.pipeTo(new WritableStream({ write(e5) {
        n3.push(e5);
      }, close() {
        t3(f.concat(n3));
      }, abort(e5) {
        r3(e5);
      } })).catch(r3);
    }) : "function" == typeof e4.pipe ? new Promise((t3, r3) => {
      const n3 = [];
      e4.on("data", (e5) => {
        n3.push(e5);
      }).on("end", () => {
        t3(f.concat(n3));
      }).on("error", r3);
    }) : e4.constructor === Object ? f.from(JSON.stringify(e4)) : f.from(e4));
    return t2 ? e3.then((e4) => e4.toString(t2)) : e3;
  }
  if (!Number.parseInt(e2.node.req.headers["content-length"] || "") && !String(e2.node.req.headers["transfer-encoding"] ?? "").split(",").map((e3) => e3.trim()).filter(Boolean).includes("chunked"))
    return Promise.resolve(void 0);
  const n2 = e2.node.req[ve] = new Promise((t3, r3) => {
    const n3 = [];
    e2.node.req.on("error", (e3) => {
      r3(e3);
    }).on("data", (e3) => {
      n3.push(e3);
    }).on("end", () => {
      t3(f.concat(n3));
    });
  });
  return t2 ? n2.then((e3) => e3.toString(t2)) : n2;
}
function handleCacheHeaders(e2, t2) {
  const r2 = ["public", ...t2.cacheControls || []];
  let n2 = false;
  if (void 0 !== t2.maxAge && r2.push("max-age=" + +t2.maxAge, "s-maxage=" + +t2.maxAge), t2.modifiedTime) {
    const r3 = new Date(t2.modifiedTime), o3 = e2.node.req.headers["if-modified-since"];
    e2.node.res.setHeader("last-modified", r3.toUTCString()), o3 && new Date(o3) >= t2.modifiedTime && (n2 = true);
  }
  if (t2.etag) {
    e2.node.res.setHeader("etag", t2.etag);
    e2.node.req.headers["if-none-match"] === t2.etag && (n2 = true);
  }
  return e2.node.res.setHeader("cache-control", r2.join(", ")), !!n2 && (e2.node.res.statusCode = 304, e2.handled || e2.node.res.end(), true);
}
function sanitizeStatusMessage(e2 = "") {
  return e2.replace(Ee, "");
}
function sanitizeStatusCode(e2, t2 = 200) {
  return e2 ? ("string" == typeof e2 && (e2 = Number.parseInt(e2, 10)), e2 < 100 || e2 > 999 ? t2 : e2) : t2;
}
function splitCookiesString(e2) {
  if (Array.isArray(e2))
    return e2.flatMap((e3) => splitCookiesString(e3));
  if ("string" != typeof e2)
    return [];
  const t2 = [];
  let r2, n2, o3, s2, i2, a2 = 0;
  const skipWhitespace = () => {
    for (; a2 < e2.length && /\s/.test(e2.charAt(a2)); )
      a2 += 1;
    return a2 < e2.length;
  };
  for (; a2 < e2.length; ) {
    for (r2 = a2, i2 = false; skipWhitespace(); )
      if (n2 = e2.charAt(a2), "," === n2) {
        for (o3 = a2, a2 += 1, skipWhitespace(), s2 = a2; a2 < e2.length && (n2 = e2.charAt(a2), "=" !== n2 && ";" !== n2 && "," !== n2); )
          a2 += 1;
        a2 < e2.length && "=" === e2.charAt(a2) ? (i2 = true, a2 = s2, t2.push(e2.slice(r2, o3)), r2 = a2) : a2 = o3 + 1;
      } else
        a2 += 1;
    (!i2 || a2 >= e2.length) && t2.push(e2.slice(r2, e2.length));
  }
  return t2;
}
function send(e2, t2, r2) {
  return r2 && function(e3, t3) {
    t3 && 304 !== e3.node.res.statusCode && !e3.node.res.getHeader("content-type") && e3.node.res.setHeader("content-type", t3);
  }(e2, r2), new Promise((r3) => {
    Be(() => {
      e2.handled || e2.node.res.end(t2), r3();
    });
  });
}
function setResponseStatus(e2, t2, r2) {
  t2 && (e2.node.res.statusCode = sanitizeStatusCode(t2, e2.node.res.statusCode)), r2 && (e2.node.res.statusMessage = sanitizeStatusMessage(r2));
}
function sendStream(e2, t2) {
  if (!t2 || "object" != typeof t2)
    throw new Error("[h3] Invalid stream provided.");
  if (e2.node.res._data = t2, !e2.node.res.socket)
    return e2._handled = true, Promise.resolve();
  if (hasProp(t2, "pipeTo") && "function" == typeof t2.pipeTo)
    return t2.pipeTo(new WritableStream({ write(t3) {
      e2.node.res.write(t3);
    } })).then(() => {
      e2.node.res.end();
    });
  if (hasProp(t2, "pipe") && "function" == typeof t2.pipe)
    return new Promise((r2, n2) => {
      t2.pipe(e2.node.res), t2.on && (t2.on("end", () => {
        e2.node.res.end(), r2();
      }), t2.on("error", (e3) => {
        n2(e3);
      })), e2.node.res.on("close", () => {
        t2.abort && t2.abort();
      });
    });
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(e2, t2) {
  for (const [r2, n2] of t2.headers)
    "set-cookie" === r2 ? e2.node.res.appendHeader(r2, splitCookiesString(n2)) : e2.node.res.setHeader(r2, n2);
  if (t2.status && (e2.node.res.statusCode = sanitizeStatusCode(t2.status, e2.node.res.statusCode)), t2.statusText && (e2.node.res.statusMessage = sanitizeStatusMessage(t2.statusText)), t2.redirected && e2.node.res.setHeader("location", t2.url), t2.body)
    return sendStream(e2, t2.body);
  e2.node.res.end();
}
async function proxyRequest(e2, t2, r2 = {}) {
  let n2, o3;
  Ie.has(e2.method) && (r2.streamRequest ? (n2 = function(e3) {
    if (!_e.includes(e3.method))
      return;
    const t3 = e3.web?.request?.body || e3._requestBody;
    return t3 || (ve in e3.node.req || "rawBody" in e3.node.req || "body" in e3.node.req || "__unenv__" in e3.node.req ? new ReadableStream({ async start(t4) {
      const r3 = await readRawBody(e3, false);
      r3 && t4.enqueue(r3), t4.close();
    } }) : new ReadableStream({ start: (t4) => {
      e3.node.req.on("data", (e4) => {
        t4.enqueue(e4);
      }), e3.node.req.on("end", () => {
        t4.close();
      }), e3.node.req.on("error", (e4) => {
        t4.error(e4);
      });
    } }));
  }(e2), o3 = "half") : n2 = await readRawBody(e2, false).catch(() => {
  }));
  const s2 = r2.fetchOptions?.method || e2.method, i2 = function(e3, ...t3) {
    const r3 = t3.filter(Boolean);
    if (0 === r3.length)
      return e3;
    const n3 = new Headers(e3);
    for (const e4 of r3)
      for (const [t4, r4] of Object.entries(e4))
        void 0 !== r4 && n3.set(t4, r4);
    return n3;
  }(getProxyRequestHeaders(e2), r2.fetchOptions?.headers, r2.headers);
  return async function(e3, t3, r3 = {}) {
    let n3;
    try {
      n3 = await _getFetch(r3.fetch)(t3, { headers: r3.headers, ignoreResponseError: true, ...r3.fetchOptions });
    } catch (e4) {
      throw createError({ status: 502, statusMessage: "Bad Gateway", cause: e4 });
    }
    e3.node.res.statusCode = sanitizeStatusCode(n3.status, e3.node.res.statusCode), e3.node.res.statusMessage = sanitizeStatusMessage(n3.statusText);
    const o4 = [];
    for (const [t4, r4] of n3.headers.entries())
      "content-encoding" !== t4 && "content-length" !== t4 && ("set-cookie" !== t4 ? e3.node.res.setHeader(t4, r4) : o4.push(...splitCookiesString(r4)));
    o4.length > 0 && e3.node.res.setHeader("set-cookie", o4.map((e4) => (r3.cookieDomainRewrite && (e4 = rewriteCookieProperty(e4, r3.cookieDomainRewrite, "domain")), r3.cookiePathRewrite && (e4 = rewriteCookieProperty(e4, r3.cookiePathRewrite, "path")), e4)));
    r3.onResponse && await r3.onResponse(e3, n3);
    if (void 0 !== n3._data)
      return n3._data;
    if (e3.handled)
      return;
    if (false === r3.sendStream) {
      const t4 = new Uint8Array(await n3.arrayBuffer());
      return e3.node.res.end(t4);
    }
    if (n3.body)
      for await (const t4 of n3.body)
        e3.node.res.write(t4);
    return e3.node.res.end();
  }(e2, t2, { ...r2, fetchOptions: { method: s2, body: n2, duplex: o3, ...r2.fetchOptions, headers: i2 } });
}
function getProxyRequestHeaders(e2) {
  const t2 = /* @__PURE__ */ Object.create(null), r2 = function(e3) {
    const t3 = {};
    for (const r3 in e3.node.req.headers) {
      const n2 = e3.node.req.headers[r3];
      t3[r3] = Array.isArray(n2) ? n2.filter(Boolean).join(", ") : n2;
    }
    return t3;
  }(e2);
  for (const e3 in r2)
    ke.has(e3) || (t2[e3] = r2[e3]);
  return t2;
}
function fetchWithEvent(e2, t2, r2, n2) {
  return _getFetch(n2?.fetch)(t2, { ...r2, context: r2?.context || e2.context, headers: { ...getProxyRequestHeaders(e2), ...r2?.headers } });
}
function _getFetch(e2) {
  if (e2)
    return e2;
  if (globalThis.fetch)
    return globalThis.fetch;
  throw new Error("fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js.");
}
function rewriteCookieProperty(e2, t2, r2) {
  const n2 = "string" == typeof t2 ? { "*": t2 } : t2;
  return e2.replace(new RegExp(`(;\\s*${r2}=)([^;]+)`, "gi"), (e3, t3, r3) => {
    let o3;
    if (r3 in n2)
      o3 = n2[r3];
    else {
      if (!("*" in n2))
        return e3;
      o3 = n2["*"];
    }
    return o3 ? t3 + o3 : "";
  });
}
function isEvent(e2) {
  return hasProp(e2, "__is_event__");
}
function createEvent(e2, t2) {
  return new H3Event(e2, t2);
}
function defineEventHandler(e2) {
  if ("function" == typeof e2)
    return e2.__is_handler__ = true, e2;
  const t2 = { onRequest: _normalizeArray(e2.onRequest), onBeforeResponse: _normalizeArray(e2.onBeforeResponse) }, _handler = (r2) => async function(e3, t3, r3) {
    if (r3.onRequest) {
      for (const t4 of r3.onRequest)
        if (await t4(e3), e3.handled)
          return;
    }
    const n2 = await t3(e3), o3 = { body: n2 };
    if (r3.onBeforeResponse)
      for (const t4 of r3.onBeforeResponse)
        await t4(e3, o3);
    return o3.body;
  }(r2, e2.handler, t2);
  return _handler.__is_handler__ = true, _handler.__resolve__ = e2.handler.__resolve__, _handler.__websocket__ = e2.websocket, _handler;
}
function _normalizeArray(e2) {
  return e2 ? Array.isArray(e2) ? e2 : [e2] : void 0;
}
function isEventHandler(e2) {
  return hasProp(e2, "__is_handler__");
}
function toEventHandler(e2, t2, r2) {
  return isEventHandler(e2) || console.warn("[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.", r2 && "/" !== r2 ? `
     Route: ${r2}` : "", `
     Handler: ${e2}`), e2;
}
function createApp(e2 = {}) {
  const t2 = [], r2 = function(e3, t3) {
    const r3 = t3.debug ? 2 : void 0;
    return Re(async (n3) => {
      n3.node.req.originalUrl = n3.node.req.originalUrl || n3.node.req.url || "/";
      const o4 = n3._path || n3.node.req.url || "/";
      let s3;
      t3.onRequest && await t3.onRequest(n3);
      for (const i2 of e3) {
        if (i2.route.length > 1) {
          if (!o4.startsWith(i2.route))
            continue;
          s3 = o4.slice(i2.route.length) || "/";
        } else
          s3 = o4;
        if (i2.match && !i2.match(s3, n3))
          continue;
        n3._path = s3, n3.node.req.url = s3;
        const e4 = await i2.handler(n3), a2 = void 0 === e4 ? void 0 : await e4;
        if (void 0 !== a2) {
          const e5 = { body: a2 };
          return t3.onBeforeResponse && (n3._onBeforeResponseCalled = true, await t3.onBeforeResponse(n3, e5)), await handleHandlerResponse(n3, e5.body, r3), void (t3.onAfterResponse && (n3._onAfterResponseCalled = true, await t3.onAfterResponse(n3, e5)));
        }
        if (n3.handled)
          return void (t3.onAfterResponse && (n3._onAfterResponseCalled = true, await t3.onAfterResponse(n3, void 0)));
      }
      if (!n3.handled)
        throw createError({ statusCode: 404, statusMessage: `Cannot find any path matching ${n3.path || "/"}.` });
      t3.onAfterResponse && (n3._onAfterResponseCalled = true, await t3.onAfterResponse(n3, void 0));
    });
  }(t2, e2), n2 = function(e3) {
    return async (t3) => {
      let r3;
      for (const n3 of e3) {
        if ("/" === n3.route && !n3.handler.__resolve__)
          continue;
        if (!t3.startsWith(n3.route))
          continue;
        if (r3 = t3.slice(n3.route.length) || "/", n3.match && !n3.match(r3, void 0))
          continue;
        let e4 = { route: n3.route, handler: n3.handler };
        if (e4.handler.__resolve__) {
          const t4 = await e4.handler.__resolve__(r3);
          if (!t4)
            continue;
          e4 = { ...e4, ...t4, route: joinURL(e4.route || "/", t4.route || "/") };
        }
        return e4;
      }
    };
  }(t2);
  r2.__resolve__ = n2;
  const o3 = function(e3) {
    let t3;
    return () => (t3 || (t3 = e3()), t3);
  }(() => {
    return t3 = n2, { ...e2.websocket, async resolve(e3) {
      const { pathname: r3 } = parseURL(e3.url || "/"), n3 = await t3(r3);
      return n3?.handler?.__websocket__ || {};
    } };
    var t3;
  }), s2 = { use: (e3, t3, r3) => use(s2, e3, t3, r3), resolve: n2, handler: r2, stack: t2, options: e2, get websocket() {
    return o3();
  } };
  return s2;
}
function use(e2, t2, r2, n2) {
  if (Array.isArray(t2))
    for (const o3 of t2)
      use(e2, o3, r2, n2);
  else if (Array.isArray(r2))
    for (const o3 of r2)
      use(e2, t2, o3, n2);
  else
    "string" == typeof t2 ? e2.stack.push(normalizeLayer({ ...n2, route: t2, handler: r2 })) : "function" == typeof t2 ? e2.stack.push(normalizeLayer({ ...r2, handler: t2 })) : e2.stack.push(normalizeLayer({ ...t2 }));
  return e2;
}
function normalizeLayer(e2) {
  let t2 = e2.handler;
  return t2.handler && (t2 = t2.handler), e2.lazy ? t2 = lazyEventHandler(t2) : isEventHandler(t2) || (t2 = toEventHandler(t2, 0, e2.route)), { route: withoutTrailingSlash(e2.route), match: e2.match, handler: t2 };
}
function handleHandlerResponse(e2, t2, r2) {
  if (null === t2)
    return function(e3, t3) {
      if (e3.handled)
        return;
      t3 || 200 === e3.node.res.statusCode || (t3 = e3.node.res.statusCode);
      const r3 = sanitizeStatusCode(t3, 204);
      204 === r3 && e3.node.res.removeHeader("content-length"), e3.node.res.writeHead(r3), e3.node.res.end();
    }(e2);
  if (t2) {
    if (n2 = t2, "undefined" != typeof Response && n2 instanceof Response)
      return sendWebResponse(e2, t2);
    if (function(e3) {
      if (!e3 || "object" != typeof e3)
        return false;
      if ("function" == typeof e3.pipe) {
        if ("function" == typeof e3._read)
          return true;
        if ("function" == typeof e3.abort)
          return true;
      }
      return "function" == typeof e3.pipeTo;
    }(t2))
      return sendStream(e2, t2);
    if (t2.buffer)
      return send(e2, t2);
    if (t2.arrayBuffer && "function" == typeof t2.arrayBuffer)
      return t2.arrayBuffer().then((r3) => send(e2, f.from(r3), t2.type));
    if (t2 instanceof Error)
      throw createError(t2);
    if ("function" == typeof t2.end)
      return true;
  }
  var n2;
  const o3 = typeof t2;
  if ("string" === o3)
    return send(e2, t2, xe.html);
  if ("object" === o3 || "boolean" === o3 || "number" === o3)
    return send(e2, JSON.stringify(t2, void 0, r2), xe.json);
  if ("bigint" === o3)
    return send(e2, t2.toString(), xe.json);
  throw createError({ statusCode: 500, statusMessage: `[h3] Cannot send ${o3} as response.` });
}
function toNodeListener(e2) {
  return async function(t2, r2) {
    const n2 = createEvent(t2, r2);
    try {
      await e2.handler(n2);
    } catch (t3) {
      const r3 = createError(t3);
      if (isError(t3) || (r3.unhandled = true), setResponseStatus(n2, r3.statusCode, r3.statusMessage), e2.options.onError && await e2.options.onError(r3, n2), n2.handled)
        return;
      (r3.unhandled || r3.fatal) && console.error("[h3]", r3.fatal ? "[fatal]" : "[unhandled]", r3), e2.options.onBeforeResponse && !n2._onBeforeResponseCalled && await e2.options.onBeforeResponse(n2, { body: r3 }), await function(e3, t4, r4) {
        if (e3.handled)
          return;
        const n3 = isError(t4) ? t4 : createError(t4), o3 = { statusCode: n3.statusCode, statusMessage: n3.statusMessage, stack: [], data: n3.data };
        if (r4 && (o3.stack = (n3.stack || "").split("\n").map((e4) => e4.trim())), e3.handled)
          return;
        setResponseStatus(e3, Number.parseInt(n3.statusCode), n3.statusMessage), e3.node.res.setHeader("content-type", xe.json), e3.node.res.end(JSON.stringify(o3, void 0, 2));
      }(n2, r3, !!e2.options.debug), e2.options.onAfterResponse && !n2._onAfterResponseCalled && await e2.options.onAfterResponse(n2, { body: r3 });
    }
  };
}
function isPayloadMethod(e2 = "GET") {
  return Ce.has(e2.toUpperCase());
}
function mergeFetchOptions(e2, t2, r2 = globalThis.Headers) {
  const n2 = { ...t2, ...e2 };
  if (t2?.params && e2?.params && (n2.params = { ...t2?.params, ...e2?.params }), t2?.query && e2?.query && (n2.query = { ...t2?.query, ...e2?.query }), t2?.headers && e2?.headers) {
    n2.headers = new r2(t2?.headers || {});
    for (const [t3, o3] of new r2(e2?.headers || {}))
      n2.headers.set(t3, o3);
  }
  return n2;
}
function createFetch$1(e2 = {}) {
  const { fetch: t2 = globalThis.fetch, Headers: r2 = globalThis.Headers, AbortController: n2 = globalThis.AbortController } = e2;
  async function onError(e3) {
    const t3 = e3.error && "AbortError" === e3.error.name && !e3.options.timeout || false;
    if (false !== e3.options.retry && !t3) {
      let t4;
      t4 = "number" == typeof e3.options.retry ? e3.options.retry : isPayloadMethod(e3.options.method) ? 0 : 1;
      const r4 = e3.response && e3.response.status || 500;
      if (t4 > 0 && (Array.isArray(e3.options.retryStatusCodes) ? e3.options.retryStatusCodes.includes(r4) : je.has(r4))) {
        const r5 = e3.options.retryDelay || 0;
        return r5 > 0 && await new Promise((e4) => setTimeout(e4, r5)), $fetchRaw(e3.request, { ...e3.options, retry: t4 - 1 });
      }
    }
    const r3 = function(e4) {
      const t4 = e4.error?.message || e4.error?.toString() || "", r4 = e4.request?.method || e4.options?.method || "GET", n3 = e4.request?.url || String(e4.request) || "/", o3 = `[${r4}] ${JSON.stringify(n3)}`, s2 = e4.response ? `${e4.response.status} ${e4.response.statusText}` : "<no response>", i2 = new FetchError(`${o3}: ${s2}${t4 ? ` ${t4}` : ""}`, e4.error ? { cause: e4.error } : void 0);
      for (const t5 of ["request", "options", "response"])
        Object.defineProperty(i2, t5, { get: () => e4[t5] });
      for (const [t5, r5] of [["data", "_data"], ["status", "status"], ["statusCode", "status"], ["statusText", "statusText"], ["statusMessage", "statusText"]])
        Object.defineProperty(i2, t5, { get: () => e4.response && e4.response[r5] });
      return i2;
    }(e3);
    throw Error.captureStackTrace && Error.captureStackTrace(r3, $fetchRaw), r3;
  }
  const $fetchRaw = async function(o3, s2 = {}) {
    const i2 = { request: o3, options: mergeFetchOptions(s2, e2.defaults, r2), response: void 0, error: void 0 };
    let a2;
    if (i2.options.method = i2.options.method?.toUpperCase(), i2.options.onRequest && await i2.options.onRequest(i2), "string" == typeof i2.request && (i2.options.baseURL && (i2.request = function(e3, t3) {
      if (isEmptyURL(t3) || hasProtocol(e3))
        return e3;
      const r3 = withoutTrailingSlash(t3);
      return e3.startsWith(r3) ? e3 : joinURL(r3, e3);
    }(i2.request, i2.options.baseURL)), (i2.options.query || i2.options.params) && (i2.request = withQuery(i2.request, { ...i2.options.params, ...i2.options.query }))), i2.options.body && isPayloadMethod(i2.options.method) && (!function(e3) {
      if (void 0 === e3)
        return false;
      const t3 = typeof e3;
      return "string" === t3 || "number" === t3 || "boolean" === t3 || null === t3 || "object" === t3 && (!!Array.isArray(e3) || !e3.buffer && (e3.constructor && "Object" === e3.constructor.name || "function" == typeof e3.toJSON));
    }(i2.options.body) ? ("pipeTo" in i2.options.body && "function" == typeof i2.options.body.pipeTo || "function" == typeof i2.options.body.pipe) && ("duplex" in i2.options || (i2.options.duplex = "half")) : (i2.options.body = "string" == typeof i2.options.body ? i2.options.body : JSON.stringify(i2.options.body), i2.options.headers = new r2(i2.options.headers || {}), i2.options.headers.has("content-type") || i2.options.headers.set("content-type", "application/json"), i2.options.headers.has("accept") || i2.options.headers.set("accept", "application/json"))), !i2.options.signal && i2.options.timeout) {
      const e3 = new n2();
      a2 = setTimeout(() => e3.abort(), i2.options.timeout), i2.options.signal = e3.signal;
    }
    try {
      i2.response = await t2(i2.request, i2.options);
    } catch (e3) {
      return i2.error = e3, i2.options.onRequestError && await i2.options.onRequestError(i2), await onError(i2);
    } finally {
      a2 && clearTimeout(a2);
    }
    if (i2.response.body && !Oe.has(i2.response.status) && "HEAD" !== i2.options.method) {
      const e3 = (i2.options.parseResponse ? "json" : i2.options.responseType) || function(e4 = "") {
        if (!e4)
          return "json";
        const t3 = e4.split(";").shift() || "";
        return $e.test(t3) ? "json" : Se.has(t3) || t3.startsWith("text/") ? "text" : "blob";
      }(i2.response.headers.get("content-type") || "");
      switch (e3) {
        case "json": {
          const e4 = await i2.response.text(), t3 = i2.options.parseResponse || destr;
          i2.response._data = t3(e4);
          break;
        }
        case "stream":
          i2.response._data = i2.response.body;
          break;
        default:
          i2.response._data = await i2.response[e3]();
      }
    }
    return i2.options.onResponse && await i2.options.onResponse(i2), !i2.options.ignoreResponseError && i2.response.status >= 400 && i2.response.status < 600 ? (i2.options.onResponseError && await i2.options.onResponseError(i2), await onError(i2)) : i2.response;
  }, $fetch = async function(e3, t3) {
    return (await $fetchRaw(e3, t3))._data;
  };
  return $fetch.raw = $fetchRaw, $fetch.native = (...e3) => t2(...e3), $fetch.create = (t3 = {}) => createFetch$1({ ...e2, defaults: { ...e2.defaults, ...t3 } }), $fetch;
}
function flatHooks(e2, t2 = {}, r2) {
  for (const n2 in e2) {
    const o3 = e2[n2], s2 = r2 ? `${r2}:${n2}` : n2;
    "object" == typeof o3 && null !== o3 ? flatHooks(o3, t2, s2) : "function" == typeof o3 && (t2[s2] = o3);
  }
  return t2;
}
function serialTaskCaller(e2, t2) {
  const r2 = t2.shift(), n2 = qe(r2);
  return e2.reduce((e3, r3) => e3.then(() => n2.run(() => r3(...t2))), Promise.resolve());
}
function parallelTaskCaller(e2, t2) {
  const r2 = t2.shift(), n2 = qe(r2);
  return Promise.all(e2.map((e3) => n2.run(() => e3(...t2))));
}
function callEachWith(e2, t2) {
  for (const r2 of [...e2])
    r2(t2);
}
function klona(e2) {
  if ("object" != typeof e2)
    return e2;
  var t2, r2, n2 = Object.prototype.toString.call(e2);
  if ("[object Object]" === n2) {
    if (e2.constructor !== Object && "function" == typeof e2.constructor)
      for (t2 in r2 = new e2.constructor(), e2)
        e2.hasOwnProperty(t2) && r2[t2] !== e2[t2] && (r2[t2] = klona(e2[t2]));
    else
      for (t2 in r2 = {}, e2)
        "__proto__" === t2 ? Object.defineProperty(r2, t2, { value: klona(e2[t2]), configurable: true, enumerable: true, writable: true }) : r2[t2] = klona(e2[t2]);
    return r2;
  }
  if ("[object Array]" === n2) {
    for (t2 = e2.length, r2 = Array(t2); t2--; )
      r2[t2] = klona(e2[t2]);
    return r2;
  }
  return "[object Set]" === n2 ? (r2 = /* @__PURE__ */ new Set(), e2.forEach(function(e3) {
    r2.add(klona(e3));
  }), r2) : "[object Map]" === n2 ? (r2 = /* @__PURE__ */ new Map(), e2.forEach(function(e3, t3) {
    r2.set(klona(t3), klona(e3));
  }), r2) : "[object Date]" === n2 ? /* @__PURE__ */ new Date(+e2) : "[object RegExp]" === n2 ? ((r2 = new RegExp(e2.source, e2.flags)).lastIndex = e2.lastIndex, r2) : "[object DataView]" === n2 ? new e2.constructor(klona(e2.buffer)) : "[object ArrayBuffer]" === n2 ? e2.slice(0) : "Array]" === n2.slice(-6) ? new e2.constructor(e2) : e2;
}
function isUppercase(e2 = "") {
  if (!ze.test(e2))
    return e2 !== e2.toLowerCase();
}
function kebabCase(e2, t2) {
  return e2 ? (Array.isArray(e2) ? e2 : function(e3) {
    const t3 = We, r2 = [];
    if (!e3 || "string" != typeof e3)
      return r2;
    let n2, o3, s2 = "";
    for (const i2 of e3) {
      const e4 = t3.includes(i2);
      if (true === e4) {
        r2.push(s2), s2 = "", n2 = void 0;
        continue;
      }
      const a2 = isUppercase(i2);
      if (false === o3) {
        if (false === n2 && true === a2) {
          r2.push(s2), s2 = i2, n2 = a2;
          continue;
        }
        if (true === n2 && false === a2 && s2.length > 1) {
          const e5 = s2.at(-1);
          r2.push(s2.slice(0, Math.max(0, s2.length - 1))), s2 = e5 + i2, n2 = a2;
          continue;
        }
      }
      s2 += i2, n2 = a2, o3 = e4;
    }
    return r2.push(s2), r2;
  }(e2)).map((e3) => e3.toLowerCase()).join(t2) : "";
}
function getEnv(e2, t2) {
  const r2 = (n2 = e2, kebabCase(n2 || "", "_")).toUpperCase();
  var n2;
  return destr(B.env[t2.prefix + r2] ?? B.env[t2.altPrefix + r2]);
}
function _isObject(e2) {
  return "object" == typeof e2 && !Array.isArray(e2);
}
function useRuntimeConfig(e2) {
  return Qe;
}
function _deepFreeze(e2) {
  const t2 = Object.getOwnPropertyNames(e2);
  for (const r2 of t2) {
    const t3 = e2[r2];
    t3 && "object" == typeof t3 && _deepFreeze(t3);
  }
  return Object.freeze(e2);
}
function asyncCall(e2, ...t2) {
  try {
    return (r2 = e2(...t2)) && "function" == typeof r2.then ? r2 : Promise.resolve(r2);
  } catch (e3) {
    return Promise.reject(e3);
  }
  var r2;
}
function stringify(e2) {
  if (function(e3) {
    const t2 = typeof e3;
    return null === e3 || "object" !== t2 && "function" !== t2;
  }(e2))
    return String(e2);
  if (function(e3) {
    const t2 = Object.getPrototypeOf(e3);
    return !t2 || t2.isPrototypeOf(Object);
  }(e2) || Array.isArray(e2))
    return JSON.stringify(e2);
  if ("function" == typeof e2.toJSON)
    return stringify(e2.toJSON());
  throw new Error("[unstorage] Cannot stringify value!");
}
function checkBufferSupport() {
  if (void 0 === f)
    throw new TypeError("[unstorage] Buffer is not supported!");
}
function normalizeKey$1(e2) {
  return e2 ? e2.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") : "";
}
function joinKeys(...e2) {
  return normalizeKey$1(e2.join(":"));
}
function normalizeBaseKey(e2) {
  return (e2 = normalizeKey$1(e2)) ? e2 + ":" : "";
}
function watch(e2, t2, r2) {
  return e2.watch ? e2.watch((e3, n2) => t2(e3, r2 + n2)) : () => {
  };
}
async function dispose(e2) {
  "function" == typeof e2.dispose && await asyncCall(e2.dispose);
}
function useStorage(e2 = "") {
  return e2 ? function(e3, t2) {
    if (!(t2 = normalizeBaseKey(t2)))
      return e3;
    const r2 = { ...e3 };
    for (const n2 of Ge)
      r2[n2] = (r3 = "", ...o3) => e3[n2](t2 + r3, ...o3);
    return r2.getKeys = (r3 = "", ...n2) => e3.getKeys(t2 + r3, ...n2).then((e4) => e4.map((e5) => e5.slice(t2.length))), r2;
  }(Ze, e2) : Ze;
}
function getKey(...e2) {
  return e2.length > 0 ? hash(e2, {}) : "";
}
function escapeKey(e2) {
  return String(e2).replace(/\W/g, "");
}
function cloneWithProxy(e2, t2) {
  return new Proxy(e2, { get: (e3, r2, n2) => r2 in t2 ? t2[r2] : Reflect.get(e3, r2, n2), set: (e3, r2, n2, o3) => r2 in t2 ? (t2[r2] = n2, true) : Reflect.set(e3, r2, n2, o3) });
}
function createRouteRulesHandler(e2) {
  return Re((t2) => {
    const r2 = function(e3) {
      e3.context._nitro = e3.context._nitro || {}, e3.context._nitro.routeRules || (e3.context._nitro.routeRules = getRouteRulesForPath(withoutBase(e3.path.split("?")[0], useRuntimeConfig().app.baseURL)));
      return e3.context._nitro.routeRules;
    }(t2);
    if (r2.headers && setHeaders(t2, r2.headers), r2.redirect) {
      let e3 = r2.redirect.to;
      if (e3.endsWith("/**")) {
        let n2 = t2.path;
        const o3 = r2.redirect._redirectStripBase;
        o3 && (n2 = withoutBase(n2, o3)), e3 = joinURL(e3.slice(0, -3), n2);
      } else if (t2.path.includes("?")) {
        e3 = withQuery(e3, getQuery(t2.path));
      }
      return function(e4, t3, r3 = 302) {
        return e4.node.res.statusCode = sanitizeStatusCode(r3, e4.node.res.statusCode), e4.node.res.setHeader("location", t3), send(e4, `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${t3.replace(/"/g, "%22")}"></head></html>`, xe.html);
      }(t2, e3, r2.redirect.statusCode);
    }
    if (r2.proxy) {
      let n2 = r2.proxy.to;
      if (n2.endsWith("/**")) {
        let e3 = t2.path;
        const o3 = r2.proxy._proxyStripBase;
        o3 && (e3 = withoutBase(e3, o3)), n2 = joinURL(n2.slice(0, -3), e3);
      } else if (t2.path.includes("?")) {
        n2 = withQuery(n2, getQuery(t2.path));
      }
      return proxyRequest(t2, n2, { fetch: e2.localFetch, ...r2.proxy });
    }
  });
}
function getRouteRulesForPath(e2) {
  return ue({}, ...tt.matchAll(e2).reverse());
}
function joinHeaders(e2) {
  return Array.isArray(e2) ? e2.join(", ") : String(e2);
}
function normalizeCookieHeader(e2 = "") {
  return splitCookiesString(joinHeaders(e2));
}
function normalizeCookieHeaders(e2) {
  const t2 = new Headers();
  for (const [r2, n2] of e2)
    if ("set-cookie" === r2)
      for (const e3 of normalizeCookieHeader(n2))
        t2.append("set-cookie", e3);
    else
      t2.set(r2, joinHeaders(n2));
  return t2;
}
function assetsCacheControl(e2) {
  const t2 = function(e3 = "") {
    for (const t3 in at)
      if (e3.startsWith(t3))
        return at[t3];
    return {};
  }(new URL(e2.url).pathname);
  return t2.maxAge ? { browserTTL: t2.maxAge, edgeTTL: t2.maxAge } : {};
}
var t, r, n, o2, s, i, a, c, u, l, f, p, h, d, m, g, y, w, b, v, _getEnv, _, x, B, I, k, A, R, T, C, S, $, j, O, N, M, L, U, P, H, q, z, W, F, D, noop, K, V, KVError, Q, J, G, Y, WordArray, X, Z, ee, te, BufferedBlockAlgorithm, Hasher, re, ne, oe, SHA256, se, ie, ae, ce, ue, le, fe, pe, he, _Readable, de, me, ge, ye, we, Socket, IncomingMessage, ServerResponse, be, __publicField$2, H3Error, ve, _e, xe, Ee, Be, setHeaders, Ie, ke, Ae, __publicField$1, H3Event, Re, lazyEventHandler, Te, FetchError, Ce, Se, $e, je, Oe, Ne, Me, Le, Ue, Pe, He, qe, Hookable, ze, We, Fe, De, Ke, Ve, Qe, Je, Ge, memory, Ye, normalizeKey, Xe, Ze, et, cachedFunction, cachedEventHandler, tt, rt, nt, __publicField, Result, errorHandler, ot, st, useNitroApp, it, at, ct, baseURLModifier;
var init_runtime = __esm({
  ".output/server/chunks/runtime.mjs"() {
    init_checked_fetch();
    init_modules_watch_stub();
    t = [];
    r = [];
    n = "undefined" == typeof Uint8Array ? Array : Uint8Array;
    o2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (let e2 = 0, n2 = 64; e2 < n2; ++e2)
      t[e2] = o2[e2], r[o2.charCodeAt(e2)] = e2;
    r["-".charCodeAt(0)] = 62, r["_".charCodeAt(0)] = 63;
    s = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
    i = 2147483647;
    Buffer$1.TYPED_ARRAY_SUPPORT = function() {
      try {
        const e2 = new Uint8Array(1), t2 = { foo: function() {
          return 42;
        } };
        return Object.setPrototypeOf(t2, Uint8Array.prototype), Object.setPrototypeOf(e2, t2), 42 === e2.foo();
      } catch {
        return false;
      }
    }(), Buffer$1.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This environment lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(Buffer$1.prototype, "parent", { enumerable: true, get: function() {
      if (Buffer$1.isBuffer(this))
        return this.buffer;
    } }), Object.defineProperty(Buffer$1.prototype, "offset", { enumerable: true, get: function() {
      if (Buffer$1.isBuffer(this))
        return this.byteOffset;
    } }), Buffer$1.poolSize = 8192, Buffer$1.from = function(e2, t2, r2) {
      return from(e2, t2, r2);
    }, Object.setPrototypeOf(Buffer$1.prototype, Uint8Array.prototype), Object.setPrototypeOf(Buffer$1, Uint8Array), Buffer$1.alloc = function(e2, t2, r2) {
      return function(e3, t3, r3) {
        return assertSize(e3), e3 <= 0 ? createBuffer(e3) : void 0 !== t3 ? "string" == typeof r3 ? createBuffer(e3).fill(t3, r3) : createBuffer(e3).fill(t3) : createBuffer(e3);
      }(e2, t2, r2);
    }, Buffer$1.allocUnsafe = function(e2) {
      return allocUnsafe(e2);
    }, Buffer$1.allocUnsafeSlow = function(e2) {
      return allocUnsafe(e2);
    }, Buffer$1.isBuffer = function(e2) {
      return null != e2 && true === e2._isBuffer && e2 !== Buffer$1.prototype;
    }, Buffer$1.compare = function(e2, t2) {
      if (isInstance(e2, Uint8Array) && (e2 = Buffer$1.from(e2, e2.offset, e2.byteLength)), isInstance(t2, Uint8Array) && (t2 = Buffer$1.from(t2, t2.offset, t2.byteLength)), !Buffer$1.isBuffer(e2) || !Buffer$1.isBuffer(t2))
        throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
      if (e2 === t2)
        return 0;
      let r2 = e2.length, n2 = t2.length;
      for (let o3 = 0, s2 = Math.min(r2, n2); o3 < s2; ++o3)
        if (e2[o3] !== t2[o3]) {
          r2 = e2[o3], n2 = t2[o3];
          break;
        }
      return r2 < n2 ? -1 : n2 < r2 ? 1 : 0;
    }, Buffer$1.isEncoding = function(e2) {
      switch (String(e2).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    }, Buffer$1.concat = function(e2, t2) {
      if (!Array.isArray(e2))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (0 === e2.length)
        return Buffer$1.alloc(0);
      let r2;
      if (void 0 === t2)
        for (t2 = 0, r2 = 0; r2 < e2.length; ++r2)
          t2 += e2[r2].length;
      const n2 = Buffer$1.allocUnsafe(t2);
      let o3 = 0;
      for (r2 = 0; r2 < e2.length; ++r2) {
        let t3 = e2[r2];
        if (isInstance(t3, Uint8Array))
          o3 + t3.length > n2.length ? (Buffer$1.isBuffer(t3) || (t3 = Buffer$1.from(t3.buffer, t3.byteOffset, t3.byteLength)), t3.copy(n2, o3)) : Uint8Array.prototype.set.call(n2, t3, o3);
        else {
          if (!Buffer$1.isBuffer(t3))
            throw new TypeError('"list" argument must be an Array of Buffers');
          t3.copy(n2, o3);
        }
        o3 += t3.length;
      }
      return n2;
    }, Buffer$1.byteLength = byteLength, Buffer$1.prototype._isBuffer = true, Buffer$1.prototype.swap16 = function() {
      const e2 = this.length;
      if (e2 % 2 != 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (let t2 = 0; t2 < e2; t2 += 2)
        swap(this, t2, t2 + 1);
      return this;
    }, Buffer$1.prototype.swap32 = function() {
      const e2 = this.length;
      if (e2 % 4 != 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (let t2 = 0; t2 < e2; t2 += 4)
        swap(this, t2, t2 + 3), swap(this, t2 + 1, t2 + 2);
      return this;
    }, Buffer$1.prototype.swap64 = function() {
      const e2 = this.length;
      if (e2 % 8 != 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let t2 = 0; t2 < e2; t2 += 8)
        swap(this, t2, t2 + 7), swap(this, t2 + 1, t2 + 6), swap(this, t2 + 2, t2 + 5), swap(this, t2 + 3, t2 + 4);
      return this;
    }, Buffer$1.prototype.toString = function() {
      const e2 = this.length;
      return 0 === e2 ? "" : 0 === arguments.length ? utf8Slice(this, 0, e2) : Reflect.apply(slowToString, this, arguments);
    }, Buffer$1.prototype.toLocaleString = Buffer$1.prototype.toString, Buffer$1.prototype.equals = function(e2) {
      if (!Buffer$1.isBuffer(e2))
        throw new TypeError("Argument must be a Buffer");
      return this === e2 || 0 === Buffer$1.compare(this, e2);
    }, Buffer$1.prototype.inspect = function() {
      let e2 = "";
      return e2 = this.toString("hex", 0, 50).replace(/(.{2})/g, "$1 ").trim(), this.length > 50 && (e2 += " ... "), "<Buffer " + e2 + ">";
    }, s && (Buffer$1.prototype[s] = Buffer$1.prototype.inspect), Buffer$1.prototype.compare = function(e2, t2, r2, n2, o3) {
      if (isInstance(e2, Uint8Array) && (e2 = Buffer$1.from(e2, e2.offset, e2.byteLength)), !Buffer$1.isBuffer(e2))
        throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e2);
      if (void 0 === t2 && (t2 = 0), void 0 === r2 && (r2 = e2 ? e2.length : 0), void 0 === n2 && (n2 = 0), void 0 === o3 && (o3 = this.length), t2 < 0 || r2 > e2.length || n2 < 0 || o3 > this.length)
        throw new RangeError("out of range index");
      if (n2 >= o3 && t2 >= r2)
        return 0;
      if (n2 >= o3)
        return -1;
      if (t2 >= r2)
        return 1;
      if (this === e2)
        return 0;
      let s2 = (o3 >>>= 0) - (n2 >>>= 0), i2 = (r2 >>>= 0) - (t2 >>>= 0);
      const a2 = Math.min(s2, i2), c2 = this.slice(n2, o3), u2 = e2.slice(t2, r2);
      for (let e3 = 0; e3 < a2; ++e3)
        if (c2[e3] !== u2[e3]) {
          s2 = c2[e3], i2 = u2[e3];
          break;
        }
      return s2 < i2 ? -1 : i2 < s2 ? 1 : 0;
    }, Buffer$1.prototype.includes = function(e2, t2, r2) {
      return -1 !== this.indexOf(e2, t2, r2);
    }, Buffer$1.prototype.indexOf = function(e2, t2, r2) {
      return bidirectionalIndexOf(this, e2, t2, r2, true);
    }, Buffer$1.prototype.lastIndexOf = function(e2, t2, r2) {
      return bidirectionalIndexOf(this, e2, t2, r2, false);
    }, Buffer$1.prototype.write = function(e2, t2, r2, n2) {
      if (void 0 === t2)
        n2 = "utf8", r2 = this.length, t2 = 0;
      else if (void 0 === r2 && "string" == typeof t2)
        n2 = t2, r2 = this.length, t2 = 0;
      else {
        if (!Number.isFinite(t2))
          throw new TypeError("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        t2 >>>= 0, Number.isFinite(r2) ? (r2 >>>= 0, void 0 === n2 && (n2 = "utf8")) : (n2 = r2, r2 = void 0);
      }
      const o3 = this.length - t2;
      if ((void 0 === r2 || r2 > o3) && (r2 = o3), e2.length > 0 && (r2 < 0 || t2 < 0) || t2 > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      n2 || (n2 = "utf8");
      let s2 = false;
      for (; ; )
        switch (n2) {
          case "hex":
            return hexWrite(this, e2, t2, r2);
          case "utf8":
          case "utf-8":
            return utf8Write(this, e2, t2, r2);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, e2, t2, r2);
          case "base64":
            return base64Write(this, e2, t2, r2);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, e2, t2, r2);
          default:
            if (s2)
              throw new TypeError("Unknown encoding: " + n2);
            n2 = ("" + n2).toLowerCase(), s2 = true;
        }
    }, Buffer$1.prototype.toJSON = function() {
      return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
    };
    a = 4096;
    Buffer$1.prototype.slice = function(e2, t2) {
      const r2 = this.length;
      (e2 = Math.trunc(e2)) < 0 ? (e2 += r2) < 0 && (e2 = 0) : e2 > r2 && (e2 = r2), (t2 = void 0 === t2 ? r2 : Math.trunc(t2)) < 0 ? (t2 += r2) < 0 && (t2 = 0) : t2 > r2 && (t2 = r2), t2 < e2 && (t2 = e2);
      const n2 = this.subarray(e2, t2);
      return Object.setPrototypeOf(n2, Buffer$1.prototype), n2;
    }, Buffer$1.prototype.readUintLE = Buffer$1.prototype.readUIntLE = function(e2, t2, r2) {
      e2 >>>= 0, t2 >>>= 0, r2 || checkOffset(e2, t2, this.length);
      let n2 = this[e2], o3 = 1, s2 = 0;
      for (; ++s2 < t2 && (o3 *= 256); )
        n2 += this[e2 + s2] * o3;
      return n2;
    }, Buffer$1.prototype.readUintBE = Buffer$1.prototype.readUIntBE = function(e2, t2, r2) {
      e2 >>>= 0, t2 >>>= 0, r2 || checkOffset(e2, t2, this.length);
      let n2 = this[e2 + --t2], o3 = 1;
      for (; t2 > 0 && (o3 *= 256); )
        n2 += this[e2 + --t2] * o3;
      return n2;
    }, Buffer$1.prototype.readUint8 = Buffer$1.prototype.readUInt8 = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 1, this.length), this[e2];
    }, Buffer$1.prototype.readUint16LE = Buffer$1.prototype.readUInt16LE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 2, this.length), this[e2] | this[e2 + 1] << 8;
    }, Buffer$1.prototype.readUint16BE = Buffer$1.prototype.readUInt16BE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 2, this.length), this[e2] << 8 | this[e2 + 1];
    }, Buffer$1.prototype.readUint32LE = Buffer$1.prototype.readUInt32LE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 4, this.length), (this[e2] | this[e2 + 1] << 8 | this[e2 + 2] << 16) + 16777216 * this[e2 + 3];
    }, Buffer$1.prototype.readUint32BE = Buffer$1.prototype.readUInt32BE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 4, this.length), 16777216 * this[e2] + (this[e2 + 1] << 16 | this[e2 + 2] << 8 | this[e2 + 3]);
    }, Buffer$1.prototype.readBigUInt64LE = defineBigIntMethod(function(e2) {
      validateNumber(e2 >>>= 0, "offset");
      const t2 = this[e2], r2 = this[e2 + 7];
      void 0 !== t2 && void 0 !== r2 || boundsError(e2, this.length - 8);
      const n2 = t2 + 256 * this[++e2] + 65536 * this[++e2] + this[++e2] * 2 ** 24, o3 = this[++e2] + 256 * this[++e2] + 65536 * this[++e2] + r2 * 2 ** 24;
      return BigInt(n2) + (BigInt(o3) << BigInt(32));
    }), Buffer$1.prototype.readBigUInt64BE = defineBigIntMethod(function(e2) {
      validateNumber(e2 >>>= 0, "offset");
      const t2 = this[e2], r2 = this[e2 + 7];
      void 0 !== t2 && void 0 !== r2 || boundsError(e2, this.length - 8);
      const n2 = t2 * 2 ** 24 + 65536 * this[++e2] + 256 * this[++e2] + this[++e2], o3 = this[++e2] * 2 ** 24 + 65536 * this[++e2] + 256 * this[++e2] + r2;
      return (BigInt(n2) << BigInt(32)) + BigInt(o3);
    }), Buffer$1.prototype.readIntLE = function(e2, t2, r2) {
      e2 >>>= 0, t2 >>>= 0, r2 || checkOffset(e2, t2, this.length);
      let n2 = this[e2], o3 = 1, s2 = 0;
      for (; ++s2 < t2 && (o3 *= 256); )
        n2 += this[e2 + s2] * o3;
      return o3 *= 128, n2 >= o3 && (n2 -= Math.pow(2, 8 * t2)), n2;
    }, Buffer$1.prototype.readIntBE = function(e2, t2, r2) {
      e2 >>>= 0, t2 >>>= 0, r2 || checkOffset(e2, t2, this.length);
      let n2 = t2, o3 = 1, s2 = this[e2 + --n2];
      for (; n2 > 0 && (o3 *= 256); )
        s2 += this[e2 + --n2] * o3;
      return o3 *= 128, s2 >= o3 && (s2 -= Math.pow(2, 8 * t2)), s2;
    }, Buffer$1.prototype.readInt8 = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 1, this.length), 128 & this[e2] ? -1 * (255 - this[e2] + 1) : this[e2];
    }, Buffer$1.prototype.readInt16LE = function(e2, t2) {
      e2 >>>= 0, t2 || checkOffset(e2, 2, this.length);
      const r2 = this[e2] | this[e2 + 1] << 8;
      return 32768 & r2 ? 4294901760 | r2 : r2;
    }, Buffer$1.prototype.readInt16BE = function(e2, t2) {
      e2 >>>= 0, t2 || checkOffset(e2, 2, this.length);
      const r2 = this[e2 + 1] | this[e2] << 8;
      return 32768 & r2 ? 4294901760 | r2 : r2;
    }, Buffer$1.prototype.readInt32LE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 4, this.length), this[e2] | this[e2 + 1] << 8 | this[e2 + 2] << 16 | this[e2 + 3] << 24;
    }, Buffer$1.prototype.readInt32BE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 4, this.length), this[e2] << 24 | this[e2 + 1] << 16 | this[e2 + 2] << 8 | this[e2 + 3];
    }, Buffer$1.prototype.readBigInt64LE = defineBigIntMethod(function(e2) {
      validateNumber(e2 >>>= 0, "offset");
      const t2 = this[e2], r2 = this[e2 + 7];
      void 0 !== t2 && void 0 !== r2 || boundsError(e2, this.length - 8);
      const n2 = this[e2 + 4] + 256 * this[e2 + 5] + 65536 * this[e2 + 6] + (r2 << 24);
      return (BigInt(n2) << BigInt(32)) + BigInt(t2 + 256 * this[++e2] + 65536 * this[++e2] + this[++e2] * 2 ** 24);
    }), Buffer$1.prototype.readBigInt64BE = defineBigIntMethod(function(e2) {
      validateNumber(e2 >>>= 0, "offset");
      const t2 = this[e2], r2 = this[e2 + 7];
      void 0 !== t2 && void 0 !== r2 || boundsError(e2, this.length - 8);
      const n2 = (t2 << 24) + 65536 * this[++e2] + 256 * this[++e2] + this[++e2];
      return (BigInt(n2) << BigInt(32)) + BigInt(this[++e2] * 2 ** 24 + 65536 * this[++e2] + 256 * this[++e2] + r2);
    }), Buffer$1.prototype.readFloatLE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 4, this.length), read(this, e2, true, 23, 4);
    }, Buffer$1.prototype.readFloatBE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 4, this.length), read(this, e2, false, 23, 4);
    }, Buffer$1.prototype.readDoubleLE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 8, this.length), read(this, e2, true, 52, 8);
    }, Buffer$1.prototype.readDoubleBE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 8, this.length), read(this, e2, false, 52, 8);
    }, Buffer$1.prototype.writeUintLE = Buffer$1.prototype.writeUIntLE = function(e2, t2, r2, n2) {
      if (e2 = +e2, t2 >>>= 0, r2 >>>= 0, !n2) {
        checkInt(this, e2, t2, r2, Math.pow(2, 8 * r2) - 1, 0);
      }
      let o3 = 1, s2 = 0;
      for (this[t2] = 255 & e2; ++s2 < r2 && (o3 *= 256); )
        this[t2 + s2] = e2 / o3 & 255;
      return t2 + r2;
    }, Buffer$1.prototype.writeUintBE = Buffer$1.prototype.writeUIntBE = function(e2, t2, r2, n2) {
      if (e2 = +e2, t2 >>>= 0, r2 >>>= 0, !n2) {
        checkInt(this, e2, t2, r2, Math.pow(2, 8 * r2) - 1, 0);
      }
      let o3 = r2 - 1, s2 = 1;
      for (this[t2 + o3] = 255 & e2; --o3 >= 0 && (s2 *= 256); )
        this[t2 + o3] = e2 / s2 & 255;
      return t2 + r2;
    }, Buffer$1.prototype.writeUint8 = Buffer$1.prototype.writeUInt8 = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 1, 255, 0), this[t2] = 255 & e2, t2 + 1;
    }, Buffer$1.prototype.writeUint16LE = Buffer$1.prototype.writeUInt16LE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 2, 65535, 0), this[t2] = 255 & e2, this[t2 + 1] = e2 >>> 8, t2 + 2;
    }, Buffer$1.prototype.writeUint16BE = Buffer$1.prototype.writeUInt16BE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 2, 65535, 0), this[t2] = e2 >>> 8, this[t2 + 1] = 255 & e2, t2 + 2;
    }, Buffer$1.prototype.writeUint32LE = Buffer$1.prototype.writeUInt32LE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 4, 4294967295, 0), this[t2 + 3] = e2 >>> 24, this[t2 + 2] = e2 >>> 16, this[t2 + 1] = e2 >>> 8, this[t2] = 255 & e2, t2 + 4;
    }, Buffer$1.prototype.writeUint32BE = Buffer$1.prototype.writeUInt32BE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 4, 4294967295, 0), this[t2] = e2 >>> 24, this[t2 + 1] = e2 >>> 16, this[t2 + 2] = e2 >>> 8, this[t2 + 3] = 255 & e2, t2 + 4;
    }, Buffer$1.prototype.writeBigUInt64LE = defineBigIntMethod(function(e2, t2 = 0) {
      return wrtBigUInt64LE(this, e2, t2, BigInt(0), BigInt("0xffffffffffffffff"));
    }), Buffer$1.prototype.writeBigUInt64BE = defineBigIntMethod(function(e2, t2 = 0) {
      return wrtBigUInt64BE(this, e2, t2, BigInt(0), BigInt("0xffffffffffffffff"));
    }), Buffer$1.prototype.writeIntLE = function(e2, t2, r2, n2) {
      if (e2 = +e2, t2 >>>= 0, !n2) {
        const n3 = Math.pow(2, 8 * r2 - 1);
        checkInt(this, e2, t2, r2, n3 - 1, -n3);
      }
      let o3 = 0, s2 = 1, i2 = 0;
      for (this[t2] = 255 & e2; ++o3 < r2 && (s2 *= 256); )
        e2 < 0 && 0 === i2 && 0 !== this[t2 + o3 - 1] && (i2 = 1), this[t2 + o3] = Math.trunc(e2 / s2) - i2 & 255;
      return t2 + r2;
    }, Buffer$1.prototype.writeIntBE = function(e2, t2, r2, n2) {
      if (e2 = +e2, t2 >>>= 0, !n2) {
        const n3 = Math.pow(2, 8 * r2 - 1);
        checkInt(this, e2, t2, r2, n3 - 1, -n3);
      }
      let o3 = r2 - 1, s2 = 1, i2 = 0;
      for (this[t2 + o3] = 255 & e2; --o3 >= 0 && (s2 *= 256); )
        e2 < 0 && 0 === i2 && 0 !== this[t2 + o3 + 1] && (i2 = 1), this[t2 + o3] = Math.trunc(e2 / s2) - i2 & 255;
      return t2 + r2;
    }, Buffer$1.prototype.writeInt8 = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 1, 127, -128), e2 < 0 && (e2 = 255 + e2 + 1), this[t2] = 255 & e2, t2 + 1;
    }, Buffer$1.prototype.writeInt16LE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 2, 32767, -32768), this[t2] = 255 & e2, this[t2 + 1] = e2 >>> 8, t2 + 2;
    }, Buffer$1.prototype.writeInt16BE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 2, 32767, -32768), this[t2] = e2 >>> 8, this[t2 + 1] = 255 & e2, t2 + 2;
    }, Buffer$1.prototype.writeInt32LE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 4, 2147483647, -2147483648), this[t2] = 255 & e2, this[t2 + 1] = e2 >>> 8, this[t2 + 2] = e2 >>> 16, this[t2 + 3] = e2 >>> 24, t2 + 4;
    }, Buffer$1.prototype.writeInt32BE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 4, 2147483647, -2147483648), e2 < 0 && (e2 = 4294967295 + e2 + 1), this[t2] = e2 >>> 24, this[t2 + 1] = e2 >>> 16, this[t2 + 2] = e2 >>> 8, this[t2 + 3] = 255 & e2, t2 + 4;
    }, Buffer$1.prototype.writeBigInt64LE = defineBigIntMethod(function(e2, t2 = 0) {
      return wrtBigUInt64LE(this, e2, t2, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), Buffer$1.prototype.writeBigInt64BE = defineBigIntMethod(function(e2, t2 = 0) {
      return wrtBigUInt64BE(this, e2, t2, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), Buffer$1.prototype.writeFloatLE = function(e2, t2, r2) {
      return writeFloat(this, e2, t2, true, r2);
    }, Buffer$1.prototype.writeFloatBE = function(e2, t2, r2) {
      return writeFloat(this, e2, t2, false, r2);
    }, Buffer$1.prototype.writeDoubleLE = function(e2, t2, r2) {
      return writeDouble(this, e2, t2, true, r2);
    }, Buffer$1.prototype.writeDoubleBE = function(e2, t2, r2) {
      return writeDouble(this, e2, t2, false, r2);
    }, Buffer$1.prototype.copy = function(e2, t2, r2, n2) {
      if (!Buffer$1.isBuffer(e2))
        throw new TypeError("argument should be a Buffer");
      if (r2 || (r2 = 0), n2 || 0 === n2 || (n2 = this.length), t2 >= e2.length && (t2 = e2.length), t2 || (t2 = 0), n2 > 0 && n2 < r2 && (n2 = r2), n2 === r2)
        return 0;
      if (0 === e2.length || 0 === this.length)
        return 0;
      if (t2 < 0)
        throw new RangeError("targetStart out of bounds");
      if (r2 < 0 || r2 >= this.length)
        throw new RangeError("Index out of range");
      if (n2 < 0)
        throw new RangeError("sourceEnd out of bounds");
      n2 > this.length && (n2 = this.length), e2.length - t2 < n2 - r2 && (n2 = e2.length - t2 + r2);
      const o3 = n2 - r2;
      return this === e2 && "function" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(t2, r2, n2) : Uint8Array.prototype.set.call(e2, this.subarray(r2, n2), t2), o3;
    }, Buffer$1.prototype.fill = function(e2, t2, r2, n2) {
      if ("string" == typeof e2) {
        if ("string" == typeof t2 ? (n2 = t2, t2 = 0, r2 = this.length) : "string" == typeof r2 && (n2 = r2, r2 = this.length), void 0 !== n2 && "string" != typeof n2)
          throw new TypeError("encoding must be a string");
        if ("string" == typeof n2 && !Buffer$1.isEncoding(n2))
          throw new TypeError("Unknown encoding: " + n2);
        if (1 === e2.length) {
          const t3 = e2.charCodeAt(0);
          ("utf8" === n2 && t3 < 128 || "latin1" === n2) && (e2 = t3);
        }
      } else
        "number" == typeof e2 ? e2 &= 255 : "boolean" == typeof e2 && (e2 = Number(e2));
      if (t2 < 0 || this.length < t2 || this.length < r2)
        throw new RangeError("Out of range index");
      if (r2 <= t2)
        return this;
      let o3;
      if (t2 >>>= 0, r2 = void 0 === r2 ? this.length : r2 >>> 0, e2 || (e2 = 0), "number" == typeof e2)
        for (o3 = t2; o3 < r2; ++o3)
          this[o3] = e2;
      else {
        const s2 = Buffer$1.isBuffer(e2) ? e2 : Buffer$1.from(e2, n2), i2 = s2.length;
        if (0 === i2)
          throw new TypeError('The value "' + e2 + '" is invalid for argument "value"');
        for (o3 = 0; o3 < r2 - t2; ++o3)
          this[o3 + t2] = s2[o3 % i2];
      }
      return this;
    };
    c = {};
    E("ERR_BUFFER_OUT_OF_BOUNDS", function(e2) {
      return e2 ? `${e2} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    }, RangeError), E("ERR_INVALID_ARG_TYPE", function(e2, t2) {
      return `The "${e2}" argument must be of type number. Received type ${typeof t2}`;
    }, TypeError), E("ERR_OUT_OF_RANGE", function(e2, t2, r2) {
      let n2 = `The value of "${e2}" is out of range.`, o3 = r2;
      return Number.isInteger(r2) && Math.abs(r2) > 2 ** 32 ? o3 = addNumericalSeparator(String(r2)) : "bigint" == typeof r2 && (o3 = String(r2), (r2 > BigInt(2) ** BigInt(32) || r2 < -(BigInt(2) ** BigInt(32))) && (o3 = addNumericalSeparator(o3)), o3 += "n"), n2 += ` It must be ${t2}. Received ${o3}`, n2;
    }, RangeError);
    u = /[^\w+/-]/g;
    l = function() {
      const e2 = "0123456789abcdef", t2 = Array.from({ length: 256 });
      for (let r2 = 0; r2 < 16; ++r2) {
        const n2 = 16 * r2;
        for (let o3 = 0; o3 < 16; ++o3)
          t2[n2 + o3] = e2[r2] + e2[o3];
      }
      return t2;
    }();
    f = globalThis.Buffer || Buffer$1;
    notImplemented("buffer.resolveObjectURL"), notImplemented("buffer.transcode"), notImplemented("buffer.isUtf8"), notImplemented("buffer.isAscii");
    p = {};
    !function() {
      try {
        h = "function" == typeof setTimeout ? setTimeout : defaultSetTimeout;
      } catch {
        h = defaultSetTimeout;
      }
      try {
        d = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
      } catch {
        d = defaultClearTimeout;
      }
    }();
    g = [];
    y = false;
    w = -1;
    p.nextTick = function(e2) {
      const t2 = Array.from({ length: arguments.length - 1 });
      if (arguments.length > 1)
        for (let e3 = 1; e3 < arguments.length; e3++)
          t2[e3 - 1] = arguments[e3];
      g.push(new Item(e2, t2)), 1 !== g.length || y || runTimeout(drainQueue);
    }, Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    }, p.title = "unenv";
    b = /* @__PURE__ */ Object.create(null);
    v = globalThis.process?.env;
    _getEnv = (e2) => v || globalThis.__env__ || (e2 ? b : globalThis);
    p.env = new Proxy(b, { get: (e2, t2) => _getEnv()[t2] ?? b[t2], has: (e2, t2) => t2 in _getEnv() || t2 in b, set: (e2, t2, r2) => (_getEnv(true)[t2] = r2, true), deleteProperty(e2, t2) {
      delete _getEnv(true)[t2];
    }, ownKeys() {
      const e2 = _getEnv();
      return Object.keys(e2);
    } }), p.argv = [], p.version = "", p.versions = {}, p.on = noop$1, p.addListener = noop$1, p.once = noop$1, p.off = noop$1, p.removeListener = noop$1, p.removeAllListeners = noop$1, p.emit = noop$1, p.prependListener = noop$1, p.prependOnceListener = noop$1, p.listeners = function(e2) {
      return [];
    }, p.binding = function(e2) {
      throw new Error("[unenv] process.binding is not supported");
    };
    _ = "/";
    p.cwd = function() {
      return _;
    }, p.chdir = function(e2) {
      _ = e2;
    }, p.umask = function() {
      return 0;
    };
    x = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof global ? global : {};
    x.process = x.process || p;
    B = x.process;
    I = /#/g;
    k = /&/g;
    A = /\//g;
    R = /=/g;
    T = /\+/g;
    C = /%5e/gi;
    S = /%60/gi;
    $ = /%7c/gi;
    j = /%20/gi;
    O = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
    N = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
    M = /^([/\\]\s*){2,}[^/\\]/;
    L = /^\.?\//;
    U = Symbol.for("ufo:protocolRelative");
    P = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
    H = {};
    q = { exports: {} };
    Mime$1.prototype.define = function(e2, t2) {
      for (let r2 in e2) {
        let n2 = e2[r2].map(function(e3) {
          return e3.toLowerCase();
        });
        r2 = r2.toLowerCase();
        for (let e3 = 0; e3 < n2.length; e3++) {
          const o3 = n2[e3];
          if ("*" !== o3[0]) {
            if (!t2 && o3 in this._types)
              throw new Error('Attempt to change mapping for "' + o3 + '" extension from "' + this._types[o3] + '" to "' + r2 + '". Pass `force=true` to allow this, otherwise remove "' + o3 + '" from the list of extensions for "' + r2 + '".');
            this._types[o3] = r2;
          }
        }
        if (t2 || !this._extensions[r2]) {
          const e3 = n2[0];
          this._extensions[r2] = "*" !== e3[0] ? e3 : e3.substr(1);
        }
      }
    }, Mime$1.prototype.getType = function(e2) {
      let t2 = (e2 = String(e2)).replace(/^.*[/\\]/, "").toLowerCase(), r2 = t2.replace(/^.*\./, "").toLowerCase(), n2 = t2.length < e2.length;
      return (r2.length < t2.length - 1 || !n2) && this._types[r2] || null;
    }, Mime$1.prototype.getExtension = function(e2) {
      return (e2 = /^\s*([^;\s]*)/.test(e2) && RegExp.$1) && this._extensions[e2.toLowerCase()] || null;
    };
    W = new Mime$1({ "application/andrew-inset": ["ez"], "application/applixware": ["aw"], "application/atom+xml": ["atom"], "application/atomcat+xml": ["atomcat"], "application/atomdeleted+xml": ["atomdeleted"], "application/atomsvc+xml": ["atomsvc"], "application/atsc-dwd+xml": ["dwd"], "application/atsc-held+xml": ["held"], "application/atsc-rsat+xml": ["rsat"], "application/bdoc": ["bdoc"], "application/calendar+xml": ["xcs"], "application/ccxml+xml": ["ccxml"], "application/cdfx+xml": ["cdfx"], "application/cdmi-capability": ["cdmia"], "application/cdmi-container": ["cdmic"], "application/cdmi-domain": ["cdmid"], "application/cdmi-object": ["cdmio"], "application/cdmi-queue": ["cdmiq"], "application/cu-seeme": ["cu"], "application/dash+xml": ["mpd"], "application/davmount+xml": ["davmount"], "application/docbook+xml": ["dbk"], "application/dssc+der": ["dssc"], "application/dssc+xml": ["xdssc"], "application/ecmascript": ["es", "ecma"], "application/emma+xml": ["emma"], "application/emotionml+xml": ["emotionml"], "application/epub+zip": ["epub"], "application/exi": ["exi"], "application/express": ["exp"], "application/fdt+xml": ["fdt"], "application/font-tdpfr": ["pfr"], "application/geo+json": ["geojson"], "application/gml+xml": ["gml"], "application/gpx+xml": ["gpx"], "application/gxf": ["gxf"], "application/gzip": ["gz"], "application/hjson": ["hjson"], "application/hyperstudio": ["stk"], "application/inkml+xml": ["ink", "inkml"], "application/ipfix": ["ipfix"], "application/its+xml": ["its"], "application/java-archive": ["jar", "war", "ear"], "application/java-serialized-object": ["ser"], "application/java-vm": ["class"], "application/javascript": ["js", "mjs"], "application/json": ["json", "map"], "application/json5": ["json5"], "application/jsonml+json": ["jsonml"], "application/ld+json": ["jsonld"], "application/lgr+xml": ["lgr"], "application/lost+xml": ["lostxml"], "application/mac-binhex40": ["hqx"], "application/mac-compactpro": ["cpt"], "application/mads+xml": ["mads"], "application/manifest+json": ["webmanifest"], "application/marc": ["mrc"], "application/marcxml+xml": ["mrcx"], "application/mathematica": ["ma", "nb", "mb"], "application/mathml+xml": ["mathml"], "application/mbox": ["mbox"], "application/mediaservercontrol+xml": ["mscml"], "application/metalink+xml": ["metalink"], "application/metalink4+xml": ["meta4"], "application/mets+xml": ["mets"], "application/mmt-aei+xml": ["maei"], "application/mmt-usd+xml": ["musd"], "application/mods+xml": ["mods"], "application/mp21": ["m21", "mp21"], "application/mp4": ["mp4s", "m4p"], "application/msword": ["doc", "dot"], "application/mxf": ["mxf"], "application/n-quads": ["nq"], "application/n-triples": ["nt"], "application/node": ["cjs"], "application/octet-stream": ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"], "application/oda": ["oda"], "application/oebps-package+xml": ["opf"], "application/ogg": ["ogx"], "application/omdoc+xml": ["omdoc"], "application/onenote": ["onetoc", "onetoc2", "onetmp", "onepkg"], "application/oxps": ["oxps"], "application/p2p-overlay+xml": ["relo"], "application/patch-ops-error+xml": ["xer"], "application/pdf": ["pdf"], "application/pgp-encrypted": ["pgp"], "application/pgp-signature": ["asc", "sig"], "application/pics-rules": ["prf"], "application/pkcs10": ["p10"], "application/pkcs7-mime": ["p7m", "p7c"], "application/pkcs7-signature": ["p7s"], "application/pkcs8": ["p8"], "application/pkix-attr-cert": ["ac"], "application/pkix-cert": ["cer"], "application/pkix-crl": ["crl"], "application/pkix-pkipath": ["pkipath"], "application/pkixcmp": ["pki"], "application/pls+xml": ["pls"], "application/postscript": ["ai", "eps", "ps"], "application/provenance+xml": ["provx"], "application/pskc+xml": ["pskcxml"], "application/raml+yaml": ["raml"], "application/rdf+xml": ["rdf", "owl"], "application/reginfo+xml": ["rif"], "application/relax-ng-compact-syntax": ["rnc"], "application/resource-lists+xml": ["rl"], "application/resource-lists-diff+xml": ["rld"], "application/rls-services+xml": ["rs"], "application/route-apd+xml": ["rapd"], "application/route-s-tsid+xml": ["sls"], "application/route-usd+xml": ["rusd"], "application/rpki-ghostbusters": ["gbr"], "application/rpki-manifest": ["mft"], "application/rpki-roa": ["roa"], "application/rsd+xml": ["rsd"], "application/rss+xml": ["rss"], "application/rtf": ["rtf"], "application/sbml+xml": ["sbml"], "application/scvp-cv-request": ["scq"], "application/scvp-cv-response": ["scs"], "application/scvp-vp-request": ["spq"], "application/scvp-vp-response": ["spp"], "application/sdp": ["sdp"], "application/senml+xml": ["senmlx"], "application/sensml+xml": ["sensmlx"], "application/set-payment-initiation": ["setpay"], "application/set-registration-initiation": ["setreg"], "application/shf+xml": ["shf"], "application/sieve": ["siv", "sieve"], "application/smil+xml": ["smi", "smil"], "application/sparql-query": ["rq"], "application/sparql-results+xml": ["srx"], "application/srgs": ["gram"], "application/srgs+xml": ["grxml"], "application/sru+xml": ["sru"], "application/ssdl+xml": ["ssdl"], "application/ssml+xml": ["ssml"], "application/swid+xml": ["swidtag"], "application/tei+xml": ["tei", "teicorpus"], "application/thraud+xml": ["tfi"], "application/timestamped-data": ["tsd"], "application/toml": ["toml"], "application/trig": ["trig"], "application/ttml+xml": ["ttml"], "application/ubjson": ["ubj"], "application/urc-ressheet+xml": ["rsheet"], "application/urc-targetdesc+xml": ["td"], "application/voicexml+xml": ["vxml"], "application/wasm": ["wasm"], "application/widget": ["wgt"], "application/winhlp": ["hlp"], "application/wsdl+xml": ["wsdl"], "application/wspolicy+xml": ["wspolicy"], "application/xaml+xml": ["xaml"], "application/xcap-att+xml": ["xav"], "application/xcap-caps+xml": ["xca"], "application/xcap-diff+xml": ["xdf"], "application/xcap-el+xml": ["xel"], "application/xcap-ns+xml": ["xns"], "application/xenc+xml": ["xenc"], "application/xhtml+xml": ["xhtml", "xht"], "application/xliff+xml": ["xlf"], "application/xml": ["xml", "xsl", "xsd", "rng"], "application/xml-dtd": ["dtd"], "application/xop+xml": ["xop"], "application/xproc+xml": ["xpl"], "application/xslt+xml": ["*xsl", "xslt"], "application/xspf+xml": ["xspf"], "application/xv+xml": ["mxml", "xhvml", "xvml", "xvm"], "application/yang": ["yang"], "application/yin+xml": ["yin"], "application/zip": ["zip"], "audio/3gpp": ["*3gpp"], "audio/adpcm": ["adp"], "audio/amr": ["amr"], "audio/basic": ["au", "snd"], "audio/midi": ["mid", "midi", "kar", "rmi"], "audio/mobile-xmf": ["mxmf"], "audio/mp3": ["*mp3"], "audio/mp4": ["m4a", "mp4a"], "audio/mpeg": ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"], "audio/ogg": ["oga", "ogg", "spx", "opus"], "audio/s3m": ["s3m"], "audio/silk": ["sil"], "audio/wav": ["wav"], "audio/wave": ["*wav"], "audio/webm": ["weba"], "audio/xm": ["xm"], "font/collection": ["ttc"], "font/otf": ["otf"], "font/ttf": ["ttf"], "font/woff": ["woff"], "font/woff2": ["woff2"], "image/aces": ["exr"], "image/apng": ["apng"], "image/avif": ["avif"], "image/bmp": ["bmp"], "image/cgm": ["cgm"], "image/dicom-rle": ["drle"], "image/emf": ["emf"], "image/fits": ["fits"], "image/g3fax": ["g3"], "image/gif": ["gif"], "image/heic": ["heic"], "image/heic-sequence": ["heics"], "image/heif": ["heif"], "image/heif-sequence": ["heifs"], "image/hej2k": ["hej2"], "image/hsj2": ["hsj2"], "image/ief": ["ief"], "image/jls": ["jls"], "image/jp2": ["jp2", "jpg2"], "image/jpeg": ["jpeg", "jpg", "jpe"], "image/jph": ["jph"], "image/jphc": ["jhc"], "image/jpm": ["jpm"], "image/jpx": ["jpx", "jpf"], "image/jxr": ["jxr"], "image/jxra": ["jxra"], "image/jxrs": ["jxrs"], "image/jxs": ["jxs"], "image/jxsc": ["jxsc"], "image/jxsi": ["jxsi"], "image/jxss": ["jxss"], "image/ktx": ["ktx"], "image/ktx2": ["ktx2"], "image/png": ["png"], "image/sgi": ["sgi"], "image/svg+xml": ["svg", "svgz"], "image/t38": ["t38"], "image/tiff": ["tif", "tiff"], "image/tiff-fx": ["tfx"], "image/webp": ["webp"], "image/wmf": ["wmf"], "message/disposition-notification": ["disposition-notification"], "message/global": ["u8msg"], "message/global-delivery-status": ["u8dsn"], "message/global-disposition-notification": ["u8mdn"], "message/global-headers": ["u8hdr"], "message/rfc822": ["eml", "mime"], "model/3mf": ["3mf"], "model/gltf+json": ["gltf"], "model/gltf-binary": ["glb"], "model/iges": ["igs", "iges"], "model/mesh": ["msh", "mesh", "silo"], "model/mtl": ["mtl"], "model/obj": ["obj"], "model/step+xml": ["stpx"], "model/step+zip": ["stpz"], "model/step-xml+zip": ["stpxz"], "model/stl": ["stl"], "model/vrml": ["wrl", "vrml"], "model/x3d+binary": ["*x3db", "x3dbz"], "model/x3d+fastinfoset": ["x3db"], "model/x3d+vrml": ["*x3dv", "x3dvz"], "model/x3d+xml": ["x3d", "x3dz"], "model/x3d-vrml": ["x3dv"], "text/cache-manifest": ["appcache", "manifest"], "text/calendar": ["ics", "ifb"], "text/coffeescript": ["coffee", "litcoffee"], "text/css": ["css"], "text/csv": ["csv"], "text/html": ["html", "htm", "shtml"], "text/jade": ["jade"], "text/jsx": ["jsx"], "text/less": ["less"], "text/markdown": ["markdown", "md"], "text/mathml": ["mml"], "text/mdx": ["mdx"], "text/n3": ["n3"], "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"], "text/richtext": ["rtx"], "text/rtf": ["*rtf"], "text/sgml": ["sgml", "sgm"], "text/shex": ["shex"], "text/slim": ["slim", "slm"], "text/spdx": ["spdx"], "text/stylus": ["stylus", "styl"], "text/tab-separated-values": ["tsv"], "text/troff": ["t", "tr", "roff", "man", "me", "ms"], "text/turtle": ["ttl"], "text/uri-list": ["uri", "uris", "urls"], "text/vcard": ["vcard"], "text/vtt": ["vtt"], "text/xml": ["*xml"], "text/yaml": ["yaml", "yml"], "video/3gpp": ["3gp", "3gpp"], "video/3gpp2": ["3g2"], "video/h261": ["h261"], "video/h263": ["h263"], "video/h264": ["h264"], "video/iso.segment": ["m4s"], "video/jpeg": ["jpgv"], "video/jpm": ["*jpm", "jpgm"], "video/mj2": ["mj2", "mjp2"], "video/mp2t": ["ts"], "video/mp4": ["mp4", "mp4v", "mpg4"], "video/mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v"], "video/ogg": ["ogv"], "video/quicktime": ["qt", "mov"], "video/webm": ["webm"] });
    F = q.exports;
    Object.defineProperty(F, "__esModule", { value: true });
    D = { ...((z = W) && z.__esModule ? z : { default: z }).default };
    D.lookup = D.getType, D.extension = D.getExtension;
    noop = () => {
    };
    D.define = noop, D.load = noop, D.default_type = "application/octet-stream", D.charsets = { lookup: () => "UTF-8" }, q.exports = D;
    K = q.exports;
    V = {};
    Object.defineProperty(V, "__esModule", { value: true }), V.InternalError = V.NotFoundError = V.MethodNotAllowedError = V.KVError = void 0;
    KVError = class extends Error {
      constructor(e2, t2 = 500) {
        super(e2), Object.setPrototypeOf(this, new.target.prototype), this.name = KVError.name, this.status = t2;
      }
      status;
    };
    V.KVError = KVError;
    V.MethodNotAllowedError = class extends KVError {
      constructor(e2 = "Not a valid request method", t2 = 405) {
        super(e2, t2);
      }
    };
    V.NotFoundError = class extends KVError {
      constructor(e2 = "Not Found", t2 = 404) {
        super(e2, t2);
      }
    };
    V.InternalError = class extends KVError {
      constructor(e2 = "Internal Error in KV Asset Handler", t2 = 500) {
        super(e2, t2);
      }
    }, function(e2) {
      var t2 = P && P.__createBinding || (Object.create ? function(e3, t3, r3, n3) {
        void 0 === n3 && (n3 = r3);
        var o4 = Object.getOwnPropertyDescriptor(t3, r3);
        o4 && !("get" in o4 ? !t3.__esModule : o4.writable || o4.configurable) || (o4 = { enumerable: true, get: function() {
          return t3[r3];
        } }), Object.defineProperty(e3, n3, o4);
      } : function(e3, t3, r3, n3) {
        void 0 === n3 && (n3 = r3), e3[n3] = t3[r3];
      }), r2 = P && P.__setModuleDefault || (Object.create ? function(e3, t3) {
        Object.defineProperty(e3, "default", { enumerable: true, value: t3 });
      } : function(e3, t3) {
        e3.default = t3;
      }), n2 = P && P.__importStar || function(e3) {
        if (e3 && e3.__esModule)
          return e3;
        var n3 = {};
        if (null != e3)
          for (var o4 in e3)
            "default" !== o4 && Object.prototype.hasOwnProperty.call(e3, o4) && t2(n3, e3, o4);
        return r2(n3, e3), n3;
      };
      Object.defineProperty(e2, "__esModule", { value: true }), e2.InternalError = e2.NotFoundError = e2.MethodNotAllowedError = e2.serveSinglePageApp = e2.mapRequestToAsset = e2.getAssetFromKV = void 0;
      const o3 = n2(K), s2 = V;
      Object.defineProperty(e2, "InternalError", { enumerable: true, get: function() {
        return s2.InternalError;
      } }), Object.defineProperty(e2, "MethodNotAllowedError", { enumerable: true, get: function() {
        return s2.MethodNotAllowedError;
      } }), Object.defineProperty(e2, "NotFoundError", { enumerable: true, get: function() {
        return s2.NotFoundError;
      } });
      const i2 = { browserTTL: null, edgeTTL: 172800, bypassCache: false }, parseStringAsObject = (e3) => "string" == typeof e3 ? JSON.parse(e3) : e3, a2 = { ASSET_NAMESPACE: "undefined" != typeof __STATIC_CONTENT ? __STATIC_CONTENT : void 0, ASSET_MANIFEST: "undefined" != typeof __STATIC_CONTENT_MANIFEST ? parseStringAsObject(__STATIC_CONTENT_MANIFEST) : {}, cacheControl: i2, defaultMimeType: "text/plain", defaultDocument: "index.html", pathIsEncoded: false, defaultETag: "strong" };
      function assignOptions(e3) {
        return Object.assign({}, a2, e3);
      }
      const mapRequestToAsset = (e3, t3) => {
        t3 = assignOptions(t3);
        const r3 = new URL(e3.url);
        let n3 = r3.pathname;
        return n3.endsWith("/") ? n3 = n3.concat(t3.defaultDocument) : o3.getType(n3) || (n3 = n3.concat("/" + t3.defaultDocument)), r3.pathname = n3, new Request(r3.toString(), e3);
      };
      e2.mapRequestToAsset = mapRequestToAsset, e2.serveSinglePageApp = function(e3, t3) {
        t3 = assignOptions(t3), e3 = mapRequestToAsset(e3, t3);
        const r3 = new URL(e3.url);
        return r3.pathname.endsWith(".html") ? new Request(`${r3.origin}/${t3.defaultDocument}`, e3) : e3;
      };
      e2.getAssetFromKV = async (e3, t3) => {
        t3 = assignOptions(t3);
        const r3 = e3.request, n3 = t3.ASSET_NAMESPACE, a3 = parseStringAsObject(t3.ASSET_MANIFEST);
        if (void 0 === n3)
          throw new s2.InternalError("there is no KV namespace bound to the script");
        const c2 = new URL(r3.url).pathname.replace(/^\/+/, "");
        let u2, l2 = t3.pathIsEncoded;
        if (t3.mapRequestToAsset)
          u2 = t3.mapRequestToAsset(r3);
        else if (a3[c2])
          u2 = r3;
        else if (a3[decodeURIComponent(c2)])
          l2 = true, u2 = r3;
        else {
          const e4 = mapRequestToAsset(r3), n4 = new URL(e4.url).pathname.replace(/^\/+/, "");
          a3[decodeURIComponent(n4)] ? (l2 = true, u2 = e4) : u2 = mapRequestToAsset(r3, t3);
        }
        if (!["GET", "HEAD"].includes(u2.method))
          throw new s2.MethodNotAllowedError(`${u2.method} is not a valid request method`);
        const f2 = new URL(u2.url);
        let p2 = (l2 ? decodeURIComponent(f2.pathname) : f2.pathname).replace(/^\/+/, "");
        const h2 = caches.default;
        let d2 = o3.getType(p2) || t3.defaultMimeType;
        (d2.startsWith("text") || "application/javascript" === d2) && (d2 += "; charset=utf-8");
        let m2 = false;
        void 0 !== a3 && a3[p2] && (p2 = a3[p2], m2 = true);
        const g2 = new Request(`${f2.origin}/${p2}`, r3), y2 = (() => {
          switch (typeof t3.cacheControl) {
            case "function":
              return t3.cacheControl(r3);
            case "object":
              return t3.cacheControl;
            default:
              return i2;
          }
        })(), formatETag = (e4 = p2, r4 = t3.defaultETag) => {
          if (!e4)
            return "";
          switch (r4) {
            case "weak":
              return e4.startsWith("W/") ? e4 : e4.startsWith('"') && e4.endsWith('"') ? `W/${e4}` : `W/"${e4}"`;
            case "strong":
              return e4.startsWith('W/"') && (e4 = e4.replace("W/", "")), e4.endsWith('"') || (e4 = `"${e4}"`), e4;
            default:
              return "";
          }
        };
        t3.cacheControl = Object.assign({}, i2, y2), (t3.cacheControl.bypassCache || null === t3.cacheControl.edgeTTL || "HEAD" == r3.method) && (m2 = false);
        const w2 = "number" == typeof t3.cacheControl.browserTTL;
        let b2 = null;
        if (m2 && (b2 = await h2.match(g2)), b2)
          if (b2.status > 300 && b2.status < 400)
            b2.body && "cancel" in Object.getPrototypeOf(b2.body) && b2.body.cancel(), b2 = new Response(null, b2);
          else {
            const e4 = { headers: new Headers(b2.headers), status: 0, statusText: "" };
            e4.headers.set("cf-cache-status", "HIT"), b2.status ? (e4.status = b2.status, e4.statusText = b2.statusText) : e4.headers.has("Content-Range") ? (e4.status = 206, e4.statusText = "Partial Content") : (e4.status = 200, e4.statusText = "OK"), b2 = new Response(b2.body, e4);
          }
        else {
          const r4 = await n3.get(p2, "arrayBuffer");
          if (null === r4)
            throw new s2.NotFoundError(`could not find ${p2} in your content namespace`);
          b2 = new Response(r4), m2 && (b2.headers.set("Accept-Ranges", "bytes"), b2.headers.set("Content-Length", String(r4.byteLength)), b2.headers.has("etag") || b2.headers.set("etag", formatETag(p2)), b2.headers.set("Cache-Control", `max-age=${t3.cacheControl.edgeTTL}`), e3.waitUntil(h2.put(g2, b2.clone())), b2.headers.set("CF-Cache-Status", "MISS"));
        }
        if (b2.headers.set("Content-Type", d2), 304 === b2.status) {
          const e4 = formatETag(b2.headers.get("etag")), t4 = g2.headers.get("if-none-match"), r4 = b2.headers.get("CF-Cache-Status");
          e4 && (t4 && t4 === e4 && "MISS" === r4 ? b2.headers.set("CF-Cache-Status", "EXPIRED") : b2.headers.set("CF-Cache-Status", "REVALIDATED"), b2.headers.set("etag", formatETag(e4, "weak")));
        }
        return w2 ? b2.headers.set("Cache-Control", `max-age=${t3.cacheControl.browserTTL}`) : b2.headers.delete("Cache-Control"), b2;
      };
    }(H);
    Q = Object.freeze({ ignoreUnknown: false, respectType: false, respectFunctionNames: false, respectFunctionProperties: false, unorderedObjects: true, unorderedArrays: false, unorderedSets: false, excludeKeys: void 0, excludeValues: void 0, replacer: void 0 });
    J = Object.freeze(["prototype", "__proto__", "constructor"]);
    G = "[native code] }";
    Y = G.length;
    WordArray = class {
      constructor(e2, t2) {
        e2 = this.words = e2 || [], this.sigBytes = void 0 === t2 ? 4 * e2.length : t2;
      }
      toString(e2) {
        return (e2 || X).stringify(this);
      }
      concat(e2) {
        if (this.clamp(), this.sigBytes % 4)
          for (let t2 = 0; t2 < e2.sigBytes; t2++) {
            const r2 = e2.words[t2 >>> 2] >>> 24 - t2 % 4 * 8 & 255;
            this.words[this.sigBytes + t2 >>> 2] |= r2 << 24 - (this.sigBytes + t2) % 4 * 8;
          }
        else
          for (let t2 = 0; t2 < e2.sigBytes; t2 += 4)
            this.words[this.sigBytes + t2 >>> 2] = e2.words[t2 >>> 2];
        return this.sigBytes += e2.sigBytes, this;
      }
      clamp() {
        this.words[this.sigBytes >>> 2] &= 4294967295 << 32 - this.sigBytes % 4 * 8, this.words.length = Math.ceil(this.sigBytes / 4);
      }
      clone() {
        return new WordArray([...this.words]);
      }
    };
    X = { stringify(e2) {
      const t2 = [];
      for (let r2 = 0; r2 < e2.sigBytes; r2++) {
        const n2 = e2.words[r2 >>> 2] >>> 24 - r2 % 4 * 8 & 255;
        t2.push((n2 >>> 4).toString(16), (15 & n2).toString(16));
      }
      return t2.join("");
    } };
    Z = { stringify(e2) {
      const t2 = [];
      for (let r2 = 0; r2 < e2.sigBytes; r2 += 3) {
        const n2 = (e2.words[r2 >>> 2] >>> 24 - r2 % 4 * 8 & 255) << 16 | (e2.words[r2 + 1 >>> 2] >>> 24 - (r2 + 1) % 4 * 8 & 255) << 8 | e2.words[r2 + 2 >>> 2] >>> 24 - (r2 + 2) % 4 * 8 & 255;
        for (let o3 = 0; o3 < 4 && 8 * r2 + 6 * o3 < 8 * e2.sigBytes; o3++)
          t2.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(n2 >>> 6 * (3 - o3) & 63));
      }
      return t2.join("");
    } };
    ee = { parse(e2) {
      const t2 = e2.length, r2 = [];
      for (let n2 = 0; n2 < t2; n2++)
        r2[n2 >>> 2] |= (255 & e2.charCodeAt(n2)) << 24 - n2 % 4 * 8;
      return new WordArray(r2, t2);
    } };
    te = { parse: (e2) => ee.parse(unescape(encodeURIComponent(e2))) };
    BufferedBlockAlgorithm = class {
      constructor() {
        this._data = new WordArray(), this._nDataBytes = 0, this._minBufferSize = 0, this.blockSize = 16;
      }
      reset() {
        this._data = new WordArray(), this._nDataBytes = 0;
      }
      _append(e2) {
        "string" == typeof e2 && (e2 = te.parse(e2)), this._data.concat(e2), this._nDataBytes += e2.sigBytes;
      }
      _doProcessBlock(e2, t2) {
      }
      _process(e2) {
        let t2, r2 = this._data.sigBytes / (4 * this.blockSize);
        r2 = e2 ? Math.ceil(r2) : Math.max((0 | r2) - this._minBufferSize, 0);
        const n2 = r2 * this.blockSize, o3 = Math.min(4 * n2, this._data.sigBytes);
        if (n2) {
          for (let e3 = 0; e3 < n2; e3 += this.blockSize)
            this._doProcessBlock(this._data.words, e3);
          t2 = this._data.words.splice(0, n2), this._data.sigBytes -= o3;
        }
        return new WordArray(t2, o3);
      }
    };
    Hasher = class extends BufferedBlockAlgorithm {
      update(e2) {
        return this._append(e2), this._process(), this;
      }
      finalize(e2) {
        e2 && this._append(e2);
      }
    };
    re = [1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225];
    ne = [1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987, 1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998];
    oe = [];
    SHA256 = class extends Hasher {
      constructor() {
        super(...arguments), this._hash = new WordArray([...re]);
      }
      reset() {
        super.reset(), this._hash = new WordArray([...re]);
      }
      _doProcessBlock(e2, t2) {
        const r2 = this._hash.words;
        let n2 = r2[0], o3 = r2[1], s2 = r2[2], i2 = r2[3], a2 = r2[4], c2 = r2[5], u2 = r2[6], l2 = r2[7];
        for (let r3 = 0; r3 < 64; r3++) {
          if (r3 < 16)
            oe[r3] = 0 | e2[t2 + r3];
          else {
            const e3 = oe[r3 - 15], t3 = (e3 << 25 | e3 >>> 7) ^ (e3 << 14 | e3 >>> 18) ^ e3 >>> 3, n3 = oe[r3 - 2], o4 = (n3 << 15 | n3 >>> 17) ^ (n3 << 13 | n3 >>> 19) ^ n3 >>> 10;
            oe[r3] = t3 + oe[r3 - 7] + o4 + oe[r3 - 16];
          }
          const f2 = n2 & o3 ^ n2 & s2 ^ o3 & s2, p2 = (n2 << 30 | n2 >>> 2) ^ (n2 << 19 | n2 >>> 13) ^ (n2 << 10 | n2 >>> 22), h2 = l2 + ((a2 << 26 | a2 >>> 6) ^ (a2 << 21 | a2 >>> 11) ^ (a2 << 7 | a2 >>> 25)) + (a2 & c2 ^ ~a2 & u2) + ne[r3] + oe[r3];
          l2 = u2, u2 = c2, c2 = a2, a2 = i2 + h2 | 0, i2 = s2, s2 = o3, o3 = n2, n2 = h2 + (p2 + f2) | 0;
        }
        r2[0] = r2[0] + n2 | 0, r2[1] = r2[1] + o3 | 0, r2[2] = r2[2] + s2 | 0, r2[3] = r2[3] + i2 | 0, r2[4] = r2[4] + a2 | 0, r2[5] = r2[5] + c2 | 0, r2[6] = r2[6] + u2 | 0, r2[7] = r2[7] + l2 | 0;
      }
      finalize(e2) {
        super.finalize(e2);
        const t2 = 8 * this._nDataBytes, r2 = 8 * this._data.sigBytes;
        return this._data.words[r2 >>> 5] |= 128 << 24 - r2 % 32, this._data.words[14 + (r2 + 64 >>> 9 << 4)] = Math.floor(t2 / 4294967296), this._data.words[15 + (r2 + 64 >>> 9 << 4)] = t2, this._data.sigBytes = 4 * this._data.words.length, this._process(), this._hash;
      }
    };
    se = { NORMAL: 0, WILDCARD: 1, PLACEHOLDER: 2 };
    ie = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
    ae = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
    ce = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
    ue = createDefu();
    le = createDefu((e2, t2, r2) => {
      if (void 0 !== e2[t2] && "function" == typeof r2)
        return e2[t2] = r2(e2[t2]), true;
    });
    fe = 10;
    pe = class {
      __unenv__ = true;
      _events = /* @__PURE__ */ Object.create(null);
      _maxListeners;
      static get defaultMaxListeners() {
        return fe;
      }
      static set defaultMaxListeners(e2) {
        if ("number" != typeof e2 || e2 < 0 || Number.isNaN(e2))
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e2 + ".");
        fe = e2;
      }
      setMaxListeners(e2) {
        if ("number" != typeof e2 || e2 < 0 || Number.isNaN(e2))
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e2 + ".");
        return this._maxListeners = e2, this;
      }
      getMaxListeners() {
        return _getMaxListeners(this);
      }
      emit(e2, ...t2) {
        if (!this._events[e2] || 0 === this._events[e2].length)
          return false;
        if ("error" === e2) {
          let e3;
          if (t2.length > 0 && (e3 = t2[0]), e3 instanceof Error)
            throw e3;
          const r2 = new Error("Unhandled error." + (e3 ? " (" + e3.message + ")" : ""));
          throw r2.context = e3, r2;
        }
        for (const r2 of this._events[e2])
          (r2.listener || r2).apply(this, t2);
        return true;
      }
      addListener(e2, t2) {
        return _addListener(this, e2, t2, false);
      }
      on(e2, t2) {
        return _addListener(this, e2, t2, false);
      }
      prependListener(e2, t2) {
        return _addListener(this, e2, t2, true);
      }
      once(e2, t2) {
        return this.on(e2, _wrapOnce(this, e2, t2));
      }
      prependOnceListener(e2, t2) {
        return this.prependListener(e2, _wrapOnce(this, e2, t2));
      }
      removeListener(e2, t2) {
        return function(e3, t3, r2) {
          if (_checkListener(r2), !e3._events[t3] || 0 === e3._events[t3].length)
            return e3;
          const n2 = e3._events[t3].length;
          if (e3._events[t3] = e3._events[t3].filter((e4) => e4 !== r2), n2 === e3._events[t3].length)
            return e3;
          e3._events.removeListener && e3.emit("removeListener", t3, r2.listener || r2);
          0 === e3._events[t3].length && delete e3._events[t3];
          return e3;
        }(this, e2, t2);
      }
      off(e2, t2) {
        return this.removeListener(e2, t2);
      }
      removeAllListeners(e2) {
        return function(e3, t2) {
          if (!e3._events[t2] || 0 === e3._events[t2].length)
            return e3;
          if (e3._events.removeListener)
            for (const r2 of e3._events[t2])
              e3.emit("removeListener", t2, r2.listener || r2);
          return delete e3._events[t2], e3;
        }(this, e2);
      }
      listeners(e2) {
        return _listeners(this, e2, true);
      }
      rawListeners(e2) {
        return _listeners(this, e2, false);
      }
      listenerCount(e2) {
        return this.rawListeners(e2).length;
      }
      eventNames() {
        return Object.keys(this._events);
      }
    };
    he = globalThis.EventEmitter || pe;
    _Readable = class extends he {
      __unenv__ = true;
      readableEncoding = null;
      readableEnded = true;
      readableFlowing = false;
      readableHighWaterMark = 0;
      readableLength = 0;
      readableObjectMode = false;
      readableAborted = false;
      readableDidRead = false;
      closed = false;
      errored = null;
      readable = false;
      destroyed = false;
      static from(e2, t2) {
        return new _Readable(t2);
      }
      constructor(e2) {
        super();
      }
      _read(e2) {
      }
      read(e2) {
      }
      setEncoding(e2) {
        return this;
      }
      pause() {
        return this;
      }
      resume() {
        return this;
      }
      isPaused() {
        return true;
      }
      unpipe(e2) {
        return this;
      }
      unshift(e2, t2) {
      }
      wrap(e2) {
        return this;
      }
      push(e2, t2) {
        return false;
      }
      _destroy(e2, t2) {
        this.removeAllListeners();
      }
      destroy(e2) {
        return this.destroyed = true, this._destroy(e2), this;
      }
      pipe(e2, t2) {
        return {};
      }
      compose(e2, t2) {
        throw new Error("[unenv] Method not implemented.");
      }
      [Symbol.asyncDispose]() {
        return this.destroy(), Promise.resolve();
      }
      async *[Symbol.asyncIterator]() {
        throw createNotImplementedError("Readable.asyncIterator");
      }
      iterator(e2) {
        throw createNotImplementedError("Readable.iterator");
      }
      map(e2, t2) {
        throw createNotImplementedError("Readable.map");
      }
      filter(e2, t2) {
        throw createNotImplementedError("Readable.filter");
      }
      forEach(e2, t2) {
        throw createNotImplementedError("Readable.forEach");
      }
      reduce(e2, t2, r2) {
        throw createNotImplementedError("Readable.reduce");
      }
      find(e2, t2) {
        throw createNotImplementedError("Readable.find");
      }
      findIndex(e2, t2) {
        throw createNotImplementedError("Readable.findIndex");
      }
      some(e2, t2) {
        throw createNotImplementedError("Readable.some");
      }
      toArray(e2) {
        throw createNotImplementedError("Readable.toArray");
      }
      every(e2, t2) {
        throw createNotImplementedError("Readable.every");
      }
      flatMap(e2, t2) {
        throw createNotImplementedError("Readable.flatMap");
      }
      drop(e2, t2) {
        throw createNotImplementedError("Readable.drop");
      }
      take(e2, t2) {
        throw createNotImplementedError("Readable.take");
      }
      asIndexedPairs(e2) {
        throw createNotImplementedError("Readable.asIndexedPairs");
      }
    };
    de = globalThis.Readable || _Readable;
    me = globalThis.Writable || class extends he {
      __unenv__ = true;
      writable = true;
      writableEnded = false;
      writableFinished = false;
      writableHighWaterMark = 0;
      writableLength = 0;
      writableObjectMode = false;
      writableCorked = 0;
      closed = false;
      errored = null;
      writableNeedDrain = false;
      destroyed = false;
      _data;
      _encoding = "utf-8";
      constructor(e2) {
        super();
      }
      pipe(e2, t2) {
        return {};
      }
      _write(e2, t2, r2) {
        if (this.writableEnded)
          r2 && r2();
        else {
          if (void 0 === this._data)
            this._data = e2;
          else {
            const r3 = "string" == typeof this._data ? f.from(this._data, this._encoding || t2 || "utf8") : this._data, n2 = "string" == typeof e2 ? f.from(e2, t2 || this._encoding || "utf8") : e2;
            this._data = f.concat([r3, n2]);
          }
          this._encoding = t2, r2 && r2();
        }
      }
      _writev(e2, t2) {
      }
      _destroy(e2, t2) {
      }
      _final(e2) {
      }
      write(e2, t2, r2) {
        const n2 = "string" == typeof t2 ? this._encoding : "utf-8", o3 = "function" == typeof t2 ? t2 : "function" == typeof r2 ? r2 : void 0;
        return this._write(e2, n2, o3), true;
      }
      setDefaultEncoding(e2) {
        return this;
      }
      end(e2, t2, r2) {
        const n2 = "function" == typeof e2 ? e2 : "function" == typeof t2 ? t2 : "function" == typeof r2 ? r2 : void 0;
        if (this.writableEnded)
          return n2 && n2(), this;
        const o3 = e2 === n2 ? void 0 : e2;
        if (o3) {
          const e3 = t2 === n2 ? void 0 : t2;
          this.write(o3, e3, n2);
        }
        return this.writableEnded = true, this.writableFinished = true, this.emit("close"), this.emit("finish"), this;
      }
      cork() {
      }
      uncork() {
      }
      destroy(e2) {
        return this.destroyed = true, delete this._data, this.removeAllListeners(), this;
      }
      compose(e2, t2) {
        throw new Error("[h3] Method not implemented.");
      }
    };
    ge = class {
      allowHalfOpen = true;
      _destroy;
      constructor(e2 = new de(), t2 = new me()) {
        Object.assign(this, e2), Object.assign(this, t2), this._destroy = function(...e3) {
          return function(...t3) {
            for (const r2 of e3)
              r2(...t3);
          };
        }(e2._destroy, t2._destroy);
      }
    };
    ye = getDuplex();
    we = globalThis.Duplex || ye;
    Socket = class extends we {
      __unenv__ = true;
      bufferSize = 0;
      bytesRead = 0;
      bytesWritten = 0;
      connecting = false;
      destroyed = false;
      pending = false;
      localAddress = "";
      localPort = 0;
      remoteAddress = "";
      remoteFamily = "";
      remotePort = 0;
      autoSelectFamilyAttemptedAddresses = [];
      readyState = "readOnly";
      constructor(e2) {
        super();
      }
      write(e2, t2, r2) {
        return false;
      }
      connect(e2, t2, r2) {
        return this;
      }
      end(e2, t2, r2) {
        return this;
      }
      setEncoding(e2) {
        return this;
      }
      pause() {
        return this;
      }
      resume() {
        return this;
      }
      setTimeout(e2, t2) {
        return this;
      }
      setNoDelay(e2) {
        return this;
      }
      setKeepAlive(e2, t2) {
        return this;
      }
      address() {
        return {};
      }
      unref() {
        return this;
      }
      ref() {
        return this;
      }
      destroySoon() {
        this.destroy();
      }
      resetAndDestroy() {
        const e2 = new Error("ERR_SOCKET_CLOSED");
        return e2.code = "ERR_SOCKET_CLOSED", this.destroy(e2), this;
      }
    };
    IncomingMessage = class extends de {
      __unenv__ = {};
      aborted = false;
      httpVersion = "1.1";
      httpVersionMajor = 1;
      httpVersionMinor = 1;
      complete = true;
      connection;
      socket;
      headers = {};
      trailers = {};
      method = "GET";
      url = "/";
      statusCode = 200;
      statusMessage = "";
      closed = false;
      errored = null;
      readable = false;
      constructor(e2) {
        super(), this.socket = this.connection = e2 || new Socket();
      }
      get rawHeaders() {
        return function(e2) {
          const t2 = [];
          for (const r2 in e2)
            if (Array.isArray(e2[r2]))
              for (const n2 of e2[r2])
                t2.push(r2, n2);
            else
              t2.push(r2, e2[r2]);
          return t2;
        }(this.headers);
      }
      get rawTrailers() {
        return [];
      }
      setTimeout(e2, t2) {
        return this;
      }
      get headersDistinct() {
        return _distinct(this.headers);
      }
      get trailersDistinct() {
        return _distinct(this.trailers);
      }
    };
    ServerResponse = class extends me {
      __unenv__ = true;
      statusCode = 200;
      statusMessage = "";
      upgrading = false;
      chunkedEncoding = false;
      shouldKeepAlive = false;
      useChunkedEncodingByDefault = false;
      sendDate = false;
      finished = false;
      headersSent = false;
      strictContentLength = false;
      connection = null;
      socket = null;
      req;
      _headers = {};
      constructor(e2) {
        super(), this.req = e2;
      }
      assignSocket(e2) {
        e2._httpMessage = this, this.socket = e2, this.connection = e2, this.emit("socket", e2), this._flush();
      }
      _flush() {
        this.flushHeaders();
      }
      detachSocket(e2) {
      }
      writeContinue(e2) {
      }
      writeHead(e2, t2, r2) {
        e2 && (this.statusCode = e2), "string" == typeof t2 && (this.statusMessage = t2, t2 = void 0);
        const n2 = r2 || t2;
        if (n2)
          if (Array.isArray(n2))
            ;
          else
            for (const e3 in n2)
              this.setHeader(e3, n2[e3]);
        return this.headersSent = true, this;
      }
      writeProcessing() {
      }
      setTimeout(e2, t2) {
        return this;
      }
      appendHeader(e2, t2) {
        e2 = e2.toLowerCase();
        const r2 = this._headers[e2], n2 = [...Array.isArray(r2) ? r2 : [r2], ...Array.isArray(t2) ? t2 : [t2]].filter(Boolean);
        return this._headers[e2] = n2.length > 1 ? n2 : n2[0], this;
      }
      setHeader(e2, t2) {
        return this._headers[e2.toLowerCase()] = t2, this;
      }
      getHeader(e2) {
        return this._headers[e2.toLowerCase()];
      }
      getHeaders() {
        return this._headers;
      }
      getHeaderNames() {
        return Object.keys(this._headers);
      }
      hasHeader(e2) {
        return e2.toLowerCase() in this._headers;
      }
      removeHeader(e2) {
        delete this._headers[e2.toLowerCase()];
      }
      addTrailers(e2) {
      }
      flushHeaders() {
      }
      writeEarlyHints(e2, t2) {
        "function" == typeof t2 && t2();
      }
    };
    be = Object.defineProperty;
    __publicField$2 = (e2, t2, r2) => (((e3, t3, r3) => {
      t3 in e3 ? be(e3, t3, { enumerable: true, configurable: true, writable: true, value: r3 }) : e3[t3] = r3;
    })(e2, "symbol" != typeof t2 ? t2 + "" : t2, r2), r2);
    H3Error = class extends Error {
      constructor(e2, t2 = {}) {
        super(e2, t2), __publicField$2(this, "statusCode", 500), __publicField$2(this, "fatal", false), __publicField$2(this, "unhandled", false), __publicField$2(this, "statusMessage"), __publicField$2(this, "data"), __publicField$2(this, "cause"), t2.cause && !this.cause && (this.cause = t2.cause);
      }
      toJSON() {
        const e2 = { message: this.message, statusCode: sanitizeStatusCode(this.statusCode, 500) };
        return this.statusMessage && (e2.statusMessage = sanitizeStatusMessage(this.statusMessage)), void 0 !== this.data && (e2.data = this.data), e2;
      }
    };
    __publicField$2(H3Error, "__h3_error__", true);
    ve = Symbol.for("h3RawBody");
    _e = ["PATCH", "POST", "PUT", "DELETE"];
    xe = { html: "text/html", json: "application/json" };
    Ee = /[^\u0009\u0020-\u007E]/g;
    Be = "undefined" == typeof setImmediate ? (e2) => e2() : setImmediate;
    setHeaders = function(e2, t2) {
      for (const [r2, n2] of Object.entries(t2))
        e2.node.res.setHeader(r2, n2);
    };
    Ie = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
    ke = /* @__PURE__ */ new Set(["transfer-encoding", "connection", "keep-alive", "upgrade", "expect", "host", "accept"]);
    Ae = Object.defineProperty;
    __publicField$1 = (e2, t2, r2) => (((e3, t3, r3) => {
      t3 in e3 ? Ae(e3, t3, { enumerable: true, configurable: true, writable: true, value: r3 }) : e3[t3] = r3;
    })(e2, "symbol" != typeof t2 ? t2 + "" : t2, r2), r2);
    H3Event = class {
      constructor(e2, t2) {
        __publicField$1(this, "__is_event__", true), __publicField$1(this, "node"), __publicField$1(this, "web"), __publicField$1(this, "context", {}), __publicField$1(this, "_method"), __publicField$1(this, "_path"), __publicField$1(this, "_headers"), __publicField$1(this, "_requestBody"), __publicField$1(this, "_handled", false), __publicField$1(this, "_onBeforeResponseCalled"), __publicField$1(this, "_onAfterResponseCalled"), this.node = { req: e2, res: t2 };
      }
      get method() {
        return this._method || (this._method = (this.node.req.method || "GET").toUpperCase()), this._method;
      }
      get path() {
        return this._path || this.node.req.url || "/";
      }
      get headers() {
        return this._headers || (this._headers = function(e2) {
          const t2 = new Headers();
          for (const [r2, n2] of Object.entries(e2))
            if (Array.isArray(n2))
              for (const e3 of n2)
                t2.append(r2, e3);
            else
              n2 && t2.set(r2, n2);
          return t2;
        }(this.node.req.headers)), this._headers;
      }
      get handled() {
        return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
      }
      respondWith(e2) {
        return Promise.resolve(e2).then((e3) => sendWebResponse(this, e3));
      }
      toString() {
        return `[${this.method}] ${this.path}`;
      }
      toJSON() {
        return this.toString();
      }
      get req() {
        return this.node.req;
      }
      get res() {
        return this.node.res;
      }
    };
    Re = defineEventHandler;
    lazyEventHandler = function(e2) {
      let t2, r2;
      const resolveHandler = () => r2 ? Promise.resolve(r2) : (t2 || (t2 = Promise.resolve(e2()).then((e3) => {
        const t3 = e3.default || e3;
        if ("function" != typeof t3)
          throw new TypeError("Invalid lazy handler result. It should be a function:", t3);
        return r2 = { handler: toEventHandler(e3.default || e3) }, r2;
      })), t2), n2 = Re((e3) => r2 ? r2.handler(e3) : resolveHandler().then((t3) => t3.handler(e3)));
      return n2.__resolve__ = resolveHandler, n2;
    };
    Te = ["connect", "delete", "get", "head", "options", "post", "put", "trace", "patch"];
    FetchError = class extends Error {
      constructor(e2, t2) {
        super(e2, t2), this.name = "FetchError", t2?.cause && !this.cause && (this.cause = t2.cause);
      }
    };
    Ce = new Set(Object.freeze(["PATCH", "POST", "PUT", "DELETE"]));
    Se = /* @__PURE__ */ new Set(["image/svg", "application/xml", "application/xhtml", "application/html"]);
    $e = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
    je = /* @__PURE__ */ new Set([408, 409, 425, 429, 500, 502, 503, 504]);
    Oe = /* @__PURE__ */ new Set([101, 204, 205, 304]);
    Ne = function() {
      if ("undefined" != typeof globalThis)
        return globalThis;
      if ("undefined" != typeof self)
        return self;
      if ("undefined" != typeof global)
        return global;
      throw new Error("unable to locate global object");
    }();
    Me = Ne.fetch || (() => Promise.reject(new Error("[ofetch] global.fetch is not supported!")));
    Le = Ne.Headers;
    Ue = Ne.AbortController;
    createFetch$1({ fetch: Me, Headers: Le, AbortController: Ue });
    Pe = /* @__PURE__ */ new Set([101, 204, 205, 304]);
    He = { run: (e2) => e2() };
    qe = void 0 !== console.createTask ? console.createTask : () => He;
    Hookable = class {
      constructor() {
        this._hooks = {}, this._before = void 0, this._after = void 0, this._deprecatedMessages = void 0, this._deprecatedHooks = {}, this.hook = this.hook.bind(this), this.callHook = this.callHook.bind(this), this.callHookWith = this.callHookWith.bind(this);
      }
      hook(e2, t2, r2 = {}) {
        if (!e2 || "function" != typeof t2)
          return () => {
          };
        const n2 = e2;
        let o3;
        for (; this._deprecatedHooks[e2]; )
          o3 = this._deprecatedHooks[e2], e2 = o3.to;
        if (o3 && !r2.allowDeprecated) {
          let e3 = o3.message;
          e3 || (e3 = `${n2} hook has been deprecated` + (o3.to ? `, please use ${o3.to}` : "")), this._deprecatedMessages || (this._deprecatedMessages = /* @__PURE__ */ new Set()), this._deprecatedMessages.has(e3) || (console.warn(e3), this._deprecatedMessages.add(e3));
        }
        if (!t2.name)
          try {
            Object.defineProperty(t2, "name", { get: () => "_" + e2.replace(/\W+/g, "_") + "_hook_cb", configurable: true });
          } catch {
          }
        return this._hooks[e2] = this._hooks[e2] || [], this._hooks[e2].push(t2), () => {
          t2 && (this.removeHook(e2, t2), t2 = void 0);
        };
      }
      hookOnce(e2, t2) {
        let r2, _function = (...e3) => ("function" == typeof r2 && r2(), r2 = void 0, _function = void 0, t2(...e3));
        return r2 = this.hook(e2, _function), r2;
      }
      removeHook(e2, t2) {
        if (this._hooks[e2]) {
          const r2 = this._hooks[e2].indexOf(t2);
          -1 !== r2 && this._hooks[e2].splice(r2, 1), 0 === this._hooks[e2].length && delete this._hooks[e2];
        }
      }
      deprecateHook(e2, t2) {
        this._deprecatedHooks[e2] = "string" == typeof t2 ? { to: t2 } : t2;
        const r2 = this._hooks[e2] || [];
        delete this._hooks[e2];
        for (const t3 of r2)
          this.hook(e2, t3);
      }
      deprecateHooks(e2) {
        Object.assign(this._deprecatedHooks, e2);
        for (const t2 in e2)
          this.deprecateHook(t2, e2[t2]);
      }
      addHooks(e2) {
        const t2 = flatHooks(e2), r2 = Object.keys(t2).map((e3) => this.hook(e3, t2[e3]));
        return () => {
          for (const e3 of r2.splice(0, r2.length))
            e3();
        };
      }
      removeHooks(e2) {
        const t2 = flatHooks(e2);
        for (const e3 in t2)
          this.removeHook(e3, t2[e3]);
      }
      removeAllHooks() {
        for (const e2 in this._hooks)
          delete this._hooks[e2];
      }
      callHook(e2, ...t2) {
        return t2.unshift(e2), this.callHookWith(serialTaskCaller, e2, ...t2);
      }
      callHookParallel(e2, ...t2) {
        return t2.unshift(e2), this.callHookWith(parallelTaskCaller, e2, ...t2);
      }
      callHookWith(e2, t2, ...r2) {
        const n2 = this._before || this._after ? { name: t2, args: r2, context: {} } : void 0;
        this._before && callEachWith(this._before, n2);
        const o3 = e2(t2 in this._hooks ? [...this._hooks[t2]] : [], r2);
        return o3 instanceof Promise ? o3.finally(() => {
          this._after && n2 && callEachWith(this._after, n2);
        }) : (this._after && n2 && callEachWith(this._after, n2), o3);
      }
      beforeEach(e2) {
        return this._before = this._before || [], this._before.push(e2), () => {
          if (void 0 !== this._before) {
            const t2 = this._before.indexOf(e2);
            -1 !== t2 && this._before.splice(t2, 1);
          }
        };
      }
      afterEach(e2) {
        return this._after = this._after || [], this._after.push(e2), () => {
          if (void 0 !== this._after) {
            const t2 = this._after.indexOf(e2);
            -1 !== t2 && this._after.splice(t2, 1);
          }
        };
      }
    };
    ze = /\d/;
    We = ["-", "_", "/", "."];
    Fe = /{{(.*?)}}/g;
    De = le({});
    Ke = { app: { baseURL: "/" }, nitro: { routeRules: {} } };
    Ve = { prefix: "NITRO_", altPrefix: Ke.nitro.envPrefix ?? B.env.NITRO_ENV_PREFIX ?? "_", envExpansion: Ke.nitro.envExpansion ?? B.env.NITRO_ENV_EXPANSION ?? false };
    Qe = _deepFreeze(function applyEnv(e2, t2, r2 = "") {
      for (const n2 in e2) {
        const o3 = r2 ? `${r2}_${n2}` : n2, s2 = getEnv(o3, t2);
        _isObject(e2[n2]) ? _isObject(s2) ? (e2[n2] = { ...e2[n2], ...s2 }, applyEnv(e2[n2], t2, o3)) : void 0 === s2 ? applyEnv(e2[n2], t2, o3) : e2[n2] = s2 ?? e2[n2] : e2[n2] = s2 ?? e2[n2], t2.envExpansion && "string" == typeof e2[n2] && (e2[n2] = e2[n2].replace(Fe, (e3, t3) => B.env[t3] || e3));
      }
      return e2;
    }(klona(Ke), Ve));
    _deepFreeze(klona(De)), new Proxy(/* @__PURE__ */ Object.create(null), { get: (e2, t2) => {
      console.warn("Please use `useRuntimeConfig()` instead of accessing config directly.");
      const r2 = useRuntimeConfig();
      if (t2 in r2)
        return r2[t2];
    } });
    Je = "base64:";
    Ge = ["hasItem", "getItem", "getItemRaw", "setItem", "setItemRaw", "removeItem", "getMeta", "setMeta", "removeMeta", "getKeys", "clear", "mount", "unmount"];
    memory = () => {
      const e2 = /* @__PURE__ */ new Map();
      return { name: "memory", getInstance: () => e2, hasItem: (t2) => e2.has(t2), getItem: (t2) => e2.get(t2) ?? null, getItemRaw: (t2) => e2.get(t2) ?? null, setItem(t2, r2) {
        e2.set(t2, r2);
      }, setItemRaw(t2, r2) {
        e2.set(t2, r2);
      }, removeItem(t2) {
        e2.delete(t2);
      }, getKeys: () => [...e2.keys()], clear() {
        e2.clear();
      }, dispose() {
        e2.clear();
      } };
    };
    Ye = {};
    normalizeKey = function(e2) {
      return e2 ? e2.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") : "";
    };
    Xe = { getKeys: () => Promise.resolve(Object.keys(Ye)), hasItem: (e2) => (e2 = normalizeKey(e2), Promise.resolve(e2 in Ye)), getItem: (e2) => (e2 = normalizeKey(e2), Promise.resolve(Ye[e2] ? Ye[e2].import() : null)), getMeta: (e2) => (e2 = normalizeKey(e2), Promise.resolve(Ye[e2] ? Ye[e2].meta : {})) };
    Ze = function(e2 = {}) {
      const t2 = { mounts: { "": e2.driver || memory() }, mountpoints: [""], watching: false, watchListeners: [], unwatch: {} }, getMount = (e3) => {
        for (const r3 of t2.mountpoints)
          if (e3.startsWith(r3))
            return { base: r3, relativeKey: e3.slice(r3.length), driver: t2.mounts[r3] };
        return { base: "", relativeKey: e3, driver: t2.mounts[""] };
      }, getMounts = (e3, r3) => t2.mountpoints.filter((t3) => t3.startsWith(e3) || r3 && e3.startsWith(t3)).map((r4) => ({ relativeBase: e3.length > r4.length ? e3.slice(r4.length) : void 0, mountpoint: r4, driver: t2.mounts[r4] })), onChange = (e3, r3) => {
        if (t2.watching) {
          r3 = normalizeKey$1(r3);
          for (const n2 of t2.watchListeners)
            n2(e3, r3);
        }
      }, stopWatch = async () => {
        if (t2.watching) {
          for (const e3 in t2.unwatch)
            await t2.unwatch[e3]();
          t2.unwatch = {}, t2.watching = false;
        }
      }, runBatch = (e3, t3, r3) => {
        const n2 = /* @__PURE__ */ new Map(), getBatch = (e4) => {
          let t4 = n2.get(e4.base);
          return t4 || (t4 = { driver: e4.driver, base: e4.base, items: [] }, n2.set(e4.base, t4)), t4;
        };
        for (const r4 of e3) {
          const e4 = "string" == typeof r4, n3 = normalizeKey$1(e4 ? r4 : r4.key), o3 = e4 ? void 0 : r4.value, s2 = e4 || !r4.options ? t3 : { ...t3, ...r4.options }, i2 = getMount(n3);
          getBatch(i2).items.push({ key: n3, value: o3, relativeKey: i2.relativeKey, options: s2 });
        }
        return Promise.all([...n2.values()].map((e4) => r3(e4))).then((e4) => e4.flat());
      }, r2 = { hasItem(e3, t3 = {}) {
        e3 = normalizeKey$1(e3);
        const { relativeKey: r3, driver: n2 } = getMount(e3);
        return asyncCall(n2.hasItem, r3, t3);
      }, getItem(e3, t3 = {}) {
        e3 = normalizeKey$1(e3);
        const { relativeKey: r3, driver: n2 } = getMount(e3);
        return asyncCall(n2.getItem, r3, t3).then((e4) => destr(e4));
      }, getItems: (e3, t3) => runBatch(e3, t3, (e4) => e4.driver.getItems ? asyncCall(e4.driver.getItems, e4.items.map((e5) => ({ key: e5.relativeKey, options: e5.options })), t3).then((t4) => t4.map((t5) => ({ key: joinKeys(e4.base, t5.key), value: destr(t5.value) }))) : Promise.all(e4.items.map((t4) => asyncCall(e4.driver.getItem, t4.relativeKey, t4.options).then((e5) => ({ key: t4.key, value: destr(e5) }))))), getItemRaw(e3, t3 = {}) {
        e3 = normalizeKey$1(e3);
        const { relativeKey: r3, driver: n2 } = getMount(e3);
        return n2.getItemRaw ? asyncCall(n2.getItemRaw, r3, t3) : asyncCall(n2.getItem, r3, t3).then((e4) => function(e5) {
          return "string" != typeof e5 ? e5 : e5.startsWith(Je) ? (checkBufferSupport(), f.from(e5.slice(Je.length), "base64")) : e5;
        }(e4));
      }, async setItem(e3, t3, n2 = {}) {
        if (void 0 === t3)
          return r2.removeItem(e3);
        e3 = normalizeKey$1(e3);
        const { relativeKey: o3, driver: s2 } = getMount(e3);
        s2.setItem && (await asyncCall(s2.setItem, o3, stringify(t3), n2), s2.watch || onChange("update", e3));
      }, async setItems(e3, t3) {
        await runBatch(e3, t3, async (e4) => {
          if (e4.driver.setItems)
            return asyncCall(e4.driver.setItems, e4.items.map((e5) => ({ key: e5.relativeKey, value: stringify(e5.value), options: e5.options })), t3);
          e4.driver.setItem && await Promise.all(e4.items.map((t4) => asyncCall(e4.driver.setItem, t4.relativeKey, stringify(t4.value), t4.options)));
        });
      }, async setItemRaw(e3, t3, n2 = {}) {
        if (void 0 === t3)
          return r2.removeItem(e3, n2);
        e3 = normalizeKey$1(e3);
        const { relativeKey: o3, driver: s2 } = getMount(e3);
        if (s2.setItemRaw)
          await asyncCall(s2.setItemRaw, o3, t3, n2);
        else {
          if (!s2.setItem)
            return;
          await asyncCall(s2.setItem, o3, function(e4) {
            if ("string" == typeof e4)
              return e4;
            checkBufferSupport();
            const t4 = f.from(e4).toString("base64");
            return Je + t4;
          }(t3), n2);
        }
        s2.watch || onChange("update", e3);
      }, async removeItem(e3, t3 = {}) {
        "boolean" == typeof t3 && (t3 = { removeMeta: t3 }), e3 = normalizeKey$1(e3);
        const { relativeKey: r3, driver: n2 } = getMount(e3);
        n2.removeItem && (await asyncCall(n2.removeItem, r3, t3), (t3.removeMeta || t3.removeMata) && await asyncCall(n2.removeItem, r3 + "$", t3), n2.watch || onChange("remove", e3));
      }, async getMeta(e3, t3 = {}) {
        "boolean" == typeof t3 && (t3 = { nativeOnly: t3 }), e3 = normalizeKey$1(e3);
        const { relativeKey: r3, driver: n2 } = getMount(e3), o3 = /* @__PURE__ */ Object.create(null);
        if (n2.getMeta && Object.assign(o3, await asyncCall(n2.getMeta, r3, t3)), !t3.nativeOnly) {
          const e4 = await asyncCall(n2.getItem, r3 + "$", t3).then((e5) => destr(e5));
          e4 && "object" == typeof e4 && ("string" == typeof e4.atime && (e4.atime = new Date(e4.atime)), "string" == typeof e4.mtime && (e4.mtime = new Date(e4.mtime)), Object.assign(o3, e4));
        }
        return o3;
      }, setMeta(e3, t3, r3 = {}) {
        return this.setItem(e3 + "$", t3, r3);
      }, removeMeta(e3, t3 = {}) {
        return this.removeItem(e3 + "$", t3);
      }, async getKeys(e3, t3 = {}) {
        e3 = normalizeBaseKey(e3);
        const r3 = getMounts(e3, true);
        let n2 = [];
        const o3 = [];
        for (const e4 of r3) {
          const r4 = await asyncCall(e4.driver.getKeys, e4.relativeBase, t3);
          for (const t4 of r4) {
            const r5 = e4.mountpoint + normalizeKey$1(t4);
            n2.some((e5) => r5.startsWith(e5)) || o3.push(r5);
          }
          n2 = [e4.mountpoint, ...n2.filter((t4) => !t4.startsWith(e4.mountpoint))];
        }
        return e3 ? o3.filter((t4) => t4.startsWith(e3) && "$" !== t4[t4.length - 1]) : o3.filter((e4) => "$" !== e4[e4.length - 1]);
      }, async clear(e3, t3 = {}) {
        e3 = normalizeBaseKey(e3), await Promise.all(getMounts(e3, false).map(async (e4) => {
          if (e4.driver.clear)
            return asyncCall(e4.driver.clear, e4.relativeBase, t3);
          if (e4.driver.removeItem) {
            const r3 = await e4.driver.getKeys(e4.relativeBase || "", t3);
            return Promise.all(r3.map((r4) => e4.driver.removeItem(r4, t3)));
          }
        }));
      }, async dispose() {
        await Promise.all(Object.values(t2.mounts).map((e3) => dispose(e3)));
      }, watch: async (e3) => (await (async () => {
        if (!t2.watching) {
          t2.watching = true;
          for (const e4 in t2.mounts)
            t2.unwatch[e4] = await watch(t2.mounts[e4], onChange, e4);
        }
      })(), t2.watchListeners.push(e3), async () => {
        t2.watchListeners = t2.watchListeners.filter((t3) => t3 !== e3), 0 === t2.watchListeners.length && await stopWatch();
      }), async unwatch() {
        t2.watchListeners = [], await stopWatch();
      }, mount(e3, n2) {
        if ((e3 = normalizeBaseKey(e3)) && t2.mounts[e3])
          throw new Error(`already mounted at ${e3}`);
        return e3 && (t2.mountpoints.push(e3), t2.mountpoints.sort((e4, t3) => t3.length - e4.length)), t2.mounts[e3] = n2, t2.watching && Promise.resolve(watch(n2, onChange, e3)).then((r3) => {
          t2.unwatch[e3] = r3;
        }).catch(console.error), r2;
      }, async unmount(e3, r3 = true) {
        (e3 = normalizeBaseKey(e3)) && t2.mounts[e3] && (t2.watching && e3 in t2.unwatch && (t2.unwatch[e3](), delete t2.unwatch[e3]), r3 && await dispose(t2.mounts[e3]), t2.mountpoints = t2.mountpoints.filter((t3) => t3 !== e3), delete t2.mounts[e3]);
      }, getMount(e3 = "") {
        e3 = normalizeKey$1(e3) + ":";
        const t3 = getMount(e3);
        return { driver: t3.driver, base: t3.base };
      }, getMounts(e3 = "", t3 = {}) {
        e3 = normalizeKey$1(e3);
        return getMounts(e3, t3.parents).map((e4) => ({ driver: e4.driver, base: e4.mountpoint }));
      }, keys: (e3, t3 = {}) => r2.getKeys(e3, t3), get: (e3, t3 = {}) => r2.getItem(e3, t3), set: (e3, t3, n2 = {}) => r2.setItem(e3, t3, n2), has: (e3, t3 = {}) => r2.hasItem(e3, t3), del: (e3, t3 = {}) => r2.removeItem(e3, t3), remove: (e3, t3 = {}) => r2.removeItem(e3, t3) };
      return r2;
    }({});
    Ze.mount("/assets", Xe);
    et = { name: "_", base: "/cache", swr: true, maxAge: 1 };
    cachedFunction = function(e2, t2 = {}) {
      t2 = { ...et, ...t2 };
      const r2 = {}, n2 = t2.group || "nitro/functions", o3 = t2.name || e2.name || "_", s2 = t2.integrity || hash([e2, t2]), i2 = t2.validate || ((e3) => void 0 !== e3.value);
      return async (...a2) => {
        if (await t2.shouldBypassCache?.(...a2))
          return e2(...a2);
        const c2 = await (t2.getKey || getKey)(...a2), u2 = await t2.shouldInvalidateCache?.(...a2), l2 = await async function(e3, a3, c3, u3) {
          const l3 = [t2.base, n2, o3, e3 + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
          let f3 = await useStorage().getItem(l3) || {};
          if ("object" != typeof f3) {
            f3 = {};
            const e4 = new Error("Malformed data read from cache.");
            console.error("[nitro] [cache]", e4), useNitroApp().captureError(e4, { event: u3, tags: ["cache"] });
          }
          const p2 = 1e3 * (t2.maxAge ?? t2.maxAge ?? 0);
          p2 && (f3.expires = Date.now() + p2);
          const h2 = c3 || f3.integrity !== s2 || p2 && Date.now() - (f3.mtime || 0) > p2 || false === i2(f3), d2 = h2 ? (async () => {
            const n3 = r2[e3];
            n3 || (void 0 !== f3.value && (t2.staleMaxAge || 0) >= 0 && false === t2.swr && (f3.value = void 0, f3.integrity = void 0, f3.mtime = void 0, f3.expires = void 0), r2[e3] = Promise.resolve(a3()));
            try {
              f3.value = await r2[e3];
            } catch (t3) {
              throw n3 || delete r2[e3], t3;
            }
            if (!n3 && (f3.mtime = Date.now(), f3.integrity = s2, delete r2[e3], false !== i2(f3))) {
              const e4 = useStorage().setItem(l3, f3).catch((e5) => {
                console.error("[nitro] [cache] Cache write error.", e5), useNitroApp().captureError(e5, { event: u3, tags: ["cache"] });
              });
              u3 && u3.waitUntil && u3.waitUntil(e4);
            }
          })() : Promise.resolve();
          return void 0 === f3.value ? await d2 : h2 && u3 && u3.waitUntil && u3.waitUntil(d2), t2.swr && false !== i2(f3) ? (d2.catch((e4) => {
            console.error("[nitro] [cache] SWR handler error.", e4), useNitroApp().captureError(e4, { event: u3, tags: ["cache"] });
          }), f3) : d2.then(() => f3);
        }(c2, () => e2(...a2), u2, a2[0] && isEvent(a2[0]) ? a2[0] : void 0);
        let f2 = l2.value;
        return t2.transform && (f2 = await t2.transform(l2, ...a2) || f2), f2;
      };
    };
    cachedEventHandler = function(e2, t2 = et) {
      const r2 = (t2.varies || []).filter(Boolean).map((e3) => e3.toLowerCase()).sort(), n2 = { ...t2, getKey: async (e3) => {
        const n3 = await t2.getKey?.(e3);
        if (n3)
          return escapeKey(n3);
        const o4 = e3.node.req.originalUrl || e3.node.req.url || e3.path;
        return [`${escapeKey(decodeURI(parseURL(o4).pathname)).slice(0, 16) || "index"}.${hash(o4)}`, ...r2.map((t3) => [t3, e3.node.req.headers[t3]]).map(([e4, t3]) => `${escapeKey(e4)}.${hash(t3)}`)].join(":");
      }, validate: (e3) => !!e3.value && (!(e3.value.code >= 400) && (void 0 !== e3.value.body && ("undefined" !== e3.value.headers.etag && "undefined" !== e3.value.headers["last-modified"]))), group: t2.group || "nitro/handlers", integrity: t2.integrity || hash([e2, t2]) }, o3 = cachedFunction(async (o4) => {
        const s2 = {};
        for (const e3 of r2)
          s2[e3] = o4.node.req.headers[e3];
        const i2 = cloneWithProxy(o4.node.req, { headers: s2 }), a2 = {};
        let c2;
        const u2 = createEvent(i2, cloneWithProxy(o4.node.res, { statusCode: 200, writableEnded: false, writableFinished: false, headersSent: false, closed: false, getHeader: (e3) => a2[e3], setHeader(e3, t3) {
          return a2[e3] = t3, this;
        }, getHeaderNames: () => Object.keys(a2), hasHeader: (e3) => e3 in a2, removeHeader(e3) {
          delete a2[e3];
        }, getHeaders: () => a2, end(e3, t3, r3) {
          return "string" == typeof e3 && (c2 = e3), "function" == typeof t3 && t3(), "function" == typeof r3 && r3(), this;
        }, write(e3, t3, r3) {
          return "string" == typeof e3 && (c2 = e3), "function" == typeof t3 && t3(), "function" == typeof r3 && r3(), this;
        }, writeHead(e3, t3) {
          if (this.statusCode = e3, t3)
            for (const e4 in t3)
              this.setHeader(e4, t3[e4]);
          return this;
        } }));
        u2.fetch = (e3, t3) => fetchWithEvent(u2, e3, t3, { fetch: useNitroApp().localFetch }), u2.$fetch = (e3, t3) => fetchWithEvent(u2, e3, t3, { fetch: globalThis.$fetch }), u2.context = o4.context, u2.context.cache = { options: n2 };
        const l2 = await e2(u2) || c2, f2 = u2.node.res.getHeaders();
        f2.etag = String(f2.Etag || f2.etag || `W/"${hash(l2)}"`), f2["last-modified"] = String(f2["Last-Modified"] || f2["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString());
        const p2 = [];
        t2.swr ? (t2.maxAge && p2.push(`s-maxage=${t2.maxAge}`), t2.staleMaxAge ? p2.push(`stale-while-revalidate=${t2.staleMaxAge}`) : p2.push("stale-while-revalidate")) : t2.maxAge && p2.push(`max-age=${t2.maxAge}`), p2.length > 0 && (f2["cache-control"] = p2.join(", "));
        return { code: u2.node.res.statusCode, headers: f2, body: l2 };
      }, n2);
      return defineEventHandler(async (r3) => {
        if (t2.headersOnly) {
          if (handleCacheHeaders(r3, { maxAge: t2.maxAge }))
            return;
          return e2(r3);
        }
        const n3 = await o3(r3);
        if (r3.node.res.headersSent || r3.node.res.writableEnded)
          return n3.body;
        if (!handleCacheHeaders(r3, { modifiedTime: new Date(n3.headers["last-modified"]), etag: n3.headers.etag, maxAge: t2.maxAge })) {
          r3.node.res.statusCode = n3.code;
          for (const e3 in n3.headers) {
            const t3 = n3.headers[e3];
            "set-cookie" === e3 ? r3.node.res.appendHeader(e3, splitCookiesString(t3)) : r3.node.res.setHeader(e3, t3);
          }
          return n3.body;
        }
      });
    };
    tt = toRouteMatcher(createRouter$1({ routes: useRuntimeConfig().nitro.routeRules }));
    rt = [];
    nt = Object.defineProperty;
    __publicField = (e2, t2, r2) => (((e3, t3, r3) => {
      t3 in e3 ? nt(e3, t3, { enumerable: true, configurable: true, writable: true, value: r3 }) : e3[t3] = r3;
    })(e2, "symbol" != typeof t2 ? t2 + "" : t2, r2), r2);
    Result = class {
      constructor(e2 = false, t2 = "Unknown error", r2 = {}) {
        __publicField(this, "Success"), __publicField(this, "Data"), __publicField(this, "Message"), this.Success = e2, this.Message = t2, this.Data = r2;
      }
      toString() {
        return JSON.stringify({ Success: this.Success, Data: this.Data, Message: this.Message });
      }
    };
    errorHandler = (e2, t2) => (function(e3, t3, r2) {
      e3.node.res.setHeader(t3, r2);
    }(t2, "Content-Type", "text/json"), send(t2, new Result(false, e2.statusMessage)));
    ot = [{ route: "/", handler: () => Promise.resolve().then(() => (init_routes(), routes_exports)), lazy: true, middleware: false, method: void 0 }];
    st = function() {
      const e2 = useRuntimeConfig(), t2 = new Hookable(), captureError = (e3, r3 = {}) => {
        const n3 = t2.callHookParallel("error", e3, r3).catch((e4) => {
          console.error("Error while capturing another error", e4);
        });
        if (r3.event && isEvent(r3.event)) {
          const t3 = r3.event.context.nitro?.errors;
          t3 && t3.push({ error: e3, context: r3 }), r3.event.waitUntil && r3.event.waitUntil(n3);
        }
      }, r2 = createApp({ debug: destr(false), onError: (e3, t3) => (captureError(e3, { event: t3, tags: ["request"] }), errorHandler(e3, t3)), onRequest: async (e3) => {
        await st.hooks.callHook("request", e3).catch((t3) => {
          captureError(t3, { event: e3, tags: ["request"] });
        });
      }, onBeforeResponse: async (e3, t3) => {
        await st.hooks.callHook("beforeResponse", e3, t3).catch((t4) => {
          captureError(t4, { event: e3, tags: ["request", "response"] });
        });
      }, onAfterResponse: async (e3, t3) => {
        await st.hooks.callHook("afterResponse", e3, t3).catch((t4) => {
          captureError(t4, { event: e3, tags: ["request", "response"] });
        });
      } }), n2 = function(e3 = {}) {
        const t3 = createRouter$1({}), r3 = {};
        let n3;
        const o4 = {}, addRoute = (e4, n4, s4) => {
          let i3 = r3[e4];
          if (i3 || (r3[e4] = i3 = { path: e4, handlers: {} }, t3.insert(e4, i3)), Array.isArray(s4))
            for (const t4 of s4)
              addRoute(e4, n4, t4);
          else
            i3.handlers[s4] = toEventHandler(n4, 0, e4);
          return o4;
        };
        o4.use = o4.add = (e4, t4, r4) => addRoute(e4, t4, r4 || "all");
        for (const e4 of Te)
          o4[e4] = (t4, r4) => o4.add(t4, r4, e4);
        const matchHandler = (e4 = "/", r4 = "get") => {
          const o5 = e4.indexOf("?");
          -1 !== o5 && (e4 = e4.slice(0, Math.max(0, o5)));
          const s4 = t3.lookup(e4);
          if (!s4 || !s4.handlers)
            return { error: createError({ statusCode: 404, name: "Not Found", statusMessage: `Cannot find any route matching ${e4 || "/"}.` }) };
          let i3 = s4.handlers[r4] || s4.handlers.all;
          if (!i3) {
            n3 || (n3 = toRouteMatcher(t3));
            const o6 = n3.matchAll(e4).reverse();
            for (const e5 of o6) {
              if (e5.handlers[r4]) {
                i3 = e5.handlers[r4], s4.handlers[r4] = s4.handlers[r4] || i3;
                break;
              }
              if (e5.handlers.all) {
                i3 = e5.handlers.all, s4.handlers.all = s4.handlers.all || i3;
                break;
              }
            }
          }
          return i3 ? { matched: s4, handler: i3 } : { error: createError({ statusCode: 405, name: "Method Not Allowed", statusMessage: `Method ${r4} is not allowed on this route.` }) };
        }, s3 = e3.preemptive || e3.preemtive;
        return o4.handler = Re((e4) => {
          const t4 = matchHandler(e4.path, e4.method.toLowerCase());
          if ("error" in t4) {
            if (s3)
              throw t4.error;
            return;
          }
          e4.context.matchedRoute = t4.matched;
          const r4 = t4.matched.params || {};
          return e4.context.params = r4, Promise.resolve(t4.handler(e4)).then((e5) => void 0 === e5 && s3 ? null : e5);
        }), o4.handler.__resolve__ = async (e4) => {
          e4 = function(e5 = "") {
            return function(e6 = "") {
              return e6.startsWith("/");
            }(e5) ? e5 : "/" + e5;
          }(e4);
          const t4 = matchHandler(e4);
          if ("error" in t4)
            return;
          let r4 = { route: t4.matched.path, handler: t4.handler };
          if (t4.handler.__resolve__) {
            const n4 = await t4.handler.__resolve__(e4);
            if (!n4)
              return;
            r4 = { ...r4, ...n4 };
          }
          return r4;
        }, o4;
      }({ preemptive: true }), o3 = (s2 = toNodeListener(r2), function(e3) {
        const t3 = new IncomingMessage(), r3 = new ServerResponse(t3);
        if (t3.url = e3.url || "/", t3.method = e3.method || "GET", t3.headers = {}, e3.headers) {
          const r4 = "function" == typeof e3.headers.entries ? e3.headers.entries() : Object.entries(e3.headers);
          for (const [e4, n3] of r4)
            n3 && (t3.headers[e4.toLowerCase()] = n3);
        }
        return t3.headers.host = t3.headers.host || e3.host || "localhost", t3.connection.encrypted = t3.connection.encrypted || "https" === e3.protocol, t3.body = e3.body || null, t3.__unenv__ = e3.context, s2(t3, r3).then(() => {
          let e4 = r3._data;
          (Pe.has(r3.statusCode) || "HEAD" === t3.method.toUpperCase()) && (e4 = null, delete r3._headers["content-length"]);
          const n3 = { body: e4, headers: r3._headers, status: r3.statusCode, statusText: r3.statusMessage };
          return t3.destroy(), r3.destroy(), n3;
        });
      });
      var s2;
      const i2 = function(e3, t3 = global.fetch) {
        return async function(r3, n3) {
          const o4 = r3.toString();
          if (!o4.startsWith("/"))
            return t3(o4, n3);
          try {
            const t4 = await e3({ url: o4, ...n3 });
            return new Response(t4.body, { status: t4.status, statusText: t4.statusText, headers: Object.fromEntries(Object.entries(t4.headers).map(([e4, t5]) => [e4, Array.isArray(t5) ? t5.join(",") : String(t5) || ""])) });
          } catch (e4) {
            return new Response(e4.toString(), { status: Number.parseInt(e4.statusCode || e4.code) || 500, statusText: e4.statusText });
          }
        };
      }(o3, globalThis.fetch), localFetch = (e3, t3) => i2(e3, t3).then((e4) => function(e5) {
        if (!e5.headers.has("set-cookie"))
          return e5;
        return new Response(e5.body, { status: e5.status, statusText: e5.statusText, headers: normalizeCookieHeaders(e5.headers) });
      }(e4)), a2 = createFetch$1({ fetch: localFetch, Headers: Le, defaults: { baseURL: e2.app.baseURL } });
      globalThis.$fetch = a2, r2.use(createRouteRulesHandler({ localFetch })), r2.use(Re((e3) => {
        e3.context.nitro = e3.context.nitro || { errors: [] };
        const t3 = e3.node.req?.__unenv__;
        t3 && Object.assign(e3.context, t3), e3.fetch = (t4, r3) => fetchWithEvent(e3, t4, r3, { fetch: localFetch }), e3.$fetch = (t4, r3) => fetchWithEvent(e3, t4, r3, { fetch: a2 }), e3.waitUntil = (r3) => {
          e3.context.nitro._waitUntilPromises || (e3.context.nitro._waitUntilPromises = []), e3.context.nitro._waitUntilPromises.push(r3), t3?.waitUntil && t3.waitUntil(r3);
        }, e3.captureError = (t4, r3) => {
          captureError(t4, { event: e3, ...r3 });
        };
      }));
      for (const t3 of ot) {
        let o4 = t3.lazy ? lazyEventHandler(t3.handler) : t3.handler;
        if (t3.middleware || !t3.route) {
          const n3 = (e2.app.baseURL + (t3.route || "/")).replace(/\/+/g, "/");
          r2.use(n3, o4);
        } else {
          const e3 = getRouteRulesForPath(t3.route.replace(/:\w+|\*\*/g, "_"));
          e3.cache && (o4 = cachedEventHandler(o4, { group: "nitro/routes", ...e3.cache })), n2.use(t3.route, o4, t3.method);
        }
      }
      r2.use(e2.app.baseURL, n2.handler);
      const c2 = { hooks: t2, h3App: r2, router: n2, localCall: o3, localFetch, captureError };
      for (const e3 of rt)
        try {
          e3(c2);
        } catch (e4) {
          throw captureError(e4, { tags: ["plugin"] }), e4;
        }
      return c2;
    }();
    useNitroApp = () => st;
    it = /post|put|patch/i;
    at = {};
    ct = { async fetch(t2, r2, n2) {
      try {
        return await H.getAssetFromKV({ request: t2, waitUntil: (e2) => n2.waitUntil(e2) }, { cacheControl: assetsCacheControl, mapRequestToAsset: baseURLModifier, ASSET_NAMESPACE: r2.__STATIC_CONTENT, ASSET_MANIFEST: JSON.parse(e) });
      } catch {
      }
      const o3 = new URL(t2.url);
      let s2;
      return function(e2) {
        return it.test(e2.method);
      }(t2) && (s2 = f.from(await t2.arrayBuffer())), globalThis.__env__ = r2, st.localFetch(o3.pathname + o3.search, { context: { cf: t2.cf, waitUntil: (e2) => n2.waitUntil(e2), cloudflare: { request: t2, env: r2, context: n2 } }, host: o3.hostname, protocol: o3.protocol, method: t2.method, headers: t2.headers, body: s2 });
    }, scheduled(e2, t2, r2) {
    } };
    baseURLModifier = (e2) => {
      const t2 = withoutBase(e2.url, useRuntimeConfig().app.baseURL);
      return H.mapRequestToAsset(new Request(t2, e2));
    };
  }
});

// .wrangler/tmp/bundle-9V1pZ5/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-9V1pZ5/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// .output/server/index.mjs
init_checked_fetch();
init_modules_watch_stub();
init_runtime();
import "__STATIC_CONTENT_MANIFEST";
globalThis._importMeta_ = { url: "file:///_entry.js", env: {} };

// ../../../../../opt/homebrew/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_checked_fetch();
init_modules_watch_stub();
var drainBody = async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e2) {
      console.error("Failed to drain the unused request body.", e2);
    }
  }
};
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../../opt/homebrew/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_checked_fetch();
init_modules_watch_stub();
function reduceError(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError(e2.cause)
  };
}
var jsonError = async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e2) {
    const error = reduceError(e2);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
};
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-9V1pZ5/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = ct;

// ../../../../../opt/homebrew/lib/node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}

// .wrangler/tmp/bundle-9V1pZ5/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  };
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      };
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
