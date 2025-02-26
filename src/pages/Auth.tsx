
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    // Handle email verification
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const type = searchParams.get("type");
      const email = searchParams.get("email");

      if (token && type === "signup" && email) {
        setVerifying(true);
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: "signup",
          });
          
          if (error) {
            console.error("Verification error:", error);
            toast.error("Verification failed", {
              description: error.message,
            });
          } else if (data?.user) {
            setVerificationSuccess(true);
            toast.success("Email verified successfully!");
            // Add a delay before redirecting
            setTimeout(() => {
              navigate("/");
            }, 3000);
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
      if (session && !verificationSuccess) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && !verificationSuccess) {
          navigate("/");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, verificationSuccess]);

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

  if (verificationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Thank you for signing up!</h2>
          <p className="text-muted-foreground">You'll be redirected to the home page in a moment...</p>
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
