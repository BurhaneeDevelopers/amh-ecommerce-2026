"use client";

import { Toaster } from "@/components/ui/sonner";
import { PropsWithChildren, useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { current_user_auth_atom } from "@/jotai/store";
import { toast } from "sonner";
import { users_service } from "@/supabase/services/user-service";
// import { ThemeProvider } from "next-themes";
import Topbar from "../constants/topbar";
import Footer from "../constants/footer";
import Navbar from "../constants/navbar";
import { Providers } from "@/api/providers";

const ProtectedComponent: React.FC<PropsWithChildren> = ({ children }) => {
  // const pathname = usePathname();
  const set_current_user_auth = useSetAtom(current_user_auth_atom);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubscribe: () => void;

    const init = async () => {
      setLoading(true);
      try {
        const [session, user] = await Promise.all([
          users_service.get_session(),
          users_service.get_current_user(),
        ]);

        if (!session) {
          set_current_user_auth(null);
          return;
        }

        if (user) set_current_user_auth(user);

        // if (user && pathname === "/") {
        //   if (user.role === "agency") {
        //     router.replace("/active-requests");
        //   } else if (user.role === "admin") {
        //     router.replace("/admin-dashboard");
        //   }
        // }

        const {
          data: { subscription },
        } = users_service.onAuthStateChange((event, session) => {
          if (event === "SIGNED_OUT" || !session) {
            toast.error("Session expired. Please login again.");
            set_current_user_auth(null);
          }
        });

        unsubscribe = () => subscription.unsubscribe();
      } catch (err) {
        console.log("Auth check failed:", err);
        toast.error("Authentication error. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
      setLoading(false);
    };
  }, [set_current_user_auth]);

  if (loading) return "loading...";

  return (
    <Providers>
      {/* 
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      > */}
      <Toaster />
      <Topbar />
      <Navbar />
      {children}
      <Footer />
      {/* </ThemeProvider> */}
    </Providers>
  );
};

export default ProtectedComponent;
