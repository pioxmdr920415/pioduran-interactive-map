import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-0 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 shadow-lg print:relative print:shadow-none">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-right gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="/assets/logo.webp" 
              alt="MDRRMO Logo" 
              className="h-16 w-16 object-contain drop-shadow-lg"
            />
          </div>
          
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-wide drop-shadow-md">
              MDRRMO PIO DURAN
            </h1>
            <p className="text-xs md:text-sm text-blue-100 mt-1 tracking-wider">
              Mitigation • Preparedness • Response • Recovery
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
