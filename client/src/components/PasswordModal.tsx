import { useState } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { useVerifyRoom } from "@/hooks/use-rooms";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordModalProps {
  slug: string;
  isOpen: boolean;
  onSuccess: (password: string) => void;
}

export function PasswordModal({ slug, isOpen, onSuccess }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const { mutate: verify, isPending } = useVerifyRoom();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verify(
      { slug, password },
      {
        onSuccess: () => {
          onSuccess(password);
          toast({
            title: "Access Granted",
            description: "You have successfully unlocked this room.",
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Incorrect password.",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4 border border-zinc-800">
            <Lock className="w-6 h-6 text-zinc-400" />
          </div>
          <DialogTitle className="text-center font-mono">Protected Room</DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            Enter the password to access <span className="text-white font-mono">{slug}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="relative">
            <Input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-900/50 border-zinc-800 focus:border-white/20 text-center font-mono tracking-widest placeholder:tracking-normal placeholder:font-sans"
              autoFocus
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-zinc-200"
            disabled={!password || isPending}
          >
            {isPending ? "Verifying..." : "Unlock Room"}
            {!isPending && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
