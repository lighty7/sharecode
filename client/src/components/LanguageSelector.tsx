import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Code2 } from "lucide-react";

const languages = [
    { value: "markdown", label: "Markdown" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "sql", label: "SQL" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
    { value: "yaml", label: "YAML" },
    { value: "xml", label: "XML" },
    { value: "shell", label: "Shell" },
    { value: "plaintext", label: "Plain Text" },
];

interface LanguageSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[140px] h-8 bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white">
                <div className="flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5" />
                    <SelectValue placeholder="Language" />
                </div>
            </SelectTrigger>
            <SelectContent>
                {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
