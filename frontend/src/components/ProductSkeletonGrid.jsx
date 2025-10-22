import React from 'react';

const ProductSkeleton = ({ variant = 'vertical' }) => {
  if (variant === 'horizontal') {
    return (
      <div className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex animate-pulse'>
        <div className='bg-gray-200 h-full p-4 min-w-[120px] md:min-w-[145px] flex justify-center items-center'>
          <div className='w-full h-full bg-gray-300 rounded'></div>
        </div>
        <div className='p-4 flex flex-col justify-between w-full'>
          <div>
            <div className='h-4 bg-gray-300 rounded w-3/4 mb-2'></div>
            <div className='h-3 bg-gray-300 rounded w-1/2 mb-2'></div>
          </div>
          <div>
            <div className='h-4 bg-gray-300 rounded w-1/3 mb-1'></div>
            <div className='h-3 bg-gray-300 rounded w-1/4'></div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile horizontal scroll skeleton
  if (variant === 'mobile') {
    return (
      <div className='flex-shrink-0 w-[160px] sm:w-full sm:max-w-[280px] bg-white rounded-lg shadow animate-pulse'>
        <div className='bg-gray-200 h-32 sm:h-48 p-2 sm:p-4 flex justify-center items-center rounded-t-lg'>
          <div className='w-full h-full bg-gray-300 rounded'></div>
        </div>
        <div className='p-2 sm:p-4 grid gap-1 sm:gap-3'>
          <div className='h-3 sm:h-4 bg-gray-300 rounded w-full'></div>
          <div className='h-2 sm:h-3 bg-gray-300 rounded w-3/4'></div>
          <div className='flex gap-1 sm:gap-3'>
            <div className='h-3 sm:h-4 bg-gray-300 rounded w-1/3'></div>
            <div className='h-3 sm:h-4 bg-gray-300 rounded w-1/3'></div>
          </div>
          <div className='h-1 bg-gray-300 rounded w-full'></div>
          <div className='h-6 sm:h-8 bg-gray-300 rounded w-full'></div>
        </div>
      </div>
    );
  }

  // Default vertical skeleton
  return (
    <div className='w-full min-w-[260px] md:min-w-[300px] max-w-[260px] md:max-w-[300px] bg-white rounded-sm shadow animate-pulse'>
      <div className='bg-gray-200 h-48 p-4 min-w-[260px] md:min-w-[300px] flex justify-center items-center'>
        <div className='w-full h-full bg-gray-300 rounded'></div>
      </div>
      <div className='p-4 grid gap-3'>
        <div className='h-4 bg-gray-300 rounded w-full'></div>
        <div className='h-3 bg-gray-300 rounded w-3/4'></div>
        <div className='flex gap-3'>
          <div className='h-4 bg-gray-300 rounded w-1/3'></div>
          <div className='h-4 bg-gray-300 rounded w-1/3'></div>
        </div>
        <div className='h-8 bg-gray-300 rounded w-full'></div>
      </div>
    </div>
  );
};

const ProductSkeletonGrid = ({ count = 6, variant = 'vertical' }) => {
  if (variant === 'mobile') {
    return (
      <div className='container mx-auto px-4 my-6'>
        <div className='h-8 bg-gray-300 rounded w-1/3 mb-4'></div>
        <div className='flex gap-2 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4'>
          {Array.from({ length: count }).map((_, index) => (
            <ProductSkeleton key={index} variant="mobile" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className='container mx-auto px-4 my-6'>
        <div className='h-8 bg-gray-300 rounded w-1/3 mb-4 animate-pulse'></div>
        <div className='flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none'>
          {Array.from({ length: count }).map((_, index) => (
            <ProductSkeleton key={index} variant="horizontal" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 my-6'>
      <div className='h-8 bg-gray-300 rounded w-1/3 mb-4 animate-pulse'></div>
      <div className='grid grid-cols-[repeat(auto-fit,minmax(260px,300px))] justify-center md:justify-between md:gap-4 overflow-x-scroll scrollbar-none'>
        {Array.from({ length: count }).map((_, index) => (
          <ProductSkeleton key={index} variant="vertical" />
        ))}
      </div>
    </div>
  );
};

export default ProductSkeletonGrid;
export { ProductSkeleton };