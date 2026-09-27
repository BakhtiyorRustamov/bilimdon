export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Ensure environment variable is loaded
  const token = process.env.HF_TOKEN;
  if (!token) {
    return res.status(200).json({ 
      answer: "Xato: Vercel serverida HF_TOKEN topilmadi. Environment Variables-ni tekshiring." 
    });
  }

  const userPrompt = req.body?.prompt || "Salom!";

  try {
    // 3. Call Hugging Face API with Llama-3.2-1B-Instruct
    const response = await fetch(
      "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: `<|system|>\nSiz boshlang'ich sinf o'quvchilariga yordam beradigan 'Bilimdon' ustozisiz. Barcha javoblarni o'zbek tilida, tushunarli va qisqa bering.<|end|>\n<|user|>\n${userPrompt}<|end|>\n<|assistant|>`,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            return_full_text: false
          }
        }),
      }
    );

    const result = await response.json();

    // 4. Handle API error responses (e.g. 401, 503, model loading)
    if (!response.ok) {
      const errorMsg = result.error || JSON.stringify(result);
      return res.status(200).json({ answer: `HF API Xatosi (${response.status}): ${errorMsg}` });
    }

    // 5. Parse output safely
    let answer = "";
    if (Array.isArray(result) && result[0]?.generated_text) {
      answer = result[0].generated_text.trim();
    } else if (typeof result === 'object' && result.generated_text) {
      answer = result.generated_text.trim();
    } else {
      answer = JSON.stringify(result);
    }

    return res.status(200).json({ answer: answer || "Javob olinmadi." });

  } catch (error) {
    return res.status(200).json({ answer: `Server ichki xatosi: ${error.message}` });
  }
}
