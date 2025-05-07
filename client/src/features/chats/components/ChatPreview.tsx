import * as Separator from "@radix-ui/react-separator";

type ChatPreviewProps = {
  message: {
    name: string;
    lastMessage: string;
    sentByMe: boolean;
  };
};

const ChatPreview = ({ message }: ChatPreviewProps) => {
  return (
    <button
      className="w-full text-left cursor-pointer hover:bg-[var(--o-gray-light)]"
      type="button"
    >
      <Separator.Root className="h-px bg-gray-200 mb-2" />
      <div className="px-2 font-medium">{message.name}</div>
      <div className="truncate px-2">
        {message.sentByMe && <span className="font-bold text-sm">Ty: </span>}
        <span className="font-extralight text-sm">{message.lastMessage}</span>
      </div>
      <Separator.Root className="mt-2" />
    </button>
  );
};

export default ChatPreview;
