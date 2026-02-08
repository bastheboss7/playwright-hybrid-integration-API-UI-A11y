export class WaitHelper {
  static readonly DEFAULT_TIMEOUT_MS = 5000;
  static readonly DEFAULT_POLL_INTERVAL_MS = 100;
  static readonly SHORT_TIMEOUT_MS = 3000;
  static readonly LONG_TIMEOUT_MS = 10000;
  static readonly SLOW_POLL_INTERVAL_MS = 150;
  static readonly RETRY_DELAY_MS = 500;

  /**
   * Polls a condition until it returns true or times out.
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    timeoutMs: number = WaitHelper.DEFAULT_TIMEOUT_MS,
    pollIntervalMs: number = WaitHelper.DEFAULT_POLL_INTERVAL_MS
  ): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (await condition()) return;
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }
    throw new Error(`Condition not met within ${timeoutMs}ms`);
  }

  /**
   * Retries an async operation up to maxRetries times.
   */
  static async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  }
}
