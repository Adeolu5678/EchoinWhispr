import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class values into a single class string and resolves conflicting Tailwind CSS classes.
 *
 * @param inputs - One or more class values (strings, arrays, objects, etc.) to be joined
 * @returns The resulting normalized class string with Tailwind class conflicts merged
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
