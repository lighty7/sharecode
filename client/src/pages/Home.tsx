import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { nanoid } from "nanoid";

export default function Home() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Generate a clean, short ID for the room
    const newRoomSlug = nanoid(10);
    setLocation(`/${newRoomSlug}`);
  }, [setLocation]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
        <p className="font-mono text-zinc-500 text-sm">Initializing environment...</p>
      </div>
    </div>
  );
}
