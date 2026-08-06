import React from "react";
import {
  FileCheck2,
  Landmark,
  Gavel,
  Award,
  Building2,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Megaphone,
} from "lucide-react";
import { MainTab } from "../types";

const WhatsappIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TiktokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const YoutubeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface OtherBrandsProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
}

export const OtherBrandsFooter: React.FC<OtherBrandsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const phoneWhatsApp = "5524998729266";

  if (activeTab === "rimane") {
    return (
      <section className="py-12 bg-zinc-950 text-white border-b border-amber-500/20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-zinc-900 p-8 rounded-3xl border-2 border-amber-500/40 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xl">
                OR
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">ORGANIZAÇÕES RIMANE</h2>
                <p className="text-xs text-amber-400 font-bold">
                  Cadastro Oficial de Pessoas Jurídicas & Gestão de Projetos Unificados
                </p>
              </div>
            </div>

            {/* Official Registration Badge Box */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-amber-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 font-bold">Razão Social:</span>
                <span className="font-black text-white text-sm">Organizações Rimane</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 font-bold">CNPJ:</span>
                <span className="font-mono font-black text-amber-400 text-sm">17.431.363/0001-84</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 font-bold">Responsável Técnico:</span>
                <span className="font-bold text-white">Alessandro Eustaquio da Silva</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 font-bold">Situação Cadastral:</span>
                <span className="font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Em transição de MEI para Pessoa Jurídica
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 font-bold">Endereço Oficial:</span>
                <span className="font-bold text-zinc-200">
                  Rua Arábica, 310 / B 4 AP 507 – Barra Mansa / RJ – CEP 27323-786
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-bold">Contato Direto:</span>
                <span className="font-bold text-amber-300">
                  (24) 99872-9266 | eustaquioalessandro60@gmail.com
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed font-medium">
              As <strong>Organizações Rimane</strong> são a divisão oficial do grupo UNIVERSO ADAS especializada na legalização patrimonial, gestão de obras com o módulo <strong>AlphaTudo Obra</strong>, financiamentos imobiliários Caixa Econômica Federal e oportunidades de mercado.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold pt-2">
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                <div className="text-amber-400 font-black flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4" />
                  <span>Regularização & Documentação</span>
                </div>
                <p className="text-zinc-400 font-normal">
                  Projetos aprovados, habite-se, averbação de reformas e liberação de registros cartorários.
                </p>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                <div className="text-emerald-400 font-black flex items-center gap-2">
                  <Landmark className="w-4 h-4" />
                  <span>Financiamento & Leilões</span>
                </div>
                <p className="text-zinc-400 font-normal">
                  Oportunidades exclusivas de arrematação em leilões imobiliários que se convertem em obras e reformas com a WVR Construções.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
              <button
                onClick={() => setActiveTab("inicio")}
                className="text-xs text-zinc-400 hover:text-white underline font-bold"
              >
                ← Voltar para o Início
              </button>

              <a
                href={`https://wa.me/${phoneWhatsApp}?text=Olá,%20gostaria%20de%20atendimento%20pelas%20Organizações%20Rimane!`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-black text-xs hover:bg-amber-300 transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Atendimento Rimane no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (activeTab === "licitmaster") {
    return (
      <section className="py-12 bg-zinc-950 text-white border-b border-amber-500/20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-zinc-900 p-8 rounded-3xl border-2 border-emerald-500/40 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-xl">
                LM
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">LICITMASTER</h2>
                <p className="text-xs text-emerald-400 font-bold">
                  Inteligência e Conquista de Licitações e Contratos Públicos
                </p>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed font-medium">
              A <strong>Licitmaster</strong> é a solução tecnológica e consultiva do UNIVERSO ADAS para captura, habilitação e conquista de contratos e licitações públicas, garantindo a execução impecável de obras civis e instalações através da WVR e GDM.
            </p>

            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs font-semibold text-zinc-300">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                <Award className="w-4 h-4" />
                <span>Gestão Completa de Obras Públicas</span>
              </div>
              <p>
                Mapeamento de pregões eletrônicos, concorrências e tomada de preços integrados diretamente com a nossa capacidade executiva de obras de infraestrutura.
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
              <button
                onClick={() => setActiveTab("inicio")}
                className="text-xs text-zinc-400 hover:text-white underline font-bold"
              >
                ← Voltar para o Início
              </button>

              <a
                href={`https://wa.me/${phoneWhatsApp}?text=Olá,%20gostaria%20de%20atendimento%20pela%20Licitmaster!`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-500 transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Atendimento Licitmaster no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export const Footer: React.FC<{ setActiveTab: (tab: MainTab) => void }> = ({
  setActiveTab,
}) => {
  const phoneWhatsApp = "5524998729266";
  const formattedPhone = "(24) 99872-9266";

  return (
    <footer className="bg-zinc-950 text-white pt-12 pb-8 border-t border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          {/* Col 1: Branding */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white">
                PAU PARA TODA <span className="text-amber-400">OBRA</span>
              </span>
            </div>
            <p className="text-zinc-400 leading-relaxed font-medium">
              Do terreno à chave na mão! WVR Construções & GDM Móveis Planejados. Construção, reformas, móveis sob medida, regularização e financiamento.
            </p>
            <a
              href={`https://wa.me/${phoneWhatsApp}?text=Olá,%20gostaria%20de%20atendimento!`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-950 font-black text-xs bg-emerald-400 hover:bg-emerald-300 px-3.5 py-1.5 rounded-xl transition-colors shadow-sm"
            >
              <WhatsappIcon className="w-4 h-4 text-emerald-950" />
              <span>{formattedPhone}</span>
            </a>
          </div>

          {/* Col 2: Marcas Principais */}
          <div className="space-y-2">
            <div className="font-bold text-amber-400 uppercase tracking-wider mb-1">
              Marcas Principais
            </div>
            <ul className="space-y-1 text-zinc-300 font-medium">
              <li>
                <button onClick={() => setActiveTab("servicos")} className="hover:text-amber-400 transition-colors">
                  • WVR Construções & Reformas
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("servicos")} className="hover:text-amber-400 transition-colors">
                  • GDM Móveis Planejados 100% MDF
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("ferramenta3d")} className="hover:text-amber-400 transition-colors">
                  • Ferramenta 3D por Voz
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("financiamento")} className="hover:text-amber-400 transition-colors">
                  • Financiamento Caixa Econômica
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Outras Marcas e Projetos do Grupo */}
          <div className="space-y-2">
            <div className="font-bold text-emerald-400 uppercase tracking-wider mb-1">
              Ecosistema Universo ADAS
            </div>
            <ul className="space-y-1.5 text-zinc-300 font-medium text-[11px]">
              <li>
                <button
                  onClick={() => {
                    setActiveTab("rimane");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-left hover:text-emerald-400 font-bold underline transition-colors"
                >
                  📋 Organizações Rimane (CNPJ 17.431.363/0001-84)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("alphatudo_obra");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-left hover:text-amber-400 font-bold text-amber-300 transition-colors"
                >
                  📊 ALPHATUDO OBRA (Novo Módulo)
                </button>
              </li>
              <li className="text-zinc-400">• Bank Invest (Controle Financeiro)</li>
              <li className="text-zinc-400">• Flowbusiness & Hub Seller</li>
              <li className="text-zinc-400">• Universo Ads (Tráfego & Leads)</li>
              <li className="text-zinc-400">• FlowHost & Biblioteca do Saber</li>
            </ul>
          </div>

          {/* Col 4: Garantias & Valores */}
          <div className="space-y-2 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
            <div className="font-bold text-white uppercase mb-1">Nossos Compromissos</div>
            <ul className="space-y-1.5 text-zinc-400 text-[11px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Entregamos o prometido</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Buscamos agradar o cliente</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Canais abertos antes, durante e depois</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Valor justo sem surpresas</span>
              </li>
            </ul>
          </div>
        </div>

        {/* REDES SOCIAIS & CANAIS OFICIAIS */}
        <div className="bg-zinc-900/90 rounded-2xl border-2 border-amber-500/30 p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                  Canais Oficiais
                </span>
                <span className="text-xs text-zinc-400 font-bold">• Pau Para Toda Obra</span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">
                REDES SOCIAIS & ATENDIMENTO
              </h3>
            </div>
            <p className="text-amber-300/90 text-xs font-semibold max-w-md">
              📸 Veja nosso portfólio completo, trabalhos em andamento e novidades: clique nas redes sociais abaixo!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
            {/* 💬 WhatsApp */}
            <a
              href={`https://wa.me/${phoneWhatsApp}?text=Olá!%20Vim%20pelo%20site%20da%20Pau%20Para%20Toda%20Obra.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 hover:border-emerald-400 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
            >
              <WhatsappIcon className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-[11px]">WhatsApp</span>
              <span className="text-[10px] text-emerald-300 font-mono">(24) 99872-9266</span>
            </a>

            {/* 📸 Instagram WVR */}
            <a
              href="https://www.instagram.com/wvrconstrucoes"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800/80 hover:bg-pink-600/20 border border-zinc-700/80 hover:border-pink-500/50 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
            >
              <InstagramIcon className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-[11px]">Instagram WVR</span>
              <span className="text-[10px] text-zinc-400">@wvrconstrucoes</span>
            </a>

            {/* 📘 Facebook WVR */}
            <a
              href="https://www.facebook.com/wvrconstrucoes"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800/80 hover:bg-blue-600/20 border border-zinc-700/80 hover:border-blue-500/50 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
            >
              <FacebookIcon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-[11px]">Facebook WVR</span>
              <span className="text-[10px] text-zinc-400">wvrconstrucoes</span>
            </a>

            {/* 📘 Facebook GDM */}
            <a
              href="https://www.facebook.com/gdmsobmedida"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800/80 hover:bg-blue-600/20 border border-zinc-700/80 hover:border-blue-500/50 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
            >
              <FacebookIcon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-[11px]">Facebook GDM</span>
              <span className="text-[10px] text-zinc-400">gdmsobmedida</span>
            </a>

            {/* 🎵 TikTok WVR */}
            <a
              href="https://www.tiktok.com/@wvrconstrucoes"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/80 hover:border-zinc-500 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
            >
              <TiktokIcon className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-[11px]">TikTok WVR</span>
              <span className="text-[10px] text-zinc-400">@wvrconstrucoes</span>
            </a>

            {/* 🎵 TikTok GDM */}
            <a
              href="https://www.tiktok.com/@gdmplanejadosrj"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/80 hover:border-zinc-500 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
            >
              <TiktokIcon className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-[11px]">TikTok GDM</span>
              <span className="text-[10px] text-zinc-400">@gdmplanejadosrj</span>
            </a>

            {/* ▶️ YouTube WVR */}
            <a
              href="https://www.youtube.com/@wvrconstrucoes"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800/80 hover:bg-red-600/20 border border-zinc-700/80 hover:border-red-500/50 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
            >
              <YoutubeIcon className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-[11px]">YouTube WVR</span>
              <span className="text-[10px] text-zinc-400">WVR Construções</span>
            </a>

            {/* 📢 Universo Ads */}
            <a
              href={`https://wa.me/${phoneWhatsApp}?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20as%20soluções%20em%20anúncios%20e%20tráfego%20da%20Universo%20Ads.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800/80 hover:bg-amber-500/20 border border-zinc-700/80 hover:border-amber-500/50 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
              title="Universo Ads - Soluções em Anúncios Google, Meta e TikTok"
            >
              <Megaphone className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-[11px]">Universo Ads</span>
              <span className="text-[10px] text-zinc-400">Anúncios & Tráfego</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-900 pt-6 text-center text-[11px] text-zinc-500">
          © {new Date().getFullYear()} UNIVERSO ADAS • PAU PARA TODA OBRA • WVR Construções • GDM Móveis Planejados. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
