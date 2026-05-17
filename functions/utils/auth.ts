import { verifyJWT } from "./jwt";

export async function authenticate(request: Request, env: any): Promise<any | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  
  const token = authHeader.split(" ")[1];
  const secret = env.JWT_SECRET || "default_local_secret";
  
  const payload = await verifyJWT(token, secret);
  return payload;
}
