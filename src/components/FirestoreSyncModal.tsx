import React, { useState, useEffect } from "react";
import {
  Cloud,
  CloudUpload,
  CloudDownload,
  RefreshCw,
  Copy,
  Check,
  X,
  Smartphone,
  Laptop,
  Flame,
  CheckCircle2,
  AlertCircle,
  Share2,
  Sparkles,
  Lock,
  Radio
} from "lucide-react";
import { Project3DState } from "../types";
import {
  saveProjectStateToFirestore,
  fetchProjectStateFromFirestore,
  subscribeProjectStateFirestore,
} from "../services/projectSyncService";

interface FirestoreSyncModalProps {
  projectState: Project3DState;
  setProjectState: React.Dispatch<React.SetStateAction<Project3DState>>;
  isOpen: boolean;
  onClose: () => void;
}

export const FirestoreSyncModal: React.FC<FirestoreSyncModalProps> = ({
  projectState,
  setProjectState,
  isOpen,
  onClose,
}) => {
  const [syncCode, setSyncCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("universo_adas_firestore_sync_code");
      return saved || `obra-${Math.random().toString(36).substring(2, 8)}`;
    } catch {
      return `obra-${Math.random().toString(36).substring(2, 8)}`;
    }
  });

  const [autoSync, setAutoSync] = useState<boolean>(() => {
    try {
      return localStorage.getItem("universo_adas_firestore_auto_sync") === "true";
    } catch {
      return true;
    }
  });

  const [liveListen, setLiveListen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Save sync code & auto-sync setting in localStorage
  useEffect(() => {
    try {
      localStorage.setItem("universo_adas_firestore_sync_code", syncCode);
      localStorage.setItem("universo_adas_firestore_auto_sync", String(autoSync));
    } catch (e) {
      console.error(e);
    }
  }, [syncCode, autoSync]);

  // Real-time listener setup if enabled
  useEffect(() => {
    if (!liveListen || !syncCode.trim()) return;

    const unsubscribe = subscribeProjectStateFirestore(
      syncCode,
      (remoteState, updatedAt) => {
        setProjectState(remoteState);
        setLastSyncedAt(
          new Date(updatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        );
        setFeedbackMsg({
          type: "success",
          text: "Configurações do projeto atualizadas em tempo real via Firestore!",
        });
        setTimeout(() => setFeedbackMsg(null), 4000);
      },
      (err) => {
        setFeedbackMsg({ type: "error", text: `Erro de sincronização: ${err}` });
      }
    );

    return () => unsubscribe();
  }, [liveListen, syncCode, setProjectState]);

  // Manual Push to Firestore
  const handlePushToCloud = async () => {
    setIsSyncing(true);
    setFeedbackMsg(null);

    const res = await saveProjectStateToFirestore(syncCode, projectState);
    setIsSyncing(false);

    if (res.success) {
      const nowTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setLastSyncedAt(nowTime);
      setFeedbackMsg({
        type: "success",
        text: `Estado do projeto salvo com sucesso no Firestore às ${nowTime}!`,
      });
    } else {
      setFeedbackMsg({
        type: "error",
        text: res.error || "Falha ao salvar no Firestore.",
      });
    }
  };

  // Manual Fetch from Firestore
  const handleFetchFromCloud = async () => {
    setIsLoadingFetch(true);
    setFeedbackMsg(null);

    const res = await fetchProjectStateFromFirestore(syncCode);
    setIsLoadingFetch(false);

    if (res.success && res.data) {
      setProjectState(res.data);
      const timeStr = res.updatedAt
        ? new Date(res.updatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        : "recente";
      setLastSyncedAt(timeStr);
      setFeedbackMsg({
        type: "success",
        text: `Configurações do projeto recuperadas do Firestore! (Atualizado às ${timeStr})`,
      });
    } else {
      setFeedbackMsg({
        type: "error",
        text: res.error || "Nenhum projeto encontrado para este código.",
      });
    }
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(syncCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleGenerateNewCode = () => {
    const newCode = `obra-${Math.random().toString(36).substring(2, 8)}`;
    setSyncCode(newCode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-amber-500/50 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-500/30 to-amber-600/10 text-amber-400 rounded-2xl border border-amber-500/40 shadow-lg">
            <Flame className="w-6 h-6 animate-pulse text-amber-400" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5 text-amber-400" /> Multi-Dispositivo • Firebase Firestore
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Sincronizar Projeto na Nuvem
            </h3>
            <p className="text-xs text-zinc-400">
              Salve o <strong className="text-zinc-200">projectState</strong> em tempo real e acesse de qualquer celular, tablet ou computador.
            </p>
          </div>
        </div>

        {/* Feedback Message Banner */}
        {feedbackMsg && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300 ${
              feedbackMsg.type === "success"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                : "bg-rose-500/20 text-rose-300 border border-rose-500/50"
            }`}
          >
            {feedbackMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Sync Key / Code Section */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <label className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center justify-between">
            <span>Código de Sincronização do Projeto</span>
            <span className="text-[10px] font-mono text-zinc-400 font-normal">Chave única de acesso</span>
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={syncCode}
              onChange={(e) => setSyncCode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
              placeholder="Ex: obra-residencia-123"
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-amber-300 font-bold focus:outline-none focus:border-amber-400"
            />

            <button
              onClick={handleCopyCode}
              className="px-3.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl border border-zinc-700 flex items-center gap-1.5 transition-all shrink-0"
              title="Copiar código para colar em outro dispositivo"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copied ? "Copiado!" : "Copiar"}</span>
            </button>

            <button
              onClick={handleGenerateNewCode}
              className="px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl border border-zinc-700 transition-all shrink-0 text-xs"
              title="Gerar novo código aleatório"
            >
              Gerar
            </button>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            💡 Digite este mesmo código no seu celular ou outro computador para carregar ou sincronizar os mesmos parâmetros do projeto 3D.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Push Button */}
          <button
            onClick={handlePushToCloud}
            disabled={isSyncing}
            className="p-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CloudUpload className="w-4 h-4" />
            )}
            <span>{isSyncing ? "Enviando..." : "Salvar no Firestore"}</span>
          </button>

          {/* Fetch Button */}
          <button
            onClick={handleFetchFromCloud}
            disabled={isLoadingFetch}
            className="p-4 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-extrabold text-xs uppercase tracking-wider rounded-2xl border border-amber-500/40 shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isLoadingFetch ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CloudDownload className="w-4 h-4 text-amber-400" />
            )}
            <span>{isLoadingFetch ? "Buscando..." : "Recuperar do Firestore"}</span>
          </button>
        </div>

        {/* Toggles & Options */}
        <div className="space-y-2 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-xs">
          {/* Live Sync Listener Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className={`w-4 h-4 ${liveListen ? "text-amber-400 animate-pulse" : "text-zinc-500"}`} />
              <div>
                <span className="font-bold text-white block">Escuta em Tempo Real (Live Sync)</span>
                <span className="text-[10px] text-zinc-400">
                  Aplica alterações automaticamente quando outro dispositivo salvar.
                </span>
              </div>
            </div>
            <button
              onClick={() => setLiveListen(!liveListen)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                liveListen ? "bg-amber-500" : "bg-zinc-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-zinc-950 transition-transform ${
                  liveListen ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Current State Summary */}
        <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <Laptop className="w-4 h-4 text-amber-400" />
            <span>
              Projeto: <strong className="text-white">{projectState.title || "Casa Obra ADAS"}</strong> ({projectState.terrain.width}x{projectState.terrain.length}m)
            </span>
          </div>

          {lastSyncedAt && (
            <span className="text-[10px] font-mono text-emerald-400">
              ● Nuvem: {lastSyncedAt}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
