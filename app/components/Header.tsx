import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo de Prepaga Argentina */}
          <div className="flex-shrink-0">
            <img
              src="/images/prepagaargentina.png"
              alt="Prepaga Argentina"
              className="h-12 md:h-20 w-auto header-logo"
            />
          </div>

          {/* Logo de Sancor Salud */}
          <div className="flex-shrink-0">
            <img
              src="/images/sancor.png"
              alt="Sancor Salud"
              className="h-6 md:h-16 w-auto header-logo"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
