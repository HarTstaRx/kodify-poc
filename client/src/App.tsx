import React, { useState } from 'react';

import { ChatInput } from './components/chat-input/ChatInput';
import { MessageInterface } from './shared/interfaces';
import { MessagesList, Typing } from './components';
import { chatService } from './services/chat.service';

import './App.scss';

function App(): JSX.Element {
  const [chatName, setChatName] = useState<string | undefined>();
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [nick, setNick] = useState<string>('unknown');

  const sendMessage = async (newMessage: MessageInterface) => {
    if (newMessage.newNick) setNick(newMessage.newNick);
    if (!isTyping) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 5000);
    }
    try {
      await chatService.sendMessage(newMessage);
      setMessages([...messages, newMessage]);
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
          <MessagesList
            nick={nick}
            onNickChange={setChatName}
          />
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
