import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E9F9EE] to-indigo-100">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
