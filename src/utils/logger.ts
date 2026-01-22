/**
 * Logging utility for the extension
 * Provides structured logging with levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_PREFIX = '[CRABE]';

class Logger {
  private enabled: boolean;

  constructor() {
    // Enable logging by default (can be configured via extension settings in the future)
    this.enabled = true;
  }

  private log(level: LogLevel, context: string, message: string, ...args: unknown[]): void {
    if (!this.enabled && level === 'debug') {
      return;
    }

    const prefix = `${LOG_PREFIX}[${context}]`;

    switch (level) {
      case 'debug':
        console.log(`${prefix} ${message}`, ...args);
        break;
      case 'info':
        console.info(`${prefix} ${message}`, ...args);
        break;
      case 'warn':
        console.warn(`${prefix} ${message}`, ...args);
        break;
      case 'error':
        console.error(`${prefix} ${message}`, ...args);
        break;
    }
  }

  debug(context: string, message: string, ...args: unknown[]): void {
    this.log('debug', context, message, ...args);
  }

  info(context: string, message: string, ...args: unknown[]): void {
    this.log('info', context, message, ...args);
  }

  warn(context: string, message: string, ...args: unknown[]): void {
    this.log('warn', context, message, ...args);
  }

  error(context: string, message: string, ...args: unknown[]): void {
    this.log('error', context, message, ...args);
  }
}

export const logger = new Logger();
