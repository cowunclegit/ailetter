import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CollectButton from './CollectButton';
import { trendsApi } from '../api/trendsApi';

// Mock FeedbackContext
const mockShowFeedback = jest.fn();
jest.mock('../contexts/FeedbackContext', () => ({
  useFeedback: () => ({
    showFeedback: mockShowFeedback,
  }),
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

// Mock the API service
jest.mock('../api/trendsApi', () => ({
  trendsApi: {
    triggerCollection: jest.fn(),
    getCollectionStatus: jest.fn().mockResolvedValue({ isCollecting: false }),
  }
}));

describe('CollectButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const simulateProxyConnected = () => {
    const handler = mockSocket.on.mock.calls.find(call => call[0] === 'proxy_status')[1];
    act(() => {
      handler({ connected: true });
    });
  };

  it('renders correctly', () => {
    render(<CollectButton />);
    expect(screen.getByText(/collect now/i)).toBeInTheDocument();
  });

  it('triggers collection on click and shows loading state', async () => {
    trendsApi.triggerCollection.mockResolvedValue({ status: 'started' });
    render(<CollectButton />);
    
    simulateProxyConnected();
    
    const button = screen.getByRole('button', { name: /collect now/i });
    expect(button).not.toBeDisabled();

    await act(async () => {
        fireEvent.click(button);
    });

    expect(trendsApi.triggerCollection).toHaveBeenCalled();
    expect(mockShowFeedback).toHaveBeenCalledWith('Collection started...', 'info');
  });

  it('handles API failure', async () => {
     trendsApi.triggerCollection.mockRejectedValue(new Error('Network Error'));
     render(<CollectButton />);
     
     simulateProxyConnected();
     const button = screen.getByRole('button', { name: /collect now/i });
     
     await act(async () => {
         fireEvent.click(button);
     });

     await waitFor(() => {
         expect(trendsApi.triggerCollection).toHaveBeenCalled();
     });
     
     expect(mockShowFeedback).toHaveBeenCalledWith(expect.stringContaining('Failed'), 'error');
     expect(button).not.toBeDisabled();
  });

  it('responds to socket progress events', async () => {
    const onComplete = jest.fn();
    render(<CollectButton onComplete={onComplete} />);
    
    simulateProxyConnected();
    
    const progressHandler = mockSocket.on.mock.calls.find(call => call[0] === 'collection_progress')[1];
    
    // Simulate in progress
    await act(async () => {
      progressHandler({ status: 'in_progress', current: 5, total: 10, message: 'Processing' });
    });
    
    expect(screen.getByText(/Processing/)).toBeInTheDocument();
    expect(screen.getByText(/5\/10/)).toBeInTheDocument();
    
    // Simulate complete
    await act(async () => {
      progressHandler({ status: 'complete' });
    });
    
    expect(onComplete).toHaveBeenCalled();
    expect(mockShowFeedback).toHaveBeenCalledWith(expect.stringContaining('complete'), 'success');
  });
});
