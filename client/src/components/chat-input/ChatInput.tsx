import React, { useContext, useState } from 'react';

import { StoreContext } from '../../contexts/store.context';
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
    setText('');
  };

  const handleKeyDown = (keyCode: string) => {
    if (keyCode.toLocaleLowerCase() === 'enter') sendMessage();
  };

  return (
    <div className='chat__input'>
      <input
        type='text'
        value={text}
        onChange={(evt) => setText(evt.target.value)}
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
