import CesiumMap from './components/CesiumMap';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* سایدبار سمت چپ */}
      <div className="w-1/5 h-full">
        <Sidebar />
      </div>

      {/* نقشه سمت راست */}
      <div className="map w-4/5 h-full">
        <CesiumMap />
      </div>
    </div>
  );
}

export default App;