"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { UserService } from "supabase-auth-lib";
import { User } from "@supabase/supabase-js";

export function useCheckOnboarding(user: User | null) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const userService = new UserService(supabase);
        const userObject = await userService.getOrCreateOrUpdate({
          id: user!.id,
          email: user!.email!,
        });

        if (!userObject.onboarding_complete) {
          router.replace("/new");
        }
      } catch (error) {
        console.error("Error checking onboarding:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) checkOnboarding();
    else setLoading(false);
  }, [user, router]);

  return { loading };
}
