import React, { useContext, useEffect, useState } from 'react';

import { ChatInput } from './components/chat-input/ChatInput';
import {
  MessageInterface,
  NickInterface,
  StoreContextInterface,
  TypingInterface,
} from './shared/interfaces';
import { MessagesList, Typing } from './components';
import { chatService } from './services/chat.service';
import { StoreContext } from './contexts/store.context';
import { CHAT_LISTENER } from './constants';
import { isNullOrEmpty } from './shared/utils';

import './App.scss';

function App(): JSX.Element {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [chatName, setChatName] = useState<string>('Someone');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const changeNick = async (newMessage: MessageInterface) =>
    await chatService.changeNick({
      from: newMessage.from,
      nick: newMessage.newNick ?? chatName,
    });

  const sendMessage = async (newMessage: MessageInterface) =>
    await chatService.sendMessage(newMessage);

  const handleSendMessage = async (newMessage: MessageInterface) => {
    let promise = sendMessage;
    if (newMessage.newNick) {
      storeContext.changeCache({ nick: newMessage.newNick });
      promise = changeNick;
    }
    try {
      await promise(newMessage);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeNick = (evt: MessageEvent<string>) => {
    if (isNullOrEmpty(evt.data)) return;
    const nickCommand = JSON.parse(evt.data) as NickInterface;
    if (nickCommand.from !== storeContext.cache.id)
      setChatName(nickCommand.nick);
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
    // EventListener cast needed because typescript doesn't like custom event names
    source.addEventListener('start-typing', handleStartTyping as EventListener);
    source.addEventListener('stop-typing', handleStopTyping as EventListener);
    source.addEventListener('nick', handleChangeNick as EventListener);

    return () => {
      source.removeEventListener(
        'start-typing',
        handleStartTyping as EventListener
      );
      source.removeEventListener(
        'stop-typing',
        handleStopTyping as EventListener
      );
      source.removeEventListener('nick', handleChangeNick as EventListener);
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
          <MessagesList />
          <ChatInput handleSendMessage={handleSendMessage} />
        </div>
      </main>
      <footer>Proof of concept by David Díez for Kodify</footer>
    </div>
  );
}

export default App;
