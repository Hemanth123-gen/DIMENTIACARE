import React from 'react';

export const SVGBrain: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Left hemisphere */}
    <path d="M50 85c-15 0-25-10-25-25 0-5 3-10 8-12 1-3 1-8 4-11 5-5 13-5 18 0l3 4c3-4 10-4 15 0 3 3 3 8 4 11 5 2 8 7 8 12 0 15-10 25-25 25Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
    <path d="M50 20v65" stroke="#0284c7" strokeWidth="3" strokeDasharray="2 2" />
    {/* Folds */}
    <path d="M35 55c5 0 7-5 12-5M30 43c4 2 8-2 10-6M65 55c-5 0-7-5-12-5M70 43c-4 2-8-2-10-6" />
    {/* Small sparks */}
    <circle cx="28" cy="30" r="1.5" fill="#0284c7" />
    <circle cx="72" cy="30" r="1.5" fill="#0284c7" />
    <circle cx="50" cy="15" r="2" fill="#36B37E" />
  </svg>
);

export const SVGPicnic: React.FC<{ className?: string }> = ({ className = "w-full h-32" }) => (
  <svg viewBox="0 0 200 120" className={className}>
    <rect width="200" height="120" rx="10" fill="#EAF8F0" />
    {/* Mountain background (NER theme - Shillong hills) */}
    <path d="M10 90 l30-40 l45 35 l50-50 l55 55 Z" fill="#C8ECD8" opacity="0.6" />
    {/* Picnic mat */}
    <polygon points="50,90 150,90 170,115 30,115" fill="#E85B5B" />
    <polygon points="60,90 140,90 155,115 45,115" fill="#FFFFFF" opacity="0.4" />
    {/* Basket */}
    <rect x="90" y="85" width="20" height="14" rx="2" fill="#F5A623" />
    <path d="M90 85 Q100 75 110 85" fill="none" stroke="#F5A623" strokeWidth="2" />
    {/* Smiling Sun */}
    <circle cx="160" cy="30" r="12" fill="#F5A623" />
    <circle cx="160" cy="30" r="15" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
    {/* Tree */}
    <rect x="25" y="65" width="6" height="25" fill="#8B5A2B" />
    <circle cx="28" cy="55" r="16" fill="#36B37E" />
  </svg>
);

export const SVGOldHouse: React.FC<{ className?: string }> = ({ className = "w-full h-32" }) => (
  <svg viewBox="0 0 200 120" className={className}>
    <rect width="200" height="120" rx="10" fill="#FFF3DF" />
    {/* Sky */}
    <circle cx="40" cy="35" r="20" fill="#FFFFFF" opacity="0.5" />
    {/* Classic Assam-type house styling */}
    <polygon points="50,85 100,50 150,85" fill="#E85B5B" />
    <rect x="60" y="85" width="80" height="30" fill="#FFFFFF" stroke="#20243A" strokeWidth="2" />
    {/* Post pillars */}
    <line x1="70" y1="85" x2="70" y2="115" stroke="#6B7280" strokeWidth="2" />
    <line x1="130" y1="85" x2="130" y2="115" stroke="#6B7280" strokeWidth="2" />
    {/* Door */}
    <rect x="92" y="93" width="16" height="22" rx="1" fill="#8B5A2B" />
    {/* Window */}
    <rect x="72" y="93" width="12" height="12" fill="#4C8DFF" />
    <rect x="116" y="93" width="12" height="12" fill="#4C8DFF" />
    {/* Flowers */}
    <circle cx="160" cy="105" r="5" fill="#E85B5B" />
    <circle cx="168" cy="108" r="4" fill="#F5A623" />
  </svg>
);

