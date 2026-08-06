import React, { useState } from "react";
import {
  Building2,
  Boxes,
  Compass,
  Ruler,
  FileText,
  Landmark,
  Users,
  Phone,
  Wifi,
  WifiOff,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  FolderDown,
  BarChart3,
  HardHat,
  Camera,
  Trophy,
  ShoppingBag,
  Share2,
} from "lucide-react";
import { MainTab } from "../types";

interface HeaderProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isOnline,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phoneWhatsApp = "5524998729266";
  const formattedPhone = "(24) 99872-9266";

  const handleNavClick = (tab: MainTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-950 text-white shadow-xl border-b border-amber-500/20">
      {/* Top Announcement & Status Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-emerald-600 to-amber-600 text-xs font-semibold py-1.5 px-4 text-center text-zinc-950 flex justify-between items-center max-w-7xl mx-auto">
        <div className="hidden md:flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-zinc-950" />
          <span>PAU PARA TODA OBRA • WVR CONSTRUÇÕES • GDM MÓVEIS PLANEJADOS</span>
        </div>

        <div className="flex items-center gap-4 mx-auto md:mx-0">
          <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-0.5 rounded-full text-white">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span className="text-[11px]">Sistema Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px]">Modo Offline (PWA Ativo)</span>
              </>
            )}
          </span>

          <a
            href="/api/download-project-zip"
            download="universo-adas-codigo-fonte.zip"
            className="hidden sm:flex items-center gap-1.5 bg-zinc-950 text-amber-400 font-black hover:bg-zinc-900 px-3 py-0.5 rounded-full transition-colors shadow-sm border border-amber-400/50"
            title="Baixar Código Fonte em formato ZIP"
          >
            <FolderDown className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">Código ZIP</span>
          </a>

          <a
            href={`https://wa.me/${phoneWhatsApp}?text=Olá,%20vim%20pelo%20site%20do%20UNIVERSO%20ADAS%20e%20gostaria%20de%20um%20orçamento!`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-zinc-950 font-bold bg-amber-400 hover:bg-amber-300 px-3 py-0.5 rounded-full transition-colors shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{formattedPhone}</span>
          </a>
        </div>
      </div>

      {/* Main Logo & Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* PAU PARA TODA OBRA Branding */}
        <div
          onClick={() => handleNavClick("inicio")}
          className="cursor-pointer flex items-center gap-3 group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-emerald-500 to-amber-600 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zinc-900 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-lg tracking-tighter">
              PPO
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                PAU PARA TODA <span className="text-amber-400">OBRA</span>
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase">
                Oficial
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
              <span className="text-amber-400 font-bold">WVR Construções</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">GDM Móveis Planejados</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => handleNavClick("inicio")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "inicio"
                ? "bg-amber-500 text-zinc-950 shadow-md"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
            }`}
          >
            Início
          </button>

          <button
            onClick={() => handleNavClick("servicos")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "servicos"
                ? "bg-amber-500 text-zinc-950 shadow-md"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            Serviços Principais
          </button>

          <button
            onClick={() => handleNavClick("alphatudo_obra")}
            className={`px-3 py-2 rounded-lg text-sm font-black transition-all flex items-center gap-1.5 ${
              activeTab === "alphatudo_obra"
                ? "bg-amber-400 text-zinc-950 shadow-md"
                : "text-amber-300 hover:text-amber-200 bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>📊 ALPHATUDO OBRA</span>
          </button>

          <button
            onClick={() => handleNavClick("parceiros_profissionais")}
            className={`px-3 py-2 rounded-lg text-sm font-black transition-all flex items-center gap-1.5 ${
              activeTab === "parceiros_profissionais"
                ? "bg-amber-400 text-zinc-950 shadow-md"
                : "text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-amber-500/40"
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>🤝 PARCEIROS</span>
          </button>

          <button
            onClick={() => handleNavClick("alphatudo_mercado")}
            className={`px-3 py-2 rounded-lg text-sm font-black transition-all flex items-center gap-1.5 ${
              activeTab === "alphatudo_mercado"
                ? "bg-emerald-400 text-zinc-950 shadow-md"
                : "text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40"
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>🛒 MERCADO</span>
          </button>

          <button
            onClick={() => handleNavClick("flowbusiness")}
            className={`px-3 py-2 rounded-lg text-sm font-black transition-all flex items-center gap-1.5 ${
              activeTab === "flowbusiness"
                ? "bg-sky-400 text-zinc-950 shadow-md"
                : "text-sky-300 bg-sky-500/15 border border-sky-500/40 hover:bg-sky-500/25"
            }`}
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            <span>📲 FLOWBUSINESS</span>
          </button>

          <button
            onClick={() => handleNavClick("ferramenta3d")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "ferramenta3d"
                ? "bg-emerald-500 text-zinc-950 shadow-md font-bold"
                : "text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20"
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            Ferramenta 3D Voz
            <span className="bg-amber-400 text-zinc-950 text-[10px] font-black px-1.5 py-0.2 rounded">
              PRO
            </span>
          </button>

          <button
            onClick={() => handleNavClick("realidade_aumentada")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "realidade_aumentada"
                ? "bg-amber-500 text-zinc-950 shadow-md font-bold"
                : "text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20"
            }`}
          >
            <Camera className="w-4 h-4 text-amber-400" />
            Realidade Aumentada (RA)
            <span className="bg-emerald-400 text-zinc-950 text-[10px] font-black px-1.5 py-0.2 rounded">
              CÂMERA
            </span>
          </button>

          <button
            onClick={() => handleNavClick("medicao")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "medicao"
                ? "bg-amber-500 text-zinc-950 shadow-md"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
            }`}
          >
            <Ruler className="w-4 h-4 text-emerald-400" />
            Trena & Laser (PWA)
          </button>

          <button
            onClick={() => handleNavClick("orcamento")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "orcamento"
                ? "bg-amber-500 text-zinc-950 shadow-md"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            Orçamento PDF
          </button>

          <button
            onClick={() => handleNavClick("financiamento")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "financiamento"
                ? "bg-amber-500 text-zinc-950 shadow-md"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
            }`}
          >
            <Landmark className="w-4 h-4 text-emerald-400" />
            Financiamento Caixa
          </button>

          <button
            onClick={() => handleNavClick("rede_profissionais")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "rede_profissionais"
                ? "bg-amber-500 text-zinc-950 shadow-md"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            Rede Profissionais
          </button>

          <button
            onClick={() => handleNavClick("dashboard_obras")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "dashboard_obras"
                ? "bg-amber-500 text-zinc-950 shadow-md font-bold"
                : "text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20"
            }`}
          >
            <HardHat className="w-4 h-4 text-amber-400" />
            Dashboard de Obras
          </button>

          <button
            onClick={() => handleNavClick("conquistas")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "conquistas"
                ? "bg-amber-500 text-zinc-950 shadow-md font-bold"
                : "text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20"
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Conquistas
            <span className="bg-amber-400 text-zinc-950 text-[10px] font-black px-1.5 py-0.2 rounded">
              BADGES
            </span>
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-zinc-800 text-amber-400 hover:bg-zinc-700 transition-colors"
          aria-label="Abrir Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-900 border-b border-amber-500/20 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNavClick("inicio")}
            className="w-full text-left px-4 py-3 rounded-lg font-semibold flex items-center justify-between text-zinc-200 hover:bg-zinc-800"
          >
            <span>Início</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={() => handleNavClick("servicos")}
            className="w-full text-left px-4 py-3 rounded-lg font-semibold flex items-center justify-between text-zinc-200 hover:bg-zinc-800"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Serviços Principais</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={() => handleNavClick("alphatudo_obra")}
            className="w-full text-left px-4 py-3 rounded-lg font-black flex items-center justify-between bg-gradient-to-r from-amber-500/25 to-emerald-500/25 border-2 border-amber-500/50 text-amber-300 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span>📊 ALPHATUDO OBRA</span>
            </div>
            <span className="bg-emerald-400 text-zinc-950 text-xs px-2 py-0.5 rounded-full font-black">
              NOVO
            </span>
          </button>

          <button
            onClick={() => handleNavClick("parceiros_profissionais")}
            className="w-full text-left px-4 py-3 rounded-lg font-black flex items-center justify-between bg-zinc-900 border border-amber-500/40 text-amber-300 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>🤝 PARCEIROS & PROFISSIONAIS</span>
            </div>
            <span className="bg-amber-400 text-zinc-950 text-xs px-2 py-0.5 rounded-full font-black">
              GRÁTIS
            </span>
          </button>

          <button
            onClick={() => handleNavClick("alphatudo_mercado")}
            className="w-full text-left px-4 py-3 rounded-lg font-black flex items-center justify-between bg-zinc-900 border border-emerald-500/40 text-emerald-300 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span>🛒 ALPHATUDO MERCADO</span>
            </div>
            <span className="bg-emerald-400 text-zinc-950 text-xs px-2 py-0.5 rounded-full font-black">
              NOVO
            </span>
          </button>

          <button
            onClick={() => handleNavClick("flowbusiness")}
            className="w-full text-left px-4 py-3 rounded-lg font-black flex items-center justify-between bg-gradient-to-r from-sky-500/20 to-emerald-500/20 border-2 border-sky-500/50 text-sky-300 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-sky-400" />
              <span>📲 MIGRAR PARA FLOWBUSINESS</span>
            </div>
            <span className="bg-sky-400 text-zinc-950 text-xs px-2 py-0.5 rounded-full font-black">
              INTEGRAR
            </span>
          </button>

          <button
            onClick={() => handleNavClick("ferramenta3d")}
            className="w-full text-left px-4 py-3 rounded-lg font-bold flex items-center justify-between bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/30 text-amber-300 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Ferramenta 3D por Comando de Voz</span>
            </div>
            <span className="bg-amber-400 text-zinc-950 text-xs px-2 py-0.5 rounded-full font-black">
              NOVO 3D
            </span>
          </button>

          <button
            onClick={() => handleNavClick("realidade_aumentada")}
            className="w-full text-left px-4 py-3 rounded-lg font-bold flex items-center justify-between bg-gradient-to-r from-emerald-500/20 to-amber-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-400" />
              <span>Realidade Aumentada (RA Câmera)</span>
            </div>
            <span className="bg-emerald-400 text-zinc-950 text-xs px-2 py-0.5 rounded-full font-black">
              CÂMERA RA
            </span>
          </button>

          <button
            onClick={() => handleNavClick("medicao")}
            className="w-full text-left px-4 py-3 rounded-lg font-semibold flex items-center justify-between text-zinc-200 hover:bg-zinc-800"
          >
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-emerald-400" />
              <span>Trena, Laser & Nível Digital</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={() => handleNavClick("orcamento")}
            className="w-full text-left px-4 py-3 rounded-lg font-semibold flex items-center justify-between text-zinc-200 hover:bg-zinc-800"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Gerar Orçamento em PDF</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={() => handleNavClick("financiamento")}
            className="w-full text-left px-4 py-3 rounded-lg font-semibold flex items-center justify-between text-zinc-200 hover:bg-zinc-800"
          >
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-400" />
              <span>Financiamento Caixa Econômica</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={() => handleNavClick("rede_profissionais")}
            className="w-full text-left px-4 py-3 rounded-lg font-semibold flex items-center justify-between text-zinc-200 hover:bg-zinc-800"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Rede de Profissionais & Clientes</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={() => handleNavClick("dashboard_obras")}
            className="w-full text-left px-4 py-3 rounded-lg font-extrabold flex items-center justify-between bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <HardHat className="w-5 h-5 text-amber-400" />
              <span>Dashboard de Obras Ativas</span>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => handleNavClick("conquistas")}
            className="w-full text-left px-4 py-3 rounded-lg font-extrabold flex items-center justify-between bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-300 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Conquistas & Badges da Obra</span>
            </div>
            <span className="bg-amber-400 text-zinc-950 text-xs px-2 py-0.5 rounded-full font-black">
              XP & BADGES
            </span>
          </button>

          <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400 space-y-1">
            <div className="font-bold text-amber-400">Outras marcas do Grupo ADAS:</div>
            <div className="flex gap-4 pt-1">
              <button
                onClick={() => handleNavClick("rimane")}
                className="text-zinc-300 hover:text-white underline"
              >
                Organizações Rimane
              </button>
              <button
                onClick={() => handleNavClick("licitmaster")}
                className="text-zinc-300 hover:text-white underline"
              >
                Licitmaster
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
