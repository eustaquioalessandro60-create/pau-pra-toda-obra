import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Download,
  PhoneCall,
  CheckCircle2,
  Trash2,
  Plus,
  Building2,
  Boxes,
  ShieldCheck,
  UserCheck,
  Printer,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  RotateCcw,
  BellRing,
  Shield,
  DollarSign,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Project3DState, ClientData, QuoteItem, ServiceDetail } from "../types";

interface QuoteGeneratorProps {
  projectState: Project3DState;
  selectedServices: ServiceDetail[];
}

export const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({
  projectState,
  selectedServices,
}) => {
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const [clientData, setClientData] = useState<ClientData>({
    name: "",
    phone: "",
    email: "",
    city: "Volta Redonda",
    neighborhood: "",
    serviceType: "Construção e Reforma Completa",
    preferredContactMethod: "whatsapp",
    notes: "",
  });

  const phoneWhatsApp = "5524998729266";

  // Calculate terrain area
  const terrainArea = (projectState.terrain.width || 10) * (projectState.terrain.length || 20);

  // Generate automatic budget items based on 3D state & selected services
  const calculateItems = (): QuoteItem[] => {
    const items: QuoteItem[] = [];

    // 1. Construção / Fundação WVR
    if (projectState.hasFoundation) {
      items.push({
        id: "item-fundacao",
        category: "Construção WVR",
        title: "Fundação Reforçada e Estrutura Inicial",
        description: `Execução de sapatas, baldrame e impermeabilização para área de ${terrainArea} m²`,
        unit: "m²",
        quantity: terrainArea,
        unitPrice: 320,
        totalPrice: terrainArea * 320,
      });
    }

    // 2. Paredes e Alvenaria
    items.push({
      id: "item-paredes",
      category: "Construção WVR",
      title: "Alvenaria, Reboco e Elevação de Paredes",
      description: `Paredes com pé-direito de ${projectState.wallHeight}m e acabamento fino`,
      unit: "m²",
      quantity: Math.round(terrainArea * 0.7),
      unitPrice: 480,
      totalPrice: Math.round(terrainArea * 0.7) * 480,
    });

    // 3. Telhado Colonial / Flat
    if (projectState.roofType !== "sem") {
      items.push({
        id: "item-telhado",
        category: "Carpintaria WVR",
        title: `Telhado Modelo ${projectState.roofType === "colonial" ? "Colonial" : "Platibanda"}`,
        description: "Vigamento de madeira tratada, calhas e acabamento envernizado",
        unit: "m²",
        quantity: Math.round(terrainArea * 0.6),
        unitPrice: 280,
        totalPrice: Math.round(terrainArea * 0.6) * 280,
      });
    }

    // 4. Piscina com Borda Infinita
    if (projectState.pool.hasPool) {
      items.push({
        id: "item-piscina",
        category: "Lazer UNIVERSO ADAS",
        title: "Piscina com Borda Infinita e Casa de Máquinas",
        description: "Escavação, revestimento em pastilhas, iluminação LED e deck ecológico",
        unit: "unidade",
        quantity: 1,
        unitPrice: 38000,
        totalPrice: 38000,
      });
    }

    // 5. Área Gourmet com Churrasqueira e Sinuca
    if (projectState.gourmet.hasGourmet) {
      items.push({
        id: "item-gourmet",
        category: "Lazer UNIVERSO ADAS",
        title: "Área Gourmet Completa com Churrasqueira e Mesa de Sinuca",
        description: "Churrasqueira refratária, bancada em granito, pergolado e sinuca oficial",
        unit: "conjunto",
        quantity: 1,
        unitPrice: 22000,
        totalPrice: 22000,
      });
    }

    // 6. Móveis Planejados GDM
    if (projectState.furniture.cozinha) {
      items.push({
        id: "item-gdm-cozinha",
        category: "Móveis Planejados GDM",
        title: "Cozinha Planejada 100% MDF Naval",
        description: "Armários aéreos, balcão com corrediças invisíveis e amortecedores",
        unit: "projeto",
        quantity: 1,
        unitPrice: 14500,
        totalPrice: 14500,
      });
    }

    // 7. Additional Selected Services
    selectedServices.forEach((s, idx) => {
      items.push({
        id: `sel-serv-${idx}`,
        category: s.category,
        title: s.title,
        description: s.shortDesc,
        unit: s.unit,
        quantity: 1,
        unitPrice: s.estimatedPriceMin > 0 ? s.estimatedPriceMin : 1200,
        totalPrice: s.estimatedPriceMin > 0 ? s.estimatedPriceMin : 1200,
      });
    });

    return items;
  };

  // Base calculated items
  const baseItems = calculateItems();
  const baseSubtotal = baseItems.reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Budget Guardian state & Custom Extra Expenses
  const [initialEstimateValue, setInitialEstimateValue] = useState<number>(baseSubtotal || 80000);
  const [extraExpenses, setExtraExpenses] = useState<QuoteItem[]>([]);
  const [newExtraTitle, setNewExtraTitle] = useState<string>("");
  const [newExtraAmount, setNewExtraAmount] = useState<string>("");
  const [hasDispatchedAlert, setHasDispatchedAlert] = useState<boolean>(false);

  // Consolidate all items
  const budgetItems = [...baseItems, ...extraExpenses];
  const subtotal = budgetItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const cashDiscount = subtotal * 0.05; // 5% de desconto à vista
  const totalWithDiscount = subtotal - cashDiscount;

  // Calculate Overrun Percentage
  const overrunAmount = subtotal - initialEstimateValue;
  const overrunPercent = initialEstimateValue > 0 ? (overrunAmount / initialEstimateValue) * 100 : 0;
  const isBudgetExceededOver10 = overrunPercent > 10;

  // Automatic Budget Guardian Notification Trigger
  useEffect(() => {
    if (isBudgetExceededOver10 && !hasDispatchedAlert) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("budget-guardian-overrun", {
            detail: {
              initialEstimate: initialEstimateValue,
              currentTotal: subtotal,
              overrunPercent,
              clientName: clientData.name || "Cliente",
            },
          })
        );
      }
      setHasDispatchedAlert(true);
    } else if (!isBudgetExceededOver10 && hasDispatchedAlert) {
      setHasDispatchedAlert(false);
    }
  }, [isBudgetExceededOver10, subtotal, initialEstimateValue, clientData.name, hasDispatchedAlert]);

  const handleAddExtraExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExtraTitle.trim() || !newExtraAmount) return;
    const amount = parseFloat(newExtraAmount) || 0;
    if (amount <= 0) return;

    const newItem: QuoteItem = {
      id: `extra-${Date.now()}`,
      category: "Adicional / Imprevisto",
      title: newExtraTitle.trim(),
      description: "Despesa extra ou aditivo contratual adicionado ao projeto",
      unit: "serviço",
      quantity: 1,
      unitPrice: amount,
      totalPrice: amount,
    };

    setExtraExpenses([...extraExpenses, newItem]);
    setNewExtraTitle("");
    setNewExtraAmount("");
  };

  const handleRemoveExtraExpense = (id: string) => {
    setExtraExpenses(extraExpenses.filter((item) => item.id !== id));
  };

  const handleTriggerManualAlert = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("budget-guardian-overrun", {
          detail: {
            initialEstimate: initialEstimateValue,
            currentTotal: subtotal,
            overrunPercent: Math.max(overrunPercent, 12.5),
            clientName: clientData.name || "Cliente",
          },
        })
      );
    }
  };

  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);

  // Generate Professional PDF
  const handleExportPDF = async () => {
    if (!pdfContainerRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const element = pdfContainerRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      // Extra pages if content exceeds A4 height
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const clientCleanName = (clientData.name || "Cliente").trim().replace(/[^a-zA-Z0-9]/g, "_");
      const fileName = `Proposta_Orçamento_UNIVERSO_ADAS_${clientCleanName}.pdf`;

      pdf.save(fileName);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Falha ao gerar o arquivo PDF. Tente novamente.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Direct Send to WhatsApp 24998729266
  const handleSendWhatsAppOrder = () => {
    if (!clientData.name || !clientData.phone) {
      alert("Por favor, preencha o seu nome e telefone antes de enviar.");
      return;
    }

    const messageText = `*NOVO PEDIDO / SOLICITAÇÃO DE ORÇAMENTO*
*UNIVERSO ADAS - DO TERRENO À CHAVE NA MÃO*

👤 *Cliente:* ${clientData.name}
📱 *Telefone:* ${clientData.phone}
📍 *Cidade/Bairro:* ${clientData.city} - ${clientData.neighborhood}
📋 *Serviço:* ${clientData.serviceType}

📐 *Projeto 3D Terreno:* ${terrainArea} m²
💰 *Valor Estimado Subtotal:* R$ ${subtotal.toLocaleString("pt-BR")}
🏷️ *Com Desconto à Vista (5%):* R$ ${totalWithDiscount.toLocaleString("pt-BR")}

*Itens do Orçamento:*
${budgetItems.map((i) => `• ${i.title}: R$ ${i.totalPrice.toLocaleString("pt-BR")}`).join("\n")}

*Observações do Cliente:* ${clientData.notes || "Sem observações adicionais."}

_Enviado pelo site oficial do UNIVERSO ADAS_`;

    const url = `https://wa.me/${phoneWhatsApp}?text=${encodeURIComponent(messageText)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="py-10 bg-slate-50 text-zinc-900 min-h-screen border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase mb-3">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Sistema Oficial de Orçamento e Pedido</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            ORÇAMENTO DETALHADO <span className="text-amber-600">COM PDF & WHATSAPP</span>
          </h2>
          <p className="text-zinc-600 font-medium text-sm sm:text-base mt-1">
            Gere a proposta oficial do seu imóvel com a chancela WVR Construções e GDM Móveis Planejados.
          </p>
        </div>

        {/* BUDGET GUARDIAN MONITORING PANEL */}
        <div className={`mb-8 p-6 rounded-3xl border-2 transition-all shadow-2xl ${
          isBudgetExceededOver10
            ? "bg-zinc-950 border-red-500/80 text-white"
            : "bg-zinc-900 border-amber-500/40 text-white"
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                  isBudgetExceededOver10
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-amber-500 text-zinc-950"
                }`}>
                  <ShieldAlert className="w-3.5 h-3.5" /> Guardião de Orçamento
                </span>
                <span className="text-xs text-amber-400 font-extrabold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Monitoramento em Tempo Real (&gt;10%)
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>Proteção e Monitoramento de Custos</span>
                {isBudgetExceededOver10 ? (
                  <span className="text-red-400 font-extrabold text-xs bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-500/50 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce" /> ALERTA: +{overrunPercent.toFixed(1)}% ACIMA DO ORÇADO
                  </span>
                ) : (
                  <span className="text-emerald-400 font-extrabold text-xs bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/50 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Orçamento Seguro (&lt;10% Variação)
                  </span>
                )}
              </h3>
            </div>

            {/* Quick Alert Trigger */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleTriggerManualAlert}
                className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-400" />
                <span>Simular Alerta de Disparo</span>
              </button>
            </div>
          </div>

          {/* Metrics Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
            {/* Metric 1: Initial Estimate */}
            <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">
                Estimativa Inicial Prevista (R$)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={initialEstimateValue}
                  onChange={(e) => setInitialEstimateValue(parseFloat(e.target.value) || 0)}
                  className="bg-zinc-900 border border-zinc-700 text-amber-400 font-black text-base rounded-lg p-1.5 w-full focus:outline-none focus:border-amber-400"
                />
              </div>
              <span className="text-[10px] text-zinc-500 block mt-1">Valor orçado base de referência</span>
            </div>

            {/* Metric 2: Current Expenses */}
            <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">
                Gastos Atuais Totais (R$)
              </span>
              <div className="text-lg font-black text-white">
                R$ {subtotal.toLocaleString("pt-BR")}
              </div>
              <span className="text-[10px] text-zinc-500 block mt-1">Soma de itens do projeto + adicionais</span>
            </div>

            {/* Metric 3: Difference Variance */}
            <div className={`p-3.5 rounded-2xl border ${
              isBudgetExceededOver10
                ? "bg-red-950/60 border-red-500/80 text-red-300"
                : overrunAmount > 0
                ? "bg-amber-950/40 border-amber-500/40 text-amber-300"
                : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
            }`}>
              <span className="text-[10px] font-bold uppercase block mb-1 opacity-80">
                Variância em R$ e %
              </span>
              <div className="text-lg font-black flex items-center gap-1">
                <span>{overrunAmount >= 0 ? "+" : ""}R$ {overrunAmount.toLocaleString("pt-BR")}</span>
                <span className="text-xs">({overrunPercent.toFixed(1)}%)</span>
              </div>
              <span className="text-[10px] opacity-80 block mt-1">
                {isBudgetExceededOver10
                  ? "⚠️ Excede margem tolerada de 10%! Notificação ativada."
                  : "✓ Dentro da margem segura de tolerância"}
              </span>
            </div>
          </div>

          {/* Add Custom Extra Expense Form */}
          <div className="pt-3 border-t border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Adicionar Imprevisto ou Adicional ao Projeto (Teste do Guardião):
            </span>
            <form onSubmit={handleAddExtraExpense} className="flex flex-col sm:flex-row items-stretch gap-2">
              <input
                type="text"
                placeholder="Ex: Escavação em rocha ou reajuste de insumo"
                value={newExtraTitle}
                onChange={(e) => setNewExtraTitle(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400 flex-1"
              />
              <input
                type="number"
                placeholder="Valor (R$) ex: 12000"
                value={newExtraAmount}
                onChange={(e) => setNewExtraAmount(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400 w-full sm:w-40"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-xl flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Extra</span>
              </button>
            </form>

            {extraExpenses.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {extraExpenses.map((ex) => (
                  <span
                    key={ex.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-950 border border-zinc-800 text-amber-300"
                  >
                    <span>{ex.title}: R$ {ex.totalPrice.toLocaleString("pt-BR")}</span>
                    <button
                      onClick={() => handleRemoveExtraExpense(ex.id)}
                      className="text-zinc-500 hover:text-red-400 ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setExtraExpenses([])}
                  className="text-[11px] text-zinc-400 hover:text-white underline ml-2"
                >
                  Limpar Extras
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CLIENT REGISTRATION FORM (5 Columns) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-zinc-200 shadow-md space-y-4">
            <h3 className="text-base font-black text-zinc-950 uppercase border-b pb-3 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-600" />
              <span>SOLICITAR ORÇAMENTO NO 'PAU PARA TODA OBRA'</span>
            </h3>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Seu Nome Completo:</label>
              <input
                type="text"
                placeholder="Ex: Alessandro Eustaquio"
                value={clientData.name}
                onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                className="w-full bg-slate-50 border border-zinc-300 rounded-xl p-2.5 text-sm font-semibold focus:outline-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">WhatsApp / Celular:</label>
                <input
                  type="text"
                  placeholder="(24) 99999-9999"
                  value={clientData.phone}
                  onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-zinc-300 rounded-xl p-2.5 text-sm font-semibold focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Cidade:</label>
                <input
                  type="text"
                  value={clientData.city}
                  onChange={(e) => setClientData({ ...clientData, city: e.target.value })}
                  className="w-full bg-slate-50 border border-zinc-300 rounded-xl p-2.5 text-sm font-semibold focus:outline-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Bairro do Imóvel:</label>
              <input
                type="text"
                placeholder="Ex: Aterrado, Centro, Retiro..."
                value={clientData.neighborhood}
                onChange={(e) => setClientData({ ...clientData, neighborhood: e.target.value })}
                className="w-full bg-slate-50 border border-zinc-300 rounded-xl p-2.5 text-sm font-semibold focus:outline-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Observações ou Pedido Especial:</label>
              <textarea
                rows={3}
                placeholder="Descreva detalhes específicos da obra, horários ou exigências..."
                value={clientData.notes}
                onChange={(e) => setClientData({ ...clientData, notes: e.target.value })}
                className="w-full bg-slate-50 border border-zinc-300 rounded-xl p-2.5 text-sm font-semibold focus:outline-amber-500"
              />
            </div>

            {/* Form CTAs */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleSendWhatsAppOrder}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <PhoneCall className="w-5 h-5" />
                <span>ENVIAR DIRETO AO WHATSAPP DA WVR</span>
              </button>

              <button
                onClick={handleExportPDF}
                disabled={isGeneratingPDF}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-75 text-amber-400 font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>GERANDO PDF FORMATADO...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>BAIXAR ARQUIVO PDF OFICIAL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ITEMIZATION / PDF PREVIEW CONTAINER (7 Columns) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-zinc-300 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <span className="text-xs font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-amber-600" /> Pré-visualização do Documento PDF
              </span>
              <button
                onClick={handleExportPDF}
                disabled={isGeneratingPDF}
                className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-amber-700" />
                <span>Exportar PDF</span>
              </button>
            </div>

            <div ref={pdfContainerRef} className="p-5 bg-white space-y-6 rounded-xl border border-zinc-200">
              {/* Official Header */}
              <div className="border-b-2 border-amber-500 pb-4 flex items-center justify-between">
                <div>
                  <div className="text-xl font-black text-zinc-950 tracking-tight">
                    UNIVERSO <span className="text-amber-600">ADAS</span>
                  </div>
                  <div className="text-xs font-bold text-zinc-600">
                    WVR Construções • GDM Móveis Planejados
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    WhatsApp Comercial: (24) 99872-9266
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="font-bold text-zinc-900">PROPOSTA DE ORÇAMENTO</div>
                  <div className="text-zinc-500 text-[10px]">
                    Data: {new Date().toLocaleDateString("pt-BR")}
                  </div>
                </div>
              </div>

              {/* Client Summary Box */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-zinc-200 text-xs grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold text-zinc-700">Cliente: </span>
                  <span className="font-bold text-zinc-950">{clientData.name || "Não informado"}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700">Contato: </span>
                  <span className="font-bold text-zinc-950">{clientData.phone || "Não informado"}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700">Cidade: </span>
                  <span className="font-bold text-zinc-950">{clientData.city}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700">Área do Terreno: </span>
                  <span className="font-bold text-emerald-700">{terrainArea} m²</span>
                </div>
              </div>

              {/* Table of Items */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-900 text-amber-400 font-bold uppercase">
                    <tr>
                      <th className="p-2 rounded-l-lg">Item / Categoria</th>
                      <th className="p-2">Qtd</th>
                      <th className="p-2">Unitário</th>
                      <th className="p-2 text-right rounded-r-lg">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium">
                    {budgetItems.map((item) => (
                      <tr key={item.id} className="hover:bg-amber-50/50">
                        <td className="p-2 py-3">
                          <div className="font-bold text-zinc-900">{item.title}</div>
                          <div className="text-[10px] text-zinc-500">{item.description}</div>
                        </td>
                        <td className="p-2">{item.quantity} {item.unit}</td>
                        <td className="p-2">R$ {item.unitPrice.toLocaleString("pt-BR")}</td>
                        <td className="p-2 text-right font-bold text-zinc-950">
                          R$ {item.totalPrice.toLocaleString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals & Payment Conditions */}
              <div className="border-t-2 border-zinc-900 pt-4 space-y-2 text-xs">
                <div className="flex justify-between items-center text-sm font-bold text-zinc-800">
                  <span>Subtotal dos Serviços:</span>
                  <span>R$ {subtotal.toLocaleString("pt-BR")}</span>
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-emerald-700">
                  <span>Desconto de 5% para Pagamento à Vista:</span>
                  <span>- R$ {cashDiscount.toLocaleString("pt-BR")}</span>
                </div>

                <div className="flex justify-between items-center text-lg font-black text-zinc-950 bg-amber-100 p-3 rounded-xl border border-amber-300">
                  <span>VALOR TOTAL FINAL:</span>
                  <span className="text-emerald-800">R$ {totalWithDiscount.toLocaleString("pt-BR")}</span>
                </div>

                <div className="text-[10px] text-zinc-500 pt-2 border-t text-center italic">
                  * Financiamento disponível pela Caixa Econômica Federal em até 420 meses. Sujeito à aprovação de crédito.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
