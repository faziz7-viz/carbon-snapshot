import React from 'react';
import { Home, UploadCloud, BarChart2 } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  hasData: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage, hasData }) => {
  const handleNavigation = (page: string) => {
    // Don't allow going to dashboard if there's no data
    if (page === 'dashboard' && !hasData) {
      return;
    }
    setCurrentPage(page);
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-teal-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 20c-2.5-2.9-5-7.8-5-10.8C1.5 5.7 4.7 2.5 8.2 2.5c2.3 0 4.3 1.2 5.8 3 1.5-1.8 3.5-3 5.8-3 3.5 0 6.7 3.2 6.7 6.7 0 3-2.5 7.9-5 10.8"></path>
                <path d="M12 20c-2.5-2.9-5-7.8-5-10.8 0-1.4.6-2.8 1.6-3.8"></path>
              </svg>
            </span>
            <h1 className="ml-2 text-xl font-bold text-slate-800">CarbonSnapshot</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className={`flex items-center px-3 py-2 text-sm font-medium ${
                currentPage === 'home'
                  ? 'text-teal-500 bg-slate-100'
                  : 'text-slate-700 hover:text-teal-500 hover:bg-slate-100'
              } rounded-md`}
              onClick={() => handleNavigation('home')}
            >
              <Home className="mr-1.5 h-4 w-4" />
              Home
            </button>
            <button
              className={`flex items-center px-3 py-2 text-sm font-medium ${
                currentPage === 'upload'
                  ? 'text-teal-500 bg-slate-100'
                  : 'text-slate-700 hover:text-teal-500 hover:bg-slate-100'
              } rounded-md`}
              onClick={() => handleNavigation('upload')}
            >
              <UploadCloud className="mr-1.5 h-4 w-4" />
              Upload
            </button>
            <button
              className={`flex items-center px-3 py-2 text-sm font-medium ${
                !hasData
                  ? 'text-slate-400 cursor-not-allowed'
                  : currentPage === 'dashboard'
                  ? 'text-teal-500 bg-slate-100'
                  : 'text-slate-700 hover:text-teal-500 hover:bg-slate-100'
              } rounded-md`}
              onClick={() => handleNavigation('dashboard')}
              disabled={!hasData}
            >
              <BarChart2 className="mr-1.5 h-4 w-4" />
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
