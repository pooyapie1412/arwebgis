import { useState, useRef } from 'react';

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const handleLoadTileset = () => {
    if (typeof window.loadCityGMLTileset === 'function') {
      window.loadCityGMLTileset();
      alert("در حال بارگذاری CityGML...");
    } else {
      alert("Viewer هنوز آماده نیست!");
    }
  };



  return (
    <div className={`sidebar bg-gray-800 text-white  p-4 transition-all duration-300 ${open ? 'w-64' : 'w-16'} z-[1000]`}>
      <button
        className="bg-blue-600 text-white p-2 rounded mb-4 w-full hover:bg-blue-700 z-[1000]"
        onClick={() => setOpen(!open)}
      >
        {open ? 'بستن' : 'باز کردن'}
      </button>
      {open && (
        <>
          {/* دکمه بارگذاری B3DM */}
          <button
            className="bg-green-600 p-2 rounded mb-2 w-full hover:bg-green-700 text-sm"
            onClick={handleLoadTileset}
          >
            بارگذاری CityGML
          </button>
        </>
      )}
    </div>
  );
};

export default Sidebar;