import { Outlet } from "react-router";
import { AuthProvider } from "./contexts/auth-context";
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </>
  );
}

export default App;
