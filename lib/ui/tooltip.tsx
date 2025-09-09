'use client';

import { cn } from '@/lib/utils';
import { Tooltip } from 'radix-ui';

export default function Tooltiper({
  children,
  content,
  className,
  side = 'top',
  align = 'center',
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild className="cursor-pointer break-words">
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={cn(
              'bg-gray border-on text-violet11 data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade z-50 m-1 max-w-96 select-none rounded-lg px-4 py-1 text-xs leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]',
              className,
            )}
            sideOffset={5}
            side={side}
            align={align}
          >
            {content}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
