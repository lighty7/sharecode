import { useState, useEffect } from "react";

export interface EditorSettings {
    fontSize: number;
    wordWrap: boolean;
    lineNumbers: boolean;
    minimap: boolean;
}

const DEFAULT_SETTINGS: EditorSettings = {
    fontSize: 14,
    wordWrap: true,
    lineNumbers: true,
    minimap: false,
};

const STORAGE_KEY = "sharecode-editor-settings";

export function useEditorSettings() {
    // Initialize state from local storage or defaults
    const [settings, setSettings] = useState<EditorSettings>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
            }
        } catch (e) {
            console.error("Failed to parse editor settings", e);
        }
        return DEFAULT_SETTINGS;
    });

    // Update local storage when settings change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error("Failed to save editor settings", e);
        }
    }, [settings]);

    const updateSetting = <K extends keyof EditorSettings>(
        key: K,
        value: EditorSettings[K]
    ) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    return { settings, updateSetting };
}
