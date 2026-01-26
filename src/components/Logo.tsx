import React from 'react';

interface LogoProps {
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = React.memo(({ onClick, className = '', size = 'md' }: LogoProps) => {
  const sizeMap = {
    sm: { height: 'h-36' },
    md: { height: 'h-40' },
    lg: { height: 'h-44' }
  };

  const { height } = sizeMap[size];

  const logoContent = (
    <div className={className}>
      <img 
        src="/images/logo.png" 
        alt="GrowthLabPro" 
        className={`${height} w-auto`}
        style={{objectFit: 'contain'}}
        loading="eager"
        decoding="async"
        width="160"
        height="160"
      />
    </div>
  );

  if (onClick) {
    return (
      <button 
        onClick={onClick} 
        className="flex-shrink-0"
        aria-label="GrowthLabPro Home"
      >
        {logoContent}
      </button>
    );
  }

  return logoContent;
});

Logo.displayName = 'Logo';

export default Logo;

