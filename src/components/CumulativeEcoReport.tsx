import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";
import {
  Leaf,
  Target,
  BarChart3,
  TrendingDown,
  Building2,
  Award,
  Trees,
  Trash2,
  CheckCircle2,
  Filter,
  Download,
  Info,
  Sparkles,
} from "lucide-react";

export interface ProjectEcoData {
  id: string;
  name: string;
  location: string;
  areaM2: number;
  completionYear: string;
  co2Tons: number;
  co2SavedTons: number;
  wasteM3: number;
  wasteDivertedPct: number;
  treesPlanted: number;
  ecoScore: number;
  badge: string;
  materials: {
    material: string;
    consumedQty: number; // e.g. tons or m³
    goalMaxQty: number; // Max allowed target for sustainability
    unit: string;
  }[];
}

const PORTFOLIO_PROJECTS: ProjectEcoData[] = [
  {
    id: "proj-1",
    name: "Residencial Alphaville 01",
    location: "Barra Mansa, RJ",
    areaM2: 220,
    completionYear: "2026 (Em Andamento)",
    co2Tons: 8.45,
    co2SavedTons: 3.2,
    wasteM3: 5.28,
    wasteDivertedPct: 97,
    treesPlanted: 57,
    ecoScore: 92,
    badge: "Selo Ouro",
    materials: [
      { material: "Cimento (Sacos)", consumedQty: 280, goalMaxQty: 350, unit: "sacos" },
      { material: "Aço Reciclado (t)", consumedQty: 4.8, goalMaxQty: 6.0, unit: "t" },
      { material: "Bloco Cerâmico (mil)", consumedQty: 12.5, goalMaxQty: 15.0, unit: "mil" },
      { material: "Porcelanato (m²)", consumedQty: 220, goalMaxQty: 250, unit: "m²" },
      { material: "MDF FSC (chapas)", consumedQty: 38, goalMaxQty: 45, unit: "chapas" },
    ],
  },
  {
    id: "proj-2",
    name: "Comercial Centro WVR",
    location: "Volta Redonda, RJ",
    areaM2: 450,
    completionYear: "2025",
    co2Tons: 16.8,
    co2SavedTons: 5.9,
    wasteM3: 10.4,
    wasteDivertedPct: 94,
    treesPlanted: 112,
    ecoScore: 88,
    badge: "Selo Prata",
    materials: [
      { material: "Cimento (Sacos)", consumedQty: 540, goalMaxQty: 650, unit: "sacos" },
      { material: "Aço Reciclado (t)", consumedQty: 9.5, goalMaxQty: 12.0, unit: "t" },
      { material: "Bloco Cerâmico (mil)", consumedQty: 24.0, goalMaxQty: 30.0, unit: "mil" },
      { material: "Porcelanato (m²)", consumedQty: 450, goalMaxQty: 500, unit: "m²" },
      { material: "MDF FSC (chapas)", consumedQty: 85, goalMaxQty: 90, unit: "chapas" },
    ],
  },
  {
    id: "proj-3",
    name: "Residencial Loteamento Sul",
    location: "Resende, RJ",
    areaM2: 180,
    completionYear: "2025",
    co2Tons: 6.9,
    co2SavedTons: 2.1,
    wasteM3: 4.5,
    wasteDivertedPct: 91,
    treesPlanted: 46,
    ecoScore: 84,
    badge: "Selo Prata",
    materials: [
      { material: "Cimento (Sacos)", consumedQty: 210, goalMaxQty: 260, unit: "sacos" },
      { material: "Aço Reciclado (t)", consumedQty: 3.9, goalMaxQty: 4.8, unit: "t" },
      { material: "Bloco Cerâmico (mil)", consumedQty: 9.8, goalMaxQty: 12.0, unit: "mil" },
      { material: "Porcelanato (m²)", consumedQty: 180, goalMaxQty: 200, unit: "m²" },
      { material: "MDF FSC (chapas)", consumedQty: 28, goalMaxQty: 35, unit: "chapas" },
    ],
  },
  {
    id: "proj-4",
    name: "Reforma Vale do Paraíba",
    location: "Porto Real, RJ",
    areaM2: 120,
    completionYear: "2024",
    co2Tons: 4.2,
    co2SavedTons: 1.8,
    wasteM3: 2.8,
    wasteDivertedPct: 98,
    treesPlanted: 28,
    ecoScore: 95,
    badge: "Selo Ouro",
    materials: [
      { material: "Cimento (Sacos)", consumedQty: 130, goalMaxQty: 180, unit: "sacos" },
      { material: "Aço Reciclado (t)", consumedQty: 2.2, goalMaxQty: 3.0, unit: "t" },
      { material: "Bloco Cerâmico (mil)", consumedQty: 5.5, goalMaxQty: 8.0, unit: "mil" },
      { material: "Porcelanato (m²)", consumedQty: 120, goalMaxQty: 140, unit: "m²" },
      { material: "MDF FSC (chapas)", consumedQty: 22, goalMaxQty: 25, unit: "chapas" },
    ],
  },
];

