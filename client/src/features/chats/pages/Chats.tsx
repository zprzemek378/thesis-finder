import React, { useState } from "react";
import FixedHeightLayout from "@/common/layout/FixedHeightLayout";
import ChatsSidebar from "../components/ChatsSidebar";
import SingleChat from "../components/SingleChat";

const Chats = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>();

  return (
    <FixedHeightLayout>
      <div className="h-full flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 flex-1 min-h-0">
          <div className="md:col-span-1 h-full">
            <ChatsSidebar
              onSelectChat={setSelectedChatId}
              selectedChatId={selectedChatId}
            />
          </div>
          <SingleChat chatId={selectedChatId} />
        </div>
      </div>
    </FixedHeightLayout>
  );
};

export default Chats;
