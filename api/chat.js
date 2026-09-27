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
    // Calling your custom fine-tuned model endpoint directly
    const response = await fetch(
      "https://api-inference.huggingface.co/models/bakhtiyor1chi/gemma-4-textbook-tutor",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: userPrompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7
          }
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result.error || JSON.stringify(result);
      return res.status(200).json({ 
        answer: `HF Xatosi (${response.status}): ${errorMsg}. (Eslatma: Agar model uxlayotgan bo'lsa, 30 soniyadan keyin yana urinib ko'ring)` 
      });
    }

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
