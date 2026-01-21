const path = require('path');

class TemplateService {
  constructor() {
    this.templates = [
      {
        id: 'classic-list',
        name: 'Classic List',
        thumbnail_url: '/assets/templates/classic-list.svg',
        layout_file: 'classic-list.ejs'
      },
      {
        id: 'modern-grid',
        name: 'Modern Grid',
        thumbnail_url: '/assets/templates/modern-grid.svg',
        layout_file: 'modern-grid.ejs'
      },
      {
        id: 'bold-hero',
        name: 'Bold Hero',
        thumbnail_url: '/assets/templates/bold-hero.svg',
        layout_file: 'bold-hero.ejs'
      },
      {
        id: 'minimalist',
        name: 'Minimalist',
        thumbnail_url: '/assets/templates/minimalist.svg',
        layout_file: 'minimalist.ejs'
      },
      {
        id: 'dark-mode',
        name: 'Dark Mode',
        thumbnail_url: '/assets/templates/dark-mode.svg',
        layout_file: 'dark-mode.ejs'
      },
      {
        id: 'tech-code',
        name: 'Tech/Code',
        thumbnail_url: '/assets/templates/tech-code.svg',
        layout_file: 'tech-code.ejs'
      },
      {
        id: 'magazine',
        name: 'Newsletter Magazine',
        thumbnail_url: '/assets/templates/magazine.svg',
        layout_file: 'magazine.ejs'
      },
      {
        id: 'accent-blue',
        name: 'Accent Color (Blue)',
        thumbnail_url: '/assets/templates/accent-blue.svg',
        layout_file: 'accent-blue.ejs'
      },
      {
        id: 'accent-green',
        name: 'Accent Color (Green)',
        thumbnail_url: '/assets/templates/accent-green.svg',
        layout_file: 'accent-green.ejs'
      },
      {
        id: 'accent-purple',
        name: 'Accent Color (Purple)',
        thumbnail_url: '/assets/templates/accent-purple.svg',
        layout_file: 'accent-purple.ejs'
      },
      {
        id: 'compact',
        name: 'Compact',
        thumbnail_url: '/assets/templates/compact.svg',
        layout_file: 'compact.ejs'
      }
    ];
  }

  getAllTemplates() {
    return this.templates;
  }

  getTemplateById(id) {
    const template = this.templates.find(t => t.id === id);
    return template || this.templates.find(t => t.id === 'classic-list');
  }
}

module.exports = new TemplateService();
