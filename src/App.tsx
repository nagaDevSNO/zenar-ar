import { useEffect, useState } from "react";

export default function App() {
  const [volume, setVolume] = useState(0.5);
  const [brightness, setBrightness] = useState(1.0);
  const [activeScene, setActiveScene] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    const onFound = (e: any) => {
      console.log("FOUND:", e.detail?.id);
      setActiveScene(e.detail?.id ?? null);
    };

    const onLost = (e: any) => {
      console.log("LOST:", e.detail?.id);
      setActiveScene(null);
    };

    window.addEventListener("zenar-marker-found", onFound as any);
    window.addEventListener("zenar-marker-lost", onLost as any);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access not supported in this browser.");
    }

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
          inset: 0,
          background: "black",
          opacity: 1 - brightness,
          pointerEvents: "none",
          zIndex: 20,
          transition: "opacity 200ms ease",
        }}
      />

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
          maxWidth: 320,
        }}
      >
        <div style={{ fontWeight: 700, letterSpacing: 0.5 }}>ZenAR</div>
        <div style={{ opacity: 0.8, fontSize: 12, marginTop: 4 }}>
          Active scene: <b>{activeScene ?? "none"}</b>
        </div>
        <div style={{ opacity: 0.6, fontSize: 11, marginTop: 6 }}>
          Test marker: Hiro only
        </div>
      </div>

      {cameraError && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            display: "grid",
            placeItems: "center",
            background: "rgba(0,0,0,0.9)",
            color: "white",
            padding: 24,
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 420 }}>
            <h2 style={{ margin: "0 0 8px" }}>Camera error</h2>
            <p style={{ margin: 0, opacity: 0.8 }}>{cameraError}</p>
            <p style={{ opacity: 0.6, fontSize: 13, marginTop: 12 }}>
              Open this on HTTPS in Safari or Chrome on mobile.
            </p>
          </div>
        </div>
      )}

      <a-scene
        embedded
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true; precision: medium; antialias: true; alpha: true;"
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: true; detectionMode: mono; patternRatio: 0.8;"
      >
        <a-assets>
          <audio
            id="forest-audio"
            src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1326.mp3?filename=forest-with-birds-singing-12053.mp3"
            preload="auto"
            crossOrigin="anonymous"
          ></audio>
        </a-assets>

        <a-marker preset="hiro" id="forest" marker-handler>
          <a-box
            position="0 0.5 0"
            scale="0.5 0.5 0.5"
            color="yellow"
          ></a-box>

          <a-entity
            sound={`src: #forest-audio; autoplay: true; loop: true; volume: ${activeScene === "forest" ? volume : 0}`}
          ></a-entity>
        </a-marker>

        <a-entity camera></a-entity>
      </a-scene>

      <div
        style={{
          position: "fixed",
          left: 12,
          right: 12,
          bottom: 12,
          zIndex: 50,
          maxWidth: 420,
          display: "grid",
          gap: 10,
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 16,
            padding: 12,
            color: "white",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, opacity: 0.85 }}>
            <span>Volume</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            style={{ width: "100%" }}
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>
            Tap the screen once if audio does not start on mobile.
          </div>
        </div>

        <div
          style={{
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 16,
            padding: 12,
            color: "white",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, opacity: 0.85 }}>
            <span>Brightness</span>
            <span>{Math.round(brightness * 100)}%</span>
          </div>
          <input
            style={{ width: "100%" }}
            type="range"
            min={0.1}
            max={1}
            step={0.01}
            value={brightness}
            onChange={(e) => setBrightness(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}