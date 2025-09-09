'use client';

import { cn } from '@/lib/utils';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import React, { useCallback, useState } from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassname?: string;
  label?: string;
  error?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassname, type, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const toggleIsPasswordVisible = useCallback(
      () => setIsPasswordVisible(!isPasswordVisible),
      [isPasswordVisible, setIsPasswordVisible],
    );

    return (
      <div className={`my-4 ${containerClassname}`}>
        {props.label && (
          <label
            htmlFor={props.id}
            className="mb-1 block text-base font-medium text-gray-500"
          >
            {props.label}
          </label>
        )}
        <div className="relative flex">
          <input
            type={isPasswordVisible ? 'text' : type}
            className={cn(
              'sm:text-md h-10 w-full rounded-lg border border-gray-300 bg-gray-100 p-2 font-normal text-gray-900 placeholder-gray-400 placeholder:text-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500',
              props.error &&
                'border-red-500 focus:border-red-500 focus:ring-red-500',
              className,
            )}
            ref={ref}
            {...props}
          />

          <div className="group">
            {props.error && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex flex-none items-center px-2.5">
                <AlertCircle
                  className={cn(
                    'size-5 text-white',
                    type === 'password' &&
                      'transition-opacity group-hover:opacity-0',
                  )}
                  fill="#ef4444"
                />
              </div>
            )}
            {type === 'password' && (
              <button
                className={cn(
                  'absolute inset-y-0 right-0 flex items-center px-3',
                  props.error &&
                    'opacity-0 transition-opacity group-hover:opacity-100',
                )}
                type="button"
                onClick={() => toggleIsPasswordVisible()}
                aria-label={
                  isPasswordVisible ? 'Hide password' : 'Show Password'
                }
              >
                {isPasswordVisible ? (
                  <Eye
                    className="size-4 flex-none text-gray-500 transition hover:text-gray-700"
                    aria-hidden
                  />
                ) : (
                  <EyeOff
                    className="size-4 flex-none text-gray-500 transition hover:text-gray-700"
                    aria-hidden
                  />
                )}
              </button>
            )}
          </div>
        </div>

        {props.error && (
          <span
            className="mt-2 block text-sm text-red-500"
            role="alert"
            aria-live="assertive"
          >
            {props.error}
          </span>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';

export { TextInput };
