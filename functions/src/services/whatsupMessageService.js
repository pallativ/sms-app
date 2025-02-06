require("dotenv").config();
const axios = require("axios");
const WHATSAPP_API_URL = "https://graph.facebook.com/v19.0";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const { logger } = require('firebase-functions');
/**
 * Send a WhatsApp message using a template
 * @param {string} recipientPhone - The recipient's phone number (E.164 format: +1234567890)
 * @param {string} templateName - The template name (approved in Meta)
 * @param {Array} templateParams - An array of text parameters for the template
 * @returns {Promise}
 */

async function sendWhatsAppTemplate(recipientPhone, templateName, templateParams) {
    try {
        const response = await axios.post(
            `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: recipientPhone,
                type: "template",
                template: {
                    name: templateName,
                    language: { code: "en" },
                    components: [
                        {
                            type: "BODY",
                            parameters: templateParams.map(param => ({ type: "text", text: param }))
                        }
                    ]
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        logger.info("Message sent successfully:", response.data);
        console.log("Message sent successfully:", response.data);
        return response.data;
    } catch (error) {
        logger.error("Error sending WhatsApp message:", error.response ? error.response.data : error.message);
        console.error("Error sending WhatsApp message:", error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { sendWhatsAppTemplate };
