// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Pastikan hanya menerima request POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API Key belum disetting di Vercel' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-lite", // Gunakan model yang stabil
        systemInstruction: "Kamu adalah Asisten Konsultan IT Senior dari 'Kita Holo Solutions'. Tugasmu adalah meyakinkan klien bahwa kami ahli dalam: Optimasi Website, Keamanan Siber, dan AI. Jawab dengan profesional, singkat, dan berwibawa. Jangan bahas anime atau game, fokus pada BISNIS dan TEKNOLOGI. Jika ditanya harga, arahkan ke form kontak."
    });

    const chat = model.startChat();
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return res.status(200).json({ reply: responseText });

  } catch (error) {
    console.error("Error Gemini:", error);
    return res.status(500).json({ error: 'Gagal menghubungi AI' });
  }
}