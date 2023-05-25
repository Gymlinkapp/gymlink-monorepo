import Link from 'next/link';

type Props = {
  styles?: string;
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  back: string;
};

export const BottomNav = () => {
  return (
    <div className='btm-nav md:hidden'>
      <button>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
          />
        </svg>
      </button>
      <button className='active'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      </button>
      <button>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>
      </button>
    </div>
  );
};

export default function Layout({
  styles,
  children,
  title,
  subtitle,
  back,
}: Props) {
  return (
    <main
      className={`mx-auto max-w-5xl flex bg-dark-500 p-6 relative ${styles}`}
    >
      <div className='flex-1 overflow-auto'>
        <div className='flex'>
          <Link href={back}>
            <button className='btn btn-secondary'>Back</button>
          </Link>
        </div>
        <h1 className='text-3xl font-medium'>{title}</h1>
        <p className='text-light-400'>{subtitle}</p>

        {children}
      </div>
      <div className='fixed top-0 right-0 h-screen w-64 bg-dark-300 overflow-auto'>
        test
      </div>
      <BottomNav />
    </main>
  );
}
