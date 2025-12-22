// Cesium XR – FINAL SAFE VERSION
// - True Stereo VR (Vive / Quest / Pico)
// - Mono orientation ONLY for mobile (non-XR)
// - NO camera manipulation in XR

import { Viewer, Model, useCesium } from "resium";
import { useEffect, useState } from "react";
import {
  Cartesian3,
  HeadingPitchRoll,
  Math as CesiumMath,
  Transforms,
} from "cesium";
import WebXRPolyfill from "webxr-polyfill";
import modelUrl from "../assets/output_fixed.gltf";

const CesiumContent = () => {
  const { viewer } = useCesium();
  const [isXRDevice, setIsXRDevice] = useState(false);

  // ===== Detect XR headset =====
  useEffect(() => {
    async function detectXR() {
      if (!navigator.xr) return;
      try {
        const supported = await navigator.xr.isSessionSupported("immersive-vr");
        const ua = navigator.userAgent || "";
        setIsXRDevice(supported && /Quest|VIVE|XR|Pico/i.test(ua));
      } catch (e) {
        console.error("XR detection failed", e);
      }
    }
    detectXR();
  }, []);

  // ===== Initial camera positioning (NON-XR ONLY) =====
  useEffect(() => {
    if (!viewer) return;
    if (isXRDevice) return; // 🚫 NEVER touch camera in XR

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(49.57840487, 37.294837457, 1200),
      orientation: {
        heading: 0,
        pitch: CesiumMath.toRadians(-45),
        roll: 0,
      },
      duration: 2.0,
    });
  }, [viewer, isXRDevice]);

  // ===== Mobile mono orientation (NON-XR ONLY) =====
  useEffect(() => {
    if (!viewer) return;
    if (isXRDevice) return;

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

  // ===== Model placement =====
  const centerLon = 49.57840487;
  const centerLat = 37.294837457;
  const centerH = 1.8157;

  const position = Cartesian3.fromDegrees(centerLon, centerLat, centerH);
  const hpr = new HeadingPitchRoll(
    CesiumMath.toRadians(90),
    CesiumMath.toRadians(90),
    0
  );

  const modelMatrix = Transforms.headingPitchRollToFixedFrame(position, hpr);

  return (
    <Model
      url={modelUrl}
      modelMatrix={modelMatrix}
      scale={1.0}
      show
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
