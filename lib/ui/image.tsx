import NextImage, { ImageProps } from 'next/image';
import React from 'react';

const ImageHolder: React.FC<ImageProps> = ({
  src = '/imageplaceholder.svg',
  alt = 'Image',
  fill = true,
  ...rest
}) => {
  return (
    <NextImage
      src={src || '/imageplaceholder.svg'}
      alt={alt}
      fill={fill}
      {...rest}
    />
  );
};

export default ImageHolder;
