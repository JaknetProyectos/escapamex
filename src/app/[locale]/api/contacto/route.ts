import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nombre,
      email,
      telefono,
      mensaje,
      servicioDeseado,
      presupuesto,
    } = body;

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // =========================
    // 📩 EMAIL AL ADMIN
    // =========================
    await resend.emails.send({
      from: "EscapaMex <info@escapamex.com>",
      to: ["info@escapamex.com"],
      subject: `Nuevo lead - ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px;">
          <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;border-top:6px solid #027f77;">
            
            <div style="padding:24px;">
              <h2 style="color:#027f77;margin-bottom:10px;">Nuevo contacto</h2>
              <p style="color:#555;">Has recibido un nuevo lead desde EscapaMex</p>

              <hr style="margin:20px 0;" />

              <p><strong>Nombre:</strong> ${nombre}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${telefono ? `<p><strong>Teléfono:</strong> ${telefono}</p>` : ""}
              ${servicioDeseado ? `<p><strong>Servicio:</strong> ${servicioDeseado}</p>` : ""}
              ${presupuesto ? `<p><strong>Presupuesto:</strong> ${presupuesto}</p>` : ""}

              <p style="margin-top:16px;"><strong>Mensaje:</strong></p>
              <div style="background:#f3f4f6;padding:12px;border-radius:8px;">
                ${mensaje}
              </div>
            </div>

            <div style="background:#027f77;color:white;padding:16px;text-align:center;">
              EscapaMex • Nuevo lead
            </div>
          </div>
        </div>
      `,
    });

    // =========================
    // 📩 EMAIL AL USUARIO
    // =========================
    await resend.emails.send({
      from: "EscapaMex <info@escapamex.com>",
      to: [email],
      subject: "Recibimos tu mensaje ✈️",
      html: `
        <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px;">
          <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;border-top:6px solid #f28621;">
            
            <div style="padding:24px;">
              <h2 style="color:#027f77;">Hola ${nombre} 👋</h2>
              
              <p style="color:#555;">
                Gracias por contactarnos en <strong>EscapaMex</strong>. 
                Ya recibimos tu mensaje y un especialista te responderá muy pronto.
              </p>

              <div style="margin:20px 0;padding:16px;border-radius:10px;background:#fff7ed;border-left:4px solid #f9ae31;">
                <p style="margin:0;"><strong>Resumen de tu solicitud:</strong></p>
                <p style="margin:8px 0 0 0;">${mensaje}</p>
              </div>

              <p style="color:#555;">
                Mientras tanto, estamos preparando opciones increíbles para ti ✈️🌍
              </p>
            </div>

            <div style="background:#027f77;color:white;padding:16px;text-align:center;">
              EscapaMex • Vive la experiencia
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error enviando el correo" },
      { status: 500 }
    );
  }
}