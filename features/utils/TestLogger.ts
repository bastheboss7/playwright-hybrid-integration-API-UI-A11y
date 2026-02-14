/**
 * TestLogger - Structured logging utility for page objects
 * 
 * Provides consistent logging across all page objects with configurable verbosity.
 * Supports info, debug, warn, and error levels with visual indicators.
 */
export class TestLogger {
  constructor(private className: string) {}

  info(message: string): void {
    console.log(`[${this.className}] ℹ️  ${message}`);
  }

  debug(message: string): void {
    if (process.env.DEBUG || process.env.VERBOSE) {
      console.log(`[${this.className}] 🔍 ${message}`);
    }
  }

  warn(message: string): void {
    console.warn(`[${this.className}] ⚠️  ${message}`);
  }

  error(message: string): void {
    console.error(`[${this.className}] ❌ ${message}`);
  }

  success(message: string): void {
    console.log(`[${this.className}] ✅ ${message}`);
  }

  step(message: string): void {
    console.log(`[${this.className}] 📍 ${message}`);
  }
}

export default TestLogger;
