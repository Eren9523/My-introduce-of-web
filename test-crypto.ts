import { hashPassword } from "./server/auth.js";
hashPassword('admin123').then(console.log).catch(console.error);
