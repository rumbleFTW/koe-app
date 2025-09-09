'use client';

import React, { useState, useRef, useEffect } from 'react';
import ImageHolder from './image';

type ImageGridCarouselProps = {
  images: string[];
};

export default function ImageGrider({ images }: ImageGridCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const displayedImages = images.slice(0, 7); // Increased to 10 images

  // Handle scroll to update current index
  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollPos = carouselRef.current.scrollLeft;
    const containerWidth = carouselRef.current.clientWidth;
    setCurrentIndex(Math.round(scrollPos / containerWidth));
  };

  // Navigate to specific slide
  const goToSlide = (index: number) => {
    carouselRef.current?.scrollTo({
      left: index * (carouselRef.current?.clientWidth || 0),
      behavior: 'smooth',
    });
  };

  // Attach scroll listener
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  // Get grid layout based on image count
  const getGridLayout = () => {
    const count = displayedImages.length;

    switch (count) {
      case 1:
        return {
          gridClass: 'grid-cols-1 grid-rows-1',
          imageClasses: ['col-span-1 row-span-1'],
        };

      case 2:
        return {
          gridClass: 'grid-cols-2 grid-rows-1',
          imageClasses: ['col-span-1 row-span-1', 'col-span-1 row-span-1'],
        };

      case 3:
        return {
          gridClass: 'grid-cols-3 grid-rows-2',
          imageClasses: [
            'col-span-2 row-span-2',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
          ],
        };

      case 4:
        return {
          gridClass: 'grid-cols-2 grid-rows-2',
          imageClasses: [
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
          ],
        };

      case 5:
        return {
          gridClass: 'grid-cols-3 grid-rows-3',
          imageClasses: [
            'col-span-2 row-span-2',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-2 row-span-1',
          ],
        };

      case 6:
        return {
          gridClass: 'grid-cols-4 grid-rows-3',
          imageClasses: [
            'col-span-2 row-span-2',
            'col-span-2 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
          ],
        };

      case 7:
        return {
          gridClass: 'grid-cols-4 grid-rows-3',
          imageClasses: [
            'col-span-2 row-span-2',
            'col-span-2 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-2 row-span-1',
          ],
        };

      case 8:
        return {
          gridClass: 'grid-cols-4 grid-rows-3',
          imageClasses: [
            'col-span-2 row-span-3',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
          ],
        };

      case 9:
        return {
          gridClass: 'grid-cols-4 grid-rows-3',
          imageClasses: [
            'col-span-2 row-span-2',
            'col-span-2 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-2 row-span-1',
          ],
        };

      case 10:
        return {
          gridClass: 'grid-cols-4 grid-rows-3',
          imageClasses: [
            'col-span-2 row-span-2',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-2 row-span-1',
          ],
        };

      default:
        return {
          gridClass: 'grid-cols-3 grid-rows-3',
          imageClasses: displayedImages.map(() => 'col-span-1 row-span-1'),
        };
    }
  };

  const { gridClass, imageClasses } = getGridLayout();

  return (
    <div className="mx-auto h-[700px] w-full max-w-[1300px]">
      {/* Desktop Grid */}
      <div className={`hidden gap-3 md:grid ${gridClass} h-full w-full`}>
        {displayedImages.map((src, idx) => (
          <div
            key={idx}
            className={`${imageClasses[idx]} overflow-hidden rounded-lg`}
          >
            <ImageHolder
              src={src}
              alt={`Image ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="relative h-full w-full overflow-hidden md:hidden">
        <div
          ref={carouselRef}
          className="flex h-full snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {displayedImages.map((src, idx) => (
            <div key={idx} className="h-full w-full flex-shrink-0 snap-start">
              <div className="h-full w-full p-2">
                <ImageHolder
                  src={src}
                  alt={`Image ${idx + 1}`}
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        {displayedImages.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 mt-4 flex justify-center space-x-2">
            {displayedImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-3 w-3 rounded-full transition-all ${
                  idx === currentIndex ? 'scale-125 bg-gray-800' : 'bg-gray-300'
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