export const SVGFestival: React.FC<{ className?: string }> = ({ className = "w-full h-32" }) => (
  <svg viewBox="0 0 200 120" className={className}>
    <rect width="200" height="120" rx="10" fill="#e1f0fc" />
    {/* Bihu dhol / drum */}
    <ellipse cx="100" cy="60" rx="28" ry="16" fill="#8B5A2B" stroke="#20243A" strokeWidth="2" />
    <path d="M72 45 L72 75 M128 45 L128 75" stroke="#FFFFFF" strokeWidth="3" />
    <path d="M72 60 L128 60" stroke="#F5A623" strokeWidth="1" strokeDasharray="2 2" />
    {/* Jaapi (Traditional Assamese sunshade hat) */}
    <circle cx="150" cy="40" r="15" fill="#FFF" stroke="#E85B5B" strokeWidth="2" />
    <circle cx="150" cy="40" r="8" fill="#none" stroke="#36B37E" strokeWidth="2" />
    <polygon points="150,22 153,30 162,30 155,35 158,44 150,38 142,44 145,35 138,30 147,30" fill="#E85B5B" />
    {/* Decorative swirls representing music */}
    <path d="M40 30 Q50 20 60 30 T80 30" fill="none" stroke="#1e70c2" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 45 Q40 35 50 45 T70 45" fill="none" stroke="#4C8DFF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const SVGMotivation: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <circle cx="32" cy="32" r="30" fill="#EAF8F0" stroke="#36B37E" strokeWidth="3" />
    {/* Thumbs up */}
    <path d="M22 42 h4 v-14 h-4 Z M26 30 C26 25 32 20 34 16 C36 12 39 12 39 15 C39 18 36 24 36 28 h10 C49 28 50 30 50 32 C50 33 49 35 48 36 C50 37 50 39 49 41 C48 43 46 44 45 44 C46 45 46 47 44 48 C42 49 32 49 26 49" fill="#36B37E" stroke="#36B37E" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const SVGElderlyMaleAvatar: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <circle cx="32" cy="32" r="30" fill="#f0f7fd" stroke="#0284c7" strokeWidth="2" />
    {/* Hair - Grey short cropped */}
    <path d="M18 26 C16 14 48 14 46 26 C43 20 21 20 18 26" fill="#E5E7EB" />
    <path d="M15 28 C18 16 46 16 49 28 C45 22 19 22 15 28" fill="#D1D5DB" />
    {/* Face */}
    <circle cx="32" cy="35" r="14" fill="#FEE2E2" />
    {/* Eyebrows */}
    <path d="M22 28 Q26 26 29 29" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M42 28 Q38 26 35 29" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Glasses */}
    <circle cx="26" cy="32" r="4.5" stroke="#1F2937" strokeWidth="2" fill="none" />
    <circle cx="38" cy="32" r="4.5" stroke="#1F2937" strokeWidth="2" fill="none" />
    <line x1="30.5" y1="32" x2="33.5" y2="32" stroke="#1F2937" strokeWidth="2" />
    {/* Mustache */}
    <path d="M25 38 Q32 40 39 38 Q32 43 25 38" fill="#9CA3AF" stroke="#9CA3AF" strokeWidth="1" />
    {/* Smile */}
    <path d="M28 42 Q32 45 36 42" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Traditional scarf */}
    <path d="M20 48 h24 v10 h-24 Z" fill="#E85B5B" />
    <path d="M23 48 v10 M28 48 v10 M33 48 v10 M38 48 v10 M41 48 v10" stroke="#FFFFFF" strokeWidth="1.5" />
  </svg>
);

