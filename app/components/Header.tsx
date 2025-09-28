import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo de Prepaga Argentina */}
          <div className="flex-shrink-0">
            <Image
              src="/images/prepagaargentina.png"
              alt="Prepaga Argentina"
              width={200}
              height={80}
              className="h-12 md:h-20 w-auto header-logo"
              priority
            />
          </div>

          {/* Logo de Sancor Salud */}
          <div className="flex-shrink-0">
            <Image
              src="/images/sancor.png"
              alt="Sancor Salud"
              width={120}
              height={64}
              className="h-6 md:h-16 w-auto header-logo"
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
}
