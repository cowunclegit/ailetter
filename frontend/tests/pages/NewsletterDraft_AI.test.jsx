import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import NewsletterDraft from '../../src/pages/NewsletterDraft';
import { FeedbackContext } from '../../src/contexts/FeedbackContext';
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios');

// Mock components that might cause issues in test environment
jest.mock('../../src/components/features/NewsletterPreview', () => () => <div data-testid="preview" />);
jest.mock('../../src/components/features/RichTextEditor', () => ({ label, value, onChange }) => (
  <div data-testid={`editor-${label}`}>
    <label>{label}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
));
jest.mock('../../src/components/features/DraggableItem', () => () => <div data-testid="draggable-item" />);
jest.mock('../../src/components/features/TemplateGrid', () => () => <div data-testid="template-grid" />);

const mockShowFeedback = jest.fn();

const renderWithContext = (ui) => {
  return render(
    <FeedbackContext.Provider value={{ showFeedback: mockShowFeedback }}>
      <MemoryRouter initialEntries={['/newsletters/draft/1']}>
        <Routes>
          <Route path="/newsletters/draft/:id" element={ui} />
        </Routes>
      </MemoryRouter>
    </FeedbackContext.Provider>
  );
};

describe('NewsletterDraft - AI Subject Recommendation', () => {
  const mockNewsletter = {
    data: {
      id: 1,
      subject: 'Initial Subject',
      introduction_html: '',
      conclusion_html: '',
      items: [{ id: 1, title: 'Item 1', summary: 'Summary 1' }]
    }
  };

  const mockPresets = {
    data: [
      { id: 1, name: 'For Developers', prompt_template: 'Template 1', is_default: 1 },
      { id: 2, name: 'For Leaders', prompt_template: 'Template 2', is_default: 1 }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockImplementation((url) => {
      if (url.includes('/newsletters/1')) return Promise.resolve(mockNewsletter);
      if (url.includes('/ai-presets')) return Promise.resolve(mockPresets);
      if (url.includes('/templates')) return Promise.resolve({ data: [] });
      if (url.includes('/preview')) return Promise.resolve({ data: '<html></html>' });
      return Promise.reject(new Error('Not found'));
    });
    axios.post.mockResolvedValue({ data: { suggested_subject: 'New AI Subject' } });
    axios.put.mockResolvedValue({ data: { success: true } });
  });

  it('loads and displays AI presets in a dropdown', async () => {
    renderWithContext(<NewsletterDraft />);
    
    await waitFor(() => {
      expect(screen.getAllByText('AI Preset')[0]).toBeInTheDocument();
    });

    // Material UI Select displays the selected value text
    expect(screen.getByText('For Developers')).toBeInTheDocument();
  });

  it('calls AI recommendation API when button is clicked', async () => {
    renderWithContext(<NewsletterDraft />);
    
    await waitFor(() => {
      expect(screen.getByText('AI Recommend')).toBeInTheDocument();
    });

    const aiButton = screen.getByText('AI Recommend');
    fireEvent.click(aiButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/newsletters/1/ai-recommend-subject'),
        expect.objectContaining({ preset_id: 1 })
      );
    });

    // Should also update subject and persist it
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/newsletters/1'),
        expect.objectContaining({ subject: 'New AI Subject' })
      );
    });
  });

  it('button is disabled if no preset is selected', async () => {
    // Empty presets
    axios.get.mockImplementation((url) => {
      if (url.includes('/newsletters/1')) return Promise.resolve(mockNewsletter);
      if (url.includes('/ai-presets')) return Promise.resolve({ data: [] });
      if (url.includes('/templates')) return Promise.resolve({ data: [] });
      if (url.includes('/preview')) return Promise.resolve({ data: '<html></html>' });
      return Promise.reject(new Error('Not found'));
    });

    renderWithContext(<NewsletterDraft />);
    
    await waitFor(() => {
      const aiButton = screen.getByText('AI Recommend');
      expect(aiButton).toBeDisabled();
    });
  });
});
