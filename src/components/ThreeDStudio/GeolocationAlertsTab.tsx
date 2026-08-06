import React, { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Bell,
  BellOff,
  ShieldCheck,
  Compass,
  Zap,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Sliders,
  RotateCcw,
  Sparkles,
  Map,
  Radio
} from "lucide-react";

interface GeolocationAlertsTabProps {
  onShowToast?: (msg: string) => void;
}

export function calculateDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Raio da Terra em metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export const GeolocationAlertsTab: React.FC<GeolocationAlertsTabProps> = ({
  onShowToast,
}) => {
  // Persistence in localStorage
  const [isGeoTrackingEnabled, setIsGeoTrackingEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("adas_geo_tracking") === "true";
    } catch {
      return false;
    }
  });

  const [siteLat, setSiteLat] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("adas_site_lat");
      return saved ? parseFloat(saved) : -22.5208;
    } catch {
      return -22.5208;
    }
  });

  const [siteLng, setSiteLng] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("adas_site_lng");
      return saved ? parseFloat(saved) : -44.1041;
    } catch {
      return -44.1041;
    }
  });

  const [siteRadius, setSiteRadius] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("adas_site_radius");
      return saved ? parseInt(saved, 10) : 150; // meters
    } catch {
      return 150;
    }
  });

  const [siteAddressLabel, setSiteAddressLabel] = useState<string>(() => {
    try {
      return (
        localStorage.getItem("adas_site_address") ||
        "Terreno do Projeto - Rodovia BR-393, Volta Redonda/RJ"
      );
    } catch {
      return "Terreno do Projeto - Rodovia BR-393, Volta Redonda/RJ";
    }
  });

  const [pushNotificationStatus, setPushNotificationStatus] = useState<
    "default" | "granted" | "denied" | "unsupported"
  >(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "unsupported";
  });

  const [currentPos, setCurrentPos] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
  } | null>(null);

  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [lastNotificationTime, setLastNotificationTime] = useState<string | null>(
    () => {
      try {
        return localStorage.getItem("adas_last_geo_notif") || null;
      } catch {
        return null;
      }
    }
  );

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem("adas_geo_tracking", String(isGeoTrackingEnabled));
      localStorage.setItem("adas_site_lat", String(siteLat));
      localStorage.setItem("adas_site_lng", String(siteLng));
      localStorage.setItem("adas_site_radius", String(siteRadius));
      localStorage.setItem("adas_site_address", siteAddressLabel);
    } catch (e) {
      console.error("Erro ao salvar config de geolocalização:", e);
    }
  }, [isGeoTrackingEnabled, siteLat, siteLng, siteRadius, siteAddressLabel]);

  // Request Notification Permission
  const handleRequestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      setPushNotificationStatus("unsupported");
      alert("Seu navegador não suporta a API de Notificações Push do sistema.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushNotificationStatus(permission);
      if (permission === "granted") {
        if (onShowToast) onShowToast("Permissão para Notificações Push concedida!");
        triggerPushNotification(
          "📍 Alertas de Geolocalização Ativados!",
          "Você receberá alertas automáticos sempre que estiver próximo ao terreno do seu projeto."
        );
      } else {
        if (onShowToast)
          onShowToast("Permissão negada. Os alertas serão exibidos na tela.");
      }
    } catch (err) {
      console.error("Erro ao solicitar permissão de Notificação:", err);
    }
  };

  // Helper to trigger Push Notification
  const triggerPushNotification = (title: string, body: string) => {
    const timestamp = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setLastNotificationTime(timestamp);
    try {
      localStorage.setItem("adas_last_geo_notif", timestamp);
    } catch {}

    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "obra-arrival-alert",
      });
    }

    if (onShowToast) {
      onShowToast(`[PUSH] ${title}: ${body}`);
    }
  };

  // Obtain Current Location
  const handleGetDeviceLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocalização não é suportada por este navegador.");
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = position.coords;
        setCurrentPos({ lat: latitude, lng: longitude, accuracy });
        if (onShowToast) {
          onShowToast(
            `Posição atual obtida! Precisão: ${Math.round(accuracy)} metros.`
          );
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = "Erro ao obter localização.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Permissão de localização negada no navegador.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Sinal de GPS indisponível no momento.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Tempo limite esgotado ao buscar sinal GPS.";
        }
        setGeoError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Set current position as site coordinates
  const handleUseCurrentPosAsSite = () => {
    if (currentPos) {
      setSiteLat(Number(currentPos.lat.toFixed(6)));
      setSiteLng(Number(currentPos.lng.toFixed(6)));
      setSiteAddressLabel(
        `Local Atual (${currentPos.lat.toFixed(4)}, ${currentPos.lng.toFixed(4)})`
      );
      if (onShowToast) {
        onShowToast("Coordenadas do terreno atualizadas para sua posição atual!");
      }
    } else {
      handleGetDeviceLocation();
    }
  };

  // Live distance calculation
  const calculatedDistance = currentPos
    ? calculateDistanceInMeters(currentPos.lat, currentPos.lng, siteLat, siteLng)
    : null;

  const isInsideRadius =
    calculatedDistance !== null && calculatedDistance <= siteRadius;

  // Watch position when tracking is enabled
  useEffect(() => {
    if (!isGeoTrackingEnabled || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCurrentPos({ lat: latitude, lng: longitude, accuracy });

        const dist = calculateDistanceInMeters(
          latitude,
          longitude,
          siteLat,
          siteLng
        );

        if (dist <= siteRadius) {
          // Trigger notification if not recently sent
          triggerPushNotification(
            "📍 Você chegou ao Terreno da Obra!",
            `Distância atual: ${dist}m. Aproveite para registrar fotos do progresso e conferir o projeto 3D.`
          );
        }
      },
      (error) => {
        console.warn("Erro no monitoramento contínuo de posição:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isGeoTrackingEnabled, siteLat, siteLng, siteRadius]);

  // Simulate Arrival Test
  const handleSimulateArrival = () => {
    triggerPushNotification(
      "📍 TESTE PUSH: Chegada ao Terreno Confirmada!",
      `Simulação realizada com sucesso no raio de ${siteRadius} metros do terreno (${siteAddressLabel}).`
    );
  };

  return (
    <div className="space-y-6 text-white animate-in fade-in duration-200">
      {/* HEADER / STATUS BADGE */}
      <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-2xl border ${
              isGeoTrackingEnabled
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse"
                : "bg-zinc-800 text-zinc-400 border-zinc-700"
            }`}
          >
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  isGeoTrackingEnabled
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {isGeoTrackingEnabled ? "Monitoramento Ativo" : "Desativado"}
              </span>
            </div>
            <h4 className="text-base font-black text-white mt-0.5">
              Alertas de Proximidade do Terreno
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsGeoTrackingEnabled(!isGeoTrackingEnabled);
            if (!isGeoTrackingEnabled && pushNotificationStatus !== "granted") {
              handleRequestNotificationPermission();
            }
          }}
          className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${
            isGeoTrackingEnabled
              ? "bg-amber-500 hover:bg-amber-400 text-zinc-950 hover:scale-105"
              : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>{isGeoTrackingEnabled ? "Desativar" : "Ativar Alertas"}</span>
        </button>
      </div>

      {/* PUSH NOTIFICATION PERMISSION CARD */}
      <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
              Status das Notificações Push
            </span>
          </div>
          <span
            className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
              pushNotificationStatus === "granted"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : pushNotificationStatus === "denied"
                ? "bg-red-500/20 text-red-300 border-red-500/40"
                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
            }`}
          >
            {pushNotificationStatus === "granted"
              ? "Permissão Concedida"
              : pushNotificationStatus === "denied"
              ? "Permissão Negada"
              : "Pendente"}
          </span>
        </div>

        {pushNotificationStatus !== "granted" && (
          <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl flex items-center justify-between gap-3 text-xs">
            <p className="text-amber-200/90 leading-snug">
              Ative as notificações push do navegador para receber avisos
              automaticamente ao se aproximar da obra.
            </p>
            <button
              onClick={handleRequestNotificationPermission}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black uppercase text-[11px] rounded-lg tracking-wider shrink-0 transition-all hover:scale-105"
            >
              Conceder Permissão
            </button>
          </div>
        )}
      </div>

      {/* TERRAIN COORDINATES & RADIUS CONFIG */}
      <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Coordenadas do Terreno / Obra</span>
          </span>

          <button
            onClick={handleGetDeviceLocation}
            disabled={isLocating}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
            <span>{isLocating ? "Obtendo GPS..." : "Obter Posição Atual"}</span>
          </button>
        </div>

        {geoError && (
          <div className="p-3 bg-red-950/80 border border-red-500/60 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{geoError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">
              Latitude do Terreno
            </label>
            <input
              type="number"
              step="0.000001"
              value={siteLat}
              onChange={(e) => setSiteLat(parseFloat(e.target.value) || 0)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-400 text-white font-mono text-sm font-bold rounded-xl px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">
              Longitude do Terreno
            </label>
            <input
              type="number"
              step="0.000001"
              value={siteLng}
              onChange={(e) => setSiteLng(parseFloat(e.target.value) || 0)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-400 text-white font-mono text-sm font-bold rounded-xl px-3 py-2 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">
            Endereço ou Nome da Obra
          </label>
          <input
            type="text"
            value={siteAddressLabel}
            onChange={(e) => setSiteAddressLabel(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-400 text-white text-xs font-semibold rounded-xl px-3 py-2 outline-none"
          />
        </div>

        {currentPos && (
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              Sua Posição GPS Actual:{" "}
              <strong className="text-white font-mono">
                {currentPos.lat.toFixed(4)}, {currentPos.lng.toFixed(4)}
              </strong>
            </span>
            <button
              onClick={handleUseCurrentPosAsSite}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold text-[11px] rounded-lg border border-zinc-700 transition-colors"
            >
              Usar Minha Localização
            </button>
          </div>
        )}

        {/* RADIUS SLIDER */}
        <div className="pt-3 border-t border-zinc-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-zinc-400">Raio de Disparo de Alerta:</span>
            <span className="text-amber-400 font-mono font-black text-sm">
              {siteRadius} metros
            </span>
          </div>

          <input
            type="range"
            min="30"
            max="1000"
            step="10"
            value={siteRadius}
            onChange={(e) => setSiteRadius(parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 bg-zinc-900 h-2 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>30m (Apenas no portão)</span>
            <span>200m (Na rua)</span>
            <span>1km (Bairro)</span>
          </div>
        </div>
      </div>

      {/* LIVE PROXIMITY & TEST SIMULATOR */}
      <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
        <h5 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center justify-between">
          <span>Medidor de Proximidade em Tempo Real</span>
          {lastNotificationTime && (
            <span className="text-[10px] text-zinc-400 font-normal">
              Última notificação: {lastNotificationTime}
            </span>
          )}
        </h5>

        {calculatedDistance !== null ? (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isInsideRadius
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 animate-pulse"
                : "bg-zinc-900 border-zinc-800 text-zinc-300"
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Distância até o Terreno
              </span>
              <span className="text-2xl font-black font-mono text-amber-300">
                {calculatedDistance >= 1000
                  ? `${(calculatedDistance / 1000).toFixed(2)} km`
                  : `${calculatedDistance} metros`}
              </span>
            </div>

            <div className="text-right">
              <span
                className={`text-xs font-black uppercase px-3 py-1 rounded-full border inline-block ${
                  isInsideRadius
                    ? "bg-emerald-500 text-zinc-950 border-emerald-400"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}
              >
                {isInsideRadius ? "Dentro do Raio da Obra!" : "Fora do Raio"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-zinc-400 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
            Clique em <strong>Obter Posição Atual</strong> acima para calcular a
            distância exata entre você e o terreno.
          </p>
        )}

        {/* SIMULATE BUTTON */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSimulateArrival}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-105 flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Simular Chegada ao Terreno (Testar Push)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
