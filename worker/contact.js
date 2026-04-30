export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "https://raidyarenas.dev",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const data = await request.json();
      const { name, email, message } = data;

      // Validación básica
      if (!name || !email || !message) {
        return new Response(
          JSON.stringify({ error: "Todos los campos son requeridos" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Enviar email con Resend
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio <onboarding@resend.dev>",
          to: "contacto@raidyarenas.dev",
          reply_to: email,
          subject: `Nuevo mensaje de ${name}`,
          html: `
            <h2>Nuevo mensaje desde tu portfolio</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Resend error:", error);
        return new Response(
          JSON.stringify({ error: "Error al enviar el mensaje" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Mensaje enviado correctamente" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://raidyarenas.dev",
          },
        }
      );
    } catch (err) {
      console.error("Error:", err);
      return new Response(
        JSON.stringify({ error: "Error interno del servidor" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
