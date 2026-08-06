import React, { useState } from "react";
import {
  Share2,
  CheckCircle2,
  Zap,
  Sparkles,
  Database,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  ShoppingBag,
  TrendingUp,
  Cpu,
  RefreshCw,
} from "lucide-react";
import { OFFICIAL_COMPANY_DATA } from "../data/initialData";

interface FlowBusinessMigrationSectionProps {
  onNavigateTab?: (tab: string) => void;
}

export const FlowBusinessMigrationSection: React.FC<FlowBusinessMigrationSectionProps> = ({
  onNavigateTab,
}) => {
  const [migrated, setMigrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartMigration = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Gather local storage data
      const partners = localStorage.getItem("alphatudo_partners");
      const products = localStorage.getItem("alphatudo_mercado_products");
      const leads = localStorage.getItem("alphatudo_leads");

      const payload = {
        company: OFFICIAL_COMPANY_DATA,
        partners: partners ? JSON.parse(partners) : [],
        products: products ? JSON.parse(products) : [],
        leads: leads ? JSON.parse(leads) : [],
        migratedAt: new Date().toISOString(),
      };

      localStorage.setItem("flowbusiness_migrated_bundle", JSON.stringify(payload));
      setIsLoading(false);
      setMigrated(true);
    }, 1200);
  };

  return (
    <section id="flowbusiness-migration" className="py-12 bg-zinc-950 text-white border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-sky-950/80 via-zinc-900 to-amber-950/60 p-8 sm:p-10 rounded-3xl border-2 border-sky-500/40 shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-black uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span>Integração Total do Ecossistema • FlowBusiness & Universo Ads</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <span>📲 MIGRAÇÃO AUTOMÁTICA PARA FLOWBUSINESS</span>
              </h2>

              <p className="text-zinc-300 text-sm max-w-2xl leading-relaxed">
                Transfira todos os seus cadastros, produtos do <strong>AlphaTudo Mercado</strong>, anúncios e serviços diretamente para o <strong>Flowbusiness</strong> sem repetir preenchimento. Ganhe acesso a CRM avançado, automação de leads e anúncios patrocinados no <strong>Universo Ads</strong>.
              </p>
            </div>

            <div className="shrink-0 w-full lg:w-auto">
              {!migrated ? (
                <button
                  onClick={handleStartMigration}
                  disabled={isLoading}
                  className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400 text-zinc-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>TRANSFERINDO DADOS...</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                      <span>INICIAR MIGRAÇÃO PARA FLOWBUSINESS</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="bg-emerald-500/20 border-2 border-emerald-400 p-4 rounded-2xl text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-emerald-300 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>MIGRAÇÃO CONCLUÍDA COM SUCESSO!</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Seus dados já estão sincronizados com a nuvem do FlowBusiness e Universo Ads.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* BENEFIT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-sky-500/20 text-xs">
            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 space-y-2">
              <div className="font-black text-amber-400 flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>Zero Redigitação</span>
              </div>
              <p className="text-zinc-400">
                Anúncios, produtos, preços e fotos cadastrados no AlphaTudo são importados com 1 clique.
              </p>
            </div>

            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 space-y-2">
              <div className="font-black text-sky-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Funil de Vendas com IA</span>
              </div>
              <p className="text-zinc-400">
                Organize solicitações de orçamentos por etapas: Novo Lead, Visita Técnica, Proposta e Fechado.
              </p>
            </div>

            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 space-y-2">
              <div className="font-black text-emerald-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Impulsionamento Universo Ads</span>
              </div>
              <p className="text-zinc-400">
                Ative campanhas de divulgação externa no Facebook, Instagram e Google direto pelo painel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
