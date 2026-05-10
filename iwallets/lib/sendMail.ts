import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendOrderEmail(order: any) {
  const { name, email, items, amount, paymentId, address } = order;

  const itemsHtml = items.map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">x ${item.qty || item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
    </tr>
  `).join("");

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Order Confirmed! Your iWallet is on the way! 🎉",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; color: #333;">
        <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">theCarryClub</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #000;">Thank you for your order, ${name}!</h2>
          <p>We've received your order and are getting it ready for shipment. Here are the details of your purchase:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f9f9f9;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; font-weight: bold; text-align: right;">Total Amount:</td>
                <td style="padding: 10px; font-weight: bold; text-align: right; font-size: 18px;">₹${amount}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background: #f7f7f7; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #666;"><strong>Payment ID:</strong> ${paymentId}</p>
            <p style="margin: 5px 0 0; font-size: 14px; color: #666;"><strong>Delivery to:</strong> ${address.city}, ${address.state} - ${address.pincode}</p>
          </div>

          <p style="margin-top: 30px;">We'll send you another email with a tracking link once your package is on its way!</p>
          
          <div style="margin-top: 40px; border-top: 1px solid #eee; pt: 20px; text-align: center; color: #888; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} theCarryClub. All rights reserved.</p>
            <p>If you have any questions, reply to this email or contact us at info@thecarryclub.in</p>
          </div>
        </div>
      </div>
    `,
  })
}
