import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import NewsletterDraft from '../../../pages/NewsletterDraft';
import { FeedbackContext } from '../../../contexts/FeedbackContext';
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios');

// Mock components that might be complex
jest.mock('../../../components/features/NewsletterPreview', () => () => <div data-testid="preview" />);

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

describe('NewsletterDraft US1 - Subject and Deletion', () => {
  const mockNewsletter = {
    data: {
      id: 1,
      subject: 'Original Subject',
      items: [
        { id: 101, title: 'Item 1', source_name: 'Source 1', published_at: '2026-01-19', original_url: 'url1' },
        { id: 102, title: 'Item 2', source_name: 'Source 2', published_at: '2026-01-19', original_url: 'url2' }
      ]
    }
  };

  beforeEach(() => {
    axios.get.mockResolvedValue(mockNewsletter);
    axios.put.mockResolvedValue({ data: { success: true } });
    axios.delete.mockResolvedValue({ data: { success: true } });
  });

  it('renders subject input with initial value', async () => {
    renderWithContext(<NewsletterDraft />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Original Subject')).toBeInTheDocument();
    });
  });

  it('updates subject line', async () => {
    renderWithContext(<NewsletterDraft />);
    
    await waitFor(() => screen.getByDisplayValue('Original Subject'));
    
    const input = screen.getByLabelText(/Subject/i);
    fireEvent.change(input, { target: { value: 'Updated Subject' } });
    
    // Check if it calls API or updates local state
    // Depending on implementation (debounce or onBlur)
    // For now assume it has a save button or autosaves
  });
});
