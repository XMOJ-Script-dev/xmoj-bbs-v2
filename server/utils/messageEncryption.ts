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
 * Modern encryption utility using Web Crypto API with AES-GCM
 * This replaces the deprecated CryptoJS implementation with proper:
 * - Key derivation (PBKDF2)
 * - Authenticated encryption (AES-GCM)
 * - Random IVs and salts
 */

const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16; // bytes
const IV_LENGTH = 12; // bytes for AES-GCM

/**
 * Derive encryption key from base key and user identifiers using PBKDF2
 */
async function deriveKey(
  baseKey: string,
  fromUser: string,
  toUser: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  // Create consistent key material from base key and users, with separator to prevent collisions
  // E.g. baseKey="ab" + fromUser="b" + toUser="cd" = "ab\0b\0cd" (not "abbcd")
  const keyMaterial = [baseKey, fromUser, toUser].join('\0');
  const encoder = new TextEncoder();
  const keyMaterialBytes = encoder.encode(keyMaterial);
  
  // Import key material
  const importedKey = await crypto.subtle.importKey(
    'raw',
    keyMaterialBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  // Derive actual encryption key
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    importedKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a message using AES-GCM with proper key derivation
 * @returns Base64-encoded: salt(16) + iv(12) + ciphertext + authTag
 */
export async function encryptMessage(
  plaintext: string,
  baseKey: string,
  fromUser: string,
  toUser: string
): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const plaintextBytes = encoder.encode(plaintext);
    
    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    
    // Derive encryption key
    const key = await deriveKey(baseKey, fromUser, toUser, salt);
    
    // Encrypt with AES-GCM (includes authentication tag)
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      plaintextBytes
    );
    
    // Combine salt + iv + ciphertext
    const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(ciphertext), salt.length + iv.length);
    
    // Encode as base64
    return 'Begin xssmseetee v3 encrypted message' + base64Encode(combined);
  } catch (error) {
    Output.Error('Message encryption failed: ' + (error instanceof Error ? error.message : String(error)));
    throw error;
  }
}

/**
 * Decrypt a message encrypted with encryptMessage
 */
export async function decryptMessage(
  ciphertext: string,
  baseKey: string,
  fromUser: string,
  toUser: string
): Promise<string> {
  try {
    // Remove header and decode from base64
    if (!ciphertext.startsWith('Begin xssmseetee v3 encrypted message')) {
      throw new Error('Invalid message format');
    }
    const base64Data = ciphertext.substring('Begin xssmseetee v3 encrypted message'.length);
    const combined = base64Decode(base64Data);
    
    // Extract salt, iv, and ciphertext
    if (combined.length < SALT_LENGTH + IV_LENGTH) {
      throw new Error('Invalid encrypted message length');
    }
    
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const encryptedData = combined.slice(SALT_LENGTH + IV_LENGTH);
    
    // Derive decryption key
    const key = await deriveKey(baseKey, fromUser, toUser, salt);
    
    // Decrypt with AES-GCM (verifies authentication tag)
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encryptedData
    );
    
    // Decode to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    Output.Error('Message decryption failed: ' + (error instanceof Error ? error.message : String(error)));
    throw error;
  }
}

/**
 * Base64 encoding for Uint8Array (compatible with Node and browser)
 */
function base64Encode(data: Uint8Array): string {
  // Use btoa if available (browser), otherwise use Buffer (Node)
  if (typeof btoa !== 'undefined') {
    const binaryString = Array.from(data)
      .map(byte => String.fromCharCode(byte))
      .join('');
    return btoa(binaryString);
  } else {
    return Buffer.from(data).toString('base64');
  }
}

/**
 * Base64 decoding to Uint8Array (compatible with Node and browser)
 */
function base64Decode(base64: string): Uint8Array {
  // Use atob if available (browser), otherwise use Buffer (Node)
  if (typeof atob !== 'undefined') {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } else {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
}
