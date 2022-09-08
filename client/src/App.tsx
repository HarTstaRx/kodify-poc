import React, { useContext, useState } from 'react';

import { ChatInput } from './components/chat-input/ChatInput';
import { MessageInterface, StoreContextInterface } from './shared/interfaces';
import { MessagesList, Typing } from './components';
import { chatService } from './services/chat.service';

import './App.scss';
import { StoreContext } from './contexts/store.context';

function App(): JSX.Element {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [chatName, setChatName] = useState<string | undefined>();
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const sendMessage = async (newMessage: MessageInterface) => {
    if (newMessage.newNick)
      storeContext.changeCache({ nick: newMessage.newNick });
    if (!isTyping) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 5000);
    }
    try {
      await chatService.sendMessage(newMessage);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='app-container'>
      <header className='app-header'>
        <h1>Chat Application - Proof of concept for Kodify</h1>
      </header>
      <main>
        <div className='chat'>
          <div className='chat__header'>
            {chatName}
            {isTyping ? <Typing /> : <></>}
          </div>
          <MessagesList onNickChange={setChatName} />
          <ChatInput handleSendMessage={sendMessage} />
        </div>
      </main>
      <footer>Proof of concept by David Díez for Kodify</footer>
    </div>
  );
}

export default App;
