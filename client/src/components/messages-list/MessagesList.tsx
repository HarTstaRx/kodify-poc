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
  BubbleInterface,
  DeleteLastInterface,
  FadeLastInterface,
  HighlightCommandInterface,
  MessageCommandInterface,
  StoreContextInterface,
  ThinkCommandInterface,
} from '../../shared/interfaces';
import { isNullOrEmpty } from '../../shared/utils';
import { Bubble } from '../bubble/Bubble';

export const MessagesList = (): JSX.Element => {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [messages, setMessages] = useState<BubbleInterface[]>([]);
  const scrollHelper = useRef<HTMLDivElement>(null);

  type BubbleCommandInterface =
    | MessageCommandInterface
    | HighlightCommandInterface
    | ThinkCommandInterface;
  const handleNewMessage = useCallback(
    (evt: MessageEvent<string>) => {
      if (isNullOrEmpty(evt.data)) return;
      const newMessage = JSON.parse(evt.data) as BubbleCommandInterface;
      setMessages([
        ...messages,
        {
          ...newMessage,
          isMine: newMessage.from === storeContext.cache.userId,
        },
      ]);
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

  const handleFadeLast = useCallback(
    (evt: MessageEvent<string>) => {
      if (isNullOrEmpty(evt.data)) return;
      const fadeLastCommand = JSON.parse(evt.data) as FadeLastInterface;
      setMessages(
        messages.map((m) => {
          if (m.id !== fadeLastCommand.messageId) return m;
          return {
            ...m,
            isFaded: true,
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
    source.addEventListener('fade-last', handleFadeLast as EventListener);

    return () => {
      source.removeEventListener(
        'delete-last',
        handleDeleteLast as EventListener
      );
      source.removeEventListener('fade-last', handleFadeLast as EventListener);
    };
  }, [handleDeleteLast]);

  return (
    <div className='chat__body'>
      {messages.map((msg) => (
        <Bubble
          key={msg.id}
          {...msg}
        />
      ))}
      <div
        className='scrollHelper'
        ref={scrollHelper}
      />
    </div>
  );
};
