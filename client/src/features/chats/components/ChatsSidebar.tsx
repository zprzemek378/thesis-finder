import * as Separator from "@radix-ui/react-separator";
import { Link } from "react-router-dom";
import ChatPreview from "./ChatPreview";

const exampleMessages = [
  {
    name: "Anna Kowalska",
    lastMessage: "O której się spotykamy?",
    sentByMe: false,
  },
  {
    name: "Jan Nowak",
    lastMessage: "Już wysłałem dokumenty.",
    sentByMe: true,
  },
  {
    name: "Katarzyna Wiśniewska",
    lastMessage: "Dzięki za pomoc!",
    sentByMe: false,
  },
  {
    name: "Piotr Zieliński",
    lastMessage: "Zaraz oddzwonię.",
    sentByMe: true,
  },
  {
    name: "Maria Lewandowska",
    lastMessage: "Jasne, do zobaczenia jutro!",
    sentByMe: false,
  },
];

const ChatsSidebar = () => {
  return (
    <div className="bg-white rounded-lg shadow-md h-full text-left ">
      {/* TODO Link */}
      <Link
        to="/search"
        className="p-6 flex items-center text-[var(--o-blue)] mb-6 hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Wstecz
      </Link>

      <div className="font-bold px-2">Czaty</div>

      <div>
        {exampleMessages.map((m) => (
          <ChatPreview message={m} />
        ))}
        <Separator.Root className="h-px bg-gray-200" />
      </div>
    </div>
  );
};

export default ChatsSidebar;