// Recharts colors
const COLOR_REAL = "#10b981"; // emerald-500
const COLOR_GOAL = "#0284c7"; // sky-600
const COLOR_SAVED = "#34d399"; // emerald-400
const COLOR_WASTE = "#f59e0b"; // amber-500

const PIE_COLORS = ["#10b981", "#38bdf8", "#fbbf24", "#71717a"];

export const CumulativeEcoReport: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("ALL");

  // Filtered projects list
  const activeProjects =
    selectedProjectId === "ALL"
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((p) => p.id === selectedProjectId);

  // Cumulative computations
  const totalArea = activeProjects.reduce((sum, p) => sum + p.areaM2, 0);
  const totalCO2Tons = activeProjects.reduce((sum, p) => sum + p.co2Tons, 0);
  const totalCO2SavedTons = activeProjects.reduce((sum, p) => sum + p.co2SavedTons, 0);
  const totalWasteM3 = activeProjects.reduce((sum, p) => sum + p.wasteM3, 0);
  const totalTrees = activeProjects.reduce((sum, p) => sum + p.treesPlanted, 0);

  const avgEcoScore = Math.round(
    activeProjects.reduce((sum, p) => sum + p.ecoScore, 0) / activeProjects.length
  );

  // Chart Data 1: Material Consumption vs Goal
  const aggregatedMaterialsMap: Record<string, { material: string; ConsumoReal: number; MetaMaxSustentavel: number; unit: string }> = {};

  PORTFOLIO_PROJECTS.forEach((p) => {
    if (selectedProjectId === "ALL" || p.id === selectedProjectId) {
      p.materials.forEach((m) => {
        if (!aggregatedMaterialsMap[m.material]) {
          aggregatedMaterialsMap[m.material] = {
            material: m.material,
            ConsumoReal: 0,
            MetaMaxSustentavel: 0,
            unit: m.unit,
          };
        }
        aggregatedMaterialsMap[m.material].ConsumoReal += m.consumedQty;
        aggregatedMaterialsMap[m.material].MetaMaxSustentavel += m.goalMaxQty;
      });
    }
  });

  const materialComparisonData = Object.values(aggregatedMaterialsMap);

  // Chart Data 2: Historical CO2 intensity trend (kg CO2 / m²)
  const historicalTrendData = [
    { projeto: "Reforma Vale (2024)", co2PorM2: 35.0, metaESGLimit: 45.0, CO2Economizado: 15.0 },
    { projeto: "Loteamento Sul (2025)", co2PorM2: 38.3, metaESGLimit: 45.0, CO2Economizado: 11.6 },
    { projeto: "Comercial Centro (2025)", co2PorM2: 37.3, metaESGLimit: 45.0, CO2Economizado: 13.1 },
    { projeto: "Alphaville 01 (2026)", co2PorM2: 38.4, metaESGLimit: 45.0, CO2Economizado: 14.5 },
  ];

  // Chart Data 3: Waste Management Breakdown
  const wasteBreakdownData = [
    { name: "Classe A - Agregados (Tijolo/Concreto)", value: Math.round(totalWasteM3 * 0.68 * 10) / 10 },
    { name: "Classe B - Reciclados (Aço/PVC)", value: Math.round(totalWasteM3 * 0.22 * 10) / 10 },
    { name: "Sobra Madeira FSC / MDF", value: Math.round(totalWasteM3 * 0.07 * 10) / 10 },
    { name: "Aterro Mínimo Auditado (Classe C/D)", value: Math.round(totalWasteM3 * 0.03 * 10) / 10 },
  ];

  // Chart Data 4: ESG Goals Compliance (% vs Target)
  const esgGoalsComplianceData = [
    { meta: "Uso de Aço Reciclado", Realizado: 94, MetaESG: 80 },
    { meta: "Desvio de Aterros (CONAMA)", Realizado: 96, MetaESG: 85 },
    { meta: "Madeira/MDF 100% FSC", Realizado: 100, MetaESG: 100 },
    { meta: "Redução de Emissão CO₂", Realizado: 32, MetaESG: 25 },
    { meta: "Coleta Seletiva em Canteiro", Realizado: 98, MetaESG: 90 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER WITH PORTFOLIO SELECTOR */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/40 p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/40 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Relatório Acumulado de Sustentabilidade WVR</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <span>Impacto Ambiental Acumulado dos Projetos</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Consolidação do consumo de materiais, economias de carbono e metas ESG para todo o portfólio de construções e reformas do cliente.
          </p>
        </div>

        {/* SELECTOR & EXPORT BUTTON */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5">
            <Filter className="w-4 h-4 text-emerald-400 ml-2" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-white font-bold text-xs pr-4 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-zinc-900 text-white">
                🌐 Todos os Projetos ({PORTFOLIO_PROJECTS.length} Obras)
              </option>
              {PORTFOLIO_PROJECTS.map((p) => (
                <option key={p.id} value={p.id} className="bg-zinc-900 text-white">
                  📍 {p.name} ({p.areaM2} m²)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-300 font-extrabold text-xs rounded-2xl border border-emerald-500/30 flex items-center gap-2 transition-all shadow"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      {/* 4 SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Area */}
        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Área Construída</span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalArea} <span className="text-xs font-bold text-sky-400">m²</span>
          </div>
          <p className="text-[10px] text-zinc-400 font-medium">Em {activeProjects.length} empreendimento(s)</p>
        </div>

        {/* Card 2: CO2 Saved */}
        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">CO₂ Reduzido vs Meta</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalCO2SavedTons.toFixed(1)} <span className="text-xs font-bold text-emerald-400">t CO₂e</span>
          </div>
          <p className="text-[10px] text-emerald-300 font-medium flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-emerald-400" />
            <span>Emissões evitadas no portfólio</span>
          </p>
        </div>

        {/* Card 3: Waste Diverted */}
        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Entulho Auditado</span>
            <Trash2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalWasteM3.toFixed(1)} <span className="text-xs font-bold text-amber-400">m³</span>
          </div>
          <p className="text-[10px] text-amber-300 font-medium">
            96% desviados de aterro sanitário
          </p>
        </div>

        {/* Card 4: Trees Equivalent */}
        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-teal-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Compensação Verde</span>
            <Trees className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalTrees} <span className="text-xs font-bold text-teal-400">Árvores</span>
          </div>
          <p className="text-[10px] text-teal-300 font-medium">Equivalente de sequestro em 20 anos</p>
        </div>

        {/* Card 5: Avg Eco Score */}
        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-sky-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Score Médio EcoBuild</span>
            <Award className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {avgEcoScore} <span className="text-xs font-bold text-sky-400">/ 100</span>
          </div>
          <p className="text-[10px] text-emerald-400 font-black uppercase">
            Certificação Ouro Ativa
          </p>
        </div>
      </div>

      {/* GRAPH SECTION 1: CONSUMO REAL VS METAS DE SUSTENTABILIDADE (RECHARTS BARCHART) */}
      <div className="bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-lg font-black text-white">
                Consumo de Materiais vs. Teto Misto de Sustentabilidade (Meta ESG)
              </h4>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Comparação direta entre o consumo real medido nas obras e o teto máximo sustentável recomendado.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-emerald-500 rounded-sm"></div>
              <span className="text-zinc-300">Consumo Real Medido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-sky-500 rounded-sm"></div>
              <span className="text-zinc-300">Teto Máximo Meta ESG</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={materialComparisonData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="material" stroke="#a1a1aa" tick={{ fontSize: 11, fontWeight: 700 }} />
              <YAxis stroke="#a1a1aa" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#09090b",
                  borderColor: "#10b981",
                  borderRadius: "1rem",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
              <Bar dataKey="ConsumoReal" name="Consumo Real Medido" fill={COLOR_REAL} radius={[8, 8, 0, 0]} />
              <Bar dataKey="MetaMaxSustentavel" name="Teto Meta Sustentável" fill={COLOR_GOAL} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Excelente Eficiência:</strong> Todos os materiais do portfólio permanecem em média <strong>16.8% abaixo do teto limite</strong> de desperdício da engenharia verde.
            </span>
          </div>
        </div>
      </div>

      {/* GRAPH SECTION 2 & 3: TWO COLUMN LAYOUT FOR CO2 TREND & WASTE PIE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRAPH 2: HISTORICAL CO2 EMISSION TREND */}
        <div className="bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-emerald-400" />
                <span>Evolução do CO₂e / m² por Projeto</span>
              </h4>
              <p className="text-xs text-zinc-400">Intensidade de carbono ao longo dos anos</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="projeto" stroke="#a1a1aa" tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis stroke="#a1a1aa" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    borderColor: "#10b981",
                    borderRadius: "0.75rem",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <ReferenceLine y={45.0} label={{ value: "Limite Meta ESG (45 kg/m²)", fill: "#ef4444", fontSize: 10, fontWeight: "bold" }} stroke="#ef4444" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="co2PorM2" name="kg CO₂e / m²" stroke="#10b981" fillOpacity={1} fill="url(#colorCo2)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 3: WASTE DESTINATION BREAKDOWN (PIE CHART) */}
        <div className="bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-amber-400" />
                <span>Destinação dos Resíduos (CONAMA 307)</span>
              </h4>
              <p className="text-xs text-zinc-400">Total acumulado: {totalWasteM3.toFixed(1)} m³</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wasteBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {wasteBreakdownData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    borderColor: "#f59e0b",
                    borderRadius: "0.75rem",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {wasteBreakdownData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5 text-zinc-300">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></div>
                <span className="truncate">{item.name}: <strong>{item.value} m³</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GRAPH 4: ESG GOALS COMPLIANCE PERCENTAGES */}
      <div className="bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
          <div>
            <h4 className="text-lg font-black text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-sky-400" />
              <span>Grau de Cumprimento das Metas ESG WVR Engenharia</span>
            </h4>
            <p className="text-xs text-zinc-400">
              Desempenho acumulado real vs metas operacionais sustentáveis.
            </p>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={esgGoalsComplianceData} margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis type="number" stroke="#a1a1aa" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
              <YAxis dataKey="meta" type="category" stroke="#a1a1aa" tick={{ fontSize: 11, fontWeight: 700 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#09090b",
                  borderColor: "#38bdf8",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Bar dataKey="Realizado" name="Alcançado (%)" fill="#10b981" radius={[0, 8, 8, 0]} />
              <Bar dataKey="MetaESG" name="Meta Mínima ESG (%)" fill="#38bdf8" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DETAILED PROJECT BREAKDOWN CARDS */}
      <div className="bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h4 className="text-lg font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>Resumo do Impacto Ambiental por Projeto</span>
            </h4>
            <p className="text-xs text-zinc-400">
              Acompanhamento individual de sustentabilidade de cada imóvel
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PORTFOLIO_PROJECTS.map((proj) => (
            <div
              key={proj.id}
              className="p-5 bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl space-y-4 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-extrabold text-white text-base">{proj.name}</h5>
                  <p className="text-xs text-zinc-400">{proj.location} • {proj.completionYear}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs rounded-full">
                  {proj.badge} ({proj.ecoScore}/100)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 bg-zinc-900 rounded-xl border border-zinc-800/80">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Área</span>
                  <div className="font-black text-white">{proj.areaM2} m²</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Pegada CO₂e</span>
                  <div className="font-black text-emerald-400">{proj.co2Tons} t</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Entulho Div.</span>
                  <div className="font-black text-amber-400">{proj.wasteDivertedPct}%</div>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                <span>🌱 {proj.treesPlanted} árvores de compensação</span>
                <span className="text-emerald-400 font-extrabold">-{proj.co2SavedTons}t CO₂e Economizados</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
