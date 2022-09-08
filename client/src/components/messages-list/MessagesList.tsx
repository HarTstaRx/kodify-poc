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
  DeleteLastInterface,
  MessageInterface,
  StoreContextInterface,
} from '../../shared/interfaces';
import { isNullOrEmpty } from '../../shared/utils';
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
      storeContext.changeCache({ lastMessageId: newMessage.id });
    },
    [messages]
  );
  const handleDeleteLast = useCallback(
    (evt: MessageEvent<string>) => {
      if (isNullOrEmpty(evt.data)) return;
      const deleteLastCommand = JSON.parse(evt.data) as DeleteLastInterface;
      setMessages(
        messages.map((m) => {
          if (m.id !== deleteLastCommand.messageId) return m;
          return {
            ...m,
            deleted: deleteLastCommand,
          };
        })
      );
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

  useEffect(() => {
    const source = new EventSource(CHAT_LISTENER);
    // EventListener cast needed because typescript doesn't like custom event names
    source.addEventListener('delete-last', handleDeleteLast as EventListener);

    return () => {
      source.removeEventListener(
        'delete-last',
        handleDeleteLast as EventListener
      );
    };
  }, [handleDeleteLast]);

  return (
    <div className='chat__body'>
      {messages.map((msg) => (
        <Bubble
          key={msg.id}
          {...msg}
          isMine={msg.from === storeContext.cache.userId}
        />
      ))}
      <div
        className='scrollHelper'
        ref={scrollHelper}
      />
    </div>
  );
};
