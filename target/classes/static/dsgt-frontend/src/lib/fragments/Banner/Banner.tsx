import React from 'react';

import './Banner.scss';

interface BannerProps {
  message: string;
  color: string;
  isVisible: boolean;
}

const Banner: React.FC<BannerProps> = ({ message, color, isVisible }) => {
  return (
    <div className="banner" style={{ backgroundColor: isVisible ? color : '#d3d3d3' }}>
      {isVisible ? message : ' '}
    </div>
  );
};

export default Banner;