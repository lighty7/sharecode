import { useState } from "react";
import { Settings, Shield, ShieldAlert, KeyRound } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUpdateRoom } from "@/hooks/use-rooms";
import { useToast } from "@/hooks/use-toast";

interface SettingsModalProps {
  slug: string;
  isPrivate: boolean;
  currentPassword?: string; // The session password we have (to authorize changes)
}

export function SettingsModal({ slug, isPrivate, currentPassword }: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const { mutate: update, isPending } = useUpdateRoom();
  const { toast } = useToast();

  const handleSetPassword = () => {
    if (!newPassword) return;

    update(
      { 
        slug, 
        password: currentPassword, // Authorize with current password if it exists
        lockPassword: newPassword,
        isPrivate: true
      },
      {
        onSuccess: () => {
          toast({ title: "Room Locked", description: "Password protection enabled." });
          setNewPassword("");
          setIsOpen(false);
        },
        onError: (err) => {
          toast({ 
            variant: "destructive", 
            title: "Failed", 
            description: err.message 
          });
        }
      }
    );
  };

  const handleRemovePassword = () => {
    update(
      {
        slug,
        password: currentPassword,
        isPrivate: false,
        lockPassword: "" // Clear it
      },
      {
        onSuccess: () => {
          toast({ title: "Room Unlocked", description: "Password protection removed." });
          setIsOpen(false);
        },
        onError: (err) => {
          toast({ 
            variant: "destructive", 
            title: "Failed", 
            description: err.message 
          });
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-mono text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" /> Room Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div className="space-y-0.5">
              <Label className="text-base">Private Room</Label>
              <div className="text-xs text-zinc-500">
                {isPrivate ? "Protected with password" : "Accessible by anyone with the link"}
              </div>
            </div>
            {isPrivate ? (
              <Shield className="w-5 h-5 text-emerald-500" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-zinc-500" />
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-mono uppercase text-zinc-500">
                {isPrivate ? "Update Password" : "Set Password"}
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <Input 
                    type="password"
                    placeholder={isPrivate ? "New password" : "Create password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-9 bg-zinc-900 border-zinc-800 font-mono"
                  />
                </div>
                <Button 
                  onClick={handleSetPassword} 
                  disabled={!newPassword || isPending}
                  variant="secondary"
                >
                  Save
                </Button>
              </div>
            </div>

            {isPrivate && (
              <div className="pt-4 border-t border-white/5">
                 <Button 
                  onClick={handleRemovePassword}
                  disabled={isPending}
                  variant="destructive"
                  className="w-full"
                >
                  Remove Password Protection
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
