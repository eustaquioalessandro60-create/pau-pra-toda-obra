import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  Phone,
  Building2,
  MapPin,
  Sparkles,
  Calendar,
  Award,
  ShieldCheck,
  Star,
  Users,
  MessageSquare,
  Wand2,
  Zap,
  Clock,
  ChevronRight,
  FileText,
} from "lucide-react";
import { OFFICIAL_COMPANY_DATA } from "../data/initialData";
import { ServiceLead } from "../types";

interface LeadCaptureFunnelProps {
  onSuccessNavigate?: (tabName: string) => void;
}

export const LeadCaptureFunnel: React.FC<LeadCaptureFunnelProps> = ({
  onSuccessNavigate,
}) => {
  const [hasInterest, setHasInterest] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    tipoServico: "Construção Residencial WVR",
    cidade: "Barra Mansa",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<ServiceLead | null>(null);
  const [activeNurtureTab, setActiveNurtureTab] = useState<"step1" | "step2" | "step3">("step1");

  const citiesList = [
    "Barra Mansa - RJ",
    "Volta Redonda - RJ",
    "Resende - RJ",
    "Barra do Piraí - RJ",
    "Porto Real - RJ",
    "Itatiaia - RJ",
    "Outro Município do Vale do Paraíba / RJ",
  ];

  const servicesList = [
    "Construção Residencial WVR (Do Terreno à Chave)",
    "Reforma Residencial ou Comercial WVR",
    "Móveis Planejados GDM Sob Medida (100% MDF)",
    "Serralheria & Estruturas Metálicas",
    "Projeto 3D + Documentação & Financiamento Rimane",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.telefone) return;

    setIsSubmitting(true);

    const newLead: ServiceLead = {
      id: `lead-${Date.now()}`,
      nome: formData.nome,
      telefone: formData.telefone,
      tipoServico: formData.tipoServico,
      cidade: formData.cidade,
      dataCriacao: new Date().toLocaleDateString("pt-BR"),
      status: "Novo",
      origem: "Universo Ads - Formulário Curto",
    };

    try {
      // Save to localStorage for client-side persistence
      const savedLeads = JSON.parse(localStorage.getItem("universo_adas_leads") || "[]");
      savedLeads.unshift(newLead);
      localStorage.setItem("universo_adas_leads", JSON.stringify(savedLeads));

      // Post to backend server endpoint
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      }).catch(() => {});
    } catch (e) {
      console.error(e);
    }

    setIsSubmitting(false);
    setSubmittedLead(newLead);
  };

  const openWhatsAppDirect = () => {
    if (!submittedLead) return;
    const text = encodeURIComponent(
      `Olá! Meu nome é ${submittedLead.nome}, de ${submittedLead.cidade}. Quero um orçamento grátis para ${submittedLead.tipoServico}! (Solicitação via site Organizações Rimane / Universo Ads)`
    );
    window.open(`https://wa.me/${OFFICIAL_COMPANY_DATA.whatsapp}?text=${text}`, "_blank");
  };

  return (
    <section id="captacao-servicos" className="py-12 bg-zinc-950 text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Title & Badges */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Atendimento Rápido • Barra Mansa, Volta Redonda, Resende & Vale do Paraíba</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Máquina de Captação & Orçamentos Sem Compromisso
          </h2>
          <p className="text-zinc-400 text-sm font-medium">
            Garanta a melhor assessoria, preço justo e equipe própria da <strong className="text-amber-400">{OFFICIAL_COMPANY_DATA.razaoSocial}</strong> (WVR Construções & GDM Móveis Planejados).
          </p>
        </div>

        {/* QUESTION BANNER: "Precisa de construção, reforma ou móveis planejados?" */}
        {hasInterest === null && (
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 p-8 rounded-3xl border-2 border-amber-500/40 shadow-2xl text-center max-w-3xl mx-auto mb-10 space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-amber-500/20 rounded-2xl border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 shadow-lg">
              <Building2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">
                Precisa de construção, reforma ou móveis planejados?
              </h3>
              <p className="text-sm text-zinc-300">
                Responda em 1 clique para receber estimativa prévia gratuita e agendar visita técnica sem custo no Sul Fluminense.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setHasInterest(true)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-emerald-500 text-zinc-950 font-black text-base rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>SIM! QUERO ORÇAMENTO GRÁTIS</span>
              </button>

              <button
                onClick={() => setHasInterest(false)}
                className="w-full sm:w-auto px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-sm rounded-2xl border border-zinc-700 transition-colors"
              >
                Apenas Conhecendo o Site
              </button>
            </div>
          </div>
        )}

        {/* IF USER CLICKED "NÃO" or "Apenas conhecendo" */}
        {hasInterest === false && (
          <div className="bg-zinc-900/90 p-6 rounded-3xl border border-zinc-800 text-center max-w-xl mx-auto mb-10 space-y-3">
            <p className="text-sm text-zinc-300 font-medium">
              Sem problemas! Navegue à vontade por nossos modelos 3D, simulate orçamentos por m² e veja as obras executadas.
            </p>
            <button
              onClick={() => setHasInterest(true)}
              className="text-xs font-bold text-amber-400 underline hover:text-amber-300"
            >
              Mudei de idéia: Quero solicitar meu orçamento grátis agora!
            </button>
          </div>
        )}

        {/* 4-FIELD HIGH CONVERTING LEAD FORM */}
        {(hasInterest === true || submittedLead) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            {/* Form Column (7 Cols) */}
            <div className="lg:col-span-7 bg-zinc-900 p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 shadow-2xl relative">
              {!submittedLead ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div>
                      <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <span>Formulário Rápido de Orçamento (Apenas 4 Campos)</span>
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        Preencha e receba estimativa imediata + envio para o Universo Ads.
                      </p>
                    </div>
                  </div>

                  {/* Field 1: Nome Completo */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-amber-400 mb-1">
                      1. Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Alessandro Silva"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Field 2: Telefone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-amber-400 mb-1">
                      2. Telefone / WhatsApp com DDD *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(24) 99872-9266"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Field 3: Tipo de Serviço */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-amber-400 mb-1">
                      3. Tipo de Serviço Desejado *
                    </label>
                    <select
                      value={formData.tipoServico}
                      onChange={(e) => setFormData({ ...formData, tipoServico: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                    >
                      {servicesList.map((srv, idx) => (
                        <option key={idx} value={srv}>
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Field 4: Cidade / Região */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-amber-400 mb-1">
                      4. Cidade da Obra / Serviço *
                    </label>
                    <select
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                    >
                      {citiesList.map((c, idx) => (
                        <option key={idx} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400 text-zinc-950 font-black text-base rounded-2xl shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    {isSubmitting ? (
                      <span>Processando e enviando...</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5 stroke-[2.5]" />
                        <span>RECEBER ORÇAMENTO GRÁTIS</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-2 text-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Seus dados estão protegidos pelas Organizações Rimane (CNPJ {OFFICIAL_COMPANY_DATA.cnpj}).</span>
                  </div>
                </form>
              ) : (
                /* SUCCESS CONFIRMATION MODAL STATE */
                <div className="text-center space-y-6 py-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white">
                      Orçamento Solicitado com Sucesso, {submittedLead.nome}!
                    </h3>
                    <p className="text-sm text-zinc-300">
                      Cadastrado com sucesso na lista segmentada do <strong className="text-amber-400">Universo Ads</strong>. Nossa equipe técnica de Barra Mansa já recebeu seus dados.
                    </p>
                  </div>

                  <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-left space-y-2 text-xs">
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-400">Serviço:</span>
                      <span className="font-bold text-white">{submittedLead.tipoServico}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-400">Cidade:</span>
                      <span className="font-bold text-white">{submittedLead.cidade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">WhatsApp Registrado:</span>
                      <span className="font-bold text-emerald-400">{submittedLead.telefone}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      onClick={openWhatsAppDirect}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Phone className="w-5 h-5 fill-current" />
                      <span>FALAR AGORA NO WHATSAPP COM O TÉCNICO</span>
                    </button>

                    <button
                      onClick={() => setSubmittedLead(null)}
                      className="text-xs text-zinc-400 underline hover:text-zinc-200"
                    >
                      Cadastrar outra solicitação
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Local SEO & Social Proof Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Local SEO Badge */}
              <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm">
                      Líder em Obras no Vale do Paraíba / RJ
                    </h4>
                    <p className="text-xs text-amber-400 font-bold">
                      Barra Mansa • Volta Redonda • Resende
                    </p>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  Atendemos presencialmente em <strong>Barra Mansa (Sede na Rua Arábica, 310)</strong>, <strong>Volta Redonda</strong>, <strong>Resende</strong>, Porto Real, Itatiaia e municípios vizinhos do Sul Fluminense com visita técnica grátis para medição de obra.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-black text-white">+150</div>
                      <div className="text-[10px] text-zinc-400">Obras Entregues</div>
                    </div>
                  </div>

                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <div>
                      <div className="font-black text-white">4.9 / 5.0</div>
                      <div className="text-[10px] text-zinc-400">Avaliação Clientes</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-3 text-xs">
                <h4 className="font-extrabold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Por que escolher o UNIVERSO ADAS?</span>
                </h4>

                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Preço Fixo Sem Surpresas:</strong> Orçamento fechado e detalhado antes de iniciar a obra.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Equipe Própria Especializada:</strong> Engenheiros, pedreiros, marceneiros e eletricistas qualificados.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Suporte Completo na Caixa:</strong> Preparamos toda a documentação PCI para Financiamento.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* AUTOMATED FOLLOW-UP SEQUENCE SIMULATOR (NUTURING FUNNEL FOR LEADS) */}
        <div className="bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6 mt-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">
                <MessageSquare className="w-4 h-4" />
                <span>Sequência Automática de Acompanhamento (Universo Ads)</span>
              </div>
              <h3 className="text-xl font-black text-white">
                Nutrição de Clientes & Acompanhamento Personalizado
              </h3>
            </div>

            <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 text-xs">
              <button
                onClick={() => setActiveNurtureTab("step1")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeNurtureTab === "step1"
                    ? "bg-amber-400 text-zinc-950 shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Dia 1: Envio Imediato
              </button>
              <button
                onClick={() => setActiveNurtureTab("step2")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeNurtureTab === "step2"
                    ? "bg-amber-400 text-zinc-950 shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Dia 3: Guia de Custos m²
              </button>
              <button
                onClick={() => setActiveNurtureTab("step3")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeNurtureTab === "step3"
                    ? "bg-amber-400 text-zinc-950 shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Dia 7: Cupom Desconto GDM
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className={`p-4 rounded-2xl border transition-all ${activeNurtureTab === "step1" ? "bg-zinc-950 border-amber-400 shadow-lg" : "bg-zinc-950/50 border-zinc-800"}`}>
              <div className="flex items-center justify-between font-black text-amber-400 mb-2">
                <span>📲 Etapa 1: WhatsApp Automático</span>
                <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full">3 minutos</span>
              </div>
              <p className="text-zinc-300">
                "Olá! Recebemos sua solicitação de orçamento nas <strong>Organizações Rimane</strong>. O engenheiro Alessandro Eustaquio já está analisando as especificações da sua cidade."
              </p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${activeNurtureTab === "step2" ? "bg-zinc-950 border-amber-400 shadow-lg" : "bg-zinc-950/50 border-zinc-800"}`}>
              <div className="flex items-center justify-between font-black text-emerald-400 mb-2">
                <span>📊 Etapa 2: Estudo de Caso & m²</span>
                <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">48 horas</span>
              </div>
              <p className="text-zinc-300">
                "Confira aqui o manual técnico de custos por m² para edificações em Barra Mansa e Volta Redonda e veja como economizar até 20% com a WVR Construções!"
              </p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${activeNurtureTab === "step3" ? "bg-zinc-950 border-amber-400 shadow-lg" : "bg-zinc-950/50 border-zinc-800"}`}>
              <div className="flex items-center justify-between font-black text-sky-400 mb-2">
                <span>🎁 Etapa 3: Oferta Móveis GDM</span>
                <span className="text-[10px] bg-sky-500/20 px-2 py-0.5 rounded-full">7 dias</span>
              </div>
              <p className="text-zinc-300">
                "Fechando sua obra ou reforma esta semana com a WVR, você ganha 5% de desconto exclusivo nos móveis planejados 100% MDF da GDM!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
