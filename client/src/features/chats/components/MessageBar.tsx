import { cn } from "@/lib/utils";

type MessageBarProps = {
  message: {
    sentByMe: boolean;
    content: string;
  };
};

const MessageBar = ({ message }: MessageBarProps) => {
  return (
    <div
      className={cn(
        "bg-red-500 rounded-2xl p-3 max-w-2/3",
        message.sentByMe
          ? "bg-[var(--o-yellow)] ml-auto"
          : "bg-[var(--o-gray-light)] mr-auto"
      )}
    >
      {message.content}
    </div>
  );
};

export default MessageBar;
