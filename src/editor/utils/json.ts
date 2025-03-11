export function safeJSONStringify<T>(value: T, defaultValue: string, onError?: (error: unknown) => void): string {
  try {
    return JSON.stringify(value) ?? defaultValue
  } catch (e) {
    onError?.(e)
    return defaultValue
  }
}
