interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export default function LoadingSpinner({ size = 'medium', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className={`spinner ${sizeClasses[size]}`} aria-hidden="true"></div>
      {message && <p className="loading-message">{message}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
