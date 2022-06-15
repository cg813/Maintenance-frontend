import React, { CSSProperties, FC } from 'react';

interface Props {
  fill?: string;
  style?: CSSProperties;
  height?: number;
  width?: number;
}

const Tray: FC<Props> = ({ fill = '#fff', height = 20, width = 20 }) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 19.644 19.644'>
    <path
      fill={fill}
      d='M5.818,16.1a1.642,1.642,0,0,0,1.637,1.637H14A1.642,1.642,0,0,0,15.64,
          16.1V6.274H5.818ZM16.459,3.818H13.594L12.776,3H8.683l-.818.818H5V5.455H16.459Z'
      transform='translate(-0.908 -0.545)'
    />
    <path fill={'none'} d='M0,0H19.644V19.644H0Z' />
  </svg>
);

export default Tray;
