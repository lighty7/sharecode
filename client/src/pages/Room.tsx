import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "wouter";
import Editor, { OnMount } from "@monaco-editor/react";
import { useRoom, useUpdateRoom, useCreateRoom } from "@/hooks/use-rooms";
import { CommandBar } from "@/components/CommandBar";
import { PasswordModal } from "@/components/PasswordModal";
import { SettingsModal } from "@/components/SettingsModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, Share2, Copy, Download, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Room() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const [sessionPassword, setSessionPassword] = useState<string | undefined>();

  // Data Fetching
  const { data: room, isLoading, error } = useRoom(slug, sessionPassword);

  // Local State
  const [content, setContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Derived State
  const debouncedContent = useDebounce(content, 1000);
  const isLocked = room && 'isLocked' in room && room.isLocked;
  const isPrivate = (room && 'isPrivate' in room && room.isPrivate) || false;
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  // Mutations
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const { toast } = useToast();

  // Initialize content from server
  useEffect(() => {
    if (room && 'content' in room && room.content !== content && !isTyping) {
      setContent(room.content || "");
      setLastSaved(new Date(room.lastAccessedAt || Date.now()));
    }
  }, [room]);

  // Handle Autosave
  useEffect(() => {
    // Don't save if content is empty (initially) or hasn't changed from server
    // Or if we are currently typing (debounce handles the wait)
    // Or if room is not loaded/locked
    // If room is locked, we can't save. But if room is missing (null), we SHOULD save to create it.
    if (isLocked) return;
    // content === room.content check needs to handle room being null
    const currentContent = (room && 'content' in room) ? room.content : "";
    if (content === (currentContent || "")) return;

    const save = async () => {
      try {
        if (!room || !('createdAt' in room)) {
          // If room doesn't exist on server yet (it's new)
          await createRoom.mutateAsync({
            slug,
            content: debouncedContent,
            password: sessionPassword
          });
        } else {
          // Update existing
          await updateRoom.mutateAsync({
            slug,
            content: debouncedContent,
            password: sessionPassword
          });
        }
        setLastSaved(new Date());
        setIsTyping(false);
      } catch (err) {
        console.error("Autosave failed", err);
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "Could not save your changes.",
        });
      }
    };

    save();
  }, [debouncedContent]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
      setIsTyping(true);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Copied", description: "URL copied to clipboard" });
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          <p className="font-mono text-zinc-600 text-xs">Loading {slug}...</p>
        </div>
      </div>
    );
  }

  // Handle 404 - Should be rare as we create on first save, 
  // but if we are viewing a non-existent slug, treat as empty new room
  const isNew = !room || !('createdAt' in room);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <PasswordModal
        slug={slug}
        isOpen={!!isLocked}
        onSuccess={setSessionPassword}
      />

      <CommandBar>
        <div className="flex items-center gap-2 px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
          <span className="text-xs text-zinc-500 font-mono">ID:</span>
          <span className="text-sm font-mono text-white">{slug}</span>
        </div>

        <div className="h-4 w-[1px] bg-zinc-800 mx-2" />

        <div className="flex items-center gap-2 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hidden sm:flex">
          <span className="text-xs text-zinc-500 font-mono">Words:</span>
          <span className="text-sm font-mono text-white">{wordCount}</span>
        </div>

        <div className="h-4 w-[1px] bg-zinc-800 mx-2 hidden sm:block" />

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 min-w-[100px]">
          {isTyping || createRoom.isPending || updateRoom.isPending ? (
            <span className="flex items-center gap-1.5 text-yellow-500">
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving...
            </span>
          ) : lastSaved ? (
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Cloud className="w-3 h-3" />
              Saved
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-zinc-500">
              Ready
            </span>
          )}
        </div>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={copyUrl}
          className="h-8 gap-2 text-zinc-400 hover:text-white"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="h-8 gap-2 text-zinc-400 hover:text-white"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </Button>

        <div className="h-4 w-[1px] bg-zinc-800 mx-2" />

        <SettingsModal
          slug={slug}
          isPrivate={isPrivate}
          currentPassword={sessionPassword}
        />
      </CommandBar>

      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          theme="vs-dark"
          value={content}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 24,
            padding: { top: 24, bottom: 24 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            renderLineHighlight: "all",
            wordWrap: "on",
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            contextmenu: true,
          }}
          loading={
            <div className="flex items-center gap-2 text-zinc-500 p-8 font-mono text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Initializing editor...
            </div>
          }
        />
      </div>
    </div>
  );
}
