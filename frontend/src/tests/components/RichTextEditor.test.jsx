import React from 'react';
import { render, screen } from '@testing-library/react';
import RichTextEditor from '../../components/features/RichTextEditor';
import '@testing-library/jest-dom';

// Mock react-quill-new as it might be hard to test in JSDOM
jest.mock('react-quill-new', () => {
  return function MockReactQuill({ value, onChange }) {
    return (
      <textarea
        data-testid="mock-quill"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
});

describe('RichTextEditor', () => {
  it('renders with label', () => {
    render(<RichTextEditor label="Test Editor" value="" onChange={() => {}} />);
    expect(screen.getByText('Test Editor')).toBeInTheDocument();
  });

  it('renders with initial value', () => {
    render(<RichTextEditor label="Test Editor" value="<p>Hello</p>" onChange={() => {}} />);
    const editor = screen.getByTestId('mock-quill');
    expect(editor.value).toBe('<p>Hello</p>');
  });
});
