// StopRecordIcon component for when recording is active
function StopRecordIcon({ toggleRecording }) {
  return (
    <button
      type='button'
      onClick={toggleRecording}
      className={`absolute top-1/2 translate-y-[-30%] right-2 flex h-9 items-center justify-center rounded-full bg-black text-white hover:opacity-70 dark:bg-white dark:text-black w-9 transition-all duration-300 animate-pulse`}
      aria-label='Stop recording speech'
    >
      <svg
        width='24px'
        height='24px'
        viewBox='-2.4 -2.4 28.80 28.80'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g
          id='SVGRepo_bgCarrier'
          strokeWidth='0'
        ></g>
        <g
          id='SVGRepo_tracerCarrier'
          strokeLinecap='round'
          strokeLinejoin='round'
          stroke='#CCCCCC'
          strokeWidth='0.048'
        ></g>
        <g id='SVGRepo_iconCarrier'>
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M14 7C15.6569 7 17 8.34315 17 10V14C17 15.6569 15.6569 17 14 17H10C8.34315 17 7 15.6569 7 14V10C7 8.34315 8.34315 7 10 7H14ZM14 9C14.5523 9 15 9.44772 15 10V14C15 14.5523 14.5523 15 14 15H10C9.44772 15 9 14.5523 9 14V10C9 9.44772 9.44772 9 10 9H14Z'
            fill='#0F0F0F'
          ></path>
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12 20.9932C7.03321 20.9932 3.00683 16.9668 3.00683 12C3.00683 7.03321 7.03321 3.00683 12 3.00683C16.9668 3.00683 20.9932 7.03321 20.9932 12C20.9932 16.9668 16.9668 20.9932 12 20.9932Z'
            fill='#0F0F0F'
          ></path>
        </g>
      </svg>
    </button>
  );
}

export default StopRecordIcon;
