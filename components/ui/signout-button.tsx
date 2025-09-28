import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";


export default function SignOutButton() {
  const router = useRouter();
  
  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/'); // Redirect to home or login page after sign out
        }
      }
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSignOut();
    }
  };

  return (
    <button 
      type="button"
      onClick={handleSignOut}
      onKeyDown={handleKeyDown}
      className="w-full text-left"
    >
      Log out
    </button>
  );
}