import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import PlanDisplay from '../PlanDisplay';
import { EventPlan } from '@/schemas/planSchemas';

expect.extend(toHaveNoViolations);

const mockPlan: EventPlan = {
  planId: 'test-123',
  eventSummary: 'Test event summary',
  budgetBreakdown: [
    {
      category: 'Venue',
      description: 'Event venue',
      estimatedCost: 100000,
      priority: 'high'
    }
  ],
  timeline: [
    {
      daysBeforeEvent: 30,
      task: 'Book venue',
      description: 'Confirm venue booking',
      responsible: 'Organizer'
    }
  ],
  vendorChecklist: [
    {
      category: 'Catering',
      type: 'Full service catering',
      estimatedCost: '₹50,000',
      whenToBook: '45 days before',
      tips: 'Request tasting'
    }
  ],
  personalizedIdeas: [
    {
      title: 'Theme decoration',
      description: 'Custom theme based decoration',
      category: 'Decoration'
    }
  ],
  tips: ['Set aside 10% for contingency', 'Get everything in writing']
};

describe('PlanDisplay', () => {
  it('should render plan summary', () => {
    render(<PlanDisplay plan={mockPlan} language="en" />);
    expect(screen.getByText('Test event summary')).toBeInTheDocument();
  });

  it('should render all tabs', () => {
    render(<PlanDisplay plan={mockPlan} language="en" />);

    expect(screen.getByRole('tab', { name: /budget breakdown/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /timeline/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /vendor checklist/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /personalized ideas/i })).toBeInTheDocument();
  });

  it('should switch tabs on click', () => {
    render(<PlanDisplay plan={mockPlan} language="en" />);

    const timelineTab = screen.getByRole('tab', { name: /timeline/i });
    fireEvent.click(timelineTab);

    expect(screen.getByText('Book venue')).toBeInTheDocument();
  });

  it('should display budget items with priority', () => {
    render(<PlanDisplay plan={mockPlan} language="en" />);

    expect(screen.getByText('Venue')).toBeInTheDocument();
    expect(screen.getByText('High Priority')).toBeInTheDocument();
    expect(screen.getByText('₹1,00,000')).toBeInTheDocument();
  });

  it('should display timeline with T-minus format', () => {
    render(<PlanDisplay plan={mockPlan} language="en" />);

    fireEvent.click(screen.getByRole('tab', { name: /timeline/i }));
    expect(screen.getByText('T-30')).toBeInTheDocument();
  });

  it('should display vendor checklist', () => {
    render(<PlanDisplay plan={mockPlan} language="en" />);

    fireEvent.click(screen.getByRole('tab', { name: /vendor/i }));
    expect(screen.getByText('Catering')).toBeInTheDocument();
    expect(screen.getByText('Request tasting')).toBeInTheDocument();
  });

  it('should display personalized ideas and tips', () => {
    render(<PlanDisplay plan={mockPlan} language="en" />);

    fireEvent.click(screen.getByRole('tab', { name: /ideas/i }));
    expect(screen.getByText('Theme decoration')).toBeInTheDocument();
    expect(screen.getByText('Set aside 10% for contingency')).toBeInTheDocument();
  });

  it('should have keyboard navigation for tabs', () => {
    render(<PlanDisplay plan={mockPlan} language="en" />);

    const timelineTab = screen.getByRole('tab', { name: /timeline/i });
    fireEvent.keyDown(timelineTab, { key: 'Enter' });

    expect(timelineTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should have aria-live region for chat', () => {
    render(<PlanDisplay plan={mockPlan} language="en" />);

    const chatLog = screen.getByRole('log');
    expect(chatLog).toHaveAttribute('aria-live', 'polite');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<PlanDisplay plan={mockPlan} language="en" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
