'use client';

import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
type TextType = 'h1' | 'h2' | 'h3' | 'p1' | 'h4' | 'h5' | 'p2' | 'p3' | 'span';

export interface TextProps<E extends TextType = 'p1'>
  extends React.HTMLProps<HTMLElement> {
  children: React.ReactNode;
  color?: 'white' | 'black' | 'gradient';
  className?: string;
  type?: E;
  animationType?:
    | 'fadeIn'
    | 'slideRight'
    | 'slideLeft'
    | 'slideUp'
    | 'slideIn'
    | 'blurFade'
    | 'none';
  motionProps?: MotionProps;
  id?: string;
}

const typeClassname = {
  h1: 'font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl my-2 text-color break-words',
  h2: 'font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl my-2 text-color break-words',
  h3: 'font-bold text-xl sm:text-2xl md:text-2xl lg:text-3xl my-1 text-color break-words',
  p1: 'font-base text-lg sm:text-lg md:text-lg lg:text-xl my-1 text-gray-400 break-words',
  h4: 'font-semibold text-base sm:text-base  md:text-lg lg:text-xl my-1 text-color break-words',
  h5: 'font-semibold text-xs sm:text-xs md:text-sm lg:text-sm text-color break-words',
  p2: 'font-light text-sm sm:text-sm md:text-base lg:text-base my-1 text-gray-400 break-words',
  p3: 'font-base text-xs sm:text-xs lg:text-sm my-1 text-gray-400 break-words',
  span: 'font-bold text-base sm:text-sm lg:text-base  my-1 text-color break-words',
};

const colorClassname = {
  white: 'text-white',
  black: 'text-black',
  gradient: 'text-gradient',
};

const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { duration: 0.7 },
  },
  slideIn: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.7 },
    viewport: { once: true },
  },
  slideUp: {
    initial: { y: 50, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    transition: { duration: 0.7 },
    viewport: { once: true },
  },
  slideLeft: {
    initial: { opacity: 0, x: '-100%' },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.7 },
  },
  slideRight: {
    initial: { opacity: 0, x: '100%' },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.7 },
  },
  blurFade: {
    initial: { opacity: 0, filter: 'blur(8px)' },
    whileInView: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 0.7 },
  },
  none: {},
};

export const Text = <E extends TextType>({
  children,
  id,
  color,
  className = '',
  type = 'p' as E,
  animationType = 'none',
  motionProps = {},
}: TextProps<E>) => {
  const appliedColor =
    colorClassname[color as keyof typeof colorClassname] || color || '';
  const animation = animationVariants[animationType];

  const Motion =
    type === 'h1'
      ? motion.h1
      : type === 'h2'
        ? motion.h2
        : type === 'h3'
          ? motion.h3
          : type === 'h4'
            ? motion.h4
            : type === 'h5'
              ? motion.h5
              : type === 'span'
                ? motion.span
                : motion.p;

  return (
    <Motion
      id={id}
      className={cn(typeClassname[type], appliedColor, className)}
      {...animation}
      {...motionProps}
    >
      {children}
    </Motion>
  );
};

export const H1 = (props: Omit<TextProps<'h1'>, 'type'>) => (
  <Text {...props} type="h1" />
);
export const H2 = (props: Omit<TextProps<'h2'>, 'type'>) => (
  <Text {...props} type="h2" />
);
export const H3 = (props: Omit<TextProps<'h3'>, 'type'>) => (
  <Text {...props} type="h3" />
);
export const H4 = (props: Omit<TextProps<'h4'>, 'type'>) => (
  <Text {...props} type="h4" />
);

export const H5 = (props: Omit<TextProps<'h5'>, 'type'>) => (
  <Text {...props} type="h5" />
);
export const P1 = (props: Omit<TextProps<'p1'>, 'type'>) => (
  <Text {...props} type="p1" />
);
export const P2 = (props: Omit<TextProps<'p2'>, 'type'>) => (
  <Text {...props} type="p2" />
);
export const P3 = (props: Omit<TextProps<'p3'>, 'type'>) => (
  <Text {...props} type="p3" />
);
export const Span = (props: Omit<TextProps<'span'>, 'type'>) => (
  <Text {...props} type="span" />
);
