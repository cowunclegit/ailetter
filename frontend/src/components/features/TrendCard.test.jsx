import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TrendCard from './TrendCard';

describe('TrendCard', () => {
  const mockProps = {
    title: 'AI Trend 1',
    summary: 'Summary of trend',
    source: 'TechCrunch',
    date: '2026-01-13',
    isSelected: false,
    onToggle: jest.fn(),
    status: 'available'
  };

  it('renders trend details', () => {
    render(<TrendCard {...mockProps} />);
    expect(screen.getByText('AI Trend 1')).toBeInTheDocument();
    expect(screen.getByText('Summary of trend')).toBeInTheDocument();
    expect(screen.getByText(/TechCrunch/)).toBeInTheDocument();
  });

  it('calls onToggle when clicked', () => {
    render(<TrendCard {...mockProps} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockProps.onToggle).toHaveBeenCalled();
  });

  it('shows "발송완료" indicator if status is sent', () => {
    render(<TrendCard {...mockProps} status="sent" isDuplicate={true} />);
    expect(screen.getByText('발송완료')).toBeInTheDocument();
  });

  it('shows "작성 중" indicator if status is draft', () => {
    render(<TrendCard {...mockProps} status="draft" />);
    expect(screen.getByText('작성 중')).toBeInTheDocument();
  });

  it('does not show AI selected badge (removed feature)', () => {
    render(<TrendCard {...mockProps} />);
    expect(screen.queryByText('AI Selected')).not.toBeInTheDocument();
  });

  it('renders YouTube icon when sourceType is youtube', () => {
    render(<TrendCard {...mockProps} sourceType="youtube" />);
    expect(screen.getByTestId('YouTubeIcon')).toBeInTheDocument();
  });

  it('renders thumbnail when thumbnailUrl is provided', () => {
    const thumbnailUrl = 'https://example.com/thumb.jpg';
    render(<TrendCard {...mockProps} thumbnailUrl={thumbnailUrl} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', thumbnailUrl);
  });

  it('renders title as a link with correct href', () => {
    const originalUrl = 'https://example.com/article';
    render(<TrendCard {...mockProps} originalUrl={originalUrl} />);
    const link = screen.getByRole('link', { name: mockProps.title });
    expect(link).toHaveAttribute('href', originalUrl);
    expect(link).toHaveAttribute('target', '_blank');
  });
});