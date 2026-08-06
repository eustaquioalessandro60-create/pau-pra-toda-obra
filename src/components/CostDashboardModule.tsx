import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Cloud,
  RefreshCw,
  AlertTriangle,
  Plus,
  Trash2,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Copy,
  Check,
  ShieldCheck,
  Calculator,
  Bell,
  CheckCircle2,
  Zap,
  Sliders,
  Info,
  ExternalLink,
} from "lucide-react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface CostCategoryItem {
  id: string;
  category: string;
  budget: number;
  actual: number;
  notes?: string;
}

export interface MonitoredMaterialItem {
  id: string;
  name: string;
  unit: string;
  baseUnitPrice: number; // Orçamento Original em R$ por unidade
  marketUnitPrice: number; // Cotação Atual de Mercado em R$
  lastUpdated: string; // ex: HH:mm:ss ou DD/MM/YYYY
  indexSource: string; // ex: "SINAPI - FGV", "INCC-M", "Cotação Direta"
  category: string; // ex: "Estrutura", "Elétrica", "Hidráulica"
  notes?: string;
}

const DEFAULT_COST_CATEGORIES: CostCategoryItem[] = [
  {
    id: "cat-1",
    category: "Fundação & Terraplanagem",
    budget: 42000,
    actual: 41500,
    notes: "Escavação e 24 estacas concluídas com leve economia de brita",
  },
  {
    id: "cat-2",
    category: "Estrutura & Concreto",
    budget: 85000,
    actual: 89200,
    notes: "Ajuste na quantidade de aço Gerdau CA-50 por readequação estrutural",
  },
  {
    id: "cat-3",
    category: "Alvenaria & Vedações",
    budget: 48000,
    actual: 46800,
    notes: "Blocos de vedação comprados direto com desconto de lote WVR",
  },
  {
    id: "cat-4",
    category: "Cobertura & Telhado",
    budget: 35000,
    actual: 32400,
    notes: "Estrutura metálica galvanizada com fornecimento direto",
  },
  {
    id: "cat-5",
    category: "Elétrica & Hidráulica",
    budget: 28000,
    actual: 29100,
    notes: "Adição de pontos extras de iluminação LED e tomadas inteligentes",
  },
  {
    id: "cat-6",
    category: "Acabamentos & Porcelanato",
    budget: 62000,
    actual: 58000,
    notes: "Porcelanato retificado 84x84 com argamassa ACIII promocional",
  },
  {
    id: "cat-7",
    category: "Marcenaria GDM (100% MDF)",
    budget: 45000,
    actual: 45000,
    notes: "Móveis planejados de cozinha, banheiros e closets 100% MDF",
  },
  {
    id: "cat-8",
    category: "Área Gourmet & Paisagismo",
    budget: 25000,
    actual: 21300,
    notes: "Piscina e deck de madeira reflorestada com aproveitamento",
  },
];

