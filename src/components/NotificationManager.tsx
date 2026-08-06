import React, { useState, useEffect } from "react";
import { Bell, BellRing, CheckCircle2, ShieldAlert, Zap, Construction, FileCheck, CalendarCheck, X } from "lucide-react";

export const NotificationManager: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default"
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }

    const handleBudgetGuardianEvent = (event: any) => {
      const detail = event.detail;
      if (!detail) return;

      const title = "⚠️ ALERTA DO GUARDIÃO DE ORÇAMENTO!";
      const body = `Os gastos do projeto (${detail.clientName || "Cliente"}) atingiram R$ ${detail.currentTotal?.toLocaleString("pt-BR")}, ultrapassando a estimativa inicial em ${detail.overrunPercent?.toFixed(1)}%!`;

      setLastNotification(`[${new Date().toLocaleTimeString()}] ${title}: ${body}`);
      setIsOpen(true);

      if ("Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(title, {
            body,
            icon: "/icon.svg",
            tag: "budget-guardian-alert",
          });
        } catch (e) {
          console.error("Error launching system notification", e);
        }
      }
    };

    window.addEventListener("budget-guardian-overrun" as any, handleBudgetGuardianEvent);
    return () => {
      window.removeEventListener("budget-guardian-overrun" as any, handleBudgetGuardianEvent);
    };
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("Seu navegador não suporta notificações de sistema.");
      return;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === "granted") {
        sendNotification(
          "🔔 Notificações Ativadas!",
          "Você receberá alertas em tempo real sobre atualizações de obras e aprovações de orçamento."
        );
      }
    } catch (err) {
      console.error("Erro ao solicitar permissão de notificações:", err);
    }
  };

  const sendNotification = async (title: string, body: string, tag: string = "general-update") => {
    if (permission !== "granted") {
      alert("Por favor, ative as notificações primeiro clicando em 'Ativar Alertas'.");
      return;
    }

    setLastNotification(`[${new Date().toLocaleTimeString()}] ${title}: ${body}`);

    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg) {
        reg.showNotification(title, {
          body,
          icon: "/icon.svg",
          badge: "/icon.svg",
          tag,
          vibrate: [200, 100, 200],
          data: { url: "/", timestamp: Date.now() }
        } as any);
        return;
      }
    }

    // Fallback standard Notification API
    new Notification(title, {
      body,
      icon: "/icon.svg",
      tag
    });
  };

  return (
    <>
      {/* Floating Push Notification Trigger Button */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-extrabold text-xs shadow-2xl transition-all border ${
            permission === "granted"
              ? "bg-zinc-900 border-amber-400 text-amber-400 hover:bg-zinc-800"
              : "bg-amber-500 border-amber-300 text-zinc-950 hover:bg-amber-400 animate-bounce"
          }`}
        >
          {permission === "granted" ? (
            <BellRing className="w-4 h-4 text-amber-400 animate-pulse" />
          ) : (
            <Bell className="w-4 h-4 text-zinc-950" />
          )}
          <span>{permission === "granted" ? "Alertas de Obra (Ativo)" : "Ativar Alertas Push"}</span>
        </button>
      </div>

      {/* Push Notification Panel Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border-2 border-amber-500/80 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                <BellRing className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Central de Notificações Push</h3>
                <p className="text-xs text-zinc-400">
                  Receba avisos instantâneos sobre o andamento das suas obras e orçamentos.
                </p>
              </div>
            </div>

            {/* Permission Status Box */}
            <div className="mb-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Status da Permissão:
                </span>
                {permission === "granted" ? (
                  <span className="flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ativado
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-black text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/40">
                    <ShieldAlert className="w-3.5 h-3.5" /> Pendente
                  </span>
                )}
              </div>

              {permission !== "granted" ? (
                <button
                  onClick={requestPermission}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>PERMITIR NOTIFICAÇÕES NO NAVEGADOR</span>
                </button>
              ) : (
                <p className="text-xs text-emerald-300/80 mt-1">
                  Seu navegador está configurado para receber notificações em tempo real.
                </p>
              )}
            </div>

            {/* Test Notification Options */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase text-amber-400 tracking-wider block">
                Simular Alertas em Tempo Real:
              </span>

              <button
                onClick={() =>
                  sendNotification(
                    "🏗️ Atualização de Obra #1024",
                    "A concretagem da laje do 2º pavimento foi concluída com sucesso pela equipe WVR!",
                    "obra-update"
                  )
                }
                disabled={permission !== "granted"}
                className="w-full p-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-400/60 rounded-2xl flex items-center justify-between text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-3">
                  <Construction className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Status de Obra</h4>
                    <p className="text-[11px] text-zinc-400">Avanço de etapa de construção</p>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                  Testar
                </span>
              </button>

              <button
                onClick={() =>
                  sendNotification(
                    "📋 Orçamento Aprovado #8492",
                    "Seu orçamento para móveis planejados GDM foi aprovado pela engenharia!",
                    "orcamento-approval"
                  )
                }
                disabled={permission !== "granted"}
                className="w-full p-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-emerald-400/60 rounded-2xl flex items-center justify-between text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Aprovação de Orçamento</h4>
                    <p className="text-[11px] text-zinc-400">Validação e liberação financeira</p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                  Testar
                </span>
              </button>

              <button
                onClick={() =>
                  sendNotification(
                    "📐 Lembrete de Medição Presencial",
                    "A equipe técnica estará no seu terreno amanhã às 09:00.",
                    "medicao-reminder"
                  )
                }
                disabled={permission !== "granted"}
                className="w-full p-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-blue-400/60 rounded-2xl flex items-center justify-between text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-3">
                  <CalendarCheck className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Agendamento Técnico</h4>
                    <p className="text-[11px] text-zinc-400">Medição técnica no local</p>
                  </div>
                </div>
                <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg">
                  Testar
                </span>
              </button>
            </div>

            {lastNotification && (
              <div className="mt-4 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-[11px] text-amber-300 font-mono break-all">
                {lastNotification}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
