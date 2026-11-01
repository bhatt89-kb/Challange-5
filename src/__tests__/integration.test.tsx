import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';

// Mock fetch
global.fetch = vi.fn();

describe('Integration: Event Planner Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete full event planning flow', async () => {
    const mockPlan = {
      success: true,
      data: {
        planId: 'test-123',
        eventSummary: 'Beautiful wedding celebration in Mumbai',
        budgetBreakdown: [
          {
            category: 'Venue',
            description: 'Beautiful banquet hall',
            estimatedCost: 250000,
            priority: 'high' as const
          }
        ],
        timeline: [
          {
            daysBeforeEvent: 90,
            task: 'Start Planning',
            description: 'Initial preparations',
            responsible: 'You'
          }
        ],
        vendorChecklist: [
          {
            category: 'Venue',
            type: 'Banquet Hall',
            estimatedCost: '₹2,50,000',
            whenToBook: '90 days before',
            tips: 'Visit in person'
          }
        ],
        personalizedIdeas: [
          {
            title: 'Themed Decoration',
            description: 'Royal theme with gold accents',
            category: 'Decoration'
          }
        ],
        tips: ['Book early', 'Compare prices', 'Read reviews']
      }
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockPlan
    } as Response);

    render(<Home />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/event name/i), {
      target: { value: 'Raj & Priya Wedding' }
    });

    fireEvent.change(screen.getByLabelText(/event date/i), {
      target: { value: '2024-12-31' }
    });

    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Mumbai' }
    });

    fireEvent.change(screen.getByLabelText(/budget/i), {
      target: { value: '1000000' }
    });

    fireEvent.change(screen.getByLabelText(/number of guests/i), {
      target: { value: '200' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /generate plan/i }));

    // Wait for plan to be displayed
    await waitFor(() => {
      expect(screen.getByText(/your event plan/i)).toBeInTheDocument();
    });

    // Verify plan content is displayed
    expect(screen.getByText('Beautiful wedding celebration in Mumbai')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /budget breakdown/i })).toBeInTheDocument();
    
    // Switch to timeline tab
    fireEvent.click(screen.getByRole('tab', { name: /timeline/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Start Planning')).toBeInTheDocument();
    });

    // Go back to create new plan
    fireEvent.click(screen.getByRole('button', { name: /new plan/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /generate plan/i })).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Server error' })
    } as Response);

    render(<Home />);

    fireEvent.change(screen.getByLabelText(/event name/i), {
      target: { value: 'Test Event' }
    });

    fireEvent.change(screen.getByLabelText(/event date/i), {
      target: { value: '2024-12-31' }
    });

    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Delhi' }
    });

    fireEvent.change(screen.getByLabelText(/budget/i), {
      target: { value: '50000' }
    });

    fireEvent.change(screen.getByLabelText(/number of guests/i), {
      target: { value: '50' }
    });

    fireEvent.click(screen.getByRole('button', { name: /generate plan/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('should support language switching', async () => {
    render(<Home />);

    // Check initial language
    expect(screen.getByText('GenAI Event Planner')).toBeInTheDocument();

    // Switch to Hindi
    const languageToggle = screen.getByRole('button', { name: /switch to hindi/i });
    fireEvent.click(languageToggle);

    await waitFor(() => {
      expect(screen.getByText(/जेनएआई इवेंट प्लानर/i)).toBeInTheDocument();
    });

    // Switch back to English
    const hindiToggle = screen.getByRole('button', { name: /switch to english/i });
    fireEvent.click(hindiToggle);

    await waitFor(() => {
      expect(screen.getByText('GenAI Event Planner')).toBeInTheDocument();
    });
  });
});
