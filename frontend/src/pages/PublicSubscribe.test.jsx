import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Public from './Public';
import { FeedbackContext } from '../contexts/FeedbackContext';

jest.mock('axios');

const mockShowFeedback = jest.fn();
const mockContextValue = {
  showFeedback: mockShowFeedback,
};

describe('Public Subscribe Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders subscribe form', () => {
    render(
      <FeedbackContext.Provider value={mockContextValue}>
        <Public />
      </FeedbackContext.Provider>
    );

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subscribe/i })).toBeInTheDocument();
  });

  it('submits email and shows success feedback', async () => {
    axios.post.mockResolvedValueOnce({});

    render(
      <FeedbackContext.Provider value={mockContextValue}>
        <Public />
      </FeedbackContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Subscribe/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/subscribers', { email: 'test@example.com' });
      expect(mockShowFeedback).toHaveBeenCalledWith('Subscribed successfully!', 'success');
    });
  });

  it('shows error feedback on failure', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'Invalid email' } } });

    render(
      <FeedbackContext.Provider value={mockContextValue}>
        <Public />
      </FeedbackContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'invalid' } });
    fireEvent.click(screen.getByRole('button', { name: /Subscribe/i }));

    await waitFor(() => {
      expect(mockShowFeedback).toHaveBeenCalledWith('Invalid email', 'error');
    });
  });
});
