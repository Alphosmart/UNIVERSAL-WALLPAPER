import React from 'react'

const HorizontalCardProduct = ({ category, heading }) => {
  return (
    <div className='container mx-auto px-4 my-6 relative'>
        <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
        <div className='flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none transition-all'>
            {/* Product cards will be added here when backend data is available */}
            <div className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex'>
                <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px]'>
                    <div className='w-full h-full bg-slate-300 rounded animate-pulse'></div>
                </div>
                <div className='p-4 grid'>
                    <div className='h-4 bg-slate-300 rounded w-full mb-2 animate-pulse'></div>
                    <div className='h-3 bg-slate-300 rounded w-3/4 mb-2 animate-pulse'></div>
                    <div className='h-4 bg-slate-300 rounded w-1/2 animate-pulse'></div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HorizontalCardProduct