export const SVGElderlyFemaleAvatar: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <circle cx="32" cy="32" r="30" fill="#FFF5F5" stroke="#0284c7" strokeWidth="2" />
    {/* Hair Bun at top */}
    <circle cx="32" cy="14" r="7" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1" />
    {/* Hair - Grey long parted */}
    <path d="M16 28 C16 12 48 12 48 28 C42 22 22 22 16 28" fill="#E5E7EB" />
    <path d="M18 28 C23 18 41 18 46 28" fill="#D1D5DB" />
    {/* Face */}
    <circle cx="32" cy="35" r="14" fill="#FEF3C7" />
    {/* Bindi (Traditional red dot) */}
    <circle cx="32" cy="27" r="1.5" fill="#EF4444" />
    {/* Eyebrows */}
    <path d="M22 29 Q26 27 29 30" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <path d="M42 29 Q38 27 35 30" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    {/* Glasses */}
    <circle cx="26" cy="33" r="4.5" stroke="#1F2937" strokeWidth="1.8" fill="none" />
    <circle cx="38" cy="33" r="4.5" stroke="#1F2937" strokeWidth="1.8" fill="none" />
    <line x1="30.5" y1="33" x2="33.5" y2="33" stroke="#1F2937" strokeWidth="1.8" />
    {/* Smile */}
    <path d="M27 41 Q32 45 37 41" stroke="#1F2937" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    {/* Traditional scarf or clothing collar */}
    <path d="M20 48 C24 45 40 45 44 48 L44 58 L20 58 Z" fill="#F59E0B" />
    <path d="M20 48 Q32 52 44 48" stroke="#D97706" strokeWidth="1.5" fill="none" />
  </svg>
);

export const SVGElderlyAvatar: React.FC<{ className?: string; gender?: 'Male' | 'Female' }> = ({ className = "w-16 h-16", gender }) => {
  if (gender === 'Female') {
    return <SVGElderlyFemaleAvatar className={className} />;
  }
  return <SVGElderlyMaleAvatar className={className} />;
};

export const SVGCaregiverAvatar: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <circle cx="32" cy="32" r="30" fill="#EAF8F0" stroke="#36B37E" strokeWidth="2" />
    {/* Hair */}
    <path d="M16 24 C20 12 44 12 48 24" fill="#20243A" />
    {/* Face */}
    <circle cx="32" cy="34" r="14" fill="#FDE047" opacity="0.7" />
    {/* Eyes */}
    <circle cx="27" cy="32" r="2" fill="#20243A" />
    <circle cx="37" cy="32" r="2" fill="#20243A" />
    {/* Smile */}
    <path d="M27 40 Q32 44 37 40" stroke="#20243A" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const SVGHornbill: React.FC<{ className?: string }> = ({ className = "w-full h-32" }) => (
  <svg viewBox="0 0 200 120" className={className}>
    <rect width="200" height="120" rx="10" fill="#fef3c7" />
    {/* Hills in background */}
    <path d="M0 90 Q40 50 100 80 T200 90 L200 120 L0 120 Z" fill="#b45309" opacity="0.15" />
    
    {/* Bamboo Gateway Arch */}
    <path d="M30 110 C 30 40, 170 40, 170 110" fill="none" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
    <path d="M40 110 C 40 50, 160 50, 160 110" fill="none" stroke="#b45309" strokeWidth="3" />
    {/* Cross-beams */}
    <line x1="60" y1="57" x2="140" y2="57" stroke="#d97706" strokeWidth="2" />
    <line x1="48" y1="75" x2="152" y2="75" stroke="#d97706" strokeWidth="2" />
    <line x1="38" y1="95" x2="162" y2="95" stroke="#d97706" strokeWidth="2" />
    
    {/* Hornbill Bird in center */}
    <path d="M85 45 C85 35, 115 35, 115 45 C115 50, 95 55, 85 45 Z" fill="#1e293b" />
    <path d="M100 37 C100 30, 115 33, 115 37" fill="#f59e0b" /> {/* Beak */}
    <circle cx="93" cy="42" r="1.5" fill="#ffffff" />
    
    {/* Text on gateway */}
    <rect x="50" y="60" width="100" height="10" rx="2" fill="#d97706" />
    <text x="100" y="65" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">HORNBILL FESTIVAL</text>
    
    {/* Traditional Naga dancers (simple icons) */}
    {/* Dancer 1 */}
    <circle cx="65" cy="98" r="3" fill="#1e293b" />
    <line x1="65" y1="101" x2="65" y2="115" stroke="#1e293b" strokeWidth="2" />
    <path d="M65 93 L63 90 L61 93 Z" fill="#ef4444" /> {/* Headband feather */}
    <rect x="62" y="103" width="6" height="8" fill="#ef4444" /> {/* Red vest */}
    
    {/* Dancer 2 */}
    <circle cx="135" cy="98" r="3" fill="#1e293b" />
    <line x1="135" y1="101" x2="135" y2="115" stroke="#1e293b" strokeWidth="2" />
    <path d="M135 93 L133 90 L131 93 Z" fill="#ef4444" />
    <rect x="132" y="103" width="6" height="8" fill="#ef4444" />
  </svg>
);

