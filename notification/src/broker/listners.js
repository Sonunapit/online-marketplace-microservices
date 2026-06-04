const { subscribeToQueue } = require("./broker");
const { sendEmail } = require("../email");

module.exports = function () {
subscribeToQueue("AUTH_NOTIFICATION.USER_CREATED", async (data) => {
  try {
    console.log("🔥 USER_CREATED EVENT RECEIVED");
    console.log(data);

    const emailHTMLTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;">

        <h1 style="color: #2E7D32; text-align: center;">
          Welcome to Local-Market! 🎉
        </h1>

        <p>
          Dear <strong>${data.fullName.firstName} ${data.fullName.lastName || ""}</strong>,
        </p>

        <p>
          Thank you for joining <strong>Local-Market</strong>! We're excited to have you as part of our growing community.
        </p>

        <p>
          Local-Market helps you discover, buy, and sell products in your local area with ease.
        </p>

        <p>
          Your account has been successfully created and you're ready to start exploring.
        </p>

        <ul>
          <li>🛍️ Browse products from local sellers</li>
          <li>🏪 Create and manage your own store</li>
          <li>💳 Secure online payments</li>
          <li>📦 Easy order tracking</li>
        </ul>

        <p>
          If you have any questions, our support team is always here to help.
        </p>

        <p>
          Best regards,<br/>
          <strong>Team Local-Market</strong>
        </p>

        <hr/>

        <p style="font-size: 12px; color: #777; text-align: center;">
          Thank you for choosing Local-Market ❤️
        </p>

      </div>
    `;

    await sendEmail(
      data.email,
      "🎉 Welcome to Local-Market",
      "Thank you for joining Local-Market. Your account has been created successfully.",
      emailHTMLTemplate
    );

    console.log(`✅ Welcome email sent to ${data.email}`);
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
  }
});

  subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_COMPLETED", async (data) => {
    const emailHTMLTemplate = `
    <h1> Payment Successful !</h>
    <p> Dear ${data.fullName.firstName + " " + (data.fullName.lastName || "")},</p>
    <p> We have received your payment of ${data.currency} ${data.amount} for the  order ID: ${data.orderId},</p>
    <p>Thank you for your purchase! </p>
    <p>Best regards,  <br/>The Team </p>
    `;
    await sendEmail(
      data.email,
      "Payment Successful",
      "We have received your payment ",
      emailHTMLTemplate,
    );
  });
  subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_FAILED", async (data) => {
    const emailHTMLTemplate = `
    <h1>Payment Failed ❌</h1>

    <p>
      Dear ${data.fullName.firstName + " " + (data.fullName.lastName || "")},
    </p>

    <p>
      Unfortunately, your payment for Order ID:
      <strong>${data.orderId}</strong> could not be completed.
    </p>

    <p>
      Amount: <strong>${data.currency} ${data.amount}</strong>
    </p>

    <p>
      Possible reasons:
    </p>

    <ul>
      <li>Insufficient balance</li>
      <li>Transaction cancelled</li>
      <li>Bank server issue</li>
      <li>Network problem</li>
    </ul>

    <p>
      Please try again using the same or another payment method.
    </p>

    <p>
      If money was deducted from your account, it will usually be refunded
      automatically within 5-7 business days.
    </p>

    <p>
      Best regards,<br/>
      The Team
    </p>
  `;

    await sendEmail(
      data.email,
      "Payment Failed",
      `Your payment for order ${data.orderId} could not be completed.`,
      emailHTMLTemplate,
    );
  });
};
