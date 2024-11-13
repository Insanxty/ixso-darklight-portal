import { LogIn } from "lucide-react";

const LoginButton = () => {
  return (
    <button className="flex items-center gap-2 px-6 py-3 bg-ixso-purple rounded-lg hover-glow transition-all duration-300 hover:-translate-y-0.5">
      <LogIn className="w-4 h-4" />
      <span className="font-medium">Login</span>
    </button>
  );
};

export default LoginButton;