const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const templateService = require('../services/templateService');

const templateCache = new Map();

function generateNewsletterHtml(newsletter, subscriber_token = null, confirmation_uuid = null) {
  const templateInfo = templateService.getTemplateById(newsletter.template_id);
  const templatePath = path.resolve(__dirname, 'templates', templateInfo.layout_file);
  
  let template = templateCache.get(templatePath);
  
  if (!template) {
    try {
      template = fs.readFileSync(templatePath, 'utf8');
      templateCache.set(templatePath, template);
    } catch (err) {
      console.error(`Failed to read template ${templatePath}, falling back to default.`, err);
      template = fs.readFileSync(path.resolve(__dirname, 'newsletter.ejs'), 'utf8');
    }
  }
  
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
