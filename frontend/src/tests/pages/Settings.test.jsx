import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from '../../../pages/Settings';
import { FeedbackContext } from '../../../contexts/FeedbackContext';
import { aiPresetsApi } from '../../../api/aiPresetsApi';
import '@testing-library/jest-dom';

jest.mock('../../../api/aiPresetsApi');

const mockShowFeedback = jest.fn();

const renderWithContext = (ui) => {
  return render(
    <FeedbackContext.Provider value={{ showFeedback: mockShowFeedback }}>
      {ui}
    </FeedbackContext.Provider>
  );
};

describe('Settings Page', () => {
  const mockPresets = [
    { id: 1, name: 'Preset 1', prompt_template: 'Template 1', is_default: 1 },
    { id: 2, name: 'Preset 2', prompt_template: 'Template 2', is_default: 0 }
  ];

  beforeEach(() => {
    aiPresetsApi.getAll.mockResolvedValue(mockPresets);
  });

  it('renders presets list', async () => {
    renderWithContext(<Settings />);
    await waitFor(() => {
      expect(screen.getByText('Preset 1')).toBeInTheDocument();
      expect(screen.getByText('Preset 2')).toBeInTheDocument();
    });
  });

  it('handles preset deletion', async () => {
    window.confirm = jest.fn().mockReturnValue(true);
    aiPresetsApi.delete.mockResolvedValue({ success: true });
    
    renderWithContext(<Settings />);
    await waitFor(() => screen.getByText('Preset 2'));
    
    // Find delete button for Preset 2 (non-default)
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    // Default preset delete button is disabled, so Preset 2 button should be the enabled one or we target by index.
    // In our implementation, default delete button is disabled.
    fireEvent.click(deleteButtons[1]); 
    
    expect(aiPresetsApi.delete).toHaveBeenCalledWith(2);
  });
});
