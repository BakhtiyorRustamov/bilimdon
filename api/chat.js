export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = process.env.HF_TOKEN;
  if (!token) {
    return res.status(200).json({ 
      answer: "Xato: Vercel serverida HF_TOKEN topilmadi." 
    });
  }

  const userPrompt = req.body?.prompt || "Salom!";

  try {
    const apiResponse = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.2-1B-Instruct",
        messages: [
          {
            role: "system",
            content: "Siz boshlang'ich sinf o'quvchilariga yordam beradigan 'Bilimdon' ustozisiz. O'zbek tilida qisqa va tushunarli javob bering."
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        max_tokens: 150
      })
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      const errorText = data.error?.message || JSON.stringify(data);
      return res.status(200).json({ answer: `API Xatosi: ${errorText}` });
    }

    const answer = data.choices?.[0]?.message?.content || "Javob olinmadi.";
    return res.status(200).json({ answer });

  } catch (err) {
    return res.status(200).json({ answer: `U ulanish xatosi: ${err.message}` });
  }
}
