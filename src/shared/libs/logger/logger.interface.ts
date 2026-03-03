export interface Logger {
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, err: Error, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}
