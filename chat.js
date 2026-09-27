export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const userPrompt = req.body.prompt;

  try {
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/bakhtiyor1chi/gemma-4-textbook-tutor",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: userPrompt }),
      }
    );

    const result = await hfResponse.json();
    
    // Hugging Face returns an array. We extract the generated text.
    const answer = result[0]?.generated_text || "Kechirasiz, javob topilmadi."; 

    res.status(200).json({ answer: answer });
  } catch (error) {
    res.status(500).json({ answer: "Server xatosi yuz berdi." });
  }
}
