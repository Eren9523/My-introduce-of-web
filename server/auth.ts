import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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
  const hash = crypto.createHash('sha256');
  hash.update(password + "salt");
  return hash.digest('hex');
}

export function sendEmailMock(email: string) {
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'reserved') {
    console.log(`Sending real email via resend to: ${email}`);
  } else {
    console.log(`模拟发送邮件验证码到: ${email}`);
  }
}
