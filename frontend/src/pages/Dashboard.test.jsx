import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Dashboard from './Dashboard';
import { FeedbackContext } from '../contexts/FeedbackContext';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

// Mock API clients directly to avoid axios mock issues
jest.mock('../api/trendsApi', () => ({
  trendsApi: {
    getTrends: jest.fn(),
    triggerCollection: jest.fn(),
    getCollectionStatus: jest.fn().mockResolvedValue({ isCollecting: false })
  }
}));

jest.mock('../api/categoriesApi', () => ({
  categoriesApi: {
    getAll: jest.fn()
  }
}));

// Mock SocketContext
const mockSocket = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
};
jest.mock('../contexts/SocketContext', () => ({
  useSocket: () => mockSocket,
}));

const mockShowFeedback = jest.fn();
const mockContextValue = {
  showFeedback: mockShowFeedback,
};

import { trendsApi } from '../api/trendsApi';
import { categoriesApi } from '../api/categoriesApi';

describe('Dashboard Integration', () => {
  const mockTrends = [
    { id: 1, title: 'Trend 1', summary: 'Summary 1', source_name: 'Source A', published_at: '2026-01-13T10:00:00Z', status: 'available', category_names: ['AI'] },
    { id: 2, title: 'Trend 2', summary: 'Summary 2', source_name: 'Source B', published_at: '2026-01-12T10:00:00Z', status: 'sent', category_names: ['Tech'] },
  ];

  const mockCategories = [
    { id: 1, name: 'AI' },
    { id: 2, name: 'Tech' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    trendsApi.getTrends.mockResolvedValue(mockTrends);
    categoriesApi.getAll.mockResolvedValue(mockCategories);
    axios.get.mockImplementation((url) => {
        if (url.includes('/newsletters/active-draft')) return Promise.resolve({ data: null });
        return Promise.resolve({ data: [] });
    });
  });

  it('renders trends grouped by date', async () => {
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
      expect(screen.getByText(/2026년 1월 13일/)).toBeInTheDocument();
    });
  });

  it('triggers manual collection when Collect Now button is clicked', async () => {
    axios.post.mockResolvedValue({ data: { status: 'started' } });

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
    
    // Simulate proxy connected so button is enabled
    const proxyHandler = mockSocket.on.mock.calls.find(call => call[0] === 'proxy_status')[1];
    act(() => {
      proxyHandler({ connected: true });
    });

    await act(async () => {
      fireEvent.click(collectButton);
    });

    await waitFor(() => {
        expect(trendsApi.getTrends).toHaveBeenCalled();
        expect(mockShowFeedback).toHaveBeenCalledWith('Collection started...', 'info');
    });
  });
});