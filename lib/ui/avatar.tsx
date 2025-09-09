import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { DEFAULT_PROFILE_URL } from '@/app/constraint';

export default function Avatar({
  src,
  name,
  className,
}: {
  src?: string;
  name?: string;
  className?: string;
}) {
  return (
    <Image
      src={src ? src : `${DEFAULT_PROFILE_URL}=?name=${name}`}
      alt={name || 'Avatar'}
      width={1000}
      height={1000}
      className={cn('size-8 rounded-full border', className)}
    />
  );
}
