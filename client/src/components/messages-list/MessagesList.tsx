import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';

import { CHAT_LISTENER } from '../../constants';
import { StoreContext } from '../../contexts/store.context';
import { CommandEnum } from '../../shared/enums/command.enum';
import {
  BubbleInterface,
  CountdownInterface,
  DeleteLastInterface,
  FadeLastInterface,
  HighlightCommandInterface,
  MessageCommandInterface,
  StoreContextInterface,
  ThinkCommandInterface,
} from '../../shared/interfaces';
import { isNullOrEmpty } from '../../shared/utils';
import { Bubble } from '../bubble/Bubble';
import { Countdown } from '../countdown/Countdown';

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
          isHighlighted: newMessage.command === CommandEnum.HIGHLIGHT,
          isThinking: newMessage.command === CommandEnum.THINK,
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

  const handleCountdown = useCallback(
    (evt: MessageEvent<string>) => {
      if (isNullOrEmpty(evt.data)) return;
      const countdownCommand = JSON.parse(evt.data) as CountdownInterface;
      if (countdownCommand.from === storeContext.cache.userId) return;

      setMessages([
        ...messages,
        {
          id: countdownCommand.id,
          from: countdownCommand.from,
          timestamp: countdownCommand.timestamp,
          text: '',
          countDown: countdownCommand,
          isMine: countdownCommand.from === storeContext.cache.userId,
        },
      ]);
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
    source.addEventListener('countdown', handleCountdown as EventListener);

    return () => {
      source.removeEventListener(
        'delete-last',
        handleDeleteLast as EventListener
      );
      source.removeEventListener('fade-last', handleFadeLast as EventListener);
      source.removeEventListener('countdown', handleCountdown as EventListener);
    };
  }, [handleDeleteLast]);

  return (
    <div className='chat__body'>
      {messages.map((msg) => {
        if (msg.countDown)
          return (
            <Countdown
              key={msg.id}
              {...msg.countDown}
            />
          );
        return (
          <Bubble
            key={msg.id}
            {...msg}
          />
        );
      })}
      <div
        className='scrollHelper'
        ref={scrollHelper}
      />
    </div>
  );
};
