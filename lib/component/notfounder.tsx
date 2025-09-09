import React from 'react';
import { cn } from '@/lib/utils';
import { P2 } from '../ui';

export default function NotFounder({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <P2
      className={cn(`flex h-[80vh] items-center justify-center ${className}`)}
    >
      {children || 'Not Found'}
    </P2>
  );
}
