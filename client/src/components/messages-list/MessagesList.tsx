import React, { useState, useRef, useEffect } from 'react';

import { CHAT_LISTENER } from '../../constants';
import { MessageInterface } from '../../shared/interfaces';
import { randomId, isNullOrEmpty } from '../../shared/utils';
import { Bubble } from '../bubble/Bubble';

interface MessagesListProps {
  nick: string;
  onNickChange: (newNick: string) => void;
}
export const MessagesList = ({
  nick,
  onNickChange,
}: MessagesListProps): JSX.Element => {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const scrollHelper = useRef<HTMLDivElement>(null);

  const handleNewMessage = (evt: MessageEvent<string>) => {
    if (isNullOrEmpty(evt.data)) return;
    console.log(evt.data);
    const newMessage = JSON.parse(evt.data) as MessageInterface;
    if (newMessage.newNick) {
      onNickChange(newMessage.newNick);
      return;
    }
    console.log(messages);
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
  );
};
