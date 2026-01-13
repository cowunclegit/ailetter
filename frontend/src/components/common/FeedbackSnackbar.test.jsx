import React from 'react';
import { render, screen } from '@testing-library/react';
import FeedbackSnackbar from './FeedbackSnackbar';
import { FeedbackContext } from '../../contexts/FeedbackContext';

const mockContextValue = {
  snackbar: {
    open: true,
    message: 'Test message',
    severity: 'success',
  },
  closeFeedback: jest.fn(),
};

describe('FeedbackSnackbar', () => {
  it('renders the message when open', () => {
    render(
      <FeedbackContext.Provider value={mockContextValue}>
        <FeedbackSnackbar />
      </FeedbackContext.Provider>
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });
});
