import React, { useContext, useEffect, useState } from 'react';

import { ChatInput } from './components/chat-input/ChatInput';
import {
  MessageInterface,
  StoreContextInterface,
  TypingInterface,
} from './shared/interfaces';
import { MessagesList, Typing } from './components';
import { chatService } from './services/chat.service';

import './App.scss';
import { StoreContext } from './contexts/store.context';
import { CHAT_LISTENER } from './constants';
import { isNullOrEmpty } from './shared/utils';

function App(): JSX.Element {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [chatName, setChatName] = useState<string>('Someone');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const sendMessage = async (newMessage: MessageInterface) => {
    if (newMessage.newNick)
      storeContext.changeCache({ nick: newMessage.newNick });
    try {
      await chatService.sendMessage(newMessage);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartTyping = (evt: MessageEvent<string>) => {
    if (isNullOrEmpty(evt.data)) return;
    const typingCommand = JSON.parse(evt.data) as TypingInterface;
    if (typingCommand.from !== storeContext.cache.id) setIsTyping(true);
  };
  const handleStopTyping = (evt: MessageEvent<string>) => {
    if (isNullOrEmpty(evt.data)) return;
    const typingCommand = JSON.parse(evt.data) as TypingInterface;
    if (typingCommand.from !== storeContext.cache.id) setIsTyping(false);
  };

  useEffect(() => {
    const source = new EventSource(CHAT_LISTENER);
    source.addEventListener('start-typing', handleStartTyping);
    source.addEventListener('stop-typing', handleStopTyping);

    return () => {
      source.removeEventListener('start-typing', handleStartTyping);
      source.removeEventListener('stop-typing', handleStopTyping);
    };
  }, []);

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
