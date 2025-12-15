// Cesium XR Final – Mono (Mobile) + Stereo (HTC Vive XR Elite)
// Assumptions:
// - HTTPS enabled
// - Vive Browser or compatible WebXR browser
// - Mono VR ONLY for mobile
import { Viewer, Model, useCesium } from "resium";
import { useEffect, useState } from "react";
import { Cartesian3, HeadingPitchRoll, Math as CesiumMath, Transforms } from "cesium";
import WebXRPolyfill from "webxr-polyfill";
import modelUrl from "../assets/output_fixed.gltf";

const CesiumContent = () => {
  const { viewer } = useCesium();
  const [isXRDevice, setIsXRDevice] = useState(false);

  // Detect XR headset (VIVE, Quest, etc.) with immersive-vr support
  useEffect(() => {
    async function checkXRSupport() {
      if (navigator.xr) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-vr');
          const ua = navigator.userAgent || "";
          setIsXRDevice(supported && /VIVE|Quest|XR/i.test(ua));
        } catch (error) {
          console.error("XR support check failed:", error);
        }
      }
    }
    checkXRSupport();
  }, []);

  // Disable ALL mono / orientation logic on XR devices
  useEffect(() => {
    if (!viewer || !isXRDevice) return;
    // Important: DO NOT touch camera in XR – Cesium handles it automatically
  }, [viewer, isXRDevice]);

  // Mobile-only mono VR using deviceorientation
  useEffect(() => {
    if (!viewer || isXRDevice) return;
    const handler = (event) => {
      const heading = CesiumMath.toRadians(event.alpha || 0);
      const pitch = CesiumMath.toRadians((event.beta || 0) - 90);
      viewer.camera.setView({
        orientation: new HeadingPitchRoll(heading, pitch, 0),
      });
    };
    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, [viewer, isXRDevice]);

  // ===== handleModelReady (from original code, corrected) =====
  const centerLon = 49.57840487;
  const centerLat = 37.294837457;
  const centerH = 1.81571149360388;
  const handleModelReady = (model) => {
    if (!viewer || viewer.isDestroyed()) return;
    const boundingSphere = model.boundingSphere;
    if (boundingSphere && boundingSphere.radius > 10) {
      viewer.camera.flyToBoundingSphere(boundingSphere, {
        duration: 2.5,
        offset: new Cesium.HeadingPitchRange(
          0,
          CesiumMath.toRadians(-45),
          boundingSphere.radius * 3
        ),
      });
    } else {
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(centerLon, centerLat, 1000 + centerH),
        orientation: {
          heading: CesiumMath.toRadians(0),
          pitch: CesiumMath.toRadians(-45),
          roll: 0,
        },
        duration: 2.5,
      });
    }
  };

  // Model placement
  const position = Cartesian3.fromDegrees(centerLon, centerLat, centerH);
  const hpr = new HeadingPitchRoll(CesiumMath.toRadians(90), CesiumMath.toRadians(90), 0);
  const modelMatrix = Transforms.headingPitchRollToFixedFrame(position, hpr);

  return (
    <Model
      url={modelUrl}
      modelMatrix={modelMatrix}
      scale={1.0}
      show={true}
      onReady={handleModelReady}
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
      vrButton
      animation={false}
      timeline={false}
      navigationHelpButton={false}
      contextOptions={{ requestWebgl2: true }}
    >
      <CesiumContent />
    </Viewer>
  );
};

export default CesiumMap;