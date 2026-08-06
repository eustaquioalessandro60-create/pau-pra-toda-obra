import React, { useState } from "react";
import {
  Building2,
  Hammer,
  Boxes,
  ShieldCheck,
  Trees,
  Wrench,
  Axe,
  FileCheck2,
  Landmark,
  Gavel,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SERVICES_DATA } from "../data/initialData";
import { ServiceDetail, MainTab } from "../types";

interface ServicesSectionProps {
  setActiveTab: (tab: MainTab) => void;
  onSelectServiceForQuote?: (service: ServiceDetail) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  setActiveTab,
  onSelectServiceForQuote,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>("wvr-reformas");

  const categories = [
    "Todos",
    "Construção",
    "Reforma",
    "Móveis Planejados",
    "Financiamento",
    "Leilões",
    "Segurança",
    "Paisagismo",
    "Serralheria",
    "Carpintaria",
    "Documentação",
  ];

  const filteredServices =
    selectedCategory === "Todos"
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.category === selectedCategory);

  const phoneWhatsApp = "5524998729266";

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Building2":
        return <Building2 className="w-6 h-6 text-amber-500" />;
      case "Hammer":
        return <Hammer className="w-6 h-6 text-emerald-500" />;
      case "Boxes":
        return <Boxes className="w-6 h-6 text-amber-500" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-6 h-6 text-emerald-500" />;
      case "Trees":
        return <Trees className="w-6 h-6 text-amber-500" />;
      case "Wrench":
        return <Wrench className="w-6 h-6 text-emerald-500" />;
      case "Axe":
        return <Axe className="w-6 h-6 text-amber-500" />;
      case "FileCheck2":
        return <FileCheck2 className="w-6 h-6 text-emerald-500" />;
      case "Landmark":
        return <Landmark className="w-6 h-6 text-amber-500" />;
      case "Gavel":
        return <Gavel className="w-6 h-6 text-amber-500" />;
      default:
        return <Building2 className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <section className="py-12 bg-slate-50 text-zinc-900 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Soluções Completas WVR & GDM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight mb-3">
            NOSSOS SERVIÇOS EM <span className="text-amber-600">DESTAQUE ABSOLUTO</span>
          </h2>
          <p className="text-zinc-600 font-medium text-base sm:text-lg">
            Garantia total de qualidade, tecnologia e prazos respeitados. Escolha a solução para sua casa ou empreendimento:
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                selectedCategory === cat
                  ? "bg-zinc-950 text-amber-400 shadow-md scale-105"
                  : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Highlight Banner for WVR Reformas Special Emphasis */}
        <div className="bg-gradient-to-r from-zinc-900 via-amber-950 to-zinc-900 text-white rounded-2xl p-6 mb-10 border-2 border-amber-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Hammer className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>
            <div>
              <div className="inline-block bg-amber-400 text-zinc-950 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase mb-1">
                Ênfase Especial WVR
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                REFORMAS RESIDENCIAIS & COMERCIAIS
              </h3>
              <p className="text-zinc-300 text-sm mt-1 max-w-2xl">
                Executamos reformas completas, pequenos reparos expressos, modernização de ambientes, adequações elétricas/hidráulicas e acessibilidade sem surpresas no orçamento.
              </p>
            </div>
          </div>

          <div className="flex gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                setActiveTab("ferramenta3d");
                window.scrollTo({ top: 500, behavior: "smooth" });
              }}
              className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-amber-400 text-zinc-950 font-black text-sm hover:bg-amber-300 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>Simular 3D</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isExpanded = expandedServiceId === service.id;

            return (
              <div
                key={service.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  service.id === "wvr-reformas"
                    ? "border-amber-500 shadow-lg ring-2 ring-amber-500/20"
                    : "border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-md"
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="p-6 border-b border-zinc-100 bg-slate-50/50 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                        {getServiceIcon(service.iconName)}
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-900 text-amber-400">
                          {service.brand === "UNIVERSO_ADAS" ? "PAU PARA TODA OBRA" : service.brand}
                        </span>
                        <h3 className="text-lg font-black text-zinc-950 mt-1 leading-snug">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-zinc-600 text-sm font-medium mb-4">
                      {service.shortDesc}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-2 mb-4 text-xs font-semibold text-zinc-700">
                      {service.features.slice(0, isExpanded ? service.features.length : 3).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Highlighted Banner for Special Customizations & Social Media Callout */}
                    {(service.category === "Construção" || service.category === "Reforma") && (
                      <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-950 font-medium">
                        <p className="leading-relaxed">
                          ✨ <strong className="font-bold text-amber-900">Acabamentos personalizados:</strong> Pinturas em cores diversas, texturas, efeitos especiais e tudo o que você imaginar para deixar sua casa com a sua cara! Veja exemplos reais nas nossas redes sociais no rodapé.
                        </p>
                      </div>
                    )}

                    {service.category === "Móveis Planejados" && (
                      <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-950 font-medium">
                        <p className="leading-relaxed">
                          🎨 <strong className="font-bold text-emerald-950">Móveis de todas as cores e estilos:</strong> Temos opções em branco, tons amadeirados, cores vibrantes, foscas, brilhantes, e combinações exclusivas. Adaptamos ao seu gosto e ao ambiente! Acesse nossas redes no rodapé para ver centenas de exemplos.
                        </p>
                      </div>
                    )}

                    {/* Expandable Description */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-zinc-100 text-xs text-zinc-600 bg-amber-50/50 p-3 rounded-xl">
                        <div className="font-bold text-zinc-900 mb-1 flex items-center gap-1">
                          <Info className="w-3.5 h-3.5 text-amber-600" />
                          Detalhes do Serviço:
                        </div>
                        <p className="leading-relaxed">{service.fullDesc}</p>

                        {service.estimatedPriceMin > 0 && (
                          <div className="mt-3 pt-2 border-t border-amber-200/60 font-bold text-amber-900 flex justify-between items-center">
                            <span>Estimativa de Valor:</span>
                            <span className="text-sm text-emerald-700">
                              R$ {service.estimatedPriceMin} - R$ {service.estimatedPriceMax} / {service.unit}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-6 pt-0 space-y-2">
                  <button
                    onClick={() => setExpandedServiceId(isExpanded ? null : service.id)}
                    className="w-full text-center text-xs font-bold text-zinc-500 hover:text-zinc-900 py-1 flex items-center justify-center gap-1"
                  >
                    <span>{isExpanded ? "Menos detalhes" : "Mais detalhes do serviço"}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex items-center gap-2 pt-1">
                    {onSelectServiceForQuote && (
                      <button
                        onClick={() => {
                          onSelectServiceForQuote(service);
                          setActiveTab("orcamento");
                        }}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Adicionar ao Orçamento</span>
                      </button>
                    )}

                    <a
                      href={`https://wa.me/${phoneWhatsApp}?text=Olá,%20tenho%20interesse%20no%20serviço:%20${encodeURIComponent(
                        service.title
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1"
                      title="Chamar no WhatsApp"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
