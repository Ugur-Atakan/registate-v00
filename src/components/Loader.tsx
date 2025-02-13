import React, { useEffect } from 'react';

const Loader = () => {
  useEffect(() => {
    const handleLoad = () => {
      const loader = document.getElementById('loader');
      if (loader) {
        loader.style.display = 'none';
      }
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  return (
    <div
      id="loader"
      className="fixed inset-0 bg-gray-200 flex flex-col items-center justify-center z-[9999]"
    >
      <div className="relative">
        {/* Dönen spinner */}
        <div className="w-20 h-20 border-4 border-gray-200 border-t-[rgb(22,73,255)] rounded-full animate-spin"></div>
        {/* Spinner’ın ortasında şirket simgesini andıran bina ikonu */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            {/* Bina gövdesi */}
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            {/* Pencereler */}
            <rect x="7" y="7" width="3" height="3" fill="white" />
            <rect x="14" y="7" width="3" height="3" fill="white" />
            <rect x="7" y="14" width="3" height="3" fill="white" />
            <rect x="14" y="14" width="3" height="3" fill="white" />
          </svg>
        </div>
      </div>
      <p className="mt-4 text-[rgb(22,73,255)] font-semibold">
        Company Formation in USA
      </p>
    </div>
  );
};

export default Loader;
