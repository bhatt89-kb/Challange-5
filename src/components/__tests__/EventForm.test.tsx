import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import EventForm from '../EventForm';

expect.extend(toHaveNoViolations);

describe('EventForm', () => {
  const mockOnSubmit = vi.fn();

  it('should render form with all required fields', () => {
    render(<EventForm onSubmit={mockOnSubmit} language="en" isLoading={false} />);

    expect(screen.getByLabelText(/event type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
  });

  it('should show wedding-specific fields when wedding is selected', () => {
    render(<EventForm onSubmit={mockOnSubmit} language="en" isLoading={false} />);

    fireEvent.change(screen.getByLabelText(/event type/i), {
      target: { value: 'wedding' }
    });

    expect(screen.getByLabelText(/wedding style/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ceremonies/i)).toBeInTheDocument();
  });

  it('should show birthday-specific fields when birthday is selected', () => {
    render(<EventForm onSubmit={mockOnSubmit} language="en" isLoading={false} />);

    fireEvent.change(screen.getByLabelText(/event type/i), {
      target: { value: 'birthday' }
    });

    expect(screen.getByLabelText(/age group/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/theme/i)).toBeInTheDocument();
  });

  it('should show community-specific fields when community is selected', () => {
    render(<EventForm onSubmit={mockOnSubmit} language="en" isLoading={false} />);

    fireEvent.change(screen.getByLabelText(/event type/i), {
      target: { value: 'community' }
    });

    expect(screen.getByLabelText(/event category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/public event/i)).toBeInTheDocument();
  });

  it('should call onSubmit with correct data', async () => {
    render(<EventForm onSubmit={mockOnSubmit} language="en" isLoading={false} />);

    fireEvent.change(screen.getByLabelText(/event name/i), {
      target: { value: 'Test Wedding' }
    });
    fireEvent.change(screen.getByLabelText(/event date/i), {
      target: { value: '2024-12-31' }
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Mumbai' }
    });
    fireEvent.change(screen.getByLabelText(/budget/i), {
      target: { value: '500000' }
    });
    fireEvent.change(screen.getByLabelText(/number of guests/i), {
      target: { value: '100' }
    });
    fireEvent.change(screen.getByLabelText(/ceremonies/i), {
      target: { value: 'Mehendi, Sangeet' }
    });

    fireEvent.click(screen.getByRole('button', { name: /generate plan/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('should disable form when loading', () => {
    render(<EventForm onSubmit={mockOnSubmit} language="en" isLoading={true} />);

    expect(screen.getByLabelText(/event name/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /generating/i })).toBeDisabled();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <EventForm onSubmit={mockOnSubmit} language="en" isLoading={false} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render in Hindi', () => {
    render(<EventForm onSubmit={mockOnSubmit} language="hi" isLoading={false} />);

    expect(screen.getByText(/इवेंट का प्रकार/i)).toBeInTheDocument();
  });
});
