const NewsletterModel = require('../../src/models/newsletterModel');
const db = require('../../src/db');

function runAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

describe('Newsletter Template Selection Persistence', () => {
    beforeEach(async () => {
        await new Promise(res => db.run("DELETE FROM newsletter_items", res));
        await new Promise(res => db.run("DELETE FROM newsletters", res));
    });

    it('should default to classic-list when creating a draft', async () => {
        const draft = await NewsletterModel.createDraft([]);
        const fetched = await NewsletterModel.getById(draft.id);
        expect(fetched.template_id).toBe('classic-list');
    });

    it('should update template_id correctly', async () => {
        const draft = await NewsletterModel.createDraft([]);
        await NewsletterModel.updateDraftContent(draft.id, { template_id: 'modern-grid' });
        const fetched = await NewsletterModel.getById(draft.id);
        expect(fetched.template_id).toBe('modern-grid');
    });

    it('should fallback to classic-list when updating with invalid template_id', async () => {
        const draft = await NewsletterModel.createDraft([]);
        await NewsletterModel.updateDraftContent(draft.id, { template_id: 'non-existent' });
        const fetched = await NewsletterModel.getById(draft.id);
        expect(fetched.template_id).toBe('classic-list');
    });
});
