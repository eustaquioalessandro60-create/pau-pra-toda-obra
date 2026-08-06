import React, { useState } from "react";
import {
  Mic,
  X,
  Layers,
  Wand2,
  Boxes,
  Sparkles,
  Axe,
  BookOpen,
  Compass,
  Zap,
} from "lucide-react";
import { InteractiveVoiceTour } from "./InteractiveVoiceTour";

export interface VoiceGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCommand: (command: string) => void;
  initialTab?: "tour" | "dictionary";
}

export const VoiceGuideModal: React.FC<VoiceGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectCommand,
  initialTab = "tour",
}) => {
  const [activeTab, setActiveTab] = useState<"tour" | "dictionary">(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  if (activeTab === "tour") {
    return (
      <InteractiveVoiceTour
        isOpen={isOpen}
        onClose={onClose}
        onExecuteCommand={(cmd) => {
          onSelectCommand(cmd);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border-2 border-amber-500/60 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-amber-950/80 via-zinc-900 to-emerald-950/80 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-zinc-950 rounded-2xl shadow-lg">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>GUIA DE COMANDOS DE VOZ DA IA</span>
                <span className="text-[10px] bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-full font-bold uppercase">
                  Português (BR)
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Exemplos práticos de comandos para alterar paredes, adicionar móveis ou mudar texturas no projeto 3D
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
            title="Fechar Guia"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex gap-2 px-6 pt-3 bg-zinc-950 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("tour")}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-amber-500/50"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Tour Interativo Guiado</span>
          </button>

          <button
            onClick={() => setActiveTab("dictionary")}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 bg-amber-500 text-zinc-950 border border-amber-400 shadow-md"
          >
            <BookOpen className="w-4 h-4" />
            <span>Dicionário Rápido de Comandos</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs">
          {/* Category 1: Alterar Paredes, Cores & Estruturas */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold uppercase text-xs">
              <Layers className="w-4 h-4" />
              <span>1. Alterar Paredes & Estruturas</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Adicionar parede",
                "Adicionar parede de pé-direito duplo",
                "Mudar cor da parede para azul",
                "Mudar cor da parede para bege",
                "Pintar fachada de branco clássico",
                "Aumentar pé-direito para 3.5m",
                "Incluir fundação reforçada com radier e sapatas",
              ].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => onSelectCommand(cmd)}
                  className="text-left bg-zinc-900 hover:bg-amber-500/20 border border-zinc-800 hover:border-amber-500/50 p-3 rounded-xl transition-all group flex items-center justify-between"
                >
                  <span className="font-semibold text-zinc-200 group-hover:text-amber-300">"{cmd}"</span>
                  <span className="text-[10px] bg-zinc-800 group-hover:bg-amber-400 group-hover:text-zinc-950 text-zinc-400 px-2 py-1 rounded-lg font-bold shrink-0 ml-2">
                    Testar
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Category 2: Mudar Texturas e Acabamentos */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sky-400 font-extrabold uppercase text-xs">
              <Wand2 className="w-4 h-4" />
              <span>2. Mudar Texturas & Acabamentos</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Mudar textura",
                "Mudar textura para tijolo rústico",
                "Mudar textura para madeira de demolição",
                "Aplicar textura de concreto aparente",
                "Pintar fachada com tom escuro modernista",
              ].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => onSelectCommand(cmd)}
                  className="text-left bg-zinc-900 hover:bg-sky-500/20 border border-zinc-800 hover:border-sky-500/50 p-3 rounded-xl transition-all group flex items-center justify-between"
                >
                  <span className="font-semibold text-zinc-200 group-hover:text-sky-300">"{cmd}"</span>
                  <span className="text-[10px] bg-zinc-800 group-hover:bg-sky-400 group-hover:text-zinc-950 text-zinc-400 px-2 py-1 rounded-lg font-bold shrink-0 ml-2">
                    Testar
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Category 3: Inserir Móveis & Planejados */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold uppercase text-xs">
              <Boxes className="w-4 h-4" />
              <span>3. Inserir Móveis Planejados GDM & Estofados</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Adicionar mesa",
                "Mover poltrona",
                "Inserir sofá e mobiliar a sala",
                "Adicionar móveis planejados GDM completos",
                "Colocar móveis e armários na cozinha",
                "Adicionar guarda-roupa casal e closet",
              ].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => onSelectCommand(cmd)}
                  className="text-left bg-zinc-900 hover:bg-emerald-500/20 border border-zinc-800 hover:border-emerald-500/50 p-3 rounded-xl transition-all group flex items-center justify-between"
                >
                  <span className="font-semibold text-zinc-200 group-hover:text-emerald-300">"{cmd}"</span>
                  <span className="text-[10px] bg-zinc-800 group-hover:bg-emerald-400 group-hover:text-zinc-950 text-zinc-400 px-2 py-1 rounded-lg font-bold shrink-0 ml-2">
                    Testar
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Category 4: Lazer, Piscina & Área Gourmet */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold uppercase text-xs">
              <Sparkles className="w-4 h-4" />
              <span>4. Lazer, Piscina de Borda Infinita & Área Gourmet</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Adicionar piscina de borda infinita",
                "Criar área gourmet com churrasqueira",
                "Colocar churrasqueira e mesa de sinuca",
                "Adicionar piscina e área gourmet completa",
              ].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => onSelectCommand(cmd)}
                  className="text-left bg-zinc-900 hover:bg-amber-500/20 border border-zinc-800 hover:border-amber-500/50 p-3 rounded-xl transition-all group flex items-center justify-between"
                >
                  <span className="font-semibold text-zinc-200 group-hover:text-amber-300">"{cmd}"</span>
                  <span className="text-[10px] bg-zinc-800 group-hover:bg-amber-400 group-hover:text-zinc-950 text-zinc-400 px-2 py-1 rounded-lg font-bold shrink-0 ml-2">
                    Testar
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Category 5: Telhado, Iluminação & Terreno */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-extrabold uppercase text-xs">
              <Axe className="w-4 h-4" />
              <span>5. Telhado, Iluminação & Terreno</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Ativar telhado colonial cerâmico",
                "Mudar para telhado platibanda moderno",
                "Ativar iluminação noturna com spots",
                "Mudar iluminação para pôr do sol",
                "Aumentar largura do terreno para 15 metros",
              ].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => onSelectCommand(cmd)}
                  className="text-left bg-zinc-900 hover:bg-amber-500/20 border border-zinc-800 hover:border-amber-500/50 p-3 rounded-xl transition-all group flex items-center justify-between"
                >
                  <span className="font-semibold text-zinc-200 group-hover:text-amber-300">"{cmd}"</span>
                  <span className="text-[10px] bg-zinc-800 group-hover:bg-amber-400 group-hover:text-zinc-950 text-zinc-400 px-2 py-1 rounded-lg font-bold shrink-0 ml-2">
                    Testar
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-zinc-400">💡 Dica: Você também pode clicar no botão do microfone e falar qualquer comando por voz!</span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl transition-colors shadow-lg"
          >
            ENTENDI / FECHAR GUIA
          </button>
        </div>
      </div>
    </div>
  );
};
