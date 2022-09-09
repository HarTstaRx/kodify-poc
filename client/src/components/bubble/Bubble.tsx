import React from 'react';
import classnames from 'classnames';

import { BubbleInterface } from '../../shared/interfaces';

import './Bubble.scss';

export const Bubble = ({
  id,
  isMine,
  text,
  deleted,
  isFaded,
  isThinking,
  isHighlighted,
}: BubbleInterface): JSX.Element => {
  const classNames = classnames('bubble', {
    own: isMine,
    deleted: deleted?.messageId === id,
    thinking: isThinking,
    faded: isFaded,
    hightlighted: isHighlighted,
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
