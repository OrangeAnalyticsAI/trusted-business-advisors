import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    // Handle email verification
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const type = searchParams.get("type");

      if (token && type === "signup") {
        setVerifying(true);
        try {
          const { error } = await supabase.auth.verifyOtp({
            type: "signup",
            token_hash: token,
          });
          
          if (error) {
            console.error("Verification error:", error);
            toast.error("Verification failed", {
              description: error.message,
            });
          } else {
            toast.success("Email verified successfully!");
            navigate("/");
          }
        } catch (error: any) {
          console.error("Verification error:", error);
          toast.error("Verification failed", {
            description: error.message,
          });
        } finally {
          setVerifying(false);
        }
      }
    };

    verifyEmail();
  }, [navigate, searchParams]);

  useEffect(() => {
    // Redirect to home if already authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Verifying your email...</h2>
          <p className="text-muted-foreground">Please wait while we verify your email address.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthForm />
    </div>
  );
}
