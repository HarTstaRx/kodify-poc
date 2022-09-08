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

  return (
    <div
      id={id}
      className={classNames}
    >
      {deleted?.messageId === id ? `deleted by ${deleted.nick}` : text}
    </div>
  );
};
