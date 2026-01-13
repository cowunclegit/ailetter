import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SourceForm from './SourceForm';

describe('SourceForm', () => {
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form inputs', () => {
    render(<SourceForm onAdd={mockOnAdd} />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/URL/i)).toBeInTheDocument();
  });

  it('calls onAdd when submitted with valid data', async () => {
    render(<SourceForm onAdd={mockOnAdd} />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Source' } });
    fireEvent.change(screen.getByLabelText(/URL/i), { target: { value: 'https://example.com/rss' } });
    
    // Select type (might need to target MUI select specifically, but let's assume standard select for now or try basics)
    // If it's MUI select, it's harder to test with standard fireEvent. 
    // Assuming default is RSS, so we don't need to change it for this test.
    
    fireEvent.click(screen.getByText(/Add Source/i)); // Button text

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith({
        name: 'New Source',
        url: 'https://example.com/rss',
        type: 'rss' // default
      });
    });
  });

  // Validation test (if we implement client-side validation)
});
