import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import NewsletterHistory from './NewsletterHistory';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

describe('NewsletterHistory', () => {
  const mockNewsletters = [
    { id: 1, issue_date: '2026-01-13', status: 'sent', item_count: 5, created_at: '2026-01-13T10:00:00Z', sent_at: '2026-01-13T11:00:00Z' },
    { id: 2, issue_date: '2026-01-14', status: 'draft', item_count: 3, created_at: '2026-01-14T10:00:00Z', sent_at: null },
  ];

  it('renders history table with data', async () => {
    axios.get.mockResolvedValueOnce({ data: mockNewsletters });

    render(
      <BrowserRouter>
        <NewsletterHistory />
      </BrowserRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('2026-01-13')).toBeInTheDocument();
      expect(screen.getByText('SENT')).toBeInTheDocument();
      expect(screen.getByText('2026-01-14')).toBeInTheDocument();
      expect(screen.getByText('DRAFT')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  it('renders empty state when no newsletters', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <BrowserRouter>
        <NewsletterHistory />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No newsletters found.')).toBeInTheDocument();
    });
  });
});
