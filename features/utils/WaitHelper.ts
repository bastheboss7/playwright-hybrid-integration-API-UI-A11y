export class WaitHelper {
  /**
   * Polls a condition until it returns true or times out.
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    timeoutMs: number = 5000,
    pollIntervalMs: number = 100
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
