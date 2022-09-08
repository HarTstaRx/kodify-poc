import React from 'react';
import { MessageInterface } from '../../shared/interfaces';

import './Bubble.scss';

interface BubbleProps extends MessageInterface {
  isMine: boolean;
}

export const Bubble = ({
  text,
  isDeleted,
  isMine,
}: BubbleProps): JSX.Element => {
  if (isDeleted) return <></>;

  return <div className={`bubble${isMine ? ' own' : ''}`}>{text}</div>;
};
