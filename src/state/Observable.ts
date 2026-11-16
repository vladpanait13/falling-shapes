export type Listener<T> = (value: T) => void;

// Minimal Observer-pattern value holder
export class Observable<T> {
  private readonly listeners = new Set<Listener<T>>();

  constructor(private current: T) {}

  get value(): T {
    return this.current;
  }

  set(next: T): void {
    if (next === this.current) return;
    this.current = next;
    this.listeners.forEach((l) => l(next));
  }

  // Calls the listener immediately and on every change. Returns an unsubscribe fn
  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    listener(this.current);
    return () => this.listeners.delete(listener);
  }
}
