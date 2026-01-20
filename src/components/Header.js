import React from 'react';

const Header = ({ searchComponent, actionButtons }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 shadow-lg print:relative print:shadow-none">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <img 
                src="/assets/logo.webp" 
                alt="MDRRMO Logo" 
                className="h-14 w-14 object-contain drop-shadow-lg"
              />
            </div>
            
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide drop-shadow-md">
                MDRRMO PIO DURAN
              </h1>
              <p className="text-xs text-blue-100 tracking-wider">
                Mitigation • Preparedness • Response • Recovery
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            {searchComponent}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {actionButtons}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