export const SVGDiwali: React.FC<{ className?: string }> = ({ className = "w-full h-32" }) => (
  <svg viewBox="0 0 200 120" className={className}>
    <rect width="200" height="120" rx="10" fill="#1e1b4b" />
    
    {/* Background Bokeh / Lights */}
    <circle cx="30" cy="30" r="4" fill="#fef08a" opacity="0.3" filter="blur(1px)" />
    <circle cx="70" cy="20" r="6" fill="#fef08a" opacity="0.2" filter="blur(1px)" />
    <circle cx="120" cy="35" r="5" fill="#fde047" opacity="0.3" filter="blur(1px)" />
    <circle cx="170" cy="25" r="7" fill="#fde047" opacity="0.2" filter="blur(1px)" />
    
    {/* Hanging Lantern (Kandil) in center background */}
    <line x1="100" y1="0" x2="100" y2="15" stroke="#f59e0b" strokeWidth="1" />
    <polygon points="90,15 110,15 105,30 95,30" fill="#ef4444" stroke="#f59e0b" strokeWidth="1" />
    <polygon points="95,30 105,30 100,45" fill="#f59e0b" />
    
    {/* Colorful Rangoli floor pattern */}
    <ellipse cx="100" cy="100" rx="60" ry="20" fill="none" stroke="#db2777" strokeWidth="3" />
    <ellipse cx="100" cy="100" rx="45" ry="15" fill="none" stroke="#3b82f6" strokeWidth="2" />
    <ellipse cx="100" cy="100" rx="30" ry="10" fill="none" stroke="#ef4444" strokeWidth="1.5" />
    
    {/* Center Diya (Large) */}
    <path d="M85 95 C85 85, 115 85, 115 95 C115 105, 85 105, 85 95 Z" fill="#b45309" stroke="#78350f" strokeWidth="1" />
    <path d="M90 95 C90 92, 110 92, 110 95 Z" fill="#d97706" />
    {/* Flame */}
    <path d="M100 93 C97 90, 97 78, 100 70 C103 78, 103 90, 100 93 Z" fill="#f59e0b" />
    <path d="M100 93 C98.5 91, 98.5 83, 100 78 C101.5 83, 101.5 91, 100 93 Z" fill="#fde047" />
    
    {/* Left Diya (Small) */}
    <path d="M50 90 C50 82, 70 82, 70 90 C70 98, 50 98, 50 90 Z" fill="#b45309" stroke="#78350f" strokeWidth="1" />
    <path d="M60 88 C58.5 86, 58.5 80, 60 76 C61.5 80, 61.5 86, 60 88 Z" fill="#f59e0b" />
    
    {/* Right Diya (Small) */}
    <path d="M130 90 C130 82, 150 82, 150 90 C150 98, 130 98, 130 90 Z" fill="#b45309" stroke="#78350f" strokeWidth="1" />
    <path d="M140 88 C138.5 86, 138.5 80, 140 76 C141.5 80, 141.5 86, 140 88 Z" fill="#f59e0b" />
  </svg>
);
