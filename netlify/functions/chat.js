import fetch from "node-fetch";

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: body.message }],
      })
    });

    const data = await response.json();

    // Check for OpenAI errors or missing choices
    if (!data.choices || !data.choices[0]?.message?.content) {
      return {
        statusCode: 500,
        body: JSON.stringify({ reply: "Sorry, I couldn't get a reply from AI." })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content })
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ reply: "Error: " + error.message }) };
  }
}
