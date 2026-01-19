const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

function generateNewsletterHtml(newsletter, subscriber_token = null, confirmation_uuid = null) {
  const templatePath = path.resolve(__dirname, 'newsletter.ejs');
  const template = fs.readFileSync(templatePath, 'utf8');
  const { items, subject, introduction_html, conclusion_html } = newsletter;
  return ejs.render(template, { 
    items, 
    subject,
    introduction_html, 
    conclusion_html, 
    subscriber_token, 
    confirmation_uuid 
  });
}

module.exports = { generateNewsletterHtml };
