import React, { useState, useEffect, useRef } from 'react';

import { ChatInput } from './components/chat-input/ChatInput';
import { CHAT_LISTENER } from './constants';
import { MessageInterface } from './shared/interfaces';
import { Bubble, Typing } from './components';
import { randomId } from './shared/utils';

import './App.scss';

function App(): JSX.Element {
  const [chatName, setChatName] = useState<string | undefined>();
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [nick, setNick] = useState<string>('unknown');
  const scrollHelper = useRef<HTMLDivElement>(null);

  const sendMessage = (newMessage: MessageInterface) => {
    if (newMessage.newNick) setNick(newMessage.newNick);
    if (!isTyping) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 5000);
    }
    setMessages([...messages, newMessage]);
  };

  const handleNewMessage = (evt: MessageEvent<string>) => {
    const newMessage = JSON.parse(evt.data) as MessageInterface;
    if (newMessage.newNick) {
      setChatName(newMessage.newNick);
      return;
    }
    setMessages([...messages, newMessage]);
  };

  useEffect(() => {
    scrollHelper.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    const source = new EventSource(CHAT_LISTENER);
    source.addEventListener('message', handleNewMessage);

    return () => source.removeEventListener('message', handleNewMessage);
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
          <div className='chat__body'>
            {messages.map((msg) => (
              <Bubble
                key={randomId()}
                {...msg}
                isMine={msg.from === nick}
              />
            ))}
            <div
              className='scrollHelper'
              ref={scrollHelper}
            />
          </div>
          <ChatInput
            handleSendMessage={sendMessage}
            currentNick={nick}
          />
        </div>
      </main>
      <footer>Proof of concept by David Díez for Kodify</footer>
    </div>
  );
}

export default App;
