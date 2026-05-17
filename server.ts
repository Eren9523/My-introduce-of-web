import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import db from "./server/db.js";
import { signToken, verifyToken, hashPassword, sendEmailMock } from "./server/auth.js";
import crypto from "crypto";

const app = express();
const PORT = 3000;

app.use(express.json());

// Extend express Request to hold user
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; username: string; role: string };
    }
  }
}

// Middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const payload = verifyToken(token);
  if (!payload) return res.status(403).json({ error: "Forbidden" });

  // 验证用户是否存在于数据库（处理数据库被重置但客户端仍保留旧token的情况），防止外键约束报错
  // Verify if user actually exists in the db (handles case where db was wiped but client has token)
  try {
    const userExists = db.prepare(`SELECT id FROM users WHERE id = ?`).get(payload.userId);
    if (!userExists) {
       return res.status(401).json({ error: "用户不存在或已失效，请重新登录" });
    }
  } catch (err) {
    console.error("Auth DB check error:", err);
    return res.status(500).json({ error: "服务器内部错误" });
  }

  req.user = payload;
  next();
};

// ======== 认证 (Auth) 路由 ======== //
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "缺少必要的字段" });
    if (/[^a-zA-Z0-9_\u4e00-\u9fa5]/.test(username)) {
      return res.status(400).json({ error: "用户名包含无效字符，仅支持中英文字母、数字和下划线" });
    }

    const hashed = await hashPassword(password);
    const userId = crypto.randomUUID();

    try {
      // 插入新用户，如用户名重复会触发主键冲突报错
      db.prepare(`INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)`).run(userId, username, hashed, 'user');
    } catch (err: any) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: "该用户名已被注册" });
      }
      throw err;
    }

    const token = signToken(userId, username, 'user');
    res.json({ token, user: { userId, username, role: 'user' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "注册失败，服务器内部错误" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = db.prepare(`SELECT * FROM users WHERE username = ?`).get(username) as any;
    if (!user) return res.status(400).json({ error: "用户名或密码错误" });

    const hashed = await hashPassword(password);
    if (hashed !== user.password_hash) return res.status(400).json({ error: "用户名或密码错误" });

    const token = signToken(user.id, user.username, user.role);
    res.json({ token, user: { userId: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/guest", (req, res) => {
  try {
    const userId = crypto.randomUUID();
    const username = `Guest_${Math.floor(Math.random() * 10000)}`;
    db.prepare(`INSERT INTO users (id, username, role) VALUES (?, ?, ?)`).run(userId, username, 'guest');

    const token = signToken(userId, username, 'guest');
    res.json({ token, user: { userId, username, role: 'guest' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/test-email", (req, res) => {
  sendEmailMock(req.body.email || "test@example.com");
  res.json({ success: true });
});

// Posts routes
app.get("/api/posts", (req, res) => {
  const posts = db.prepare(`
    SELECT p.*, u.username, u.role as authorRole 
    FROM posts p 
    JOIN users u ON p.author_id = u.id 
    ORDER BY p.created_at DESC
  `).all();
  res.json(posts);
});

app.post("/api/posts", authenticateToken, (req, res) => {
  try {
    const { title, content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    db.prepare(`INSERT INTO posts (author_id, title, content) VALUES (?, ?, ?)`).run(req.user!.userId, title || null, content);
    
    const insertId = (db.prepare(`SELECT last_insert_rowid() as id`).get() as any).id;
    const newPost = db.prepare(`
      SELECT p.*, u.username, u.role as authorRole 
      FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = ?
    `).get(insertId);
    res.json(newPost);
  } catch (error: any) {
    console.error("Posts error:", error);
    if (error.message && error.message.includes("FOREIGN KEY constraint failed")) {
      return res.status(401).json({ error: "User not found or invalid foreign key" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/posts/:id", (req, res) => {
  try {
    const post = db.prepare(`
      SELECT p.*, u.username, u.role as authorRole 
      FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = ?
    `).get(req.params.id) as any;
    
    if (!post) return res.status(404).json({ error: "Not found" });
    
    const comments = db.prepare(`
      SELECT c.*, u.username, u.role as authorRole 
      FROM log_comments c JOIN users u ON c.author_id = u.id 
      WHERE c.post_id = ? ORDER BY c.created_at ASC
    `).all(req.params.id);

    res.json({ ...post, comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/posts/:id", authenticateToken, (req, res) => {
  try {
    const post = db.prepare(`SELECT author_id FROM posts WHERE id = ?`).get(req.params.id) as any;
    if (!post) return res.status(404).json({ error: "Not found" });

    if (req.user!.role !== 'admin' && req.user!.userId !== post.author_id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    db.prepare(`DELETE FROM posts WHERE id = ?`).run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Comments routes
app.post("/api/log_comments", authenticateToken, (req, res) => {
  try {
    const { post_id, content } = req.body;
    if (!post_id || !content) return res.status(400).json({ error: "Missing fields" });

    db.prepare(`INSERT INTO log_comments (post_id, author_id, content) VALUES (?, ?, ?)`).run(post_id, req.user!.userId, content);

    const insertId = (db.prepare(`SELECT last_insert_rowid() as id`).get() as any).id;
    const newComment = db.prepare(`
      SELECT c.*, u.username, u.role as authorRole 
      FROM log_comments c JOIN users u ON c.author_id = u.id WHERE c.id = ?
    `).get(insertId);
    
    res.json(newComment);
  } catch (error: any) {
    console.error("Comments error:", error);
    if (error.message && error.message.includes("FOREIGN KEY constraint failed")) {
      return res.status(401).json({ error: "User or Post not found" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/log_comments/:id", authenticateToken, (req, res) => {
  try {
    const comment = db.prepare(`SELECT author_id FROM log_comments WHERE id = ?`).get(req.params.id) as any;
    if (!comment) return res.status(404).json({ error: "Not found" });

    if (req.user!.role !== 'admin' && req.user!.userId !== comment.author_id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    db.prepare(`DELETE FROM log_comments WHERE id = ?`).run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ======== 侧边栏便签 (Todos) 路由 ======== //
app.get("/api/todos", (req, res) => {
  try {
    // 联合查询出发布者的用户名与角色，按照创建时间倒序排列
    const todos = db.prepare(`
      SELECT t.*, u.username, u.role as authorRole 
      FROM todos t JOIN users u ON t.author_id = u.id 
      ORDER BY t.created_at DESC
    `).all();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "获取便签失败，服务器内部错误" });
  }
});

app.post("/api/todos", authenticateToken, (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const id = crypto.randomUUID();
    db.prepare(`INSERT INTO todos (id, author_id, content) VALUES (?, ?, ?)`).run(id, req.user!.userId, content);
    
    const newTodo = db.prepare(`
      SELECT t.*, u.username, u.role as authorRole 
      FROM todos t JOIN users u ON t.author_id = u.id WHERE t.id = ?
    `).get(id);
    res.json(newTodo);
  } catch (error: any) {
    console.error("Todos error:", error);
    if (error.message && error.message.includes("FOREIGN KEY constraint failed")) {
      return res.status(401).json({ error: "User not found" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/todos/:id/toggle", authenticateToken, (req, res) => {
  try {
    const todo = db.prepare(`SELECT author_id, is_completed FROM todos WHERE id = ?`).get(req.params.id) as any;
    if (!todo) return res.status(404).json({ error: "Not found" });

    if (req.user!.role !== 'admin' && req.user!.userId !== todo.author_id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const newState = todo.is_completed ? 0 : 1;
    db.prepare(`UPDATE todos SET is_completed = ? WHERE id = ?`).run(newState, req.params.id);
    res.json({ success: true, is_completed: newState });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/todos/:id", authenticateToken, (req, res) => {
  try {
    const todo = db.prepare(`SELECT author_id FROM todos WHERE id = ?`).get(req.params.id) as any;
    if (!todo) return res.status(404).json({ error: "Not found" });

    if (req.user!.role !== 'admin' && req.user!.userId !== todo.author_id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    db.prepare(`DELETE FROM todos WHERE id = ?`).run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Auto-create an admin for testing if no users exist
    const userCount = db.prepare(`SELECT COUNT(*) as count FROM users`).get() as any;
    if (userCount.count === 0) {
      hashPassword('admin123').then(hashed => {
        db.prepare(`INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)`)
          .run('admin-id', 'admin', hashed, 'admin');
        console.log('Created default admin: admin / admin123');
      }).catch(err => console.error("Failed to create admin:", err));
    }
  });
}

startServer();
