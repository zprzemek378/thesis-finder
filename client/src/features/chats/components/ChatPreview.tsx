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
    <div>
      <Separator.Root className="h-px bg-gray-200 my-2" />
      <div className="px-2 font-medium">{message.name}</div>
      <div className="truncate px-2">
        {message.sentByMe && <span className="font-bold text-sm">Ty: </span>}
        <span className="font-extralight text-sm">{message.lastMessage}</span>
      </div>
    </div>
  );
};

export default ChatPreview;
