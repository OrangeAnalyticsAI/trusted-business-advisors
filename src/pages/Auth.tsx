
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
  const [fullName, setFullName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";

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
            // Fetch the user's profile data
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', data.user.id)
              .single();

            if (profileError) {
              console.error("Error fetching profile:", profileError);
            } else if (profileData) {
              setFullName(profileData.full_name || '');
            }

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
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session && !verificationSuccess) {
          navigate("/");
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: authData } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && !verificationSuccess) {
          navigate("/");
        }
      }
    );

    return () => {
      authData.subscription.unsubscribe();
    };
  }, [navigate, verificationSuccess]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-16 sm:pt-32">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Verifying your email...</h2>
          <p className="text-muted-foreground">Please wait while we verify your email address.</p>
        </div>
      </div>
    );
  }

  if (verificationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-16 sm:pt-32">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            {fullName ? `Thank you for signing up, ${fullName}!` : 'Thank you for signing up!'}
          </h2>
          <p className="text-muted-foreground">You'll be redirected to the home page in a moment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-16 sm:pt-32">
      <AuthForm initialMode={initialMode} />
    </div>
  );
}
