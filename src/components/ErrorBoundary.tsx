'use client';

import { Component, ReactNode, ErrorInfo } from 'react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('React Error Boundary caught error', {
      error: error.message,
      componentStack: errorInfo.componentStack
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary" role="alert">
          <h2>Something went wrong</h2>
          <p>We apologize for the inconvenience. Please refresh the page to try again.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="back-button"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
