
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WishlistGenerator from '../WishlistGenerator';

describe('WishlistGenerator', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn();
  });

  it('shows error when role keywords are empty', async () => {
    render(<WishlistGenerator />);
    
    const input = screen.getByLabelText(/role keywords/i);
    const button = screen.getByText(/generate wishlist/i);
    
    // Clear input and submit
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter at least one role keyword/i)).toBeInTheDocument();
    });
  });

  it('generates wishlist successfully', async () => {
    // Mock successful API responses
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          total: 2,
          companies: [
            { id: '1', name: 'Company A', /* ... */ },
            { id: '2', name: 'Company B', /* ... */ }
          ]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          results: []
        })
      });

    render(<WishlistGenerator />);
    
    const button = screen.getByText(/generate wishlist/i);
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/successfully generated wishlist with 2 companies/i)).toBeInTheDocument();
    });
  });

  it('handles jobs fetch failure gracefully', async () => {
    // Mock wishlist success, jobs failure
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          total: 1,
          companies: [{ id: '1', name: 'Test Co', /* ... */ }]
        })
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false })
      });

    render(<WishlistGenerator />);
    
    const button = screen.getByText(/generate wishlist/i);
    fireEvent.click(button);
    
    await waitFor(() => {
      // Should still show success
      expect(screen.getByText(/successfully generated/i)).toBeInTheDocument();
      // Should NOT show error
      expect(screen.queryByText(/failed to generate/i)).not.toBeInTheDocument();
    });
  });
});