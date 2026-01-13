const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const templatePath = path.resolve(__dirname, 'newsletter.ejs');
const template = fs.readFileSync(templatePath, 'utf8');

function generateNewsletterHtml(items, subscriber_token, confirmation_uuid = null) {
  return ejs.render(template, { items, subscriber_token, confirmation_uuid });
}

module.exports = { generateNewsletterHtml };
