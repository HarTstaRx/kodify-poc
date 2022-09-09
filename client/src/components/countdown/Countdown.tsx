import React, { useState, useRef, useEffect } from 'react';

import { CountdownInterface } from '../../shared/interfaces';

import './Countdown.scss';

export const Countdown = ({
  id,
  seconds,
  url,
}: CountdownInterface): JSX.Element => {
  const intervalRef = useRef<NodeJS.Timer>();
  const [secondsLeft, setSecondsLeft] = useState<number>(seconds ?? 0);
  const [isRedirected, setIsRedirected] = useState<boolean>(false);

  const clearLoop = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (intervalRef.current) clearTimeout(intervalRef.current);
    intervalRef.current = undefined;
  };

  useEffect(() => {
    intervalRef.current = setTimeout(() => {
      if (secondsLeft > 0) setSecondsLeft(secondsLeft - 1);
      else if (!isRedirected) {
        window.open(url);
        setIsRedirected(true);
        clearLoop();
      }
    }, 1000);

    return clearLoop;
  });

  if (isRedirected) {
    return (
      <div
        id={id}
        className='countdown'
      >
        Redirected to&nbsp;{url}
      </div>
    );
  }
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
};
