const Skeleton = () => {
  return (
    <li className='flex flex-col md:flex-row gap-2 border-1 border-dark-400 rounded-xl overflow-hidden hover:border-dark-300 cursor-pointer duration-200 p-6'>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-4'>
          <div className='w-14 h-14 bg-dark-400 rounded-full animate-pulse' />
          <div className='flex flex-col gap-2'>
            <div className='w-32 h-4 rounded-full bg-dark-400 animate-pulse' />
            <div className='w-28 h-4 rounded-full bg-dark-400 animate-pulse' />
          </div>
          <div className='w-16 h-4 rounded-full bg-dark-400 animate-pulse' />
        </div>
        <div className='flex gap-2'>
          <div className='w-8 h-4 bg-dark-400 rounded-full' />
          <div className='w-8 h-4 bg-dark-400 rounded-full' />
          <div className='w-8 h-4 bg-dark-400 rounded-full' />
        </div>
      </div>
    </li>
  );
};

export default function PeopleSkeleton() {
  return (
    <main className='p-6 md:p-16'>
      <ul className='grid grid-cols-1 gap-5 md:grid-cols-2'>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </ul>
    </main>
  );
}
