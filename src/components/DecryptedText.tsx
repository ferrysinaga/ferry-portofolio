import { useState, useEffect } from 'react';

const DecryptedText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}:"<>?|[]~\\-\';,./';

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      setIsStarted(true);
      let iteration = 0;
      interval = setInterval(() => {
        setDisplayText(
          text.split('').map((char, index) => {
            if (index < iteration) return text[index];
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('')
        );
        if (iteration >= text.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 40);
    }, delay);
    return () => { clearTimeout(timeout); if (interval) clearInterval(interval); };
  }, [text, delay]);

  return <span>{!isStarted ? <span className="opacity-0">{text}</span> : displayText}</span>;
};

export default DecryptedText;