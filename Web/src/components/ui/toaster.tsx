'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import type { ToasterToast } from '@/hooks/use-toast';

function ToasterContent(): JSX.Element {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }: ToasterToast) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

/**
 * Toaster component that displays all active toast notifications.
 *
 * This component renders all currently active toasts in a designated viewport.
 * It should be placed at the root level of the application to ensure toasts
 * can be displayed from anywhere in the component tree.
 *
 * The toaster automatically handles:
 * - Toast positioning and stacking
 * - Auto-dismissal after the configured timeout
 * - Manual dismissal via close button
 * - Toast animations and transitions
 *
 * Note: ToastStateProvider must be wrapping this component at a higher level
 * in the component tree (typically in Providers.tsx).
 *
 * @returns JSX element containing the toast provider and viewport with all active toasts
 */
export const Toaster = ToasterContent;
