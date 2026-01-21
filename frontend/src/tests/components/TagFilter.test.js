import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TagFilter from '../../components/features/TagFilter';
import '@testing-library/jest-dom';

const mockCategories = [
  { id: 1, name: 'AI' },
  { id: 2, name: 'Tech' }
];

describe('TagFilter', () => {
  it('renders correctly', () => {
    render(<TagFilter categories={mockCategories} selectedIds={[]} onChange={() => {}} />);
    expect(screen.getByLabelText('Filter by Category')).toBeInTheDocument();
  });

  it('displays selected chips', () => {
    render(<TagFilter categories={mockCategories} selectedIds={[1]} onChange={() => {}} />);
    expect(screen.getByText('AI')).toBeInTheDocument();
  });
});
