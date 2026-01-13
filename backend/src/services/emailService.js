const sgMail = require('@sendgrid/mail');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/env');
const NewsletterModel = require('../models/newsletterModel');
const { generateNewsletterHtml } = require('../utils/emailTemplate');

sgMail.setApiKey(config.sendgridApiKey);

class EmailService {
  async sendNewsletter(recipient, htmlContent) {
    const msg = {
      to: recipient,
      from: 'newsletter@ai-trends.com', // This should be a verified sender
      subject: 'Your Weekly AI Trends Newsletter',
      html: htmlContent,
    };

    if (config.nodeEnv !== 'test') {
      try {
        await sgMail.send(msg);
        console.log(`Email sent to ${recipient}`);
      } catch (error) {
        console.error('SendGrid Error:', error.response ? error.response.body : error.message);
      }
    } else {
        console.log(`(Test mode) Email would be sent to ${recipient}`);
    }
  }

  async sendTestNewsletter(newsletterId) {
    const newsletter = await NewsletterModel.getById(newsletterId);
    if (!newsletter) throw new Error('Newsletter not found');

    const uuid = uuidv4();
    await NewsletterModel.updateConfirmationUuid(newsletterId, uuid);

    const html = generateNewsletterHtml(newsletter.items, 'admin-token', uuid);
    await this.sendNewsletter(config.adminEmail, html);
    
    return { uuid, recipient: config.adminEmail };
  }
}

module.exports = EmailService;
