import React, { useState, useRef, useEffect } from 'react';
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
  countDown,
}: BubbleInterface): JSX.Element => {
  const classNames = classnames('bubble', {
    own: isMine,
    deleted: deleted?.messageId === id,
    thinking: isThinking,
    faded: isFaded,
    hightlighted: isHighlighted,
  });

  const intervalRef = useRef<NodeJS.Timer>();
  const [secondsLeft, setSecondsLeft] = useState<number>(
    countDown?.seconds ?? 0
  );

  useEffect(() => {
    if (countDown === undefined) return;
    intervalRef.current = setInterval(() => {
      if (secondsLeft > 0) setSecondsLeft(secondsLeft - 1);
      else window.location.href = countDown.url;
    }, 1000);

    return () => {
      if (intervalRef.current)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        clearInterval(intervalRef.current);
    };
  });

  if (countDown !== undefined) {
    return (
      <div
        id={id}
        className='countdown'
      >
        {secondsLeft}
        <span className='dot-one'>.</span>
        <span className='dot-two'>.</span>
        <span className='dot-three'>.</span>
      </div>
    );
  }

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
