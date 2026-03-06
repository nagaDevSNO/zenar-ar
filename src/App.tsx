import { useEffect, useState } from "react";

export default function App() {
  const [activeScene, setActiveScene] = useState<string | null>(null);

  useEffect(() => {
    const onFound = (e: any) => setActiveScene(e.detail?.id ?? null);
    const onLost = () => setActiveScene(null);

    window.addEventListener("zenar-marker-found", onFound as any);
    window.addEventListener("zenar-marker-lost", onLost as any);

    return () => {
      window.removeEventListener("zenar-marker-found", onFound as any);
      window.removeEventListener("zenar-marker-lost", onLost as any);
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black", overflow: "hidden" }}>
      <div
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          zIndex: 50,
          color: "white",
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 14,
          padding: "10px 12px",
          fontSize: 13,
        }}
      >
        <div style={{ fontWeight: 700 }}>ZenAR Phase 2</div>
        <div style={{ marginTop: 4 }}>
          Active scene: <b>{activeScene ?? "none"}</b>
        </div>
      </div>

      <a-scene
        embedded
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true; precision: medium;"
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: true;"
      >
        <a-marker preset="hiro" id="test" marker-handler>
          <a-box position="0 0.5 0" color="yellow"></a-box>
        </a-marker>

        <a-entity camera></a-entity>
      </a-scene>
    </div>
  );
}