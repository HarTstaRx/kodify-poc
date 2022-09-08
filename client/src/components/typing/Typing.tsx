import React from 'react';

import './Typing.scss';

export const Typing = () => {
  return (
    <span className='typing'>
      &nbsp; is typing
      <span className='dot-one'>.</span>
      <span className='dot-two'>.</span>
      <span className='dot-three'>.</span>
    </span>
  );
};
