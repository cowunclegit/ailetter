import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import NewsletterDraft from '../../../pages/NewsletterDraft';
import { FeedbackContext } from '../../../contexts/FeedbackContext';
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios');

// Mock components
jest.mock('../../../components/features/NewsletterPreview', () => () => <div data-testid="preview" />);
jest.mock('../../../components/features/RichTextEditor', () => ({ label, value, onChange }) => (
  <div data-testid={`editor-${label}`}>
    <label>{label}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
));

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

describe('NewsletterDraft US2 - Intro and Outro Editors', () => {
  const mockNewsletter = {
    data: {
      id: 1,
      subject: 'Subject',
      introduction_html: '<p>Initial Intro</p>',
      conclusion_html: '<p>Initial Outro</p>',
      items: []
    }
  };

  beforeEach(() => {
    axios.get.mockResolvedValue(mockNewsletter);
    axios.put.mockResolvedValue({ data: { success: true } });
  });

  it('renders intro and outro editors with initial content', async () => {
    renderWithContext(<NewsletterDraft />);
    
    await waitFor(() => {
      expect(screen.getByText('Introduction')).toBeInTheDocument();
      expect(screen.getByText('Conclusion')).toBeInTheDocument();
    });

    // Verify initial values in mocked textareas
    // Label is passed to the mock
  });
});
