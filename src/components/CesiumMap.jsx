import { Viewer, Model, useCesium } from "resium";
import { useEffect } from "react";
import {
  Cartesian3,
  HeadingPitchRoll,
  Math as CesiumMath,
  Transforms,
} from "cesium";
import WebXRPolyfill from "webxr-polyfill";
import modelUrl from "../assets/output_fixed.gltf";

/* =========================
   Cesium Scene Content
========================= */
const CesiumContent = () => {
  const { viewer } = useCesium();

  // ===== ONLY valid XR state =====
  const isXRActive =
    viewer?.scene?.xr?.enabled === true;

  /* =========================
     Initial camera (NON-XR ONLY)
  ========================= */
  useEffect(() => {
    if (!viewer) return;
    if (isXRActive) return;

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        49.57840487,
        37.294837457,
        1200
      ),
      orientation: {
        heading: 0,
        pitch: CesiumMath.toRadians(-45),
        roll: 0,
      },
      duration: 2.0,
    });
  }, [viewer, isXRActive]);

  /* =========================
     Mobile mono orientation
     (STRICTLY NON-XR)
  ========================= */
  useEffect(() => {
    if (!viewer) return;
    if (isXRActive) return;

    const handler = (event) => {
      viewer.camera.setView({
        orientation: new HeadingPitchRoll(
          CesiumMath.toRadians(event.alpha || 0),
          CesiumMath.toRadians((event.beta || 0) - 90),
          0
        ),
      });
    };

    window.addEventListener("deviceorientation", handler);
    return () =>
      window.removeEventListener("deviceorientation", handler);
  }, [viewer, isXRActive]);

  /* =========================
     Model placement ONLY
     (Never touch camera)
  ========================= */
  const modelMatrix = Transforms.headingPitchRollToFixedFrame(
    Cartesian3.fromDegrees(
      49.57840487,
      37.294837457,
      1.8157
    ),
    new HeadingPitchRoll(
      CesiumMath.toRadians(90),
      CesiumMath.toRadians(90),
      0
    )
  );

  return (
    <Model
      url={modelUrl}
      modelMatrix={modelMatrix}
      scale={1.0}
      show
    />
  );
};

/* =========================
   Cesium Viewer Wrapper
========================= */
const CesiumMap = () => {
  useEffect(() => {
    // Polyfill ONLY if native WebXR is missing
    if (
      typeof navigator !== "undefined" &&
      !("xr" in navigator)
    ) {
      new WebXRPolyfill();
    }
  }, []);

  return (
    <Viewer
      full
      vrButton
      animation={false}
      timeline={false}
      navigationHelpButton={false}
      contextOptions={{
        requestWebgl2: true,
        alpha: false,
      }}
    >
      <CesiumContent />
    </Viewer>
  );
};

export default CesiumMap;
