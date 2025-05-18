import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagsInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
  error: boolean;
  className: string;
}

export function TagsInput({
  tags,
  setTags,
  placeholder = "Add a tag",
  error,
  className = "",
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && inputValue === "") {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-md border px-3 py-2",
        {
          "border-red-500": error,
        },
        className
      )}
    >
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center rounded-full bg-muted px-3 py-1 text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="ml-1 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Input
        className="border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-auto flex-1 min-w-[100px]"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}
