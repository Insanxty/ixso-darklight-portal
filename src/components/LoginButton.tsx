import { LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

const LoginButton = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async () => {
    if (session) {
      await supabase.auth.signOut();
    } else {
      navigate("/login");
    }
  };

  return (
    <button 
      onClick={handleAuth}
      className="flex items-center gap-2 px-6 py-3 bg-ixso-purple rounded-lg hover-glow transition-all duration-300 hover:-translate-y-0.5"
    >
      {session ? (
        <>
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Logout</span>
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4" />
          <span className="font-medium">Login</span>
        </>
      )}
    </button>
  );
};

export default LoginButton;