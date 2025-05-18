function LoginHeader() {
  return (
    <div className='text-center'>
      <div className='flex items-center justify-center'>
        <img
          src='/logo_no_name.png'
          alt='logo'
          className='h-12'
        />
      </div>
      <h1 className='text-stone-200 text-2xl font-semibold pt-5'>
        Welcome Back
      </h1>
    </div>
  );
}

export default LoginHeader;
