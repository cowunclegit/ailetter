import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TemplateGrid from '../../components/features/TemplateGrid';
import '@testing-library/jest-dom';

const mockTemplates = [
  { id: 't1', name: 'Template 1', thumbnail_url: '/t1.png' },
  { id: 't2', name: 'Template 2', thumbnail_url: '/t2.png' }
];

describe('TemplateGrid', () => {
  it('renders all templates provided', () => {
    render(<TemplateGrid templates={mockTemplates} selectedId="t1" onSelect={() => {}} />);
    expect(screen.getByText('Template 1')).toBeInTheDocument();
    expect(screen.getByText('Template 2')).toBeInTheDocument();
  });

  it('calls onSelect when a template is clicked', () => {
    const onSelect = jest.fn();
    render(<TemplateGrid templates={mockTemplates} selectedId="t1" onSelect={onSelect} />);
    
    fireEvent.click(screen.getByText('Template 2'));
    expect(onSelect).toHaveBeenCalledWith('t2');
  });

  it('highlights the selected template', () => {
    const { container } = render(<TemplateGrid templates={mockTemplates} selectedId="t1" onSelect={() => {}} />);
    // Check for border or some indication of selection
    // Since we use MUI, we can check for the presence of the check icon
    expect(container.querySelector('svg[data-testid="CheckCircleIcon"]')).toBeInTheDocument();
  });
});
