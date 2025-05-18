import HeaderMenu from "./HeaderMenu";
import Logo from "./Logo";

function Header() {
  return (
    <header className='flex items-center justify-between px-10 py-3 bg-[#192836] shadow-xl shadow-slate-700'>
      <img
        src='/Murshedi_logo_no_bg.png'
        alt='murshedi_logo'
        className='h-10 sm:h-14 -ml-5 sm:-ml-0'
      />
      <Logo className='h-[75px]' />
      <HeaderMenu />
    </header>
  );
}

export default Header;
