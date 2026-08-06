import React, { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  X,
  ChevronRight,
  ChevronLeft,
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Layers,
  Wand2,
  Boxes,
  SunMoon,
  Award,
  RotateCcw,
  Zap,
  HelpCircle,
} from "lucide-react";

export interface TourStep {
  id: number;
  title: string;
  category: string;
  badgeColor: string;
  icon: React.ElementType;
  description: string;
  voiceExample: string;
  explanationText: string;
  sampleActionDescription: string;
  actionCommand: string;
  tips: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    title: "1. Ativação do Microfone & Escuta Inteligente",
    category: "Reconhecimento de Voz",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    icon: Mic,
    description:
      "Aprenda como ativar o microfone e enviar comandos por voz ao vivo para a inteligência artificial do modelador 3D.",
    voiceExample: "Ativar microfone e falar 'Ajuda com comandos'",
    explanationText:
      "O sistema utiliza a API de Reconhecimento de Voz do seu navegador. Basta clicar no ícone do microfone no topo do estúdio ou na barra flutuante. Quando o indicador piscar em vermelho/amarelo, fale naturalmente em português.",
    sampleActionDescription: "Testar ativação simulada do áudio",
    actionCommand: "Abrir menu de comandos de voz",
    tips: [
      "Fale em tom de conversa normal, sem pressa.",
      "Você pode usar o atalho rápido clicando no botão do microfone na barra de ferramentas.",
      "Se o navegador pedir permissão de microfone, clique em 'Permitir'.",
    ],
  },
  {
    id: 2,
    title: "2. Paredes, Pé-Direito & Estrutura da Casa",
    category: "Modificação Estrutural",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    icon: Layers,
    description:
      "Ajuste paredes, adicione pé-direito duplo ou mude a altura da casa usando apenas comandos de voz.",
    voiceExample: "Aumentar pé-direito para 3.5m",
    explanationText:
      "Você pode alterar o número de cômodos, criar paredes duplas ou ajustar o pé-direito da residência. A IA reinterpreta os valores em tempo real e reajusta as fundações automaticamente no visualizador 3D.",
    sampleActionDescription: "Simular comando: 'Aumentar pé-direito para 3.5m'",
    actionCommand: "Aumentar pé-direito para 3.5m",
    tips: [
      "Exemplos: 'Adicionar parede', 'Pé-direito duplo', 'Pintar paredes de branco clássico'.",
      "O orçamento do projeto atualiza instantaneamente ao mudar a estrutura.",
    ],
  },
  {
    id: 3,
    title: "3. Revestimentos, Tintas & Texturas de Fachada",
    category: "Acabamentos & Materiais",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    icon: Wand2,
    description:
      "Troque revestimentos externos entre tijolo rústico, concreto aparente, madeira de demolição ou pintura lisa.",
    voiceExample: "Mudar textura para tijolo rústico",
    explanationText:
      "Diga à IA qual material deseja aplicar na fachada ou paredes internas. O motor gráfico atualiza os materiais de iluminação e rugosidade do modelo 3D.",
    sampleActionDescription: "Simular comando: 'Mudar textura para tijolo rústico'",
    actionCommand: "Mudar textura para tijolo rústico",
    tips: [
      "Experimente: 'Aplicar textura de concreto aparente', 'Madeira de demolição', 'Fachada branca'.",
      "Você pode comparar as texturas trocando os comandos em sequência.",
    ],
  },
  {
    id: 4,
    title: "4. Móveis Planejados GDM & Interiores",
    category: "Decoração & Marcenaria",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    icon: Boxes,
    description:
      "Insira conjuntos de móveis planejados em 100% MDF da GDM Móveis na cozinha, salas e dormitórios.",
    voiceExample: "Adicionar móveis planejados GDM completos",
    explanationText:
      "Controle a marcenaria e estofados por voz. O sistema calcula automaticamente as dimensões necessárias e adiciona o custo de fabricação no carrinho de mobília do projeto.",
    sampleActionDescription:
      "Simular comando: 'Adicionar móveis planejados GDM completos'",
    actionCommand: "Adicionar móveis planejados GDM completos",
    tips: [
      "Exemplos: 'Inserir sofá e mobiliar a sala', 'Cozinha planejada com armários', 'Guarda-roupa casal'.",
      "Os itens mobiliados geram uma lista para orçamento no carrinho.",
    ],
  },
  {
    id: 5,
    title: "5. Lazer, Piscina com Borda Infinita & Área Gourmet",
    category: "Área Externa & Lazer",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    icon: Sparkles,
    description:
      "Adicione piscina com borda infinita, churrasqueira, deck e mesas de sinuca para compor a área gourmet.",
    voiceExample: "Adicionar piscina de borda infinita",
    explanationText:
      "Basta pedir para a IA incluir uma piscina ou área gourmet. O modelador posiciona a piscina com água animada e iluminação subaquática ao fundo do lote.",
    sampleActionDescription:
      "Simular comando: 'Adicionar piscina de borda infinita'",
    actionCommand: "Adicionar piscina de borda infinita",
    tips: [
      "Exemplos: 'Criar área gourmet com churrasqueira', 'Mesa de sinuca oficial', 'Piscina e lazer'.",
    ],
  },
  {
    id: 6,
    title: "6. IluminaçãoNoturna, Clima & Telhados",
    category: "Cena & Iluminação 3D",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    icon: SunMoon,
    description:
      "Simule o comportamento da luz do sol, troque para iluminação noturna com spots e altere o estilo do telhado.",
    voiceExample: "Ativar iluminação noturna com spots",
    explanationText:
      "Fale para a IA mudar a hora do dia ou o estilo do telhado (colonial cerâmico ou platibanda moderno). Veja como as sombras e os pontos de iluminação LED se comportam na maquete.",
    sampleActionDescription:
      "Simular comando: 'Ativar iluminação noturna com spots'",
    actionCommand: "Ativar iluminação noturna com spots",
    tips: [
      "Exemplos: 'Mudar iluminação para por do sol', 'Telhado colonial', 'Telhado platibanda moderno'.",
      "Perfeito para apresentar o projeto para clientes com atmosferas variadas.",
    ],
  },
];

