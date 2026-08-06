import React from "react";
import {
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  PieChart,
  ShieldAlert,
  ArrowDownRight,
  Zap,
  RotateCcw,
  Sliders,
  PlusCircle,
  HelpCircle
} from "lucide-react";
import { Project3DState } from "../../types";

interface BudgetControlPanelProps {
  projectState: Project3DState;
  onUpdateState: React.Dispatch<React.SetStateAction<Project3DState>>;
}

export const calculateEstimatedProjectCost = (projectState: Project3DState) => {
  const terrainArea = (projectState.terrain.width || 10) * (projectState.terrain.length || 20);
  let total = 0;

  const items: { label: string; category: string; cost: number; isOptional?: boolean; keyName?: string }[] = [];

  // 1. Fundação
  if (projectState.hasFoundation) {
    const cost = terrainArea * 320;
    total += cost;
    items.push({ label: `Fundação & Baldrame (${terrainArea}m²)`, category: "Estrutura", cost });
  }

  // 2. Paredes e Alvenaria
  const wallArea = Math.round(terrainArea * 0.7 * (projectState.wallHeight / 2.8));
  const wallCost = wallArea * 480;
  total += wallCost;
  items.push({ label: `Alvenaria & Reboco (h=${projectState.wallHeight}m)`, category: "Estrutura", cost: wallCost });

  // 3. Telhado
  if (projectState.roofType !== "sem") {
    const cost = Math.round(terrainArea * 0.6) * 280;
    total += cost;
    items.push({ label: `Telhado Modelo ${projectState.roofType.toUpperCase()}`, category: "Cobertura", cost });
  }

  // 4. Esquadrias (Portas e Janelas)
  const doorsCost = (projectState.doorsCount || 2) * 1200;
  const windowsCost = (projectState.windowsCount || 4) * 850;
  total += doorsCost + windowsCost;
  items.push({ label: `Esquadrias (${projectState.doorsCount} portas, ${projectState.windowsCount} janelas)`, category: "Acabamentos", cost: doorsCost + windowsCost });

  // 5. Piscina
  if (projectState.pool?.hasPool) {
    const cost = projectState.pool.type === "borda_infinita" ? 42000 : 32000;
    total += cost;
    items.push({ label: `Piscina (${projectState.pool.type === "borda_infinita" ? "Borda Infinita" : "Tradicional"})`, category: "Lazer & Paisagismo", cost, isOptional: true, keyName: "pool" });
  }

  // 6. Área Gourmet
  if (projectState.gourmet?.hasGourmet) {
    let cost = 18000;
    if (projectState.gourmet.churrasqueira) cost += 4500;
    if (projectState.gourmet.mesaSinuca) cost += 5500;
    if (projectState.gourmet.pergolado) cost += 7000;
    total += cost;
    items.push({ label: "Área Gourmet Completa & Equipamentos", category: "Lazer & Paisagismo", cost, isOptional: true, keyName: "gourmet" });
  }

  // 7. Móveis Planejados GDM
  let furnitureCost = 0;
  if (projectState.furniture?.cozinha) furnitureCost += 16500;
  if (projectState.furniture?.quartoCasal) furnitureCost += 14000;
  if (projectState.furniture?.quartoSolteiro) furnitureCost += 9500;
  if (projectState.furniture?.banheiro) furnitureCost += 4800;
  if (projectState.furniture?.salaTV) furnitureCost += 8200;

  if (furnitureCost > 0) {
    total += furnitureCost;
    items.push({ label: "Móveis Planejados GDM (100% MDF)", category: "Interiores", cost: furnitureCost, isOptional: true, keyName: "furniture" });
  }

  // 8. Iluminação
  if (projectState.lighting?.preset) {
    let lightCost = 3500;
    if (projectState.lighting.preset === "noite_spots") lightCost = 6800;
    if (projectState.lighting.preset === "festa_gourmet") lightCost = 8500;
    total += lightCost;
    items.push({ label: `Projeto Luminotécnico (${projectState.lighting.preset})`, category: "Instalações", cost: lightCost });
  }

  // 9. Segurança & Automatização
  let secCost = 0;
  if (projectState.security?.camsHD) secCost += projectState.security.camsHD * 450;
  if (projectState.security?.electricFenceMeters) secCost += projectState.security.electricFenceMeters * 60;
  if (secCost > 0) {
    total += secCost;
    items.push({ label: "Segurança Eletrônica & Câmeras HD", category: "Segurança", cost: secCost, isOptional: true });
  }

  return { total, items };
};