const DEFAULT_MONITORED_MATERIALS: MonitoredMaterialItem[] = [
  {
    id: "mat-1",
    name: "Aço CA-50 Gerdau (Vergalhão 10mm)",
    unit: "kg",
    baseUnitPrice: 8.50,
    marketUnitPrice: 9.60, // +12.9% -> Alerta Crítico
    lastUpdated: "Hoje, 09:30",
    indexSource: "SINAPI / Indústria Metalúrgica",
    category: "Estrutura",
    notes: "Reajuste no preço global do minério de ferro impactou fornecedores locais.",
  },
  {
    id: "mat-2",
    name: "Cimento CP II-E-32 Zebu (Saco 50kg)",
    unit: "saco 50kg",
    baseUnitPrice: 34.50,
    marketUnitPrice: 32.80, // -4.9% -> Oportunidade
    lastUpdated: "Hoje, 10:15",
    indexSource: "INCC-M / Atacado de Construção",
    category: "Estrutura & Alvenaria",
    notes: "Lote promocional no distribuidor regional para compras acima de 100 sacos.",
  },
  {
    id: "mat-3",
    name: "Cabo Flexível Cobre 2,5mm² (Rolo 100m)",
    unit: "rolo 100m",
    baseUnitPrice: 195.00,
    marketUnitPrice: 224.00, // +14.8% -> Alerta Crítico
    lastUpdated: "Ontem, 16:45",
    indexSource: "Cotação Direta Elétrica",
    category: "Elétrica",
    notes: "Alta acentuada na cotação internacional do cobre no último trimestre.",
  },
  {
    id: "mat-4",
    name: "Porcelanato Retificado 84x84cm Calacatta",
    unit: "m²",
    baseUnitPrice: 72.00,
    marketUnitPrice: 72.00, // 0.0% -> Estável
    lastUpdated: "Hoje, 08:00",
    indexSource: "Tabela Fabricante Portobello",
    category: "Acabamentos",
    notes: "Preço congelado conforme orçamento formal garantido por 60 dias.",
  },
  {
    id: "mat-5",
    name: "Tijolo Cerâmico Baiano 6 Furos (11.5x14x24)",
    unit: "milheiro",
    baseUnitPrice: 890.00,
    marketUnitPrice: 840.00, // -5.6% -> Oportunidade
    lastUpdated: "Ontem, 14:20",
    indexSource: "Olaria Regional WVR",
    category: "Alvenaria",
    notes: "Desconto especial negociado direto com a cerâmica produtora.",
  },
  {
    id: "mat-6",
    name: "Tubo PVC Soldável 25mm 3/4\" (Barra 6m)",
    unit: "barra 6m",
    baseUnitPrice: 21.00,
    marketUnitPrice: 24.80, // +18.0% -> Alerta Crítico
    lastUpdated: "Hoje, 07:50",
    indexSource: "SINAPI / Tigre Amanco",
    category: "Hidráulica",
    notes: "Repasse de custos da resina plástica derivadas do petróleo.",
  },
  {
    id: "mat-7",
    name: "Areia Média Lavada de Rio",
    unit: "m³",
    baseUnitPrice: 115.00,
    marketUnitPrice: 122.00, // +6.0% -> Leve Alta
    lastUpdated: "Hoje, 09:10",
    indexSource: "Porto de Areia Local",
    category: "Fundação & Concreto",
    notes: "Frete rodoviário teve reajuste por alta de diesel no estado.",
  },
];

const COLLECTION_NAME = "project_costs";

