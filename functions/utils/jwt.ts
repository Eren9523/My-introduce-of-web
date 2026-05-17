/* 
 * Lightweight JWT implementation for Cloudflare Pages/Workers over Web Crypto API 
 */

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let string = '';
  for (let i = 0; i < bytes.length; i++) {
    string += String.fromCharCode(bytes[i]);
  }
  return btoa(string).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const getJwtSecretKey = async (secret: string): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
};

export const signJWT = async (
  payload: any,
  secret: string,
  expiresInSec: number = 24 * 60 * 60
): Promise<string> => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const enc = new TextEncoder();
  
  const payloadWithExp = { ...payload };
  if (expiresInSec > 0) {
    payloadWithExp.exp = Math.floor(Date.now() / 1000) + expiresInSec;
  }

  const encodedHeader = base64UrlEncode(enc.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(enc.encode(JSON.stringify(payloadWithExp)));
  
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  
  const key = await getJwtSecretKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(dataToSign));
  
  const encodedSignature = base64UrlEncode(signature);
  
  return `${dataToSign}.${encodedSignature}`;
};

export const verifyJWT = async (
  token: string,
  secret: string
): Promise<any | null> => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToSign = `${encodedHeader}.${encodedPayload}`;
    
    const key = await getJwtSecretKey(secret);
    const signature = base64UrlDecode(encodedSignature);
    const enc = new TextEncoder();
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      enc.encode(dataToSign)
    );
    
    if (!isValid) return null;
    
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedPayload)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    
    return payload;
  } catch (err) {
    return null;
  }
};
