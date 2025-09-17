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
        })
    };
    return (
        <div onClick={handleSignOut}>
            Log out
        </div>
    )
}