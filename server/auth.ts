import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development';

export function signToken(userId: string, username: string, role: string) {
  return jwt.sign({ userId, username, role }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string, username: string, role: string };
  } catch (err) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "salt"); // Simple salt
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function sendEmailMock(email: string) {
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'reserved') {
    // Would do actual fetch to resend here
    console.log(`Sending real email via resend to: ${email}`);
  } else {
    console.log(`模拟发送邮件验证码到: ${email}`);
  }
}
