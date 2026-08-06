import React, { useState } from "react";
import {
  Settings,
  Clock,
  HardDrive,
  Download,
  CheckCircle2,
  X,
  ShieldCheck,
  Save,
  Sparkles,
  Check,
  MapPin,
  Radio
} from "lucide-react";
import { GeolocationAlertsTab } from "./GeolocationAlertsTab";

interface AutoSaveSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoSaveMinutes: number;
  setAutoSaveMinutes: (minutes: number) => void;
  autoSaveDestination: "localStorage" | "download";
  setAutoSaveDestination: (destination: "localStorage" | "download") => void;
  onTriggerSaveNow: () => void;
  secondsLeft: number;
  onShowToast?: (msg: string) => void;
  initialTab?: "autosave" | "geolocation";
}

export const AutoSaveSettingsModal: React.FC<AutoSaveSettingsModalProps> = ({
  isOpen,
  onClose,
  autoSaveMinutes,
  setAutoSaveMinutes,
  autoSaveDestination,
  setAutoSaveDestination,
  onTriggerSaveNow,
  secondsLeft,
  onShowToast,
  initialTab = "autosave",
}) => {
  const [activeTab, setActiveTab] = useState<"autosave" | "geolocation">(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const FREQUENCY_OPTIONS = [
    { value: 15, label: "15 Minutos", desc: "Recomendado para edições intensas no projeto 3D" },
    { value: 30, label: "30 Minutos", desc: "Intervalo padrão balanceado de salvamento" },
    { value: 60, label: "60 Minutos (1 Hora)", desc: "Ideal para sessões longas de visualização" },
  ];

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-amber-500/50 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              Painel de Configurações 3D
            </div>
            <h3 className="text-xl font-black text-white">
              Preferências & Automações
            </h3>
            <p className="text-xs text-zinc-400">
              Gerencie salvamento automático, backups do projeto e alertas de geolocalização.
            </p>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex gap-2 border-b border-zinc-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("autosave")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border ${
              activeTab === "autosave"
                ? "bg-amber-500 text-zinc-950 border-amber-400 shadow-md"
                : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Auto-Save & Backup</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("geolocation")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border ${
              activeTab === "geolocation"
                ? "bg-amber-500 text-zinc-950 border-amber-400 shadow-md"
                : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Alertas de Geolocalização</span>
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-5">
          {activeTab === "autosave" && (
            <>
              {/* Current Timer Info Card */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block">Próximo Auto-Save em</span>
                    <span className="text-lg font-black font-mono text-amber-400">{formatMinSec(secondsLeft)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onTriggerSaveNow();
                  }}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5 hover:scale-105 shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Agora</span>
                </button>
              </div>

              {/* SECTION 1: Frequency Selector */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Frequência do Backup Automático</span>
                </label>

                <div className="grid grid-cols-1 gap-2.5">
                  {FREQUENCY_OPTIONS.map((opt) => {
                    const isSelected = autoSaveMinutes === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAutoSaveMinutes(opt.value)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-amber-950/40 border-amber-500/80 shadow-lg"
                            : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-black ${isSelected ? "text-amber-300" : "text-white"}`}>
                              {opt.label}
                            </span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Ativo
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400">{opt.desc}</p>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-amber-500 border-amber-400 text-zinc-950"
                              : "border-zinc-700 bg-zinc-900"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: Destination Toggle */}
              <div className="space-y-3 pt-2 border-t border-zinc-800">
                <label className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Destino / Modo de Salvamento</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* LocalStorage Option */}
                  <button
                    type="button"
                    onClick={() => setAutoSaveDestination("localStorage")}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                      autoSaveDestination === "localStorage"
                        ? "bg-amber-950/40 border-amber-500/80 shadow-lg"
                        : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30">
                        <HardDrive className="w-5 h-5" />
                      </div>
                      {autoSaveDestination === "localStorage" && (
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-white">LocalStorage</h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                        Armazena o histórico diretamente na memória local do navegador para fácil restauração na aba de Snapshots.
                      </p>
                    </div>
                  </button>

                  {/* Direct Download Option */}
                  <button
                    type="button"
                    onClick={() => setAutoSaveDestination("download")}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                      autoSaveDestination === "download"
                        ? "bg-amber-950/40 border-amber-500/80 shadow-lg"
                        : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30">
                        <Download className="w-5 h-5" />
                      </div>
                      {autoSaveDestination === "download" && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-white">Download Direto (.json)</h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                        Gera e baixa automaticamente um arquivo `.json` no seu computador a cada ciclo do temporizador.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "geolocation" && (
            <GeolocationAlertsTab onShowToast={onShowToast} />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800 shrink-0">
          <span className="text-[10px] text-zinc-500 font-mono">
            Configurações salvas automaticamente no navegador.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
