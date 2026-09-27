export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = process.env.HF_TOKEN;
  if (!token) {
    return res.status(200).json({ 
      answer: "Xato: Vercel serverida HF_TOKEN topilmadi. Environment Variables-ni tekshiring." 
    });
  }

  const userPrompt = req.body?.prompt || "Salom!";

  try {
    // We use Qwen2.5-7B-Instruct, which is hosted on Hugging Face's Serverless Router
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-7B-Instruct",
          messages: [
            {
              role: "system",
              content: "Siz boshlang'ich sinf o'quvchilariga yordam beradigan mehribon va aqlli 'Bilimdon' ustozisiz. Barcha javoblarni o'zbek tilida, tushunarli va qisqa bering."
            },
            {
              role: "user",
              content: userPrompt
            }
          ],
          max_tokens: 250,
          temperature: 0.7
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result.error?.message || JSON.stringify(result);
      return res.status(200).json({ answer: `HF API Xatosi (${response.status}): ${errorMsg}` });
    }

    // OpenAI-compatible format output parsing
    const answer = result.choices?.[0]?.message?.content || "Javob olinmadi.";
    return res.status(200).json({ answer });

  } catch (error) {
    return res.status(200).json({ answer: `Server ichki xatosi: ${error.message}` });
  }
}
