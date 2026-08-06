import React, { useState } from "react";
import {
  Landmark,
  Calculator,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Gavel,
  ShieldAlert,
  Tag,
  Percent,
  Info,
  AlertCircle,
  FileText,
} from "lucide-react";
import { FinancingSim, MainTab } from "../types";

interface FinancingSimulatorProps {
  setActiveTab: (tab: MainTab) => void;
}

export const FinancingSimulator: React.FC<FinancingSimulatorProps> = ({
  setActiveTab,
}) => {
  const [sim, setSim] = useState<FinancingSim>({
    propertyValue: 250000,
    downPayment: 50000,
    loanAmount: 200000,
    termMonths: 360, // 30 anos
    interestRateYear: 8.5, // 8.5% ao ano
    estimatedMonthlyPayment: 0,
    modality: "construcao_terreno_proprio",
  });

  const phoneWhatsApp = "5524998729266";

  // Calculate Price Table Monthly Payment
  const loanValue = Math.max(0, sim.propertyValue - sim.downPayment);
  const monthlyRate = sim.interestRateYear / 100 / 12;
  const numPayments = sim.termMonths;

  let monthlyPayment = 0;
  if (monthlyRate > 0 && numPayments > 0 && loanValue > 0) {
    monthlyPayment =
      (loanValue * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  const handleApplyViaWhatsApp = () => {
    const text = `*SOLICITAÇÃO DE SIMULAÇÃO FINANCIAMENTO CAIXA*
*UNIVERSO ADAS*

🏦 *Modalidade:* ${
      sim.modality === "construcao_terreno_proprio"
        ? "Construção em Terreno Próprio"
        : sim.modality === "aquisicao_terreno_construcao"
        ? "Aquisição de Terreno + Construção"
        : sim.modality === "reforma_ampliacao"
        ? "Reforma e Ampliação de Imóvel"
        : "Programa Habitação Popular"
    }
🏠 *Valor do Projeto/Imóvel:* R$ ${sim.propertyValue.toLocaleString("pt-BR")}
💵 *Entrada Pretendida:* R$ ${sim.downPayment.toLocaleString("pt-BR")}
🏦 *Valor a Financiar:* R$ ${loanValue.toLocaleString("pt-BR")}
📅 *Prazo:* ${sim.termMonths / 12} Anos (${sim.termMonths} meses)
💰 *Parcela Estimada:* R$ ${Math.round(monthlyPayment).toLocaleString("pt-BR")}/mês

_Gostaria de dar entrada na minha aprovação de crédito com a assessoria técnica do UNIVERSO ADAS!_`;

    window.open(`https://wa.me/${phoneWhatsApp}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section className="py-12 bg-slate-50 text-zinc-900 border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full uppercase mb-3">
            <Landmark className="w-4 h-4 text-emerald-600" />
            <span>Assessoria Gratuita Caixa Econômica Federal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            SIMULADOR DE <span className="text-amber-600">FINANCIAMENTO CAIXA</span>
          </h2>
          <p className="text-zinc-600 font-medium text-base mt-1">
            Simule os valores de construção, reforma, materiais e programas habitacionais. Nós montamos toda a sua pasta técnica PCI sem burocracia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIMULATOR INPUTS (7 Columns) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-lg space-y-6">
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-2 uppercase">
                1. Escolha a Modalidade Desejada:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
                {[
                  { id: "construcao_terreno_proprio", label: "Construção em Terreno Próprio" },
                  { id: "aquisicao_terreno_construcao", label: "Aquisição de Terreno + Construção" },
                  { id: "reforma_ampliacao", label: "Reforma e Ampliação de Imóvel" },
                  { id: "minha_casa_minha_vida", label: "Programa Habitação Popular" },
                ].map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => setSim({ ...sim, modality: mod.id as any })}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      sim.modality === mod.id
                        ? "bg-zinc-950 text-amber-400 border-zinc-950 shadow-md font-black"
                        : "bg-slate-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    {mod.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Range Inputs */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-800 mb-1">
                  <span>Valor Total da Obra / Imóvel:</span>
                  <span className="text-amber-600 font-black text-sm">
                    R$ {sim.propertyValue.toLocaleString("pt-BR")}
                  </span>
                </div>
                <input
                  type="range"
                  min="80000"
                  max="1500000"
                  step="10000"
                  value={sim.propertyValue}
                  onChange={(e) => setSim({ ...sim, propertyValue: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-800 mb-1">
                  <span>Valor da Entrada Pretendida:</span>
                  <span className="text-emerald-700 font-black text-sm">
                    R$ {sim.downPayment.toLocaleString("pt-BR")}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={sim.propertyValue * 0.5}
                  step="5000"
                  value={sim.downPayment}
                  onChange={(e) => setSim({ ...sim, downPayment: Number(e.target.value) })}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-800 mb-1">
                  <span>Prazo do Financiamento ({sim.termMonths / 12} anos):</span>
                  <span className="text-zinc-900 font-black text-sm">
                    {sim.termMonths} Meses
                  </span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="420"
                  step="12"
                  value={sim.termMonths}
                  onChange={(e) => setSim({ ...sim, termMonths: Number(e.target.value) })}
                  className="w-full accent-zinc-800"
                />
              </div>
            </div>
          </div>

          {/* SIMULATION RESULT BOX (5 Columns) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-zinc-950 to-zinc-900 text-white p-6 sm:p-8 rounded-2xl border-2 border-amber-500/40 shadow-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase mb-4">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Resultado da Simulação</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-zinc-400">Valor a Financiar:</div>
                  <div className="text-2xl font-black text-white">
                    R$ {loanValue.toLocaleString("pt-BR")}
                  </div>
                </div>

                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                  <div className="text-xs font-extrabold text-amber-400 uppercase">
                    Parcela Inicial Estimada:
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">
                    R$ {Math.round(monthlyPayment).toLocaleString("pt-BR")}
                    <span className="text-xs text-zinc-400 font-normal"> / mês</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs font-semibold text-zinc-300 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Assessoria técnica completa na elaboração da planilha PCI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Liberação do crédito em parcelas conforme medição da obra</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleApplyViaWhatsApp}
              className="w-full py-4 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <PhoneCall className="w-5 h-5 text-zinc-950" />
              <span>APROVAR CRÉDITO NO WHATSAPP</span>
            </button>
          </div>
        </div>

        {/* SPECIAL ADVISORY SERVICES SECTION */}
        <div className="mt-14 space-y-8 border-t border-zinc-200 pt-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-3 py-1 rounded-full inline-block mb-2">
              Apoio Técnico & Oportunidades
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-zinc-950">
              SERVIÇOS DE ASSESSORIA ESPECIALIZADA
            </h3>
            <p className="text-zinc-600 text-sm font-medium mt-1">
              Orientação técnica completa sem burocracia para aprovação de crédito Caixa e participação segura em leilões.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 🏦 CARD 1: ASSESSORIA PARA FINANCIAMENTO CAIXA */}
            <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-sm">
                Orçamento PCI & Pasta Técnica
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
                    <Landmark className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-zinc-950 leading-tight">
                      🏦 ASSESSORIA PARA FINANCIAMENTO CAIXA
                    </h4>
                    <span className="text-xs text-emerald-700 font-bold">
                      Caixa Econômica Federal • PCI & SINAPI
                    </span>
                  </div>
                </div>

                <p className="text-zinc-700 text-xs font-medium leading-relaxed">
                  Apoio completo para quem quer construir ou reformar com financiamento. Elaboramos orçamento oficial no padrão <strong>PCI</strong> (Proposta de Empreendimento Caixa), seguimos tabelas <strong>SINAPI/Caixa</strong>, organizamos documentos e orientamos sobre todas as regras para evitar erros e atrasos.
                </p>

                {/* Important Disclaimer Alert */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl text-xs text-amber-900 font-semibold space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-950 font-bold uppercase text-[11px]">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Esclarecimento Importante:</span>
                  </div>
                  <p className="text-[11px] leading-snug text-amber-900/90">
                    Somos consultoria de <strong>apoio e orientação técnica</strong>; não somos a Caixa Econômica. Montamos o documento no padrão correto para evitar erros, devoluções e atrasos na aprovação do seu projeto.
                  </p>
                </div>

                {/* Price Table */}
                <div className="bg-slate-50 border border-zinc-200 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-black text-zinc-900 uppercase border-b pb-1">
                    Tabela de Valores Oficiais:
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium text-zinc-800">
                    <span>• Elaboração de PCI / Orçamento oficial:</span>
                    <span className="font-black text-zinc-950">R$ 390,00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium text-zinc-800">
                    <span>• Assessoria completa:</span>
                    <span className="font-black text-zinc-950">R$ 790,00 <span className="text-[10px] text-zinc-500 font-normal">(ou 1,5%)</span></span>
                  </div>
                </div>

                {/* Special Discount Box */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 flex items-start gap-2.5">
                  <Tag className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950">
                    <span className="font-black uppercase block text-[11px] text-emerald-800">
                      🎁 DESCONTO ESPECIAL AO CONTRATAR OBRA OU MÓVEIS:
                    </span>
                    <p className="text-[11px] font-bold text-emerald-900 mt-0.5">
                      PCI por apenas <span className="text-emerald-700 font-black text-xs">R$ 190,00</span> • Assessoria Completa por <span className="text-emerald-700 font-black text-xs">R$ 390,00</span>!
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${phoneWhatsApp}?text=${encodeURIComponent(
                  "Olá! Gostaria de contratar a Assessoria para Financiamento Caixa (Elaboração de PCI / Pasta Técnica)."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>SOLICITAR ASSESSORIA CAIXA NO WHATSAPP</span>
              </a>
            </div>

            {/* 🔨 CARD 2: ASSESSORIA EM LEILÕES */}
            <div className="bg-white rounded-2xl border-2 border-amber-500/40 p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-zinc-950 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-sm">
                Segurança & Estratégia de Lances
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                    <Gavel className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-zinc-950 leading-tight">
                      🔨 ASSESSORIA EM LEILÕES
                    </h4>
                    <span className="text-xs text-amber-700 font-bold">
                      Caixa • Judiciais • PRF • Detran • Receita Federal
                    </span>
                  </div>
                </div>

                <p className="text-zinc-700 text-xs font-medium leading-relaxed">
                  Ajudamos você a encontrar boas oportunidades e participar com total segurança. Abrangemos leilões da <strong>Caixa, judiciais, PRF, Detran, Receita Federal</strong> e outros órgãos públicos. Analisamos riscos, situação do bem, valor de mercado, definimos estratégia de lances e acompanhamos a disputa junto com você.
                </p>

                {/* Safety Rule Warning Box */}
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-xl text-xs text-red-900 font-semibold space-y-1">
                  <div className="flex items-center gap-1.5 text-red-950 font-black uppercase text-[11px]">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Regra Obrigatória de Segurança:</span>
                  </div>
                  <p className="text-[11px] leading-snug text-red-900/90">
                    <strong>NÃO USAMOS NEM INDICAMOS robôs ou lances automáticos</strong>, pois são proibidos nas plataformas oficiais e trazem riscos graves de perda de dinheiro e bloqueio de conta. Trabalhamos exclusivamente com estratégia humana inteligente e 100% legal.
                  </p>
                </div>

                {/* Price Table */}
                <div className="bg-slate-50 border border-zinc-200 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-black text-zinc-900 uppercase border-b pb-1">
                    Tabela de Valores Oficiais:
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium text-zinc-800">
                    <span>• Análise de oportunidade e estratégia:</span>
                    <span className="font-black text-zinc-950">R$ 190,00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium text-zinc-800">
                    <span>• Acompanhamento no dia do leilão:</span>
                    <span className="font-black text-zinc-950">R$ 290,00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium text-zinc-800">
                    <span>• Pacote completo de assessoria:</span>
                    <span className="font-black text-zinc-950">R$ 390,00</span>
                  </div>
                </div>

                {/* Special Discount Box */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-2.5">
                  <Percent className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-950">
                    <span className="font-black uppercase block text-[11px] text-amber-900">
                      🎁 50% DE DESCONTO AO CONTRATAR OBRA / REFORMA:
                    </span>
                    <p className="text-[11px] font-bold text-amber-900 mt-0.5">
                      Garante <span className="text-amber-800 font-black text-xs">50% de desconto</span> no pacote completo de assessoria se fechar a obra ou reforma do imóvel arrematado depois conosco!
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${phoneWhatsApp}?text=${encodeURIComponent(
                  "Olá! Gostaria de solicitar a Assessoria em Leilões (Imóveis e Bens)."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-zinc-950" />
                <span>SOLICITAR ASSESSORIA EM LEILÕES NO WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
