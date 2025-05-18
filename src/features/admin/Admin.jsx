import { lazy } from "react";
const AdminUpload = lazy(() => import("./AdminUpload"));

function Admin() {
  return (
    <div className='bg-[#212121] h-[100dvh] w-full flex relative'>
      <main className='bg-red-50 w-full '>
        <AdminUpload />
      </main>
    </div>
  );
}

export default Admin;
