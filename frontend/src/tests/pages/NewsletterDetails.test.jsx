import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import NewsletterDetails from '../../pages/NewsletterDetails';
import { FeedbackContext } from '../../contexts/FeedbackContext';
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios');

const mockShowFeedback = jest.fn();

const renderWithContext = (ui, id = '1') => {
  return render(
    <FeedbackContext.Provider value={{ showFeedback: mockShowFeedback }}>
      <MemoryRouter initialEntries={[`/newsletters/${id}`]}>
        <Routes>
          <Route path="/newsletters/:id" element={ui} />
        </Routes>
      </MemoryRouter>
    </FeedbackContext.Provider>
  );
};

describe('NewsletterDetails Page', () => {
  const mockNewsletter = {
    data: {
      id: 1,
      issue_date: '2026-01-19',
      status: 'sent',
      subject: 'Test Subject',
      introduction_html: '<p>Intro content</p>',
      conclusion_html: '<p>Outro content</p>',
      items: [
        { id: 101, title: 'Article 1', source_name: 'Source 1', published_at: '2026-01-19', original_url: 'url1' },
        { id: 102, title: 'Article 2', source_name: 'Source 2', published_at: '2026-01-19', original_url: 'url2' }
      ]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    axios.get.mockReturnValue(new Promise(() => {})); // Never resolves
    renderWithContext(<NewsletterDetails />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders newsletter details successfully', async () => {
    axios.get.mockResolvedValue(mockNewsletter);
    renderWithContext(<NewsletterDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Subject')).toBeInTheDocument();
      expect(screen.getByText('SENT')).toBeInTheDocument();
      expect(screen.getByText('Intro content')).toBeInTheDocument();
      expect(screen.getByText('Outro content')).toBeInTheDocument();
      expect(screen.getByText('Article 1')).toBeInTheDocument();
      expect(screen.getByText('Article 2')).toBeInTheDocument();
    });
  });

  it('renders "Go to Draft Editor" button for draft newsletters', async () => {
    const draftNewsletter = {
      data: { ...mockNewsletter.data, status: 'draft' }
    };
    axios.get.mockResolvedValue(draftNewsletter);
    renderWithContext(<NewsletterDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('DRAFT')).toBeInTheDocument();
      expect(screen.getByText(/Continue Editing/i)).toBeInTheDocument();
    });
  });

  it('renders error message when newsletter not found', async () => {
    axios.get.mockRejectedValue({ response: { status: 404 } });
    renderWithContext(<NewsletterDetails />);
    
    await waitFor(() => {
      expect(screen.getByText(/Newsletter not found/i)).toBeInTheDocument();
    });
  });
});