export const CostDashboardModule: React.FC = () => {
  const [syncCode, setSyncCode] = useState<string>(() => {
    try {
      return localStorage.getItem("universo_adas_firestore_sync_code") || "obra-demo";
    } catch {
      return "obra-demo";
    }
  });

  const [categories, setCategories] = useState<CostCategoryItem[]>(DEFAULT_COST_CATEGORIES);
  const [materials, setMaterials] = useState<MonitoredMaterialItem[]>(DEFAULT_MONITORED_MATERIALS);
  const [alertThresholdPercent, setAlertThresholdPercent] = useState<number>(7); // Alerta quando variação for >= 7%
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isSimulatingMarket, setIsSimulatingMarket] = useState<boolean>(false);

  // Modal states
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState<boolean>(false);
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState<boolean>(false);

  // New Category state
  const [newCategory, setNewCategory] = useState({
    category: "",
    budget: 10000,
    actual: 0,
    notes: "",
  });

  // New Material state
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    unit: "kg",
    baseUnitPrice: 10,
    marketUnitPrice: 10,
    indexSource: "SINAPI / Mercado Local",
    category: "Estrutura",
    notes: "",
  });

  // Save sync code to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("universo_adas_firestore_sync_code", syncCode);
    } catch (e) {
      console.error(e);
    }
  }, [syncCode]);

  // Real-time Firestore subscription
  useEffect(() => {
    if (!syncCode.trim()) return;

    const cleanedCode = syncCode.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const docRef = doc(db, COLLECTION_NAME, cleanedCode);

    setIsSyncing(true);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        setIsSyncing(false);
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data) {
            if (Array.isArray(data.categories)) {
              setCategories(data.categories);
            }
            if (Array.isArray(data.materials)) {
              setMaterials(data.materials);
            }
            if (typeof data.alertThresholdPercent === "number") {
              setAlertThresholdPercent(data.alertThresholdPercent);
            }
            setLastSyncedAt(
              data.updatedAt
                ? new Date(data.updatedAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : new Date().toLocaleTimeString("pt-BR")
            );
            setSyncError(null);
          }
        } else {
          saveToFirestore(cleanedCode, DEFAULT_COST_CATEGORIES, DEFAULT_MONITORED_MATERIALS, 7);
        }
      },
      (err) => {
        setIsSyncing(false);
        setSyncError(`Erro de conexão com Firestore: ${err.message}`);
      }
    );

    return () => unsubscribe();
  }, [syncCode]);

  // Save data to Firestore
  const saveToFirestore = async (
    codeToUse: string,
    catsToSave: CostCategoryItem[],
    matsToSave: MonitoredMaterialItem[],
    thresholdToSave: number
  ) => {
    if (!codeToUse.trim()) return;
    setIsSyncing(true);
    setSyncError(null);

    try {
      const cleanedCode = codeToUse.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
      const docRef = doc(db, COLLECTION_NAME, cleanedCode);

      const totalBudget = catsToSave.reduce((acc, c) => acc + (Number(c.budget) || 0), 0);
      const totalActual = catsToSave.reduce((acc, c) => acc + (Number(c.actual) || 0), 0);

      await setDoc(
        docRef,
        {
          syncCode: cleanedCode,
          categories: catsToSave,
          materials: matsToSave,
          alertThresholdPercent: thresholdToSave,
          totalBudget,
          totalActual,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      const timeStr = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setLastSyncedAt(timeStr);
    } catch (err: any) {
      console.error("Erro ao salvar dados no Firestore:", err);
      setSyncError(err.message || "Falha ao salvar no Firestore.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Category Operations
  const handleUpdateCategoryValue = (
    id: string,
    field: "budget" | "actual" | "category" | "notes",
    val: any
  ) => {
    const updated = categories.map((cat) => {
      if (cat.id === id) {
        return {
          ...cat,
          [field]: field === "budget" || field === "actual" ? Number(val) : val,
        };
      }
      return cat;
    });
    setCategories(updated);
    saveToFirestore(syncCode, updated, materials, alertThresholdPercent);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.category.trim()) return;

    const newItem: CostCategoryItem = {
      id: `cat-${Date.now()}`,
      category: newCategory.category.trim(),
      budget: Number(newCategory.budget) || 0,
      actual: Number(newCategory.actual) || 0,
      notes: newCategory.notes || "Nova categoria de custo adicionada",
    };

    const updated = [...categories, newItem];
    setCategories(updated);
    saveToFirestore(syncCode, updated, materials, alertThresholdPercent);
    setNewCategory({ category: "", budget: 10000, actual: 0, notes: "" });
    setIsAddCategoryModalOpen(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`Remover a categoria de custo "${name}"?`)) {
      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
      saveToFirestore(syncCode, updated, materials, alertThresholdPercent);
    }
  };

  // Material Operations
  const handleUpdateMaterialValue = (
    id: string,
    field: "baseUnitPrice" | "marketUnitPrice" | "name" | "unit" | "indexSource" | "notes",
    val: any
  ) => {
    const updated = materials.map((mat) => {
      if (mat.id === id) {
        return {
          ...mat,
          [field]: field === "baseUnitPrice" || field === "marketUnitPrice" ? Number(val) : val,
          lastUpdated: `Editado ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`,
        };
      }
      return mat;
    });
    setMaterials(updated);
    saveToFirestore(syncCode, categories, updated, alertThresholdPercent);
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.name.trim()) return;

    const newItem: MonitoredMaterialItem = {
      id: `mat-${Date.now()}`,
      name: newMaterial.name.trim(),
      unit: newMaterial.unit || "unidade",
      baseUnitPrice: Number(newMaterial.baseUnitPrice) || 0,
      marketUnitPrice: Number(newMaterial.marketUnitPrice) || 0,
      indexSource: newMaterial.indexSource || "SINAPI / Mercado",
      category: newMaterial.category || "Geral",
      notes: newMaterial.notes || "Novo material em monitoramento",
      lastUpdated: `Criado ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`,
    };

    const updated = [...materials, newItem];
    setMaterials(updated);
    saveToFirestore(syncCode, categories, updated, alertThresholdPercent);
    setNewMaterial({
      name: "",
      unit: "kg",
      baseUnitPrice: 10,
      marketUnitPrice: 10,
      indexSource: "SINAPI / Mercado Local",
      category: "Estrutura",
      notes: "",
    });
    setIsAddMaterialModalOpen(false);
  };

  const handleDeleteMaterial = (id: string, name: string) => {
    if (confirm(`Remover o monitoramento de preço para "${name}"?`)) {
      const updated = materials.filter((m) => m.id !== id);
      setMaterials(updated);
      saveToFirestore(syncCode, categories, updated, alertThresholdPercent);
    }
  };

  const handleSimulateMarketUpdate = () => {
    setIsSimulatingMarket(true);
    setTimeout(() => {
      const updated = materials.map((m) => {
        // Random variation between -5% and +12%
        const deltaFactor = 1 + (Math.random() * 0.17 - 0.05);
        const newMarketPrice = Number((m.baseUnitPrice * deltaFactor).toFixed(2));
        return {
          ...m,
          marketUnitPrice: newMarketPrice,
          lastUpdated: `SINAPI Simulado (${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })})`,
        };
      });
      setMaterials(updated);
      saveToFirestore(syncCode, categories, updated, alertThresholdPercent);
      setIsSimulatingMarket(false);
    }, 600);
  };

  const handleUpdateThreshold = (newVal: number) => {
    setAlertThresholdPercent(newVal);
    saveToFirestore(syncCode, categories, materials, newVal);
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(syncCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Calculations
  const totalBudget = categories.reduce((acc, c) => acc + (Number(c.budget) || 0), 0);
  const totalActual = categories.reduce((acc, c) => acc + (Number(c.actual) || 0), 0);
  const netVariance = totalBudget - totalActual;
  const variancePercent = totalBudget > 0 ? ((netVariance / totalBudget) * 100).toFixed(1) : "0.0";
  const isOverallUnderBudget = netVariance >= 0;

  const maxChartVal = Math.max(
    ...categories.flatMap((c) => [Number(c.budget) || 0, Number(c.actual) || 0]),
    1000
  ) * 1.15;

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatBRLCompact = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Material Variations Calculation & Alerts
  const materialsWithVariation = materials.map((m) => {
    const base = Number(m.baseUnitPrice) || 0.01;
    const market = Number(m.marketUnitPrice) || 0;
    const variationPct = ((market - base) / base) * 100;
    const diffR$ = market - base;
    const isCriticalHigh = variationPct >= alertThresholdPercent;
    const isOpportunityDiscount = variationPct <= -5;
    return {
      ...m,
      variationPct,
      diffR$,
      isCriticalHigh,
      isOpportunityDiscount,
    };
  });

  const criticalHighAlerts = materialsWithVariation.filter((m) => m.isCriticalHigh);
  const opportunityAlerts = materialsWithVariation.filter((m) => m.isOpportunityDiscount);
  const avgMaterialVariation =
    materialsWithVariation.length > 0
      ? (materialsWithVariation.reduce((acc, m) => acc + m.variationPct, 0) / materialsWithVariation.length).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      {/* HEADER BAR & FIRESTORE STATUS */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 p-6 rounded-3xl border-2 border-amber-500/40 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Sincronização em Tempo Real • Firebase Firestore</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <span>📊 Dashboard de Custos & Monitoramento de Preços</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-extrabold">
                FIRESTORE CONECTADO
              </span>
            </h2>
            <p className="text-xs text-zinc-300 max-w-3xl">
              Acompanhe o <strong>Orçamento Original Previsto</strong>, os <strong>Gastos Reais Executados</strong> e o{" "}
              <strong>Monitor de Alertas Automáticos de Inflação de Materiais (SINAPI/Mercado)</strong> com persistência no Firestore.
            </p>
          </div>

          {/* Sync Code Controls */}
          <div className="bg-zinc-950/90 p-3.5 rounded-2xl border border-zinc-800 space-y-2 shrink-0">
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
              <span className="flex items-center gap-1 text-amber-400">
                <Cloud className="w-3.5 h-3.5" /> Código no Firestore
              </span>
              {lastSyncedAt && (
                <span className="text-[10px] text-emerald-400 font-mono">
                  Sincronizado {lastSyncedAt}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={syncCode}
                onChange={(e) => setSyncCode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="obra-demo"
                className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-amber-300 w-36 focus:outline-none focus:border-amber-400"
              />

              <button
                onClick={handleCopyCode}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl border border-zinc-700 transition-colors"
                title="Copiar código de sincronização"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              </button>

              <button
                onClick={() => saveToFirestore(syncCode, categories, materials, alertThresholdPercent)}
                disabled={isSyncing}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-xl flex items-center gap-1 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Salvando..." : "Salvar"}</span>
              </button>
            </div>
          </div>
        </div>

        {syncError && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{syncError}</span>
          </div>
        )}
      </div>

      {/* SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budgeted */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black uppercase text-zinc-400">
            <span>Orçamento Previsto</span>
            <Calculator className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{formatBRLCompact(totalBudget)}</div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1">
            <span>Soma das {categories.length} categorias orçadas</span>
          </div>
        </div>

        {/* Total Actual */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black uppercase text-zinc-400">
            <span>Gasto Real Executado</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{formatBRLCompact(totalActual)}</div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1">
            <span>Valores efetivamente pagos/faturados</span>
          </div>
        </div>

        {/* Variance / Balance */}
        <div
          className={`border p-5 rounded-2xl space-y-2 relative overflow-hidden ${
            isOverallUnderBudget ? "bg-emerald-950/20 border-emerald-500/40" : "bg-rose-950/20 border-rose-500/40"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-black uppercase">
            <span className={isOverallUnderBudget ? "text-emerald-400" : "text-rose-400"}>
              {isOverallUnderBudget ? "Economia Total" : "Estouro de Orçamento"}
            </span>
            {isOverallUnderBudget ? (
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingUp className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div className={`text-2xl font-black ${isOverallUnderBudget ? "text-emerald-300" : "text-rose-300"}`}>
            {formatBRLCompact(Math.abs(netVariance))}
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1 font-bold">
            {isOverallUnderBudget ? (
              <span className="text-emerald-400 flex items-center gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5" /> {variancePercent}% abaixo do teto
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> {Math.abs(Number(variancePercent))}% acima do orçado
              </span>
            )}
          </div>
        </div>

        {/* Material Alerts KPI */}
        <div className="bg-zinc-900/90 border border-amber-500/40 p-5 rounded-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black uppercase text-amber-400">
            <span>Alertas de Materiais</span>
            <Bell className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <span className={criticalHighAlerts.length > 0 ? "text-rose-400 font-extrabold" : "text-emerald-400"}>
              {criticalHighAlerts.length} Críticos
            </span>
            <span className="text-xs text-zinc-400 font-normal">
              ({opportunityAlerts.length} Oportunidades)
            </span>
          </div>
          <div className="text-[11px] text-zinc-400">
            Tolerância: <strong className="text-amber-300">+{alertThresholdPercent}%</strong> • Média:{" "}
            <strong className={Number(avgMaterialVariation) > 0 ? "text-rose-400" : "text-emerald-400"}>
              {Number(avgMaterialVariation) > 0 ? `+${avgMaterialVariation}%` : `${avgMaterialVariation}%`}
            </strong>
          </div>
        </div>
      </div>

      {/* 🚨 MATERIAL PRICE MONITORING & AUTOMATIC ALERTS SYSTEM SECTION */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border-2 border-amber-500/50 p-6 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header of Material Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>Monitor de Preços de Materiais e Alertas de Inflação</span>
              </h3>
            </div>
            <p className="text-xs text-zinc-300 max-w-2xl">
              Comparação contínua entre o <strong>Valor Unitário Base Orçado</strong> e a <strong>Cotação Atual de Mercado</strong>. O sistema dispara alertas automáticos no Firestore ao detectar variações superiores ao limite configurado.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Threshold Selector */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 px-3 py-1.5 rounded-xl text-xs">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-400 font-bold">Gatilho de Alerta:</span>
              <select
                value={alertThresholdPercent}
                onChange={(e) => handleUpdateThreshold(Number(e.target.value))}
                className="bg-zinc-950 text-amber-300 font-mono font-bold px-2 py-1 rounded-lg border border-zinc-800 focus:outline-none"
              >
                <option value={5}>+5% (Rigoroso)</option>
                <option value={7}>+7% (Recomendado)</option>
                <option value={10}>+10% (Tolerante)</option>
                <option value={15}>+15% (Largo)</option>
              </select>
            </div>

            {/* Simulate / Update button */}
            <button
              onClick={handleSimulateMarketUpdate}
              disabled={isSimulatingMarket}
              className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
              title="Simula atualização de preços de mercado baseada nos índices SINAPI / INCC"
            >
              <Zap className={`w-3.5 h-3.5 text-amber-400 ${isSimulatingMarket ? "animate-spin" : ""}`} />
              <span>{isSimulatingMarket ? "Atualizando Índices..." : "Simular Cotação SINAPI"}</span>
            </button>

            {/* Add Material Button */}
            <button
              onClick={() => setIsAddMaterialModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Monitorar Novo Material</span>
            </button>
          </div>
        </div>

        {/* AUTOMATIC ALERT BANNERS */}
        {criticalHighAlerts.length > 0 && (
          <div className="bg-rose-950/40 border-2 border-rose-500/60 p-4 rounded-2xl space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-rose-300 font-black text-xs uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse shrink-0" />
              <span>🚨 ALERTA AUTOMÁTICO DE ELEVAÇÃO DE CUSTOS (VARIAÇÃO ≥ +{alertThresholdPercent}%)</span>
            </div>
            <p className="text-xs text-rose-200">
              Foram identificados <strong>{criticalHighAlerts.length} materiais</strong> com aumento de preço de mercado significativamente acima do orçamento inicial armazenado no Firestore:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {criticalHighAlerts.map((mat) => (
                <div
                  key={mat.id}
                  className="bg-zinc-900/90 border border-rose-500/40 p-2.5 rounded-xl space-y-1 text-xs"
                >
                  <div className="font-bold text-white truncate">{mat.name}</div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">Orçado: {formatBRL(mat.baseUnitPrice)}</span>
                    <span className="text-rose-400 font-black">
                      Mercado: {formatBRL(mat.marketUnitPrice)} (+{mat.variationPct.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {opportunityAlerts.length > 0 && (
          <div className="bg-emerald-950/30 border border-emerald-500/50 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                💡 Oportunidade de Compra: <strong>{opportunityAlerts.length} materiais</strong> estão com preço de mercado abaixo do orçado original (desconto ≥ 5%).
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 shrink-0">
              Economia Potencial Detectada
            </span>
          </div>
        )}

        {/* MATERIALS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materialsWithVariation.map((mat) => {
            const isHigh = mat.isCriticalHigh;
            const isLow = mat.isOpportunityDiscount;

            return (
              <div
                key={mat.id}
                className={`bg-zinc-900/80 border p-4 rounded-2xl space-y-3 transition-all hover:border-amber-500/60 flex flex-col justify-between ${
                  isHigh
                    ? "border-rose-500/50 bg-rose-950/10"
                    : isLow
                    ? "border-emerald-500/40 bg-emerald-950/10"
                    : "border-zinc-800"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block mb-1">
                        {mat.category}
                      </span>
                      <h4 className="font-black text-white text-sm leading-tight">{mat.name}</h4>
                      <p className="text-[11px] text-zinc-400 font-mono">Unidade: {mat.unit}</p>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {isHigh ? (
                        <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-black text-[10px] flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          +{mat.variationPct.toFixed(1)}%
                        </span>
                      ) : isLow ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-black text-[10px] flex items-center gap-1">
                          <TrendingDown className="w-3 h-3 text-emerald-400" />
                          {mat.variationPct.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono font-bold text-[10px]">
                          {mat.variationPct >= 0 ? `+${mat.variationPct.toFixed(1)}%` : `${mat.variationPct.toFixed(1)}%`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price Comparison Inputs */}
                  <div className="grid grid-cols-2 gap-2 bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800/80 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 mb-0.5">Base Orçada (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={mat.baseUnitPrice}
                        onChange={(e) => handleUpdateMaterialValue(mat.id, "baseUnitPrice", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-amber-300 font-mono font-bold text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 mb-0.5">Cotação Atual (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={mat.marketUnitPrice}
                        onChange={(e) => handleUpdateMaterialValue(mat.id, "marketUnitPrice", e.target.value)}
                        className={`w-full bg-zinc-900 border rounded-lg px-2 py-1 font-mono font-bold text-xs focus:outline-none ${
                          isHigh
                            ? "border-rose-500/50 text-rose-300 focus:border-rose-400"
                            : isLow
                            ? "border-emerald-500/50 text-emerald-300 focus:border-emerald-400"
                            : "border-zinc-800 text-zinc-200 focus:border-amber-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Additional Material Metadata */}
                  <div className="text-[11px] text-zinc-400 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span>Fonte: <strong className="text-zinc-300">{mat.indexSource}</strong></span>
                      <span className="text-zinc-500 font-mono">{mat.lastUpdated}</span>
                    </div>

                    {mat.notes && (
                      <p className="text-[11px] text-zinc-400 italic bg-zinc-950/40 p-2 rounded-lg border border-zinc-800/50">
                        {mat.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 mt-3">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Diferença Unitária:{" "}
                    <strong className={mat.diffR$ > 0 ? "text-rose-400" : "text-emerald-400"}>
                      {mat.diffR$ > 0 ? `+ ${formatBRL(mat.diffR$)}` : formatBRL(mat.diffR$)}
                    </strong>
                  </span>

                  <button
                    onClick={() => handleDeleteMaterial(mat.id, mat.name)}
                    className="p-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                    title="Remover este material do monitoramento"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BAR CHART COMPARISON SECTION (High-Craft Custom SVG) */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-amber-400" />
              <span>Gráfico Comparativo: Orçamento Previsto vs. Gasto Real</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Visualização lado a lado por categoria de engenharia com dados sincronizados via Firestore.
            </p>
          </div>

          <button
            onClick={() => setIsAddCategoryModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Categoria</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-xs font-bold text-zinc-300 pt-2 border-t border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-amber-500 inline-block shadow-sm"></span>
            <span>Orçamento Previsto</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-emerald-500 inline-block shadow-sm"></span>
            <span>Gasto Real (Economia / Dentro da Meta)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-rose-500 inline-block shadow-sm"></span>
            <span>Gasto Real (Acima do Orçamento)</span>
          </div>
        </div>

        {/* Interactive Custom SVG Chart */}
        <div className="relative w-full overflow-x-auto pb-2">
          <div className="min-w-[700px] space-y-4 pt-2">
            {categories.map((cat) => {
              const budget = Number(cat.budget) || 0;
              const actual = Number(cat.actual) || 0;
              const budgetPct = Math.min((budget / maxChartVal) * 100, 100);
              const actualPct = Math.min((actual / maxChartVal) * 100, 100);
              const isOver = actual > budget;
              const diff = budget - actual;

              return (
                <div
                  key={cat.id}
                  className="group bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800/80 hover:border-amber-500/50 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white group-hover:text-amber-300 transition-colors">
                      {cat.category}
                    </span>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-amber-400">Previsto: {formatBRLCompact(budget)}</span>
                      <span className={isOver ? "text-rose-400 font-black" : "text-emerald-400 font-black"}>
                        Real: {formatBRLCompact(actual)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          isOver
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {isOver ? `+ ${formatBRLCompact(Math.abs(diff))}` : `- ${formatBRLCompact(diff)}`}
                      </span>
                    </div>
                  </div>

                  {/* Dual Progress Bars */}
                  <div className="space-y-1.5">
                    {/* Budget Bar */}
                    <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden border border-zinc-800/80">
                      <div
                        className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(budgetPct, 1)}%` }}
                      ></div>
                    </div>

                    {/* Actual Bar */}
                    <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden border border-zinc-800/80">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver
                            ? "bg-gradient-to-r from-rose-600 to-rose-400"
                            : "bg-gradient-to-r from-emerald-600 to-emerald-400"
                        }`}
                        style={{ width: `${Math.max(actualPct, 1)}%` }}
                      ></div>
                    </div>
                  </div>

                  {cat.notes && (
                    <p className="text-[11px] text-zinc-400 italic pt-0.5">
                      💡 {cat.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CATEGORY DETAILS & DIRECT FIRESTORE EDITING TABLE */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span>Detalhamento por Categoria e Edição Direta</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Altere os valores abaixo e eles serão salvos automaticamente na sua conta Firestore.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Categoria da Obra</th>
                <th className="py-3 px-3 text-right">Orçamento Previsto (R$)</th>
                <th className="py-3 px-3 text-right">Gasto Real (R$)</th>
                <th className="py-3 px-3 text-right">Diferença / Status</th>
                <th className="py-3 px-3">Observações da Engenharia</th>
                <th className="py-3 px-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {categories.map((cat) => {
                const diff = (Number(cat.budget) || 0) - (Number(cat.actual) || 0);
                const isUnder = diff >= 0;

                return (
                  <tr key={cat.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-white">
                      <input
                        type="text"
                        value={cat.category}
                        onChange={(e) => handleUpdateCategoryValue(cat.id, "category", e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-amber-400 text-white font-bold text-xs py-1 px-1 rounded focus:outline-none w-full"
                      />
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <input
                        type="number"
                        value={cat.budget}
                        onChange={(e) => handleUpdateCategoryValue(cat.id, "budget", e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-xl text-right font-mono font-bold text-amber-300 text-xs w-28 focus:outline-none focus:border-amber-400"
                      />
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <input
                        type="number"
                        value={cat.actual}
                        onChange={(e) => handleUpdateCategoryValue(cat.id, "actual", e.target.value)}
                        className={`bg-zinc-950 border px-2.5 py-1 rounded-xl text-right font-mono font-bold text-xs w-28 focus:outline-none ${
                          isUnder
                            ? "border-emerald-500/40 text-emerald-300 focus:border-emerald-400"
                            : "border-rose-500/40 text-rose-300 focus:border-rose-400"
                        }`}
                      />
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-black">
                      <div
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] ${
                          isUnder
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        <span>{isUnder ? `+ ${formatBRLCompact(diff)}` : `- ${formatBRLCompact(Math.abs(diff))}`}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <input
                        type="text"
                        value={cat.notes || ""}
                        onChange={(e) => handleUpdateCategoryValue(cat.id, "notes", e.target.value)}
                        placeholder="Adicionar nota..."
                        className="bg-transparent border-b border-zinc-800 hover:border-zinc-700 focus:border-amber-400 text-zinc-300 text-xs py-1 px-1 w-full focus:outline-none"
                      />
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.category)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Remover categoria"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD CATEGORY */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-amber-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Nova Categoria de Custo</span>
              </h3>
              <button
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">Nome da Categoria</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pintura, Esquadrias de Alumínio"
                  value={newCategory.category}
                  onChange={(e) => setNewCategory({ ...newCategory, category: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Orçamento Previsto (R$)</label>
                  <input
                    type="number"
                    required
                    value={newCategory.budget}
                    onChange={(e) => setNewCategory({ ...newCategory, budget: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Gasto Real Atual (R$)</label>
                  <input
                    type="number"
                    required
                    value={newCategory.actual}
                    onChange={(e) => setNewCategory({ ...newCategory, actual: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-emerald-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Observações da Engenharia</label>
                <input
                  type="text"
                  placeholder="Ex: Fornecedor local com entrega em 15 dias"
                  value={newCategory.notes}
                  onChange={(e) => setNewCategory({ ...newCategory, notes: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="flex-1 py-2.5 bg-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 text-zinc-950 font-black rounded-xl hover:bg-amber-400"
                >
                  Salvar no Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MATERIAL TO MONITOR */}
      {isAddMaterialModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-amber-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <span>Monitorar Novo Material</span>
              </h3>
              <button
                onClick={() => setIsAddMaterialModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMaterial} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">Descrição do Material</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Telha Termoacústica Sanduíche 30mm"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Unidade de Medida</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: m², kg, saco, barra 6m"
                    value={newMaterial.unit}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Categoria da Obra</label>
                  <select
                    value={newMaterial.category}
                    onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="Estrutura">Estrutura</option>
                    <option value="Alvenaria">Alvenaria</option>
                    <option value="Elétrica">Elétrica</option>
                    <option value="Hidráulica">Hidráulica</option>
                    <option value="Acabamentos">Acabamentos</option>
                    <option value="Cobertura">Cobertura</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Preço Base Orçado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newMaterial.baseUnitPrice}
                    onChange={(e) => setNewMaterial({ ...newMaterial, baseUnitPrice: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Cotação Atual Mercado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newMaterial.marketUnitPrice}
                    onChange={(e) => setNewMaterial({ ...newMaterial, marketUnitPrice: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-emerald-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Fonte da Cotação / Índice</label>
                <input
                  type="text"
                  placeholder="Ex: SINAPI, INCC-M, Fornecedor Gerdau"
                  value={newMaterial.indexSource}
                  onChange={(e) => setNewMaterial({ ...newMaterial, indexSource: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Observações da Engenharia</label>
                <input
                  type="text"
                  placeholder="Ex: Material crítico para próxima etapa de montagem"
                  value={newMaterial.notes}
                  onChange={(e) => setNewMaterial({ ...newMaterial, notes: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddMaterialModalOpen(false)}
                  className="flex-1 py-2.5 bg-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 text-zinc-950 font-black rounded-xl hover:bg-amber-400"
                >
                  Adicionar ao Monitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