export const BudgetControlPanel: React.FC<BudgetControlPanelProps> = ({
  projectState,
  onUpdateState,
}) => {
  const maxBudget = projectState.maxBudget || 200000;
  const { total: estimatedCost, items } = calculateEstimatedProjectCost(projectState);

  const diff = estimatedCost - maxBudget;
  const isOverBudget = diff > 0;
  const percentageUsed = Math.min(Math.round((estimatedCost / maxBudget) * 100), 200);

  const PRESET_BUDGETS = [100000, 150000, 200000, 300000, 500000, 800000];

  const handleSetMaxBudget = (val: number) => {
    onUpdateState((prev) => ({
      ...prev,
      maxBudget: val,
    }));
  };

  const handleOptimizeToBudget = () => {
    if (!isOverBudget) return;
    onUpdateState((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as Project3DState;
      // Step by step disable high cost optional items until fit
      if (next.pool?.hasPool) {
        next.pool.hasPool = false;
      } else if (next.gourmet?.mesaSinuca) {
        next.gourmet.mesaSinuca = false;
      } else if (next.gourmet?.pergolado) {
        next.gourmet.pergolado = false;
      } else if (next.gourmet?.hasGourmet) {
        next.gourmet.hasGourmet = false;
      } else if (next.furniture?.quartoSolteiro) {
        next.furniture.quartoSolteiro = false;
      } else if (next.wallHeight > 2.8) {
        next.wallHeight = 2.8;
      }
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Badge */}
      <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
              Controle Financeiro 3D
            </span>
            <h4 className="text-base font-black text-white">
              Teto de Orçamento do Projeto
            </h4>
          </div>
        </div>
      </div>

      {/* ALERT BANNER IF OVER BUDGET */}
      {isOverBudget ? (
        <div className="bg-red-950/80 border-2 border-red-500 text-red-200 p-4 rounded-2xl shadow-xl flex items-start gap-3 animate-pulse">
          <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>Atenção: Orçamento Excedido!</span>
            </h5>
            <p className="text-xs text-red-200 font-semibold leading-relaxed">
              Os custos estimados do seu projeto (<strong>R$ {estimatedCost.toLocaleString("pt-BR")}</strong>) ultrapassaram o teto máximo definido em{" "}
              <strong className="text-red-300">R$ {diff.toLocaleString("pt-BR")}</strong> ({percentageUsed}% do orçamento).
            </p>
            <button
              onClick={handleOptimizeToBudget}
              className="mt-2 px-3 py-1.5 bg-red-500 hover:bg-red-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Ajustar Projeto Automaticamente</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 p-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h5 className="text-xs font-black uppercase text-emerald-400 tracking-wider">
              Dentro do Orçamento Planejado!
            </h5>
            <p className="text-xs text-emerald-200/90 font-medium">
              Sua margem disponível é de <strong>R$ {Math.abs(diff).toLocaleString("pt-BR")}</strong> ({100 - percentageUsed}% livre).
            </p>
          </div>
        </div>
      )}

      {/* INPUT MAX BUDGET & PRESETS */}
      <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 space-y-4">
        <label className="text-xs font-black uppercase tracking-wider text-amber-400 block">
          Definir Teto Máximo (R$):
        </label>
        
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-black text-sm">R$</span>
          <input
            type="number"
            step="5000"
            min="10000"
            value={maxBudget}
            onChange={(e) => handleSetMaxBudget(Number(e.target.value) || 100000)}
            className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-amber-400 text-white font-black text-lg rounded-xl pl-10 pr-4 py-2.5 outline-none transition-colors"
          />
        </div>

        {/* Presets */}
        <div>
          <span className="text-[10px] text-zinc-400 font-bold uppercase block mb-2">Atalhos de Valores:</span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_BUDGETS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => handleSetMaxBudget(b)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all border ${
                  maxBudget === b
                    ? "bg-amber-400 text-zinc-950 border-amber-300 shadow"
                    : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600"
                }`}
              >
                R$ {(b / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VISUAL PROGRESS METER */}
      <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-zinc-400">Progresso do Orçamento:</span>
          <span className={`font-mono font-black ${isOverBudget ? "text-red-400" : "text-emerald-400"}`}>
            {percentageUsed}% ({isOverBudget ? "ESTOURADO" : "OK"})
          </span>
        </div>

        {/* Bar */}
        <div className="h-4 bg-zinc-950 rounded-full border border-zinc-800 overflow-hidden p-0.5 relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentageUsed > 100
                ? "bg-gradient-to-r from-amber-500 via-red-500 to-red-600 animate-pulse"
                : percentageUsed > 80
                ? "bg-gradient-to-r from-amber-500 to-amber-400"
                : "bg-gradient-to-r from-emerald-500 to-emerald-400"
            }`}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] font-mono font-bold text-zinc-400 pt-1">
          <span>Atual: R$ {estimatedCost.toLocaleString("pt-BR")}</span>
          <span>Teto: R$ {maxBudget.toLocaleString("pt-BR")}</span>
        </div>
      </div>

      {/* ITEM COST BREAKDOWN */}
      <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 space-y-3">
        <h5 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center justify-between">
          <span>Detalhamento dos Custos Estimados</span>
          <span className="text-white font-mono text-sm">R$ {estimatedCost.toLocaleString("pt-BR")}</span>
        </h5>

        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 text-xs">
              <div className="flex flex-col">
                <span className="font-bold text-white">{it.label}</span>
                <span className="text-[10px] text-amber-500/80 uppercase font-bold">{it.category}</span>
              </div>
              <span className="font-mono font-black text-amber-300 shrink-0">
                R$ {it.cost.toLocaleString("pt-BR")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
