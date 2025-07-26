// utils/mailtrapApi.js
const axios = require('axios');

const MAILTRAP_TOKEN = process.env.MAILTRAP_API_TOKEN;
const MAILTRAP_SENDER_EMAIL = 'your_verified_sender@mailtrap.email';

const sendEmailViaAPI = async ({ to, subject, text }) => {
  try {
    const response = await axios.post(
      'https://send.api.mailtrap.io/api/send',
      {
        to: [{ email: to }],
        from: { email: MAILTRAP_SENDER_EMAIL },
        subject: subject,
        text: text,
      },
      {
        headers: {
          Authorization: `Bearer ${MAILTRAP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Email sent via Mailtrap API:', response.data.message_id);
    return { success: true };
  } catch (error) {
    console.error('❌ Mailtrap API error:', error.response?.data || error.message);
    return { success: false, error };
  }
};

module.exports = { sendEmailViaAPI };
