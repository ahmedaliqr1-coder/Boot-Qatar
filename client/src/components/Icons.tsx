import React from "react";

export function CarIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
      {/* Car body */}
      <rect x="20" y="45" width="60" height="25" rx="3" fill="none" stroke="#004A80" strokeWidth="2" />
      
      {/* Car top */}
      <rect x="30" y="30" width="40" height="15" rx="2" fill="none" stroke="#004A80" strokeWidth="2" />
      
      {/* Left wheel */}
      <circle cx="30" cy="70" r="6" fill="none" stroke="#004A80" strokeWidth="2" />
      <circle cx="30" cy="70" r="3" fill="#004A80" />
      
      {/* Right wheel */}
      <circle cx="70" cy="70" r="6" fill="none" stroke="#004A80" strokeWidth="2" />
      <circle cx="70" cy="70" r="3" fill="#004A80" />
      
      {/* Left headlight */}
      <circle cx="22" cy="50" r="2.5" fill="#004A80" />
      
      {/* Right headlight */}
      <circle cx="78" cy="50" r="2.5" fill="#004A80" />
      
      {/* Antenna */}
      <line x1="50" y1="30" x2="50" y2="18" stroke="#004A80" strokeWidth="1.5" />
    </svg>
  );
}

export function PersonIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="30" r="12" fill="none" stroke="#004A80" strokeWidth="2" />
      
      {/* Hair/Crown */}
      <path d="M 38 28 Q 50 18 62 28" fill="none" stroke="#004A80" strokeWidth="2" strokeLinecap="round" />
      
      {/* Body */}
      <rect x="40" y="42" width="20" height="20" rx="2" fill="none" stroke="#004A80" strokeWidth="2" />
      
      {/* Left arm */}
      <line x1="40" y1="48" x2="28" y2="55" stroke="#004A80" strokeWidth="2" strokeLinecap="round" />
      
      {/* Right arm */}
      <line x1="60" y1="48" x2="72" y2="55" stroke="#004A80" strokeWidth="2" strokeLinecap="round" />
      
      {/* Left leg */}
      <line x1="43" y1="62" x2="40" y2="75" stroke="#004A80" strokeWidth="2" strokeLinecap="round" />
      
      {/* Right leg */}
      <line x1="57" y1="62" x2="60" y2="75" stroke="#004A80" strokeWidth="2" strokeLinecap="round" />
      
      {/* Face details - Eyes */}
      <circle cx="46" cy="28" r="1.5" fill="#004A80" />
      <circle cx="54" cy="28" r="1.5" fill="#004A80" />
    </svg>
  );
}

export function BuildingIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
      {/* Main building */}
      <rect x="25" y="30" width="50" height="50" fill="none" stroke="#004A80" strokeWidth="2" />
      
      {/* Door */}
      <rect x="42" y="60" width="16" height="20" fill="none" stroke="#004A80" strokeWidth="1.5" />
      <circle cx="57" cy="70" r="1.5" fill="#004A80" />
      
      {/* Windows - Row 1 */}
      <rect x="30" y="35" width="8" height="8" fill="none" stroke="#004A80" strokeWidth="1.5" />
      <rect x="42" y="35" width="8" height="8" fill="none" stroke="#004A80" strokeWidth="1.5" />
      <rect x="54" y="35" width="8" height="8" fill="none" stroke="#004A80" strokeWidth="1.5" />
      
      {/* Windows - Row 2 */}
      <rect x="30" y="48" width="8" height="8" fill="none" stroke="#004A80" strokeWidth="1.5" />
      <rect x="42" y="48" width="8" height="8" fill="none" stroke="#004A80" strokeWidth="1.5" />
      <rect x="54" y="48" width="8" height="8" fill="none" stroke="#004A80" strokeWidth="1.5" />
      
      {/* Roof */}
      <polygon points="25,30 50,15 75,30" fill="none" stroke="#004A80" strokeWidth="2" />
      
      {/* Roof detail */}
      <line x1="50" y1="15" x2="50" y2="30" stroke="#004A80" strokeWidth="1" />
    </svg>
  );
}
