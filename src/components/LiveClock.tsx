import { useState, useEffect } from 'react';

const LiveClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Bangkok'
    };
    return date.toLocaleDateString('th-TH', options);
  };

  return (
    <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-full">
      <span className="text-red-600 font-medium text-sm">
        {formatDate(currentTime)}
      </span>
    </div>
  );
};

export default LiveClock;