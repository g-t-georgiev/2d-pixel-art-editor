import type { ApplicationEventsMap } from "../types";

// Make the EventEmitter generic
export default class EventEmitter<Events extends Record<string, (...args: any[]) => any>> {
  // Internally, we use `keyof Events` and `Function` to avoid complex type gymnastics.
  // The public methods enforce the strict types.
  private events: Map<keyof Events, Set<Function>> = new Map();

  /**
   * Register new event listener.
   */
  on<K extends keyof Events>(eventName: K, callback: Events[K]): boolean {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }

    const callbacks = this.events.get(eventName)!;

    if (callbacks.has(callback)) return false;

    callbacks.add(callback);
    return true;
  }

  /**
   * Remove registered event listener.
   */
  off<K extends keyof Events>(eventName: K, callback?: Events[K]): boolean {
    if (!this.events.has(eventName)) return false;

    const callbacks = this.events.get(eventName)!;

    if (callback) return callbacks.delete(callback);

    callbacks.clear();
    return true;
  }

  /**
   * Emit an event.
   * `Parameters<Events[K]>` ensures you pass the exact arguments the callback expects.
   */
  emit<K extends keyof Events>(eventName: K, ...params: Parameters<Events[K]>): void {
    if (!this.events.has(eventName)) return;

    const callbacks = this.events.get(eventName);
    if (!callbacks) return;

    callbacks.forEach((cb) => cb(...params));
  }
}

export const GlobalEmitter = new EventEmitter<ApplicationEventsMap>();