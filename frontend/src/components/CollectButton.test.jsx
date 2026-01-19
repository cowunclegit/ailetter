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

// Mock the API service
jest.mock('../api/trendsApi', () => ({
  trendsApi: {
    triggerCollection: jest.fn(),
    getCollectionStatus: jest.fn(),
  }
}));

describe('CollectButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<CollectButton />);
    expect(screen.getByText(/collect now/i)).toBeInTheDocument();
  });

  it('triggers collection on click and shows loading state', async () => {
    // Mock successful start
    trendsApi.triggerCollection.mockResolvedValue({ status: 'started' });
    // Mock status checking to be true initially
    trendsApi.getCollectionStatus.mockResolvedValue({ isCollecting: true });

    render(<CollectButton />);
    
    const button = screen.getByRole('button', { name: /collect now/i });
    
    await act(async () => {
        fireEvent.click(button);
    });

    // Should call API
    expect(trendsApi.triggerCollection).toHaveBeenCalled();
    
    // Should show loading spinner or text
    await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
    
    // Button should be disabled
    expect(button).toBeDisabled();
  });

  it('handles API failure', async () => {
     trendsApi.triggerCollection.mockRejectedValue(new Error('Network Error'));
     const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

     render(<CollectButton />);
     const button = screen.getByRole('button', { name: /collect now/i });
     
     await act(async () => {
         fireEvent.click(button);
     });

     await waitFor(() => {
         expect(trendsApi.triggerCollection).toHaveBeenCalled();
     });
     
     // Verify feedback
     expect(mockShowFeedback).toHaveBeenCalledWith(expect.stringContaining('Failed'), 'error');
     
     // Should revert to enabled (loading stops)
     await waitFor(() => {
        expect(button).not.toBeDisabled();
     });
     
     consoleSpy.mockRestore();
  });

  it('polls status and calls onComplete when finished', async () => {
    jest.useFakeTimers();
    const onComplete = jest.fn();
    
    trendsApi.triggerCollection.mockResolvedValue({ status: 'started' });
    trendsApi.getCollectionStatus
        .mockResolvedValueOnce({ isCollecting: true })
        .mockResolvedValueOnce({ isCollecting: false });

    render(<CollectButton onComplete={onComplete} />);
    
    const button = screen.getByRole('button', { name: /collect now/i });
    
    await act(async () => {
        fireEvent.click(button);
    });
    
    // Flush promises to let setIsPolling(true) happen
    await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
    });

    expect(trendsApi.triggerCollection).toHaveBeenCalled();
    
    // Advance time for first poll
    await act(async () => {
        jest.advanceTimersByTime(2000);
    });
    
    expect(trendsApi.getCollectionStatus).toHaveBeenCalled();

    // Advance again for completion
    await act(async () => {
        jest.advanceTimersByTime(2000);
    });
    
    // Wait for effect updates
    await waitFor(() => {
        expect(onComplete).toHaveBeenCalled();
    });
    
    expect(button).not.toBeDisabled();
    
    jest.useRealTimers();
  });
});
