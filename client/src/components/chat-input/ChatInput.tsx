import React, { useCallback, useContext, useState, useRef } from 'react';

import { StoreContext } from '../../contexts/store.context';
import { CommandEnum } from '../../shared/enums/command.enum';
import {
  CommandInterface,
  StoreContextInterface,
  TypingCommandInterface,
} from '../../shared/interfaces';
import { isNullOrEmpty, randomId } from '../../shared/utils';

interface ChatInputProps {
  handleSendMessage: (newMessage: CommandInterface) => void;
  handleStartTyping: (typingCommand: TypingCommandInterface) => void;
  handleStopTyping: (typingCommand: TypingCommandInterface) => void;
}

export const ChatInput = ({
  handleSendMessage,
  handleStartTyping,
  handleStopTyping,
}: ChatInputProps) => {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [text, setText] = useState<string>('');
  const lastTyped = useRef<Date>(new Date());

  const buildMessage = (): CommandInterface => {
    if (text?.startsWith('/nick ')) {
      return {
        command: CommandEnum.NICK,
        from: storeContext.cache.userId,
        nick: text.replace('/nick ', ''),
      };
    }
    if (text?.startsWith('/countdown ')) {
      const countdown = text.replace('/countdown ', '');
      return {
        id: randomId(),
        timestamp: new Date(),
        command: CommandEnum.COUNTDOWN,
        from: storeContext.cache.userId,
        seconds: parseInt(countdown.split(' ')[0]),
        url: countdown.split(' ')[1],
      };
    }
    if (text?.startsWith('/oops')) {
      return {
        command: CommandEnum.DELETE_LAST,
        from: storeContext.cache.userId,
        nick: storeContext.cache.nick ?? 'Someone',
        messageId: storeContext.cache.lastMessageId ?? '',
      };
    }
    if (text?.startsWith('/fadelast')) {
      return {
        command: CommandEnum.FADE_LAST,
        from: storeContext.cache.userId,
        nick: storeContext.cache.nick ?? 'Someone',
        messageId: storeContext.cache.lastMessageId ?? '',
      };
    }
    const newMessage = {
      id: randomId(),
      from: storeContext.cache.userId,
      timestamp: new Date(),
      text,
    };
    if (text?.startsWith('/highlight ')) {
      return {
        command: CommandEnum.HIGHLIGHT,
        ...newMessage,
        text: text.replace('/highlight ', ''),
      };
    }
    if (text?.startsWith('/think ')) {
      return {
        command: CommandEnum.THINK,
        ...newMessage,
        text: text.replace('/think ', ''),
      };
    }

    return {
      command: CommandEnum.MESSAGE,
      ...newMessage,
    };
  };

  const sendMessage = () => {
    handleSendMessage(buildMessage());
    void handleStopTyping({
      command: CommandEnum.STOP_TYPING,
      from: storeContext.cache.userId,
      nick: storeContext.cache.nick,
    });
    setText('');
  };

  const handleKeyDown = (keyCode: string) => {
    if (keyCode.toLocaleLowerCase() === 'enter') sendMessage();
  };

  const FIVE_SECONDS = 5000;
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const sendStopTyping = () => {
    handleStopTyping({
      command: CommandEnum.STOP_TYPING,
      from: storeContext.cache.userId,
      nick: storeContext.cache.nick,
    });
  };
  const sendStartTyping = () => {
    handleStartTyping({
      command: CommandEnum.START_TYPING,
      from: storeContext.cache.userId,
      nick: storeContext.cache.nick,
    });
  };

  const handleTextChange = useCallback(
    async (newText: string) => {
      setText(newText);
      let lastSeconds = lastTyped.current.getTime();
      let nowSeconds = new Date().getTime();
      if (nowSeconds - lastSeconds > FIVE_SECONDS) sendStartTyping();

      lastTyped.current = new Date();
      await sleep(FIVE_SECONDS);

      lastSeconds = lastTyped.current.getTime();
      nowSeconds = new Date().getTime();
      if (nowSeconds - lastSeconds > FIVE_SECONDS) sendStopTyping();
    },
    [lastTyped]
  );

  return (
    <div className='chat__input'>
      <input
        type='text'
        value={text}
        onChange={(evt) => void handleTextChange(evt.target.value)}
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
