import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { orderId, total, currency, items, customer } = body;

    if (!orderId || !total || !items || !customer) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    // =========================
    // 🧾 Generar lista de productos (HTML)
    // =========================
    const itemsHtml = items
      .map(
        (item: any) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;">
            <strong>${item.title}</strong><br/>
            <span style="color:#666;font-size:12px;">
              ${item.category}
              ${item.selectedDate ? `<br/>📅 ${new Date(item.selectedDate).toLocaleDateString("es-MX")}` : ""}
            </span>
          </td>
          <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">
            ${item.quantity}
          </td>
          <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">
            $${item.price.toLocaleString("es-MX")} MXN
          </td>
        </tr>
      `
      )
      .join("");

    // =========================
    // 📩 EMAIL ADMIN
    // =========================
    await resend.emails.send({
      from: "EscapaMex <info@vanguardiatecnologia.com>",
      to: ["info@vanguardiatecnologia.com"], // ⚠️ cambia esto
      subject: `Nueva compra #${orderId}`,
      html: `
        <div style="font-family: Arial; background:#f9fafb; padding:20px;">
          <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;border-top:6px solid #027f77;">
            
            <div style="padding:24px;">
              <h2 style="color:#027f77;">Nueva compra recibida</h2>

              <p><strong>Orden:</strong> ${orderId}</p>
              <p><strong>Cliente:</strong> ${customer.firstName} ${customer.lastName}</p>
              <p><strong>Email:</strong> ${customer.email}</p>
              <p><strong>Teléfono:</strong> ${customer.telefono}</p>

              <hr style="margin:20px 0;" />

              <table width="100%" style="border-collapse:collapse;">
                <thead>
                  <tr style="background:#f3f4f6;text-align:left;">
                    <th style="padding:10px;">Producto</th>
                    <th style="padding:10px;text-align:center;">Cant.</th>
                    <th style="padding:10px;text-align:right;">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div style="text-align:right;margin-top:20px;">
                <p style="font-size:18px;">
                  <strong>Total:</strong> 
                  <span style="color:#f28621;">
                    $${total.toLocaleString("es-MX")} ${currency}
                  </span>
                </p>
              </div>
            </div>

            <div style="background:#027f77;color:white;padding:16px;text-align:center;">
              EscapaMex • Nueva venta
            </div>
          </div>
        </div>
      `,
    });

    // =========================
    // 📩 EMAIL CLIENTE (TICKET)
    // =========================
    await resend.emails.send({
      from: "EscapaMex <info@vanguardiatecnologia.com>",
      to: [customer.email],
      subject: `Tu compra en EscapaMex #${orderId}`,
      html: `
        <div style="font-family: Arial; background:#f9fafb; padding:20px;">
          <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;border-top:6px solid #f28621;">
            
            <div style="padding:24px;">
              <h2 style="color:#027f77;">¡Gracias por tu compra! ✈️</h2>

              <p>Hola ${customer.firstName},</p>
              <p>
                Hemos recibido tu pedido correctamente. Aquí tienes tu comprobante:
              </p>

              <div style="background:#fff7ed;padding:16px;border-radius:10px;margin:20px 0;">
                <p><strong>Orden:</strong> ${orderId}</p>
                <p><strong>Fecha:</strong> ${new Date().toLocaleDateString("es-MX")}</p>
              </div>

              <table width="100%" style="border-collapse:collapse;">
                <thead>
                  <tr style="background:#f3f4f6;">
                    <th style="padding:10px;text-align:left;">Experiencia</th>
                    <th style="padding:10px;text-align:center;">Cant.</th>
                    <th style="padding:10px;text-align:right;">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div style="text-align:right;margin-top:20px;">
                <p style="font-size:20px;">
                  <strong>Total pagado:</strong><br/>
                  <span style="color:#f9ae31;font-weight:bold;">
                    $${total.toLocaleString("es-MX")} ${currency}
                  </span>
                </p>
              </div>

              <p style="margin-top:20px;color:#555;">
                Nuestro equipo te contactará pronto con los detalles de tu experiencia.
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
      { error: "Error enviando confirmación" },
      { status: 500 }
    );
  }
}