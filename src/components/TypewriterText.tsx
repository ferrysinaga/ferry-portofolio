import React, { useState, useEffect } from 'react';

export interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, delay = 0, speed = 30 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    const timeout = setTimeout(() => {
      setIsStarted(true);
      let i = 0;
      interval = setInterval(() => {
        setDisplayText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay, speed]);

  return (
    <span>
      {!isStarted ? <span className="opacity-0">{text}</span> : displayText}
      {isStarted && <span className="animate-pulse ml-1 font-bold">_</span>}
    </span>
  );
};

export default TypewriterText;