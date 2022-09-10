import React, { useContext, useEffect, useState } from 'react';

import { ChatInput } from './components/chat-input/ChatInput';
import {
  CommandInterface,
  NickInterface,
  StoreContextInterface,
  TypingInterface,
} from './shared/interfaces';
import { MessagesList, Typing } from './components';
import { chatService } from './services/chat.service';
import { StoreContext } from './contexts/store.context';
import { CHAT_LISTENER } from './constants';
import { isNullOrEmpty } from './shared/utils';
import { CommandEnum } from './shared/enums/command.enum';

import './App.scss';

function App(): JSX.Element {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [chatName, setChatName] = useState<string>('Someone');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSendMessage = async (newMessage: CommandInterface) => {
    let promise: Promise<void> = Promise.resolve();
    switch (newMessage.command) {
      case CommandEnum.COUNTDOWN:
        promise = chatService.countdown(newMessage);
        break;
      case CommandEnum.DELETE_LAST:
        promise = chatService.deleteLast(newMessage);
        break;
      case CommandEnum.FADE_LAST:
        promise = chatService.fadeLast(newMessage);
        break;
      case CommandEnum.NICK:
        storeContext.changeCache({ nick: newMessage.nick });
        promise = chatService.changeNick(newMessage);
        break;
      case CommandEnum.THINK:
      case CommandEnum.HIGHLIGHT:
      case CommandEnum.MESSAGE:
        promise = chatService.sendMessage(newMessage);
        break;
    }

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeNick = (evt: MessageEvent<string>) => {
    if (isNullOrEmpty(evt.data)) return;
    const nickCommand = JSON.parse(evt.data) as NickInterface;
    if (nickCommand.from !== storeContext.cache.userId)
      setChatName(nickCommand.nick);
  };
  const handleStartTyping = (evt: MessageEvent<string>) => {
    if (isNullOrEmpty(evt.data)) return;
    const typingCommand = JSON.parse(evt.data) as TypingInterface;
    if (typingCommand.from !== storeContext.cache.userId) setIsTyping(true);
  };
  const handleStopTyping = (evt: MessageEvent<string>) => {
    if (isNullOrEmpty(evt.data)) return;
    const typingCommand = JSON.parse(evt.data) as TypingInterface;
    if (typingCommand.from !== storeContext.cache.userId) setIsTyping(false);
  };

  const subscribeEvents = (source: EventSource) => {
    // EventListener cast needed because typescript doesn't like custom event names
    source.addEventListener('start-typing', handleStartTyping as EventListener);
    source.addEventListener('stop-typing', handleStopTyping as EventListener);
    source.addEventListener('nick', handleChangeNick as EventListener);
  };
  const unsubscribeEvents = (source: EventSource) => {
    source.removeEventListener(
      'start-typing',
      handleStartTyping as EventListener
    );
    source.removeEventListener(
      'stop-typing',
      handleStopTyping as EventListener
    );
    source.removeEventListener('nick', handleChangeNick as EventListener);
    source.close();
  };

  useEffect(() => {
    const source = new EventSource(CHAT_LISTENER);
    subscribeEvents(source);

    return () => unsubscribeEvents(source);
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
          <ChatInput
            handleSendMessage={handleSendMessage}
            handleStartTyping={chatService.startTyping}
            handleStopTyping={chatService.stopTyping}
          />
        </div>
      </main>
      <footer>Proof of concept by David Díez for Kodify</footer>
    </div>
  );
}

export default App;
