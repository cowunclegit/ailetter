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
    render(<TemplateGrid templates={mockTemplates} selectedId="t1" onSelect={() => {}} />);
    // Check for MUI primary color class which indicates selection in Chip
    const selectedChip = screen.getByText('Template 1').closest('.MuiChip-root');
    expect(selectedChip).toHaveClass('MuiChip-colorPrimary');
    
    const unselectedChip = screen.getByText('Template 2').closest('.MuiChip-root');
    expect(unselectedChip).not.toHaveClass('MuiChip-colorPrimary');
  });
});
