import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SourceForm from './SourceForm';

// Mock categoriesApi
jest.mock('../api/categoriesApi', () => ({
  categoriesApi: {
    getAll: jest.fn().mockResolvedValue([])
  }
}));

describe('SourceForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form inputs', () => {
    render(<SourceForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/URL/i)).toBeInTheDocument();
  });

  it('calls onSubmit when submitted with valid data', async () => {
    render(<SourceForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Source' } });
    fireEvent.change(screen.getByLabelText(/URL/i), { target: { value: 'https://example.com/rss' } });
    
    fireEvent.click(screen.getByText(/Add Source/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'New Source',
        url: 'https://example.com/rss',
        type: 'rss',
        categoryIds: []
      });
    });
  });
});