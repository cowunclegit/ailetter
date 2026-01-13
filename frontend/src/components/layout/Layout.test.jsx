import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';

describe('Layout', () => {
  it('renders navigation links and content', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Child Content</div>
        </Layout>
      </BrowserRouter>
    );

    expect(screen.getByText('AILetter')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});
