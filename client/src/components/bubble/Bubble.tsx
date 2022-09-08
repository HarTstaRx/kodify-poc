import React from 'react';
import classnames from 'classnames';

import { MessageInterface } from '../../shared/interfaces';

import './Bubble.scss';

interface BubbleProps extends MessageInterface {
  isMine: boolean;
}

export const Bubble = ({
  id,
  text,
  deleted,
  isMine,
  isThinking,
}: BubbleProps): JSX.Element => {
  const classNames = classnames('bubble', {
    own: isMine,
    deleted: deleted?.messageId === id,
    thinking: isThinking,
  });

  const printText = (message: string): string => {
    let text = message;
    text = text.replaceAll('(smile)', '😀');
    text = text.replaceAll('(wink)', '😉');
    return text;
  };

  return (
    <div
      id={id}
      className={classNames}
    >
      {deleted?.messageId === id
        ? `deleted by ${deleted.nick}`
        : printText(text ?? '')}
    </div>
  );
};
