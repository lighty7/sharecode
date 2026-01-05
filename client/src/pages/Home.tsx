import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { nanoid } from "nanoid";

import { useCreateRoom } from "@/hooks/use-rooms";

export default function Home() {
  const [, setLocation] = useLocation();
  const createRoom = useCreateRoom();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      // Generate a clean, short ID for the room
      const slug = nanoid(10);
      try {
        // Explicitly create the room in the DB
        await createRoom.mutateAsync({
          slug,
          content: "",
        });
      } catch (error) {
        console.error("Failed to pre-create room, falling back to auto-create", error);
      } finally {
        setLocation(`/${slug}`);
      }
    };

    init();
  }, [setLocation, createRoom]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
        <p className="font-mono text-zinc-500 text-sm">Initializing environment...</p>
      </div>
    </div>
  );
}
