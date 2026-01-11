import { Type, WrapText, ListOrdered, Map, Settings2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EditorSettings } from "@/hooks/use-editor-settings";
import { useState } from "react";

interface EditorSettingsModalProps {
    settings: EditorSettings;
    onUpdate: <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => void;
}

export function EditorSettingsModal({ settings, onUpdate }: EditorSettingsModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                    <Settings2 className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-zinc-800 sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-mono text-lg flex items-center gap-2">
                        <Settings2 className="w-5 h-5" /> Editor Settings
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Type className="w-4 h-4 text-zinc-400" />
                            <Label htmlFor="font-size" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Font Size
                            </Label>
                        </div>
                        <Input
                            id="font-size"
                            type="number"
                            value={settings.fontSize}
                            onChange={(e) => onUpdate("fontSize", parseInt(e.target.value) || 14)}
                            className="w-20 h-8 font-mono bg-zinc-900 border-zinc-800"
                            min={10}
                            max={32}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <WrapText className="w-4 h-4 text-zinc-400" />
                            <Label htmlFor="word-wrap" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Word Wrap
                            </Label>
                        </div>
                        <Switch
                            id="word-wrap"
                            checked={settings.wordWrap}
                            onCheckedChange={(checked) => onUpdate("wordWrap", checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ListOrdered className="w-4 h-4 text-zinc-400" />
                            <Label htmlFor="line-numbers" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Line Numbers
                            </Label>
                        </div>
                        <Switch
                            id="line-numbers"
                            checked={settings.lineNumbers}
                            onCheckedChange={(checked) => onUpdate("lineNumbers", checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Map className="w-4 h-4 text-zinc-400" />
                            <Label htmlFor="minimap" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Minimap
                            </Label>
                        </div>
                        <Switch
                            id="minimap"
                            checked={settings.minimap}
                            onCheckedChange={(checked) => onUpdate("minimap", checked)}
                        />
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
