import * as Separator from "@radix-ui/react-separator";

const user = "Jan Kowalski";

const exampleConversation = [
  {
    sentByMe: true,
    content: "Hej! Jak tam?",
    timestamp: "2025-05-07T10:30:00Z",
  },
  {
    sentByMe: false,
    content: "Cześć! Wszystko ok, a u Ciebie?",
    timestamp: "2025-05-07T10:31:15Z",
  },
  {
    sentByMe: true,
    content: "W porządku! Chcesz się spotkać wieczorem?",
    timestamp: "2025-05-07T10:32:00Z",
  },
  {
    sentByMe: false,
    content: "Pewnie! O 18 pasuje?",
    timestamp: "2025-05-07T10:33:00Z",
  },
];

const SingleChat = () => {
  return (
    <div className="md:col-span-5 h-full">
      <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
        <div className="font-bold px-6 py-2">{user}</div>
        <Separator.Root className="h-px bg-gray-200" />

        <main className="flex-1 w-full flex flex-col p-6">msgs</main>
        <div>footer</div>
      </div>
    </div>
  );
};

export default SingleChat;
