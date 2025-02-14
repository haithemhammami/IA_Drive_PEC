import React, { useEffect, useState } from 'react';

interface StatusPopupProps {
  message: string;
  type: 'error' | 'success';
  onClose: () => void;
}

const StatusPopup: React.FC<StatusPopupProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Wait for fade-out animation to complete
    }, 9500); // Start fading out after 9.5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-100' : 'bg-green-100';
  const textColor = type === 'error' ? 'text-red-700' : 'text-green-700';
  const borderColor = type === 'error' ? 'border-red-300' : 'border-green-300';

  return (
    <div className={`fixed top-4 right-4 z-50 min-w-[200px] max-w-sm ${isVisible ? 'animate-fade-in-down' : 'animate-fade-out-up'}`}>
      <div className={`rounded-lg ${bgColor} p-4 ${textColor} shadow-lg border ${borderColor}`}>
        {message}
      </div>
    </div>
  );
};

export default StatusPopup;