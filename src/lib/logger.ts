type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private formatLog(entry: LogEntry): string {
    return JSON.stringify(entry);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      metadata
    };
    console.log(this.formatLog(entry));
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      metadata
    };
    console.warn(this.formatLog(entry));
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      metadata
    };
    console.error(this.formatLog(entry));
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      const entry: LogEntry = {
        level: 'debug',
        message,
        timestamp: new Date().toISOString(),
        metadata
      };
      console.log(this.formatLog(entry));
    }
  }
}

export const logger = new Logger();
