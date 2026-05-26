import { clsx } from 'clsx';
import { tailwindMerge } from 'tailwind-merge';

export const cn = (classes: string[]) => {
  return tailwindMerge(...classes);
};