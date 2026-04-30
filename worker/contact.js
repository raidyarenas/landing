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
          from: "Portfolio <noreply@raidyarenas.dev>",
          to: "contacto@raidyarenas.dev",
          reply_to: email,
          subject: `Nuevo mensaje de ${name}`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
              <div style="background: linear-gradient(135deg, #00d4aa 0%, #0ea5e9 100%); padding: 40px 30px; text-align: center;">
                <p style="margin: 0; font-size: 40px;">👋</p>
                <h1 style="color: #ffffff; margin: 15px 0 0 0; font-size: 22px; font-weight: 600;">¡Hola Raidy!</h1>
              </div>
              <div style="padding: 35px 30px;">
                <p style="margin: 0 0 25px 0; font-size: 18px; color: #1f2937; line-height: 1.6;">
                  <strong style="color: #00d4aa;">${name}</strong> quiere contactar contigo desde tu portfolio.
                </p>
                <div style="background: #f9fafb; border-left: 4px solid #00d4aa; padding: 20px; border-radius: 0 12px 12px 0; margin-bottom: 25px;">
                  <p style="margin: 0; font-size: 16px; color: #374151; line-height: 1.7; font-style: italic;">"${message.replace(/\n/g, "<br>")}"</p>
                </div>
                <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #00d4aa 0%, #0ea5e9 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">Responder a ${name}</a>
              </div>
              <div style="padding: 20px 30px; background: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #9ca3af; font-size: 13px;">Enviado desde <a href="https://raidyarenas.dev" style="color: #00d4aa; text-decoration: none;">raidyarenas.dev</a></p>
              </div>
            </div>
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
