import React from "react";

export function CarIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
      {/* Official MOI Vehicle Plate Icon Style */}
      <path d="M15 55 Q15 45 25 45 L75 45 Q85 45 85 55 L85 70 Q85 75 75 75 L25 75 Q15 75 15 70 Z" fill="none" stroke="#004A80" strokeWidth="2.5" />
      <path d="M25 45 L30 35 Q32 30 40 30 L60 30 Q68 30 70 35 L75 45" fill="none" stroke="#004A80" strokeWidth="2.5" />
      <circle cx="30" cy="75" r="7" fill="white" stroke="#004A80" strokeWidth="2.5" />
      <circle cx="70" cy="75" r="7" fill="white" stroke="#004A80" strokeWidth="2.5" />
      <rect x="35" y="55" width="30" height="10" rx="1" fill="none" stroke="#004A80" strokeWidth="1.5" />
    </svg>
  );
}

export function PersonIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
      {/* Official MOI QID Icon Style (Ghutra/Qatari Dress) */}
      <path d="M50 20 C40 20 35 25 35 35 C35 45 40 50 50 50 C60 50 65 45 65 35 C65 25 60 20 50 20" fill="none" stroke="#004A80" strokeWidth="2.5" />
      <path d="M30 30 Q50 15 70 30 L75 45 Q75 55 65 60 L65 80 L35 80 L35 60 Q25 55 25 45 Z" fill="none" stroke="#004A80" strokeWidth="2.5" />
      <path d="M40 80 L30 90 M60 80 L70 90" stroke="#004A80" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function BuildingIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
      {/* Official MOI Establishment Icon Style */}
      <rect x="20" y="30" width="60" height="50" rx="2" fill="none" stroke="#004A80" strokeWidth="2.5" />
      <path d="M20 30 L50 15 L80 30" fill="none" stroke="#004A80" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="42" y="60" width="16" height="20" fill="none" stroke="#004A80" strokeWidth="2" />
      <rect x="30" y="40" width="10" height="10" rx="1" fill="none" stroke="#004A80" strokeWidth="1.5" />
      <rect x="60" y="40" width="10" height="10" rx="1" fill="none" stroke="#004A80" strokeWidth="1.5" />
    </svg>
  );
}
