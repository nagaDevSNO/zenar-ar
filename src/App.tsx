import { useEffect, useState } from "react";

export default function App() {
  const [volume, setVolume] = useState(0.5);
  const [brightness, setBrightness] = useState(1.0);
  const [activeScene, setActiveScene] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    const onFound = (e: any) => setActiveScene(e.detail?.id ?? null);
    const onLost = () => setActiveScene(null);

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
      {/* Brightness overlay */}
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

      {/* Header / status */}
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
          Markers: Hiro = Forest · Kanji = Ocean · LetterA = Rain
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
              Try Chrome/Safari on mobile. Some devices require HTTPS for camera access.
            </p>
          </div>
        </div>
      )}

      {/* AR Scene */}
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono; videoTexture: true;"
        renderer="antialias: true; alpha: true;"
        vr-mode-ui="enabled: false"
      >
        <a-assets>
          {/* Remote audio (no keys). Replace with local files later if you want. */}
          <audio
            id="forest-audio"
            src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1326.mp3?filename=forest-with-birds-singing-12053.mp3"
            preload="auto"
            crossOrigin="anonymous"
          ></audio>
          <audio
            id="ocean-audio"
            src="https://cdn.pixabay.com/download/audio/2021/11/24/audio_3499119565.mp3?filename=ocean-waves-112906.mp3"
            preload="auto"
            crossOrigin="anonymous"
          ></audio>
          <audio
            id="rain-audio"
            src="https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3?filename=soft-rain-ambient-111154.mp3"
            preload="auto"
            crossOrigin="anonymous"
          ></audio>
        </a-assets>

        {/* FOREST - Hiro marker */}
        {/* <a-marker preset="hiro" id="forest" marker-handler>
          <a-entity position="0 0 0">
            <a-plane rotation="-90 0 0" width="2" height="2" color="#2f5d3a" opacity="0.85"></a-plane>

            <a-cylinder position="-0.5 0.5 0" radius="0.05" height="1" color="#4b3621"></a-cylinder>
            <a-sphere position="-0.5 1 0" radius="0.3" color="#2d5a27"></a-sphere>

            <a-cylinder position="0.5 0.4 0.3" radius="0.05" height="0.8" color="#4b3621"></a-cylinder>
            <a-sphere position="0.5 0.8 0.3" radius="0.25" color="#3a6b35"></a-sphere>

            <a-entity
              sound={`src: #forest-audio; autoplay: true; loop: true; volume: ${activeScene === "forest" ? volume : 0}`}
            ></a-entity>

            <a-text value="Forest Sanctuary" position="0 1.5 0" align="center" width="4" color="#fff"></a-text>
          </a-entity>
        </a-marker> */}
        <a-marker preset="hiro">
          <a-box position="0 0.5 0" color="yellow"></a-box>
            </a-marker>

        {/* OCEAN - Kanji marker */}
        <a-marker preset="kanji" id="ocean" marker-handler>
          <a-entity position="0 0 0">
            <a-plane
              rotation="-90 0 0"
              width="2.5"
              height="2.5"
              color="#0077be"
              opacity="0.85"
              animation="property: position; from: 0 0 0; to: 0 0.08 0; dir: alternate; dur: 2000; loop: true"
            ></a-plane>

            <a-sphere position="0.4 0 -0.4" radius="0.2" color="#c2b280"></a-sphere>

            <a-entity
              sound={`src: #ocean-audio; autoplay: true; loop: true; volume: ${activeScene === "ocean" ? volume : 0}`}
            ></a-entity>

            <a-text value="Ocean Serenity" position="0 1.5 0" align="center" width="4" color="#fff"></a-text>
          </a-entity>
        </a-marker>

        {/* RAIN - Letter A pattern marker (patt.a) */}
        <a-marker
          type="pattern"
          url="https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@master/data/data/patt.a"
          id="rain"
          marker-handler
        >
          <a-entity position="0 0 0">
            <a-plane rotation="-90 0 0" width="2" height="2" color="#0b1220" opacity="0.5"></a-plane>

            <a-entity id="rain-particles">
              {Array.from({ length: 22 }).map((_, i) => {
                const x = (Math.random() - 0.5) * 2;
                const z = (Math.random() - 0.5) * 2;
                const startY = 1 + Math.random() * 1.5;
                const dur = 500 + Math.random() * 600;
                return (
                  <a-cylinder
                    key={i}
                    position={`${x} ${startY} ${z}`}
                    radius="0.005"
                    height="0.2"
                    color="#a5f3fc"
                    opacity="0.6"
                    animation={`property: position; to: ${x} 0 ${z}; dur: ${dur}; loop: true; easing: linear`}
                  ></a-cylinder>
                );
              })}
            </a-entity>

            <a-entity
              sound={`src: #rain-audio; autoplay: true; loop: true; volume: ${activeScene === "rain" ? volume : 0}`}
            ></a-entity>

            <a-text value="Rainy Retreat" position="0 1.5 0" align="center" width="4" color="#fff"></a-text>
          </a-entity>
        </a-marker>

        <a-entity camera></a-entity>
      </a-scene>

      {/* Bottom controls */}
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
            Tip: audio may require tapping the screen once on mobile.
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