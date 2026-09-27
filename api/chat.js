export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = process.env.HF_TOKEN;
  if (!token) {
    return res.status(200).json({ answer: "Xato: Vercel serverida HF_TOKEN topilmadi." });
  }

  const userPrompt = req.body?.prompt || "Salom!";

  try {
    // Calling your custom fine-tuned model repository directly via HF Inference API
    const apiResponse = await fetch("https://api-inference.huggingface.co/models/bakhtiyor1chi/gemma-4-textbook-tutor", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: userPrompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7
        }
      })
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      const errorText = data.error || JSON.stringify(data);
      return res.status(200).json({ answer: `Model yuklanmoqda yoki xatolik: ${errorText}` });
    }

    // Parse standard text-generation response array or object
    let answer = "";
    if (Array.isArray(data) && data[0]?.generated_text) {
      answer = data[0].generated_text;
    } else if (data?.generated_text) {
      answer = data.generated_text;
    } else {
      answer = JSON.stringify(data);
    }

    return res.status(200).json({ answer });

  } catch (err) {
    return res.status(200).json({ answer: `Server xatosi: ${err.message}` });
  }
}
