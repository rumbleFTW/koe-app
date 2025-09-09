'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { BsArrowLeft } from 'react-icons/bs';
import { H4 } from '../ui';

interface HeaderProps {
  currentPage?: string;
  className?: string;
  back?: boolean;
  rightContent?: ReactNode;
}

export default function Header({
  currentPage,
  className = '',
  back = false,
  rightContent = null,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header
      className={`mb-4 flex w-full items-center justify-between border-y-[1px] bg-white px-3 py-1 md:px-10 ${className}`}
    >
      <div className="flex w-1/5 justify-start">
        {back && (
          <BsArrowLeft
            className="-100 size-8 cursor-pointer rounded-lg bg-orange-100 p-1.5 hover:bg-orange-200"
            onClick={() => router.back()}
          />
        )}
      </div>

      <H4 className="truncate text-center">{currentPage}</H4>

      <div className="flex w-1/5 justify-end">{rightContent}</div>
    </header>
  );
}
