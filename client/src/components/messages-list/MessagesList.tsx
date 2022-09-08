import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';

import { CHAT_LISTENER } from '../../constants';
import { StoreContext } from '../../contexts/store.context';
import {
  MessageInterface,
  StoreContextInterface,
} from '../../shared/interfaces';
import { randomId, isNullOrEmpty } from '../../shared/utils';
import { Bubble } from '../bubble/Bubble';

export const MessagesList = (): JSX.Element => {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const scrollHelper = useRef<HTMLDivElement>(null);

  const handleNewMessage = useCallback(
    (evt: MessageEvent<string>) => {
      if (isNullOrEmpty(evt.data)) return;
      const newMessage = JSON.parse(evt.data) as MessageInterface;
      setMessages([...messages, newMessage]);
    },
    [messages]
  );

  useEffect(() => {
    scrollHelper.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    const source = new EventSource(CHAT_LISTENER);
    source.addEventListener('message', handleNewMessage);

    return () => source.removeEventListener('message', handleNewMessage);
  }, [handleNewMessage]);

  return (
    <div className='chat__body'>
      {messages.map((msg) => (
        <Bubble
          key={randomId()}
          {...msg}
          isMine={msg.from === storeContext.cache.id}
        />
      ))}
      <div
        className='scrollHelper'
        ref={scrollHelper}
      />
    </div>
  );
};
