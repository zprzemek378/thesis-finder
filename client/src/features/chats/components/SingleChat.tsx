import { Input } from "@/components/ui/input";
import * as Separator from "@radix-ui/react-separator";
import SendIcon from "./SendIcon";
import MessageBar from "./MessageBar";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useEffect, useRef } from "react";

const user = "Jan Kowalski";

const exampleConversation = [
  {
    sentByMe: true,
    content:
      "Dzień dobry, Panie Profesorze. Piszę w sprawie mojej pracy inżynierskiej – chciałbym zaproponować temat i zapytać o Pana opinię.",
  },
  {
    sentByMe: false,
    content: "Dzień dobry. Oczywiście, proszę pisać, jestem ciekaw propozycji.",
  },
  {
    sentByMe: true,
    content: `Myślałem o stworzeniu aplikacji webowej wspierającej naukę języków obcych z elementami grywalizacji. 
  Chciałbym, aby użytkownik mógł wykonywać krótkie zadania (np. quizy, dopasowania, szybkie tłumaczenia), zbierać punkty i rywalizować z innymi w czasie rzeczywistym. System miałby ranking, poziomy trudności oraz możliwość wyzwań 1-na-1. 
  Funkcjonalnie byłoby to coś pomiędzy Duolingo a Kahootem, ale skupione na formacie grywalizowanych pojedynków.`,
  },
  {
    sentByMe: true,
    content:
      "Od strony technicznej planuję wykorzystać React (z TypeScriptem) po stronie klienta oraz NestJS z PostgreSQL w backendzie. Do komunikacji w czasie rzeczywistym chciałbym użyć WebSocketów. Całość byłaby napisana z naciskiem na czysty kod, modularność i testowalność.",
  },
  {
    sentByMe: false,
    content: `To dość ambitny projekt, ale zdecydowanie możliwy do zrealizowania. Podoba mi się pomysł na połączenie edukacji i grywalizacji – to aktualny temat z potencjałem praktycznym.
    Proszę tylko pamiętać o ograniczeniu zakresu funkcji – na przykład dobrze byłoby skupić się na jednej grupie językowej i maksymalnie dwóch-trzech typach zadań.`,
  },
  {
    sentByMe: false,
    content:
      "Czy ma Pan już wstępny tytuł pracy i propozycję podziału na rozdziały?",
  },
  {
    sentByMe: true,
    content: `Roboczy tytuł, jaki zapisałem, to: „Aplikacja webowa wspomagająca naukę języków obcych z wykorzystaniem grywalizacji i interakcji między użytkownikami”.
    Co do struktury: chciałbym zacząć od wprowadzenia teoretycznego (grywalizacja, nauka języków online), następnie opisać założenia projektu i architekturę systemu, potem implementację i testy, a na końcu planuję rozdział ewaluacyjny z oceną funkcjonalności oraz możliwymi kierunkami rozwoju.`,
  },
  {
    sentByMe: false,
    content:
      "Brzmi bardzo dobrze. Proszę przesłać mi do końca tygodnia krótki dokument z konspektem pracy i technologiami, które Pan planuje. Będziemy mogli wtedy oficjalnie zatwierdzić temat.",
  },
  {
    sentByMe: true,
    content:
      "Zgoda. Dziękuję za komentarze i akceptację kierunku. Pracę nad konspektem rozpocznę jeszcze dziś i wyślę w piątek najpóźniej.",
  },
  {
    sentByMe: false,
    content:
      "W porządku. W razie dodatkowych pytań proszę śmiało pisać. Powodzenia!",
  },
  {
    sentByMe: true,
    content: "Dziękuję, Panie Profesorze. Odezwę się wkrótce z dokumentem.",
  },
];

const SingleChat = () => {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, []); // TODO do dependencies dodać gdy pojawi się nowa wiadomość

  return (
    <div className="md:col-span-5 flex-1 min-h-0">
      <div className="bg-white rounded-lg shadow-md h-full flex flex-col overflow-hidden">
        <div className="font-bold px-6 py-2">{user}</div>
        <Separator.Root className="h-px bg-gray-200" />

        <ScrollArea.Root className="flex-1 min-h-0">
          <ScrollArea.Viewport className="h-full w-full" ref={viewportRef}>
            <div className="p-6 gap-3 flex flex-col">
              {exampleConversation.map((m) => (
                <MessageBar message={m} />
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation="vertical"
            className="w-2 bg-gray-200"
          >
            <ScrollArea.Thumb className="bg-gray-500 rounded-full" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>

        <div className="flex items-center p-4">
          <Input placeholder="Wyślij wiadomość" className="rounded-full" />
          <button className="p-2 ml-2 cursor-pointer">
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleChat;
