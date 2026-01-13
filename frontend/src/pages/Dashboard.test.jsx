import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import Dashboard from './Dashboard';
import { FeedbackContext } from '../contexts/FeedbackContext';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

const mockShowFeedback = jest.fn();
const mockContextValue = {
  showFeedback: mockShowFeedback,
};

describe('Dashboard Integration', () => {
  const mockTrends = [
    { id: 1, title: 'Trend 1', summary: 'Summary 1', source_name: 'Source A', published_at: '2026-01-13T10:00:00Z', status: 'available' },
    { id: 2, title: 'Trend 2', summary: 'Summary 2', source_name: 'Source B', published_at: '2026-01-12T10:00:00Z', status: 'sent' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders grid of trends with weekly subheaders', async () => {
    axios.get.mockResolvedValueOnce({ data: mockTrends });

    await act(async () => {
      render(
        <FeedbackContext.Provider value={mockContextValue}>
          <BrowserRouter>
              <Dashboard />
          </BrowserRouter>
        </FeedbackContext.Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Trend 1')).toBeInTheDocument();
      expect(screen.getByText('Trend 2')).toBeInTheDocument();
      // Should show 'This Week' header (since mock date is 2026-01-13 which is Week 3)
      expect(screen.getByText('This Week')).toBeInTheDocument();
    });
  });

  it('triggers manual collection when Collect Now button is clicked', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({ data: { status: 'started' } });

    await act(async () => {
      render(
        <FeedbackContext.Provider value={mockContextValue}>
          <BrowserRouter>
              <Dashboard />
          </BrowserRouter>
        </FeedbackContext.Provider>
      );
    });

    const collectButton = await screen.findByText(/Collect Now/i);
    await act(async () => {
      collectButton.click();
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/api/trends/collect');
        expect(mockShowFeedback).toHaveBeenCalledWith('Data collection started...', 'info');
    });
  });
});