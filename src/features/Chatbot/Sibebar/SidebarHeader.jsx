import CloseSidebarIcon from "../../../icons/CloseSidebarIcon";
import { useSidebar } from "../../../context/SidebarContext";

function SidebarHeader() {
  const { closeSidebar } = useSidebar();

  return (
    <div className='flex justify-between items-center'>
      <div>
        <h2 className='text-2xl font-bold text-stone-200 font-sans'>
          Murshedi
        </h2>
      </div>
      <div
        className='flex'
        data-state='closed'
      >
        <button
          className='h-10 rounded-lg px-2 hover:bg-[#212121] transition-all duration-200'
          aria-label='Close sidebar'
          title='Close sidebar'
          data-testid='close-sidebar-button'
          onClick={closeSidebar}
        >
          <CloseSidebarIcon />
        </button>
      </div>
    </div>
  );
}

export default SidebarHeader;
