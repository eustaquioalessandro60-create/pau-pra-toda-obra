import React from "react";
import {
  Sparkles,
  Building2,
  Boxes,
  FileCheck2,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Compass,
  Zap,
  FolderDown,
  Download,
} from "lucide-react";
import { MainTab } from "../types";

interface HeroHeaderProps {
  setActiveTab: (tab: MainTab) => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ setActiveTab }) => {
  const phoneWhatsApp = "5524998729266";

  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white pt-8 pb-16 border-b border-amber-500/20">
      {/* Tropical Ambient Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 text-center">
        {/* Badge Banner */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-inner">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>WVR CONSTRUÇÕES • GDM MÓVEIS PLANEJADOS</span>
        </div>

        {/* 🌟 TÍTULO PRINCIPAL */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight mb-2 drop-shadow-sm">
          PAU PARA TODA <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent">OBRA</span>
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-amber-400 mb-6">
          WVR CONSTRUÇÕES • GDM MÓVEIS PLANEJADOS
        </h2>

        {/* 🌟 DESTAQUE LOGO ABAIXO */}
        <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-3">
          "DO TERRENO À CHAVE NA MÃO!"
        </div>

        <div className="my-3 text-xs sm:text-sm md:text-base font-extrabold text-amber-400 tracking-wide uppercase px-4 py-2.5 bg-zinc-900/90 border border-amber-500/30 rounded-xl inline-block max-w-4xl mx-auto shadow-lg">
          CONSTRUÇÃO • REFORMA • MÓVEIS • SEGURANÇA • PAISAGISMO • DOCUMENTAÇÃO • FINANCIAMENTO
        </div>

        {/* 🌟 COMPLETE EXPLANATORY TEXT (REQUIRED EXPLICITLY) */}
        <p className="text-base sm:text-lg md:text-xl text-zinc-300 font-medium max-w-3xl mx-auto leading-relaxed mt-4 mb-8">
          Tudo o que você precisa para realizar o seu sonho, sem burocracia e com a qualidade que você merece! Do projeto visualizado na hora até a entrega final, resolvemos todas as etapas para você.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={() => {
              setActiveTab("ferramenta3d");
              window.scrollTo({ top: 500, behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 text-zinc-950 font-black text-lg shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Compass className="w-6 h-6 text-zinc-950 animate-spin-slow" />
            <span>ABRIR PROJETOR 3D POR VOZ</span>
          </button>

          <a
            href={`https://wa.me/${phoneWhatsApp}?text=Olá!%20Quero%20um%20orçamento%20para%20construir,%20reformar%20ou%20mobiliar%20com%20o%20UNIVERSO%20ADAS!`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border-2 border-emerald-500 text-emerald-400 font-black text-lg shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <PhoneCall className="w-6 h-6 text-emerald-400" />
            <span>SOLICITAR ORÇAMENTO WHATSAPP</span>
          </a>
        </div>

        {/* 📦 PACOTE DO CÓDIGO FONTE ZIP - DESTAQUE NA PÁGINA FRONTAL */}
        <div className="mb-10 max-w-3xl mx-auto bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border-2 border-amber-400/80 p-5 sm:p-6 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <FolderDown className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                    Projeto Completo Pronto para Hospedagem
                  </span>
                  <span className="bg-emerald-500 text-zinc-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    Formato .ZIP
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Download do Código Fonte
                </h3>
                <p className="text-xs text-zinc-300 font-medium">
                  Baixe todos os arquivos (.tsx, .ts, configs) organizados e prontos para rodar ou hospedar.
                </p>
              </div>
            </div>
            <a
              href="/api/download-project-zip"
              download="universo-adas-codigo-fonte.zip"
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              <Download className="w-5 h-5 text-zinc-950" />
              <span>BAIXAR CÓDIGO ZIP</span>
            </a>
          </div>
        </div>

        {/* Highlight Values Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-6 border-t border-zinc-800 text-left">
          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800 hover:border-amber-500/40 transition-colors">
            <CheckCircle2 className="w-5 h-5 text-amber-400 mb-1.5" />
            <div className="text-xs font-bold text-white">Entregamos o Prometido</div>
            <div className="text-[11px] text-zinc-400">Prazos e contratos levados a sério.</div>
          </div>

          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800 hover:border-emerald-500/40 transition-colors">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1.5" />
            <div className="text-xs font-bold text-white">Buscamos Agradar</div>
            <div className="text-[11px] text-zinc-400">Atendimento humano focado em você.</div>
          </div>

          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800 hover:border-amber-500/40 transition-colors">
            <PhoneCall className="w-5 h-5 text-amber-400 mb-1.5" />
            <div className="text-xs font-bold text-white">Canais Sempre Abertos</div>
            <div className="text-[11px] text-zinc-400">Suporte antes, durante e pós-obra.</div>
          </div>

          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800 hover:border-emerald-500/40 transition-colors">
            <Zap className="w-5 h-5 text-emerald-400 mb-1.5" />
            <div className="text-xs font-bold text-white">Tecnologia Exclusiva</div>
            <div className="text-[11px] text-zinc-400">Ferramenta 3D com voz e PWA.</div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800 hover:border-amber-500/40 transition-colors">
            <FileCheck2 className="w-5 h-5 text-amber-400 mb-1.5" />
            <div className="text-xs font-bold text-white">Valor Justo</div>
            <div className="text-[11px] text-zinc-400">Preço claro sem surpresas no final.</div>
          </div>
        </div>
      </div>
    </section>
  );
};
