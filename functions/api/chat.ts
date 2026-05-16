import { GoogleGenAI } from "@google/genai";

export async function onRequestPost(context: any) {
  // context 包含 request (前端发来的请求) 和 env (云端配置的环境变量)
  const { request, env } = context;

  try {
    // 1. 精确解析你 WebAgent.tsx 发来的 body 数据
    const body = await request.json();
    const { message, history } = body;

    // 2. 密钥安全拦截
    if (!env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "服务器未配置 API Key" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. 呼叫大模型
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    
    // 适配模型所需的历史记录格式
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role,
      parts: msg.parts.map((p: any) => ({ text: p.text }))
    }));

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are a helpful AI assistant. Be concise and friendly.",
        temperature: 0.7,
      },
      history: formattedHistory
    });

    const response = await chat.sendMessage({ message: message });

    // 4. 返回标准 JSON 给前端 (这正是前端 const data = await response.json() 期待的)
    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    // 返回标准格式的错误信息给前端的 catch 块
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