export interface InteractiveVoiceTourProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (command: string) => void;
}

export const InteractiveVoiceTour: React.FC<InteractiveVoiceTourProps> = ({
  isOpen,
  onClose,
  onExecuteCommand,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isSpeakingNarration, setIsSpeakingNarration] = useState<boolean>(false);
  const [isListeningSimulator, setIsListeningSimulator] = useState<boolean>(false);
  const [simulatedRecognizedText, setSimulatedRecognizedText] = useState<string | null>(
    null
  );
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Stop narration on step change or close
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeakingNarration(false);
    }
    setSimulatedRecognizedText(null);
    setIsListeningSimulator(false);
  }, [currentStepIndex, isOpen]);

  if (!isOpen) return null;

  // Speech Synthesis (TTS) Helper
  const handleToggleNarration = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Navegador não suporta síntese de voz.");
      return;
    }

    if (isSpeakingNarration) {
      window.speechSynthesis.cancel();
      setIsSpeakingNarration(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `${currentStep.title}. ${currentStep.explanationText} Exemplo de comando: ${currentStep.voiceExample}.`
      );
      utterance.lang = "pt-BR";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => setIsSpeakingNarration(false);
      utterance.onerror = () => setIsSpeakingNarration(false);

      setIsSpeakingNarration(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Simulate or execute live command
  const handleTestStepCommand = () => {
    setIsListeningSimulator(true);
    setSimulatedRecognizedText("Ouvindo voz...");

    setTimeout(() => {
      setSimulatedRecognizedText(`🎤 Reconhecido: "${currentStep.actionCommand}"`);

      setTimeout(() => {
        onExecuteCommand(currentStep.actionCommand);
        setIsListeningSimulator(false);

        if (!completedSteps.includes(currentStepIndex)) {
          setCompletedSteps((prev) => [...prev, currentStepIndex]);
        }
      }, 1000);
    }, 1200);
  };

  const handleNextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleFinishTour = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    onClose();
  };

  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-zinc-950 border-2 border-amber-500/60 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/90 via-zinc-900 to-amber-950/90 border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-zinc-950 rounded-2xl shadow-lg shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-400 text-zinc-950 font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                  Tour Guiado Interativo
                </span>
                <span className="text-[10px] text-zinc-400 font-mono font-bold">
                  Passo {currentStepIndex + 1} de {TOUR_STEPS.length}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                Como Controlar o Estúdio 3D por Voz
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio TTS Button */}
            <button
              onClick={handleToggleNarration}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                isSpeakingNarration
                  ? "bg-amber-500 text-zinc-950 border-amber-400 animate-pulse"
                  : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-amber-300"
              }`}
              title="Ouvir Narração em Áudio do Passo"
            >
              {isSpeakingNarration ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-400" />
              )}
              <span className="hidden sm:inline">
                {isSpeakingNarration ? "Parar Áudio" : "Ouvir Passo"}
              </span>
            </button>

            <button
              onClick={handleFinishTour}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
              title="Fechar Tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-zinc-900 h-1.5 flex shrink-0">
          {TOUR_STEPS.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isDone = completedSteps.includes(idx) || idx < currentStepIndex;
            return (
              <div
                key={step.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-full flex-1 cursor-pointer transition-all ${
                  isCurrent
                    ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                    : isDone
                    ? "bg-amber-600/80"
                    : "bg-zinc-800"
                }`}
                title={`Ir para o Passo ${idx + 1}: ${step.title}`}
              />
            );
          })}
        </div>

        {/* STEP STEPPER INDICATOR ICONS */}
        <div className="px-4 py-2 bg-zinc-900/60 border-b border-zinc-800/80 flex items-center justify-between overflow-x-auto gap-2 scrollbar-none shrink-0">
          {TOUR_STEPS.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isDone = completedSteps.includes(idx);
            const StepIconComp = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black transition-all shrink-0 border ${
                  isCurrent
                    ? "bg-amber-500 text-zinc-950 border-amber-400 shadow-md scale-105"
                    : isDone
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300"
                }`}
              >
                <StepIconComp className="w-3.5 h-3.5" />
                <span>Passo {idx + 1}</span>
                {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-0.5" />}
              </button>
            );
          })}
        </div>

        {/* MAIN BODY CONTENT */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs flex-1">
          {/* STEP TITLE & BADGE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${currentStep.badgeColor}`}
              >
                {currentStep.category}
              </span>

              {completedSteps.includes(currentStepIndex) && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Praticado com Sucesso!
                </span>
              )}
            </div>

            <h4 className="text-xl font-black text-white flex items-center gap-2">
              <StepIcon className="w-6 h-6 text-amber-400" />
              <span>{currentStep.title}</span>
            </h4>

            <p className="text-zinc-300 text-sm leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* DETAILED EXPLANATION CARD */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Como Funciona Este Comando</span>
            </h5>
            <p className="text-zinc-300 text-xs leading-relaxed">
              {currentStep.explanationText}
            </p>
          </div>

          {/* VOICE EXAMPLE & LIVE INTERACTIVE SIMULATOR */}
          <div className="bg-gradient-to-r from-amber-950/50 via-zinc-900 to-amber-950/50 border-2 border-amber-500/40 p-4 sm:p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Exemplo de Frase de Voz para Falar:
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                Língua: Português (BR)
              </span>
            </div>

            <div className="p-3.5 bg-zinc-950 border border-amber-500/60 rounded-xl flex items-center justify-between text-base font-black text-amber-300 font-mono shadow-inner">
              <span>"{currentStep.voiceExample}"</span>

              {/* Animated sound wave bars when simulating */}
              {isListeningSimulator && (
                <div className="flex items-center gap-1 h-5">
                  <div className="w-1 bg-amber-400 h-full animate-bounce" />
                  <div className="w-1 bg-amber-400 h-3 animate-bounce delay-75" />
                  <div className="w-1 bg-amber-400 h-5 animate-bounce delay-150" />
                  <div className="w-1 bg-amber-400 h-2 animate-bounce delay-200" />
                </div>
              )}
            </div>

            {simulatedRecognizedText && (
              <div className="p-3 bg-zinc-950/90 border border-emerald-500/60 rounded-xl text-xs font-mono font-bold text-emerald-300 animate-in fade-in flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{simulatedRecognizedText}</span>
              </div>
            )}

            {/* SIMULATION ACTION BUTTON */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <p className="text-[11px] text-zinc-400">
                Clique no botão ao lado para simular o reconhecimento de voz e ver o efeito no projeto 3D ao vivo.
              </p>

              <button
                onClick={handleTestStepCommand}
                disabled={isListeningSimulator}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-105 shrink-0 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>
                  {isListeningSimulator ? "Reconhecendo Áudio..." : "Testar Comando No Modelo 3D"}
                </span>
              </button>
            </div>
          </div>

          {/* USEFUL TIPS */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl space-y-2">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
              💡 Dicas Importantes para este Passo:
            </span>
            <ul className="space-y-1 text-zinc-400 text-xs list-disc list-inside">
              {currentStep.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 font-bold text-xs uppercase rounded-xl transition-all flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-2">
            {!isLastStep ? (
              <button
                onClick={handleNextStep}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <span>Próximo Passo</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            ) : (
              <button
                onClick={handleFinishTour}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Concluir Tour & Começar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
