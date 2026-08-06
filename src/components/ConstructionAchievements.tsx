import React, { useState, useEffect } from "react";
import {
  Trophy,
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  HardHat,
  ShieldCheck,
  Star,
  ChevronRight,
  RefreshCcw,
  Building2,
  Ruler,
  DollarSign,
  Share2,
  PartyPopper,
  Flame,
  X
} from "lucide-react";

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "planejamento" | "estrutura" | "acabamento" | "gestao";
  xp: number;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

const DEFAULT_BADGES: AchievementBadge[] = [
  {
    id: "planta_aprovada",
    title: "Primeira Planta Aprovada",
    description: "Definiu as medições e aprovou o projeto arquitetônico 3D.",
    icon: "📜",
    category: "planejamento",
    xp: 150,
    unlocked: true,
    unlockedAt: "12/01/2026",
    requirement: "Aprovar projeto ou medição no sistema 3D",
  },
  {
    id: "fundacao_concluida",
    title: "Fundação Concluída",
    description: "Sondagem de solo, terraplenagem e radier/sapatas concretados.",
    icon: "🏗️",
    category: "estrutura",
    xp: 250,
    unlocked: true,
    unlockedAt: "20/02/2026",
    requirement: "Concluir etapa de Fundação na obra",
  },
  {
    id: "alvenaria_laje",
    title: "Paredes no Alto",
    description: "Alvenaria estrutural e laje do 1º/2º pavimento erguidas.",
    icon: "🧱",
    category: "estrutura",
    xp: 200,
    unlocked: true,
    unlockedAt: "15/04/2026",
    requirement: "Concluir etapa de Alvenaria e Estrutura",
  },
  {
    id: "cobertura_protegida",
    title: "Teto Protegido",
    description: "Telhado, impermeabilização e esquadrias instaladas.",
    icon: "🏠",
    category: "estrutura",
    xp: 200,
    unlocked: false,
    requirement: "Concluir etapa de Cobertura & Esquadrias",
  },
  {
    id: "hidro_eletrica",
    title: "Rede Energizada",
    description: "Tubulação de água e fiação elétrica 100% instaladas e testadas.",
    icon: "⚡",
    category: "acabamento",
    xp: 250,
    unlocked: false,
    requirement: "Concluir etapa de Instalações Hidroelétricas",
  },
  {
    id: "mestre_acabamento",
    title: "Mestre do Acabamento",
    description: "Revestimento, porcelanato e pintura finalizados com esmero.",
    icon: "🎨",
    category: "acabamento",
    xp: 300,
    unlocked: false,
    requirement: "Concluir etapa de Pintura e Revestimento",
  },
  {
    id: "chave_na_mao",
    title: "Chave na Mão!",
    description: "Obra 100% entregue dentro dos padrões de qualidade UNIVERSO ADAS.",
    icon: "🔑",
    category: "gestao",
    xp: 500,
    unlocked: false,
    requirement: "Completar 100% de todas as etapas de uma obra",
  },
  {
    id: "guardiao_orcamento",
    title: "Guardião do Orçamento",
    description: "Manteve todos os gastos da obra dentro da margem de 10% orçada.",
    icon: "🛡️",
    category: "gestao",
    xp: 300,
    unlocked: true,
    unlockedAt: "01/05/2026",
    requirement: "Manter despesas sem extrapolar 10% da estimativa",
  },
  {
    id: "explorador_ra",
    title: "Explorador de RA 3D",
    description: "Projetou móveis no cômodo real utilizando a Realidade Aumentada.",
    icon: "📱",
    category: "planejamento",
    xp: 150,
    unlocked: true,
    unlockedAt: "03/08/2026",
    requirement: "Usar a Câmera RA para simular móveis",
  },
  {
    id: "gestor_exemplar",
    title: "Mestre do Cronograma",
    description: "Acompanhou e atualizou o status das etapas no painel de obras.",
    icon: "📊",
    category: "gestao",
    xp: 150,
    unlocked: true,
    unlockedAt: "10/06/2026",
    requirement: "Atualizar status de etapas ativas no painel",
  },
];

const LOCAL_STORAGE_KEY = "universo_adas_construction_badges_v1";

interface ConstructionAchievementsProps {
  completedStepsCount?: number;
  totalStepsCount?: number;
  onBadgeUnlocked?: (badge: AchievementBadge) => void;
}

