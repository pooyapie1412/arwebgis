import { Viewer, Model, useCesium } from "resium";
import { useEffect } from "react";
import { Cartesian3, Math as CesiumMath, HeadingPitchRoll, Transforms } from "cesium";
import WebXRPolyfill from "webxr-polyfill";
import { Ion } from "cesium";
import { EllipsoidTerrainProvider } from "cesium";

Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NGQ4MGQzYy00YmFjLTQ0MTQtYjdjNy0wZjU3NGJlM2ExNTciLCJpZCI6MzM1MDQ0LCJpYXQiOjE3NjE0ODgyMjh9.34QRLJ1yTWW2neUreWfN1RRqDoffO3Lkzafc5emXf2w";


const CesiumContent = () => {
  const { viewer } = useCesium();

  useEffect(() => {
    if (viewer) {
      // مهم: terrain خاموش
      viewer.terrainProvider = new EllipsoidTerrainProvider();
      viewer.scene.globe.depthTestAgainstTerrain = false;
    }
  }, [viewer]);

  useEffect(() => {
    if (viewer) {
      window.CESIUM_VIEWER = viewer; // ⬅️ ثبت viewer برای دکمه VR در Sidebar
      const vrButton = viewer.vrButton; // دسترسی به VRButtonViewModel
      if (vrButton) {
        vrButton.viewModel.isVRButtonVisible = true; // forc visible
        vrButton.viewModel.isVREnabled = true; // اگر لازم
      }
    }
  }, [viewer]);
  

  useEffect(() => {
    new WebXRPolyfill();

    // Load Eruda فقط روی موبایل
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {


        const canvas = viewer.scene.canvas; // یا document.querySelector('canvas')
        
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/eruda"; // از CDN
        script.onload = () => {
          // window.eruda.init(); // فعال کردن کنسول
          // console.log("Eruda loaded!"); // تست
          // viewer.vrButton.viewModel.command();
          // if (canvas.requestFullscreen) {
          //   console.log('Fullscreen supported on canvas');
          // } else {
          //   console.log('Fullscreen NOT supported');
          // }
          // if (navigator.xr) {
          //   navigator.xr.isSessionSupported('immersive-vr').then(supported => {
          //     console.log('VR supported:', supported); // این رو در Eruda ببین
          //   }).catch(err => console.error('VR check error:', err));
          // } else {
          //   console.log('No WebXR support');
          // }
          const vm = viewer.vrButton.viewModel;
          vm.isVRButtonVisible = true;  // forc visible
          vm.isVREnabled = true;
          // if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          //   DeviceOrientationEvent.requestPermission()
          //     .then(permissionState => {
          //       console.log('Motion permission:', permissionState); // 'granted' باید باشه
          //     })
          //     .catch(console.error);
          // } else {
          //   console.log('No permission request needed');
          // }
        };
        document.body.appendChild(script);

        
          }
    }, []);

  // موقعیت تهران
  const position = Cartesian3.fromDegrees(54.461375, 36.839126, 50); // lon, lat, height
  const hpr = new HeadingPitchRoll(
    CesiumMath.toRadians(0),   // heading
    CesiumMath.toRadians(0),   // pitch
    CesiumMath.toRadians(0)    // roll
  );
  const modelMatrix = Transforms.headingPitchRollToFixedFrame(position, hpr);

  const handleModelReady = (model) => {
    if (!viewer || viewer.isDestroyed()) return;

    const boundingSphere = model.boundingSphere;
    if (boundingSphere) {
      viewer.camera.flyToBoundingSphere(boundingSphere, {
        duration: 2.5,
        offset: new HeadingPitchRoll(
          CesiumMath.toRadians(0),
          CesiumMath.toRadians(-30),
          boundingSphere.radius * 2
        ),
      });
    }

    if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
      DeviceOrientationEvent?.requestPermission()
        .then(permissionState => {
          console.log('Motion permission:', permissionState);
          if (permissionState === 'granted') {
            // forc visible کردن دکمه VR اگر مجوز OK باشه
            if (viewer.vrButton) {
              const vm = viewer.vrButton.viewModel;
              vm.isVRButtonVisible = true;
              vm.isVREnabled = true;
              console.log('VR button forced visible');
            }
          } else {
            console.error('Motion permission denied');
          }
        })
        .catch(err => console.error('Permission error:', err));
    } else {
      console.log('No permission request needed - assuming granted');
      // forc visible اگر مجوز لازم نباشه
      if (viewer.vrButton) {
        const vm = viewer.vrButton.viewModel;
        vm.isVRButtonVisible = true;
        vm.isVREnabled = true;
      }
    }
  };

  return (
    <Model
      url="/assets/FeatureIdAttribute.gltf"
      modelMatrix={modelMatrix} // مهم: مدل روی موقعیت تهران
      scale={100.0}             // مقیاس بزرگتر چون مدل نرمال 0-1 است
      minimumPixelSize={128}
      show
      onReady={handleModelReady}
      onError={(e) => console.error("❌ Model error:", e)}
    />
  );
};

const CesiumMap = () => {
  useEffect(() => {
    new WebXRPolyfill();
  }, []);

  

  return (
    <Viewer
      full
      // style={{ height: "100vh", width: "100%" }}
      homeButton
      sceneModePicker
      navigationHelpButton
      fullscreenButton
      vrButton
      animation={false}
    >
      <CesiumContent />
    </Viewer>
  );
};

export default CesiumMap;
