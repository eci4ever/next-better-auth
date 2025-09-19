import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>Welcome to the Home Page</h1>
      <div className="gap-6">
        <Button className="ml-4">
          <Link href={"/login"}> Sign In</Link>
        </Button>
        <Button className="ml-4" variant="outline">
          <Link href={"/signup"}> Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