export const ConstructionAchievements: React.FC<ConstructionAchievementsProps> = ({
  completedStepsCount = 5,
  totalStepsCount = 12,
}) => {
  const [badges, setBadges] = useState<AchievementBadge[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error loading badges", e);
        }
      }
    }
    return DEFAULT_BADGES;
  });

  const [celebrationModalBadge, setCelebrationModalBadge] = useState<AchievementBadge | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");

  // Save to local storage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(badges));
    }
  }, [badges]);

  // Listen for global unlock event
  useEffect(() => {
    const handleGlobalUnlock = (e: any) => {
      const badgeId = e.detail?.badgeId;
      if (!badgeId) return;

      setBadges((prev) =>
        prev.map((b) => {
          if (b.id === badgeId && !b.unlocked) {
            const updated = {
              ...b,
              unlocked: true,
              unlockedAt: new Date().toLocaleDateString("pt-BR"),
            };
            setCelebrationModalBadge(updated);
            return updated;
          }
          return b;
        })
      );
    };

    window.addEventListener("unlock-construction-badge" as any, handleGlobalUnlock);
    return () => {
      window.removeEventListener("unlock-construction-badge" as any, handleGlobalUnlock);
    };
  }, []);

  // Calculate XP & Gamer Level
  const unlockedBadges = badges.filter((b) => b.unlocked);
  const totalXP = unlockedBadges.reduce((acc, b) => acc + b.xp, 0);

  let userLevel = 1;
  let levelTitle = "Aprendiz de Obra";
  let nextLevelXP = 500;

  if (totalXP >= 1500) {
    userLevel = 4;
    levelTitle = "Arquiteto Lendário";
    nextLevelXP = 2500;
  } else if (totalXP >= 900) {
    userLevel = 3;
    levelTitle = "Mestre de Obras Pro";
    nextLevelXP = 1500;
  } else if (totalXP >= 400) {
    userLevel = 2;
    levelTitle = "Construtor Experiente";
    nextLevelXP = 900;
  }

  const levelProgress = Math.min(100, Math.round((totalXP / nextLevelXP) * 100));

  const toggleUnlockBadge = (id: string) => {
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextState = !b.unlocked;
          const updated = {
            ...b,
            unlocked: nextState,
            unlockedAt: nextState ? new Date().toLocaleDateString("pt-BR") : undefined,
          };
          if (nextState) {
            setCelebrationModalBadge(updated);
            // Play audio chime
            playCelebrationSound();
          }
          return updated;
        }
        return b;
      })
    );
  };

  const playCelebrationSound = () => {
    try {
      if (typeof window !== "undefined" && (window.AudioContext || (window as any).webkitAudioContext)) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.3); // C6

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio not permitted without interaction
    }
  };

  const resetAllBadges = () => {
    setBadges(DEFAULT_BADGES);
  };

  const filteredBadges = badges.filter(
    (b) => selectedCategory === "todas" || b.category === selectedCategory
  );

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/30 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> Sistema de Conquistas
            </span>
            <span className="text-xs text-emerald-400 font-extrabold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Jornada de Engajamento da Obra
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Conquistas e Badges de</span>
            <span className="text-amber-400">Construção</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Ganhe insígnias exclusivas e acumule XP conforme atinge marcos e completa etapas das suas obras!
          </p>
        </div>

        {/* User Gamer Level Card */}
        <div className="bg-zinc-950 border-2 border-amber-500/50 p-4 rounded-2xl shrink-0 flex items-center gap-3 min-w-[260px] shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-zinc-950 font-black text-xl flex items-center justify-center shrink-0 shadow-md">
            L{userLevel}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 truncate">{levelTitle}</span>
              <span className="text-[10px] font-mono font-bold text-zinc-400">{totalXP} XP</span>
            </div>

            {/* Level Bar */}
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="text-[9px] text-zinc-500 flex justify-between">
              <span>{unlockedBadges.length}/{badges.length} desbloqueados</span>
              <span>Próximo Nível: {nextLevelXP} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "todas", label: "Todas" },
            { id: "planejamento", label: "Planejamento" },
            { id: "estrutura", label: "Estrutura & Alvenaria" },
            { id: "acabamento", label: "Acabamento" },
            { id: "gestao", label: "Gestão de Custo" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? "bg-amber-500 text-zinc-950 shadow-md"
                  : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={resetAllBadges}
          className="text-[11px] text-zinc-500 hover:text-amber-400 flex items-center gap-1 font-semibold"
        >
          <RefreshCcw className="w-3 h-3" /> Redefinir Conquistas
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            onClick={() => toggleUnlockBadge(badge.id)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative group overflow-hidden ${
              badge.unlocked
                ? "bg-zinc-950 border-amber-500/60 shadow-xl hover:border-amber-400 hover:scale-[1.02]"
                : "bg-zinc-950/50 border-zinc-800/80 opacity-60 hover:opacity-80"
            }`}
          >
            {/* Background Glow when Unlocked */}
            {badge.unlocked && (
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            )}

            <div className="flex items-start gap-3 relative z-10">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border transition-transform group-hover:scale-110 ${
                  badge.unlocked
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-md"
                    : "bg-zinc-900 border-zinc-800 grayscale"
                }`}
              >
                {badge.icon}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-sm font-black text-white truncate">{badge.title}</h4>
                  {badge.unlocked ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" /> +{badge.xp} XP
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center gap-1 shrink-0">
                      <Lock className="w-3 h-3" /> {badge.xp} XP
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>

                <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500">
                  <span className="italic truncate">Requisito: {badge.requirement}</span>
                  {badge.unlockedAt && (
                    <span className="text-amber-400/80 font-mono shrink-0 ml-1">
                      {badge.unlockedAt}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Celebration Unlock Modal */}
      {celebrationModalBadge && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border-2 border-amber-400 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setCelebrationModalBadge(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full border border-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 flex items-center justify-center text-4xl mx-auto shadow-2xl border-4 border-white/20 animate-bounce">
              {celebrationModalBadge.icon}
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/40 inline-flex items-center gap-1">
                <PartyPopper className="w-3.5 h-3.5" /> Conquista Desbloqueada!
              </span>
              <h3 className="text-2xl font-black text-white pt-2">
                {celebrationModalBadge.title}
              </h3>
              <p className="text-xs text-zinc-300 px-2 leading-relaxed">
                {celebrationModalBadge.description}
              </p>
            </div>

            <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 text-xs font-black text-emerald-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>+{celebrationModalBadge.xp} XP Adicionados ao Seu Nível</span>
            </div>

            <button
              onClick={() => setCelebrationModalBadge(null)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg"
            >
              Continuar Jornada da Obra 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
