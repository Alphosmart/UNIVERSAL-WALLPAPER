import React from 'react'

const VerticalCardProduct = ({ category, heading }) => {
  return (
    <div className='container mx-auto px-4 my-6 relative'>
        <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
        <div className='grid grid-cols-[repeat(auto-fit,minmax(260px,300px))] justify-center md:justify-between md:gap-4 overflow-x-scroll scrollbar-none transition-all'>
            {/* Product cards will be added here when backend data is available */}
            {[1,2,3,4,5].map((item) => (
                <div key={item} className='w-full min-w-[260px] md:min-w-[300px] max-w-[260px] md:max-w-[300px] bg-white rounded-sm shadow'>
                    <div className='bg-slate-200 h-48 p-4 min-w-[260px] md:min-w-[300px] flex justify-center items-center'>
                        <div className='w-full h-full bg-slate-300 rounded animate-pulse'></div>
                    </div>
                    <div className='p-4 grid gap-3'>
                        <div className='h-4 bg-slate-300 rounded w-full animate-pulse'></div>
                        <div className='h-3 bg-slate-300 rounded w-3/4 animate-pulse'></div>
                        <div className='flex gap-3'>
                            <div className='h-4 bg-slate-300 rounded w-1/3 animate-pulse'></div>
                            <div className='h-4 bg-slate-300 rounded w-1/3 animate-pulse'></div>
                        </div>
                        <div className='h-8 bg-slate-300 rounded w-full animate-pulse'></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default VerticalCardProduct
