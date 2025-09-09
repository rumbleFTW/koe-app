import * as React from 'react';
import { cn } from '@/lib/utils';
import { ButtonProps } from './button';

const IconButton: React.FC<
  ButtonProps & {
    Icon: React.ReactNode;
    hoverIcon?: React.ReactNode;
  }
> = ({ Icon, hoverIcon, className, ...props }) => {
  return (
    <button
      className={cn(
        'border-on group relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-gray-100 p-1 text-gray-600 transition-all duration-300 hover:bg-gray-200 hover:text-black',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          `${hoverIcon ? 'transition-transform duration-200 group-hover:translate-y-12 group-hover:opacity-0' : ''}`,
        )}
      >
        {Icon}
      </div>

      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100',
        )}
      >
        {hoverIcon}
      </div>
    </button>
  );
};

export default IconButton;
