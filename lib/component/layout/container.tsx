'use client';

import { cn } from '@/lib/utils';
import { motion, MotionProps } from 'framer-motion';
import React, { ComponentPropsWithoutRef, ReactNode } from 'react';
import Header from '../header';
import Loader from '../loader';
import NotFounder from '../notfounder';


export default function Container({
  children,
  className,
  currentPage,
  back = false,
  HeaderRightContent = null,
  headerClassName,
  empty = false,
  loading = false,
  emptyText,
  ...props
}: {
  children: ReactNode;
  className?: string;
  currentPage?: string;
  empty?: boolean;
  emptyText?: string;
  loading?: boolean;
  back?: boolean;
  HeaderRightContent?: ReactNode;
  headerClassName?: string;
} & ComponentPropsWithoutRef<'main'> &
  MotionProps) {
  return (
    <motion.main
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8 }}
      className={cn(
        `flex h-full min-h-screen w-full flex-1 flex-col items-center justify-start px-4 py-2 sm:px-6 sm:py-4 md:px-8 md:py-6 lg:px-10 lg:py-8 ${className}`,
      )}
      {...props}
    >
      {currentPage && (
        <>
          <Header
            currentPage={currentPage}
            back={back}
            rightContent={HeaderRightContent}
            className={`absolute top-0 mb-0 ${headerClassName}`}
          />
          <div className="h-8" />
        </>
      )}

      {children}
      {loading && <Loader />}
      {empty && <NotFounder>{emptyText}</NotFounder>}
    </motion.main>
  );
}
