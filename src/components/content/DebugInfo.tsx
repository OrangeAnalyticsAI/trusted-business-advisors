
interface UserProfile {
  id: string;
  user_type: 'client' | 'consultant';
  email: string;
  full_name?: string;
}

interface DebugInfoProps {
  userProfile: UserProfile | null;
  isConsultant: boolean;
}

export const DebugInfo = ({ userProfile, isConsultant }: DebugInfoProps) => {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded p-3 mb-6">
      <h3 className="font-medium">Debug Information</h3>
      <p>User is logged in: {userProfile ? "Yes" : "No"}</p>
      <p>User type: {userProfile?.user_type || "Unknown"}</p>
      <p>Is consultant (state): {isConsultant ? "Yes" : "No"}</p>
    </div>
  );
};
