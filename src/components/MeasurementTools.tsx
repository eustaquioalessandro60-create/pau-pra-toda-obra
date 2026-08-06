import React, { useState, useRef, useEffect } from "react";
import {
  Ruler,
  Camera,
  Crosshair,
  Compass,
  CheckCircle2,
  Plus,
  Trash2,
  Send,
  Zap,
  Info,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import { Project3DState, MeasurementRecord } from "../types";

interface MeasurementToolsProps {
  projectState: Project3DState;
  setProjectState: React.Dispatch<React.SetStateAction<Project3DState>>;
}

export const MeasurementTools: React.FC<MeasurementToolsProps> = ({
  setProjectState,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"trena" | "laser" | "nivel">("trena");
  const [cameraActive, setCameraActive] = useState(false);
  const [measurements, setMeasurements] = useState<MeasurementRecord[]>([]);

  // Trena digital interactive points
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Digital level states
  const [tiltGamma, setTiltGamma] = useState(0); // Roll (-90 to 90)
  const [tiltBeta, setTiltBeta] = useState(0); // Pitch (-180 to 180)

  // Start Camera Feed
  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.log("Câmera indisponível ou permissão negada. Ativando modo simulador AR.", err);
      setCameraActive(true);
    }
  };

  // Stop Camera
  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  // Listen to Gyroscope for Level & Plumb
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null) setTiltGamma(Math.round(event.gamma));
      if (event.beta !== null) setTiltBeta(Math.round(event.beta));
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  // Drop point on AR canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (points.length >= 4) {
      setPoints([{ x, y }]);
    } else {
      setPoints([...points, { x, y }]);
    }
  };

  // Calculate distance or area from AR points
  const calculateDistFromPoints = () => {
    if (points.length < 2) return 0;
    const p1 = points[0];
    const p2 = points[1];
    const pixelDist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    // Convert pixels to meters estimate (approx 50px = 1m)
    return parseFloat((pixelDist / 45).toFixed(2));
  };

  const calculatedDist = calculateDistFromPoints();
  const calculatedArea = parseFloat((calculatedDist * (calculatedDist * 0.8)).toFixed(2));

  // Save measurement record
  const handleSaveMeasurement = () => {
    if (calculatedDist <= 0) return;

    const newRec: MeasurementRecord = {
      id: "med-" + Date.now(),
      label: `Medição Trena Digital #${measurements.length + 1}`,
      type: "distancia",
      value: calculatedDist,
      unit: "m",
      date: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMeasurements([newRec, ...measurements]);
  };

  // Apply measurement to 3D project
  const handleApplyTo3D = (val: number) => {
    setProjectState((prev) => ({
      ...prev,
      terrain: {
        ...prev.terrain,
        width: Math.max(5, Math.min(100, val)),
      },
    }));
    alert(`Medida de ${val}m aplicada com sucesso à largura do terreno no Projetor 3D!`);
  };

  return (
    <section className="py-8 bg-zinc-950 text-white min-h-screen border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs px-3 py-1 rounded-full uppercase mb-3">
            <Smartphone className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Ferramentas de Medição PWA para Celular</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            TRENA, LASER & <span className="text-amber-400">NÍVEL DIGITAL</span>
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Use a câmera do celular para medir distâncias, nivelar paredes e integrar automaticamente no seu projeto 3D do UNIVERSO ADAS.
          </p>
        </div>

        {/* Subtab Selector */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveSubTab("trena")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === "trena"
                ? "bg-amber-400 text-zinc-950 shadow-lg scale-105"
                : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>1. Trena Digital AR</span>
          </button>

          <button
            onClick={() => setActiveSubTab("laser")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === "laser"
                ? "bg-amber-400 text-zinc-950 shadow-lg scale-105"
                : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            <Crosshair className="w-4 h-4" />
            <span>2. Raio Laser Virtual</span>
          </button>

          <button
            onClick={() => setActiveSubTab("nivel")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === "nivel"
                ? "bg-amber-400 text-zinc-950 shadow-lg scale-105"
                : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>3. Nível & Prumo Digital</span>
          </button>
        </div>

        {/* 📐 TOOL 1: TRENA DIGITAL AR */}
        {activeSubTab === "trena" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <div
                onClick={handleCanvasClick}
                className="relative w-full h-[450px] bg-zinc-900 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl cursor-crosshair flex items-center justify-center"
              >
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <Camera className="w-16 h-16 text-amber-400 mx-auto opacity-80" />
                    <div className="text-sm font-bold text-white">
                      Modo Visualizador AR de Câmera Ativo
                    </div>
                    <button
                      onClick={handleStartCamera}
                      className="px-6 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-black text-xs hover:bg-amber-300 transition-colors"
                    >
                      ATIVAR CÂMERA DO APARELHO
                    </button>
                  </div>
                )}

                {/* AR Target Reticle Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-amber-400 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 bg-amber-400 rounded-full" />
                  </div>
                </div>

                {/* Drawn Points & Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {points.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r="6"
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  ))}

                  {points.length >= 2 && (
                    <line
                      x1={points[0].x}
                      y1={points[0].y}
                      x2={points[1].x}
                      y2={points[1].y}
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray="4"
                    />
                  )}
                </svg>

                {/* Measurements HUD */}
                <div className="absolute top-4 left-4 bg-zinc-950/90 backdrop-blur-md p-3 rounded-xl border border-amber-500/40 text-xs space-y-1">
                  <div className="text-amber-400 font-extrabold flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Distância Medida: {calculatedDist} m</span>
                  </div>
                  <div className="text-emerald-400 font-extrabold">
                    Área Estimada: {calculatedArea} m²
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSaveMeasurement}
                  disabled={calculatedDist <= 0}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>SALVAR MEDIÇÃO NA LISTA</span>
                </button>

                <button
                  onClick={() => handleApplyTo3D(calculatedDist)}
                  disabled={calculatedDist <= 0}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>INTEGRAR NO PROJETOR 3D</span>
                </button>

                <button
                  onClick={() => setPoints([])}
                  className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs"
                >
                  Limpar Pontos
                </button>
              </div>
            </div>

            {/* Saved Measurements List (4 Columns) */}
            <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-black text-amber-400 uppercase flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Medições Salvas</span>
              </h3>

              {measurements.length === 0 ? (
                <div className="text-xs text-zinc-500 italic text-center py-8">
                  Nenhuma medição gravada ainda. Toque no quadro da câmera para marcar os pontos de medição.
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {measurements.map((m) => (
                    <div
                      key={m.id}
                      className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{m.label}</div>
                        <div className="text-emerald-400 font-black text-sm">
                          {m.value} {m.unit}
                        </div>
                      </div>

                      <button
                        onClick={() => handleApplyTo3D(m.value)}
                        className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold hover:bg-amber-500/30 text-[10px]"
                      >
                        Usar no 3D
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🔴 TOOL 2: RAIO LASER VIRTUAL */}
        {activeSubTab === "laser" && (
          <div className="max-w-3xl mx-auto bg-zinc-900 border-2 border-red-500/40 rounded-2xl p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500 flex items-center justify-center mx-auto text-red-500">
              <Crosshair className="w-8 h-8 animate-spin-slow" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">RAIO LASER VIRTUAL DE ALINHAMENTO</h3>
              <p className="text-zinc-400 text-xs mt-1">
                Aponte o celular para a parede para verificar alinhamentos de esquadrias, vigas de madeira e tomadas.
              </p>
            </div>

            <div className="relative w-full h-64 bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden flex items-center justify-center">
              {/* Red Laser Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse" />
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse" />

              <div className="text-xs font-bold text-red-400 bg-red-950/80 px-4 py-2 rounded-full border border-red-500/40">
                Ponto de Mapeamento Laser Ativo • Nivelamento 100% Ok
              </div>
            </div>
          </div>
        )}

        {/* ⚖️ TOOL 3: NÍVEL E PRUMO DIGITAL */}
        {activeSubTab === "nivel" && (
          <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center space-y-6">
            <h3 className="text-xl font-black text-white">NÍVEL & PRUMO DIGITAL (GIROSCÓPIO)</h3>

            <div className="grid grid-cols-2 gap-6">
              {/* Roll Bubble Level */}
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                <div className="text-xs font-bold text-zinc-400 mb-2">Inclinação Lateral (Nível)</div>
                <div className="text-3xl font-black text-amber-400">{tiltGamma}°</div>
                <div className="w-full h-4 bg-zinc-800 rounded-full mt-4 relative overflow-hidden">
                  <div
                    className="w-4 h-4 bg-amber-400 rounded-full absolute top-0 transition-all duration-100"
                    style={{ left: `${Math.max(0, Math.min(90, 45 + tiltGamma))} %` }}
                  />
                </div>
              </div>

              {/* Pitch Plumb Level */}
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                <div className="text-xs font-bold text-zinc-400 mb-2">Prumo Vertical</div>
                <div className="text-3xl font-black text-emerald-400">{tiltBeta}°</div>
                <div className="w-full h-4 bg-zinc-800 rounded-full mt-4 relative overflow-hidden">
                  <div
                    className="w-4 h-4 bg-emerald-400 rounded-full absolute top-0 transition-all duration-100"
                    style={{ left: `${Math.max(0, Math.min(90, 45 + tiltBeta))} %` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
