import { Command } from "lucide-react";

export function CommandBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-12 border-b border-white/5 bg-background/95 backdrop-blur flex items-center px-4 justify-between select-none">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
          <Command className="w-4 h-4" />
        </div>
        <span className="font-mono tracking-tight text-foreground">ROOMS</span>
      </div>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
}
