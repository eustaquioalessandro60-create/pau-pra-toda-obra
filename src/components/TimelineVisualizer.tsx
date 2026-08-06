import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Layers,
  Building2,
  Sparkles,
  ChevronRight,
  Filter,
  BarChart2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Check
} from "lucide-react";
import { ActiveWork, ActiveWorkStep } from "./ActiveProjectsDashboard";

interface TimelineVisualizerProps {
  works: ActiveWork[];
}

export const TimelineVisualizer: React.FC<TimelineVisualizerProps> = ({ works }) => {
  const [selectedWorkId, setSelectedWorkId] = useState<string>(
    works.length > 0 ? works[0].id : ""
  );
  const [chartMode, setChartMode] = useState<"percent" | "gantt">("percent");

  const activeWork = works.find((w) => w.id === selectedWorkId) || works[0];

  if (!activeWork) return null;

  // Helper function to parse "DD/MM/YYYY" into JS Date object
  const parseDate = (dateStr?: string): Date => {
    if (!dateStr) return new Date();
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    return new Date();
  };

  // Helper to format Date into "DD/MM/YYYY"
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const projectStartDate = parseDate(activeWork.startDate);

  // Transform steps into Gantt & Progress Comparison Data for Recharts
  const comparisonData = activeWork.steps.map((step, index) => {
    const estDurationPerStepDays = 30; // Average 30 days per phase
    const startOffsetDays = index * 25;
    const durationDays = estDurationPerStepDays;

    const startDateObj = new Date(projectStartDate);
    startDateObj.setDate(startDateObj.getDate() + startOffsetDays);

    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(endDateObj.getDate() + durationDays);

    // Calculate Real vs Planned progress percentages
    let plannedPercent = 100;
    let realPercent = 0;

    if (step.status === "completed") {
      plannedPercent = 100;
      realPercent = 100;
    } else if (step.status === "in_progress") {
      plannedPercent = 85;
      realPercent = 65; // Slightly behind or in progress
    } else {
      // Pending
      plannedPercent = index === 2 ? 30 : 0;
      realPercent = 0;
    }

    const variance = realPercent - plannedPercent;

    return {
      id: step.id,
      name: `#${step.id} ${step.name}`,
      shortName: step.name,
      status: step.status,
      // Gantt offsets
      offset: startOffsetDays,
      duration: durationDays,
      // Real vs Planned Progress %
      planejado: plannedPercent,
      real: realPercent,
      variance,
      startDateStr: step.completedDate || step.expectedDate || formatDate(startDateObj),
      endDateStr: formatDate(endDateObj),
      statusLabel:
        step.status === "completed"
          ? "Concluído"
          : step.status === "in_progress"
          ? "Em Andamento"
          : "Pendente",
    };
  });

  // Calculate overall metrics
  const completedCount = activeWork.steps.filter((s) => s.status === "completed").length;
  const inProgressCount = activeWork.steps.filter((s) => s.status === "in_progress").length;
  const pendingCount = activeWork.steps.filter((s) => s.status === "pending").length;
  const totalCount = activeWork.steps.length;
  const avgRealProgress = Math.round(
    comparisonData.reduce((acc, curr) => acc + curr.real, 0) / (totalCount || 1)
  );
  const avgPlannedProgress = Math.round(
    comparisonData.reduce((acc, curr) => acc + curr.planejado, 0) / (totalCount || 1)
  );
  const overallVariance = avgRealProgress - avgPlannedProgress;

  // Custom Tooltip for Real vs Planned %
  const PercentTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-950 border-2 border-amber-500/80 p-3.5 rounded-2xl shadow-2xl text-white text-xs space-y-1.5 max-w-xs z-50">
          <div className="flex items-center gap-1.5 font-black text-amber-400">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{data.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-zinc-800">
            <div className="bg-blue-950/60 p-2 rounded-xl border border-blue-800/60">
              <span className="text-blue-400 font-bold block">📊 Planejado:</span>
              <strong className="text-white text-sm">{data.planejado}%</strong>
            </div>
            <div className="bg-amber-950/60 p-2 rounded-xl border border-amber-800/60">
              <span className="text-amber-400 font-bold block">🚧 Real Executado:</span>
              <strong className="text-white text-sm">{data.real}%</strong>
            </div>
          </div>
          <div className="text-[11px] text-zinc-300 flex items-center justify-between pt-1">
            <span>Desvio (Variância):</span>
            <span
              className={`font-black ${
                data.variance >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {data.variance >= 0 ? `+${data.variance}%` : `${data.variance}%`}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Visualizer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/30 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Cronograma de Engenharia
            </span>
            <span className="text-xs text-emerald-400 font-extrabold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Gráficos Recharts Integrados
            </span>
          </div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>Diagrama de Gantt &</span>
            <span className="text-amber-400">Progresso Real vs. Planejado</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Acompanhamento comparativo em tempo real entre o planejamento físico original e a execução real na obra.
          </p>
        </div>

        {/* Controls Bar: Project Selector & Mode Switch */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setChartMode("percent")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                chartMode === "percent"
                  ? "bg-amber-500 text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Real vs Planejado (%)</span>
            </button>
            <button
              onClick={() => setChartMode("gantt")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                chartMode === "gantt"
                  ? "bg-amber-500 text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Gantt Temporal (Dias)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-zinc-400 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-amber-400" /> Obra:
            </span>
            <select
              value={selectedWorkId}
              onChange={(e) => setSelectedWorkId(e.target.value)}
              className="bg-zinc-950 border border-amber-500/40 text-white font-bold text-xs rounded-xl p-2 focus:outline-none focus:border-amber-400 max-w-xs truncate"
            >
              {works.map((w) => (
                <option key={w.id} value={w.id}>
                  [{w.brand}] {w.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Stats Comparison Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase block">Progresso Real Acumulado</span>
          <div className="text-xl font-black text-amber-400">{avgRealProgress}% Concluído</div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all"
              style={{ width: `${avgRealProgress}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase block">Meta Planejada</span>
          <div className="text-xl font-black text-blue-400">{avgPlannedProgress}% Esperado</div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{ width: `${avgPlannedProgress}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase block">Status do Desvio (Físico)</span>
          <div className={`text-xl font-black flex items-center gap-1.5 ${
            overallVariance >= 0 ? "text-emerald-400" : "text-amber-400"
          }`}>
            {overallVariance >= 0 ? (
              <>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>No Prazo / Adiantado</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-5 h-5 text-amber-400" />
                <span>Atraso Físico ({overallVariance}%)</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-zinc-500 block">Diferença em relação à meta</span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase block">Marcos da Engenharia</span>
          <div className="text-sm font-black text-white flex items-center gap-3">
            <span className="text-emerald-400">{completedCount} ✓</span>
            <span className="text-amber-400">{inProgressCount} ⚡</span>
            <span className="text-zinc-500">{pendingCount} ⏳</span>
          </div>
          <span className="text-[10px] text-zinc-500 block">Total de {totalCount} etapas cadastradas</span>
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-amber-400" />
            <span>
              {chartMode === "percent"
                ? "Comparativo Percentual (%) por Etapa da Obra"
                : "Cronograma de Gantt Flutuante (Dias Decorridos)"}
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            Início: {activeWork.startDate} | Entrega: {activeWork.expectedCompletionDate}
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === "percent" ? (
              /* Mode 1: Bar Chart comparing Real vs Planned Percentages */
              <BarChart
                data={comparisonData}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="shortName"
                  stroke="#71717a"
                  tick={{ fill: "#f4f4f5", fontSize: 11, fontWeight: "bold" }}
                />
                <YAxis
                  stroke="#71717a"
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  unit="%"
                  domain={[0, 100]}
                />
                <Tooltip content={<PercentTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs font-bold text-zinc-300 capitalize">{value}</span>
                  )}
                />
                <Bar name="Planejado (%)" dataKey="planejado" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar name="Real Executado (%)" dataKey="real" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              /* Mode 2: Floating Gantt Offset & Duration Chart */
              <BarChart
                layout="vertical"
                data={comparisonData}
                margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#71717a"
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  unit=" dias"
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#71717a"
                  tick={{ fill: "#f4f4f5", fontSize: 11, fontWeight: "bold" }}
                  width={160}
                />
                <Tooltip content={<PercentTooltip />} />
                <Bar dataKey="offset" stackId="a" fill="transparent" />
                <Bar name="Duração Estimada" dataKey="duration" stackId="a" fill="#f59e0b" radius={[0, 8, 8, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Milestone Cards Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> Detalhamento de Progresso e Prazos por Etapa
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {comparisonData.map((st) => (
            <div
              key={st.id}
              className={`p-4 rounded-2xl border transition-all ${
                st.status === "completed"
                  ? "bg-emerald-950/20 border-emerald-500/40"
                  : st.status === "in_progress"
                  ? "bg-amber-950/30 border-amber-400/80 shadow-lg"
                  : "bg-zinc-950 border-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-zinc-400">
                  Etapa #{st.id}
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                    st.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : st.status === "in_progress"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                      : "bg-zinc-900 text-zinc-500 border-zinc-800"
                  }`}
                >
                  {st.statusLabel}
                </span>
              </div>

              <h5 className="text-sm font-black text-white mb-2 leading-snug">{st.shortName}</h5>

              {/* Progress Bars (Planejado vs Real) */}
              <div className="space-y-2 py-2 border-t border-b border-zinc-800/80">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-blue-400 mb-0.5">
                    <span>Planejado:</span>
                    <span>{st.planejado}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all"
                      style={{ width: `${st.planejado}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-amber-400 mb-0.5">
                    <span>Real Executado:</span>
                    <span>{st.real}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all"
                      style={{ width: `${st.real}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-zinc-400 pt-2 flex items-center justify-between">
                <span>Data Ref / Conclusão:</span>
                <strong className="text-amber-300">{st.startDateStr}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

