import React, { useCallback, useContext, useState, useRef } from 'react';

import { StoreContext } from '../../contexts/store.context';
import { chatService } from '../../services/chat.service';
import {
  MessageInterface,
  StoreContextInterface,
} from '../../shared/interfaces';
import { isNullOrEmpty } from '../../shared/utils';

interface ChatInputProps {
  handleSendMessage: (newMessage: MessageInterface) => void;
}

export const ChatInput = ({ handleSendMessage }: ChatInputProps) => {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [text, setText] = useState<string | undefined>();
  const lastTyped = useRef<Date>(new Date());

  const buildMessage = (): MessageInterface => {
    const highlighted = text?.startsWith('/highlight ')
      ? text.replace('/highlight ', '')
      : undefined;
    const newNick = text?.startsWith('/nick ')
      ? text.replace('/nick ', '')
      : undefined;
    const thinking = text?.startsWith('/think ')
      ? text.replace('/think ', '')
      : undefined;
    const countdown = text?.startsWith('/countdown ')
      ? text.replace('/countdown ', '')
      : undefined;

    let textToSend: string | undefined;
    if (highlighted) textToSend = highlighted;
    else if (thinking) textToSend = thinking;
    else if (countdown) textToSend = countdown;
    else textToSend = text;

    return {
      from: storeContext.cache.id,
      timestamp: new Date(),
      isDeleted: text === '/oops',
      isFadeLast: text === '/fadelast',
      isHighlighted: highlighted !== undefined,
      newNick: newNick,
      isThinking: thinking !== undefined,
      countDown:
        countdown !== undefined
          ? {
              seconds: parseInt(countdown.split(' ')[0]),
              url: countdown.split(' ')[1],
            }
          : undefined,
      text: textToSend,
    };
  };

  const sendMessage = () => {
    handleSendMessage(buildMessage());
    void chatService.stopTyping({
      from: storeContext.cache.id,
      nick: storeContext.cache.nick,
    });
    setText('');
  };

  const handleKeyDown = (keyCode: string) => {
    if (keyCode.toLocaleLowerCase() === 'enter') sendMessage();
  };

  const FIVE_SECONDS = 5000;
  const sendStopTyping = useCallback(() => {
    const lastSeconds = lastTyped.current.getTime();
    const nowSeconds = new Date().getTime();
    if (nowSeconds - lastSeconds > FIVE_SECONDS)
      void chatService.stopTyping({
        from: storeContext.cache.id,
        nick: storeContext.cache.nick,
      });
  }, [lastTyped]);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const sendStartTyping = async () => {
    void chatService.startTyping({
      from: storeContext.cache.id,
      nick: storeContext.cache.nick,
    });
    await sleep(FIVE_SECONDS);
    sendStopTyping();
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    lastTyped.current = new Date();
    void sendStartTyping();
  };

  return (
    <div className='chat__input'>
      <input
        type='text'
        value={text}
        onChange={(evt) => handleTextChange(evt.target.value)}
        onKeyDown={(evt) => handleKeyDown(evt.key)}
      />
      <button
        onClick={sendMessage}
        disabled={isNullOrEmpty(text)}
      >
        Send
      </button>
    </div>
  );
};
