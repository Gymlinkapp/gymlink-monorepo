export default function MainNavbar() {
  return (
    <div className='fixed py-4 w-full right-0 left-0 rounded-t-xl bottom-0 bg-dark-400'>
      <ul className='flex flex-row w-full justify-evenly'>
        <li className='btn btn-ghost'>
          <a>Item 1</a>
        </li>

        <li className='btn btn-ghost'>
          <a>Item 3</a>
        </li>
      </ul>
    </div>
  );
}
