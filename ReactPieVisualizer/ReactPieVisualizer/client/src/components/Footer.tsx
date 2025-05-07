import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-teal-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 20c-2.5-2.9-5-7.8-5-10.8C1.5 5.7 4.7 2.5 8.2 2.5c2.3 0 4.3 1.2 5.8 3 1.5-1.8 3.5-3 5.8-3 3.5 0 6.7 3.2 6.7 6.7 0 3-2.5 7.9-5 10.8"></path>
                <path d="M12 20c-2.5-2.9-5-7.8-5-10.8 0-1.4.6-2.8 1.6-3.8"></path>
              </svg>
            </span>
            <span className="ml-2 text-lg font-semibold text-slate-800">CarbonSnapshot</span>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-sm text-slate-600 hover:text-teal-500">About</a>
            <a href="#" className="text-sm text-slate-600 hover:text-teal-500">Help</a>
            <a href="#" className="text-sm text-slate-600 hover:text-teal-500">Privacy</a>
            <a href="#" className="text-sm text-slate-600 hover:text-teal-500">Terms</a>
          </div>
        </div>
        <div className="mt-4 text-center md:text-left">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} CarbonSnapshot. All rights reserved. Emission factors based on industry standards and may vary by region.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
