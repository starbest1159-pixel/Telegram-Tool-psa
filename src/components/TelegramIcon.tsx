import React from 'react';

export function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Accurate vector representation of paper plane */}
      <path 
        d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM17.893 7.82L15.352 19.805C15.16 20.653 14.658 20.864 13.945 20.464L10.07 17.608L8.2 19.408C7.993 19.615 7.82 19.787 7.42 19.787L7.699 15.836L14.891 9.338C15.204 9.06 14.823 8.905 14.405 9.184L5.514 14.781L1.687 13.583C0.855 13.323 0.84 12.75 1.862 12.35L16.827 6.582C17.52 6.326 18.125 6.741 17.893 7.82Z" 
        fill="#2AABEE"
      />
    </svg>
  );
}

