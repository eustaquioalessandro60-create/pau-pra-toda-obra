import React, { useState } from "react";
import {
  History,
  Trash2,
  Mic,
  RotateCcw,
  Pencil,
  Check,
  X,
  Plus,
  Play,
  Sparkles,
  Clock,
  Send,
} from "lucide-react";

export interface VoiceCommandHistoryItem {
  id: string;
  command: string;
  timestamp: string;
  isEdited?: boolean;
  replayCount?: number;
}

export interface VoiceCommandHistoryProps {
  history: VoiceCommandHistoryItem[];
  onReapplyCommand?: (command: string) => void;
  onEditCommand?: (id: string, newCommand: string) => void;
  onDeleteCommand?: (id: string) => void;
  onClearHistory?: () => void;
  onAddCustomCommand?: (command: string) => void;
}

export const VoiceCommandHistory: React.FC<VoiceCommandHistoryProps> = ({
  history,
  onReapplyCommand,
  onEditCommand,
  onDeleteCommand,
  onClearHistory,
  onAddCustomCommand,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState<string>("");
  const [lastExecutedId, setLastExecutedId] = useState<string | null>(null);
  const [newCommandText, setNewCommandText] = useState<string>("");
  const [showAddInput, setShowAddInput] = useState<boolean>(false);

  // Maximum items shown in chronological order
  const displayHistory = history.slice(0, 10);

  const handleStartEdit = (item: VoiceCommandHistoryItem) => {
    setEditingId(item.id);
    setEditBuffer(item.command);
  };

  const handleSaveEdit = (id: string, executeImmediately = false) => {
    if (!editBuffer.trim()) return;
    if (onEditCommand) {
      onEditCommand(id, editBuffer.trim());
    }
    if (executeImmediately && onReapplyCommand) {
      onReapplyCommand(editBuffer.trim());
      setLastExecutedId(id);
      setTimeout(() => setLastExecutedId(null), 2000);
    }
    setEditingId(null);
    setEditBuffer("");
  };

  const handleReapply = (item: VoiceCommandHistoryItem) => {
    if (onReapplyCommand) {
      onReapplyCommand(item.command);
      setLastExecutedId(item.id);
      setTimeout(() => setLastExecutedId(null), 2000);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommandText.trim()) return;
    const cmd = newCommandText.trim();
    if (onAddCustomCommand) {
      onAddCustomCommand(cmd);
    } else if (onReapplyCommand) {
      onReapplyCommand(cmd);
    }
    setNewCommandText("");
    setShowAddInput(false);
  };

  return (
    <div className="bg-zinc-950/90 border border-amber-500/30 rounded-2xl p-4 mt-4 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Histórico de Comandos de Voz</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">
                {history.length}
              </span>
            </h4>
            <p className="text-[11px] text-zinc-400">
              Refaça, edite ou crie novos comandos rápidos em 3D
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddInput(!showAddInput)}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 shadow-sm"
            title="Digitar comando manualmente"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Novo Comando</span>
          </button>

          {history.length > 0 && onClearHistory && (
            <button
              onClick={onClearHistory}
              className="text-[11px] font-semibold text-zinc-400 hover:text-red-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
              title="Limpar todo o histórico"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Custom Command Input Bar */}
      {showAddInput && (
        <form
          onSubmit={handleAddSubmit}
          className="mb-3 p-2.5 bg-zinc-900 border border-amber-500/40 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <Mic className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
          <input
            type="text"
            value={newCommandText}
            onChange={(e) => setNewCommandText(e.target.value)}
            placeholder="Ex: Adicionar iluminação noturna e sacada moderna..."
            className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            disabled={!newCommandText.trim()}
            className="px-3 py-1 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-zinc-950 font-black text-xs rounded-lg flex items-center gap-1 transition-all shrink-0"
          >
            <Send className="w-3 h-3" />
            <span>Executar</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddInput(false)}
            className="p-1 text-zinc-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Chronological History List */}
      {displayHistory.length === 0 ? (
        <div className="py-6 text-center bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
          <Mic className="w-6 h-6 text-zinc-600 mx-auto mb-2 opacity-50" />
          <p className="text-xs text-zinc-400 font-medium">
            Nenhum comando executado recentemente.
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Clique no microfone acima ou digite um novo comando para simular sua obra.
          </p>
        </div>
      ) : (
        <div className="max-h-56 overflow-y-auto custom-scrollbar space-y-2 pr-1">
          {displayHistory.map((item, index) => {
            const isEditing = editingId === item.id;
            const isJustExecuted = lastExecutedId === item.id;

            return (
              <div
                key={item.id}
                className={`group relative p-2.5 rounded-xl border transition-all duration-200 ${
                  isJustExecuted
                    ? "bg-amber-950/60 border-amber-400 shadow-lg scale-[1.01]"
                    : isEditing
                    ? "bg-zinc-900 border-amber-500/80 shadow-md"
                    : "bg-zinc-900/80 hover:bg-zinc-900 border-zinc-800/80 hover:border-amber-500/40"
                }`}
              >
                {isEditing ? (
                  /* Edit Mode View */
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                        Editando Comando
                      </span>
                    </div>
                    <textarea
                      value={editBuffer}
                      onChange={(e) => setEditBuffer(e.target.value)}
                      className="w-full bg-zinc-950 border border-amber-500/60 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
                      rows={2}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white bg-zinc-800 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(item.id, false)}
                        className="px-2.5 py-1 text-xs text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apenas Salvar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(item.id, true)}
                        className="px-3 py-1 text-xs font-black text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1 shadow"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Salvar & Executar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard List Item View */
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-black flex items-center justify-center shrink-0 border border-amber-500/20">
                        #{displayHistory.length - index}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-white truncate group-hover:text-amber-200 transition-colors">
                            "{item.command}"
                          </p>
                          {item.isEdited && (
                            <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                              Editado
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-0.5">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          <span>{item.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isJustExecuted && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/40 px-2 py-0.5 rounded-md flex items-center gap-1 animate-in fade-in">
                          <Sparkles className="w-3 h-3" /> Executado!
                        </span>
                      )}

                      {/* Redo/Reapply Button */}
                      {onReapplyCommand && (
                        <button
                          onClick={() => handleReapply(item)}
                          className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-400 hover:text-zinc-950 text-amber-300 text-xs font-bold rounded-lg transition-all flex items-center gap-1 border border-amber-500/30 shadow-sm"
                          title="Refazer / Reexecutar este comando"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Refazer</span>
                        </button>
                      )}

                      {/* Edit Button */}
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-1.5 text-zinc-400 hover:text-amber-400 bg-zinc-950/60 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-800"
                        title="Editar comando"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Single Item */}
                      {onDeleteCommand && (
                        <button
                          onClick={() => onDeleteCommand(item.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 bg-zinc-950/60 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-800"
                          title="Remover do histórico"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
