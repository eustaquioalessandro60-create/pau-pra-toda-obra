import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Phone,
  Trash2,
  Building2,
  Coins,
  Armchair,
  FileCheck,
  Minimize2,
  Gavel,
  Landmark,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

const PRESET_QUESTIONS = [
  {
    icon: Landmark,
    text: "Como funciona a Assessoria para Financiamento Caixa (PCI)?",
  },
  {
    icon: Gavel,
    text: "Como funciona a Assessoria em Leilões (Caixa, Detran, PRF)?",
  },
  {
    icon: Building2,
    text: "Como funciona o serviço 'Do Terreno à Chave na Mão'?",
  },
  {
    icon: Armchair,
    text: "Quais ambientes vocês fazem com Móveis Planejados GDM?",
  },
  {
    icon: FileCheck,
    text: "Como solicitar um orçamento sem compromisso?",
  },
];

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Olá! Sou o Assistente Virtual da **PAU PARA TODA OBRA** (WVR Construções & GDM Móveis Planejados).\n\nComo posso ajudar você hoje? Tire suas dúvidas sobre construção, reformas, móveis planejados, assessoria para financiamento Caixa (PCI) e assessoria em leilões!",
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userTime = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg: ChatMessage = {
      id: Date.now().toString() + "-user",
      sender: "user",
      text: query,
      time: userTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      // Prepare conversation history for Gemini
      const history = messages.slice(-8).map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("model" as const),
        text: m.text,
      }));

      const res = await fetch("/api/ai/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, history }),
      });

      const data = await res.json();
      const botTime = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const botMsg: ChatMessage = {
        id: Date.now().toString() + "-bot",
        sender: "bot",
        text:
          data.reply ||
          "Desculpe, tive uma oscilação na resposta. Pode reformular a pergunta ou chamar no WhatsApp (24) 99872-9266?",
        time: botTime,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Erro no chatbot:", err);
      const botTime = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-err",
          sender: "bot",
          text: "Estou enfrentando uma instabilidade na conexão. Se quiser, entre em contato direto pelo WhatsApp: (24) 99872-9266!",
          time: botTime,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const phoneWhatsApp = "5524998729266";
  const whatsappUrl = `https://wa.me/${phoneWhatsApp}?text=${encodeURIComponent(
    "Olá! Estava navegando no site 'PAU PARA TODA OBRA' e gostaria de tirar dúvidas e solicitar um orçamento."
  )}`;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Floating Widget Window */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-[380px] h-[540px] max-h-[80vh] bg-zinc-950 border-2 border-amber-500/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Widget Header */}
          <div className="bg-gradient-to-r from-amber-950 via-zinc-900 to-emerald-950 p-3.5 border-b border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 rounded-xl shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-zinc-950 rounded-full animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-white uppercase tracking-tight">
                    PAU PARA TODA OBRA
                  </h4>
                  <span className="text-[9px] font-bold bg-amber-400 text-zinc-950 px-1.5 py-0.2 rounded uppercase">
                    IA
                  </span>
                </div>
                <p className="text-[10px] text-amber-300 font-medium">
                  WVR Construções • GDM Planejados
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 1 && (
                <button
                  onClick={() =>
                    setMessages([
                      {
                        id: "welcome-reset",
                        sender: "bot",
                        text: "Conversa reiniciada. Como posso te ajudar?",
                        time: new Date().toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                      },
                    ])
                  }
                  className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Limpar conversa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                title="Minimizar"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Contact Banner */}
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-1.5 flex items-center justify-between text-[11px]">
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Respostas instantâneas por IA
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-0.5 rounded flex items-center gap-1 transition-colors shadow-sm"
            >
              <Phone className="w-2.5 h-2.5" />
              WhatsApp Humanizado
            </a>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-zinc-950/80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-amber-500 text-zinc-950 font-medium rounded-tr-none"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1.5 text-right font-mono ${
                      msg.sender === "user"
                        ? "text-zinc-900/70"
                        : "text-zinc-500"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <div className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start items-center text-xs text-amber-400 bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl rounded-tl-none max-w-[75%]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span className="font-semibold text-[11px]">
                  Consultando IA da obra...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Buttons (if conversation is short) */}
          {messages.length <= 2 && !isLoading && (
            <div className="p-2 bg-zinc-900/90 border-t border-zinc-800 space-y-1">
              <p className="text-[10px] text-zinc-400 font-bold px-1 uppercase tracking-wider">
                Perguntas Frequentes:
              </p>
              <div className="grid grid-cols-1 gap-1 max-h-28 overflow-y-auto custom-scrollbar">
                {PRESET_QUESTIONS.map((q) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.text}
                      onClick={() => handleSendMessage(q.text)}
                      className="text-left bg-zinc-950 hover:bg-amber-500/20 border border-zinc-800 hover:border-amber-500/50 p-1.5 rounded-lg text-[11px] text-zinc-300 hover:text-amber-300 transition-all flex items-center gap-1.5 group"
                    >
                      <Icon className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                      <span className="truncate">{q.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida sobre a obra..."
              className="flex-1 bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-zinc-950 font-bold rounded-xl transition-all shadow-md shrink-0"
              title="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-amber-300/80"
        title="Assistente Virtual PAU PARA TODA OBRA"
      >
        {isOpen ? (
          <>
            <X className="w-6 h-6 text-zinc-950" />
            <span className="text-xs uppercase tracking-wide hidden sm:inline">
              Fechar Chat
            </span>
          </>
        ) : (
          <>
            <div className="relative">
              <MessageSquare className="w-6 h-6 fill-zinc-950 text-zinc-950" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 border-2 border-amber-400 rounded-full animate-ping" />
              )}
            </div>

            <div className="flex flex-col text-left">
              <span className="text-xs uppercase tracking-tight font-black leading-none">
                Assistente IA
              </span>
              <span className="text-[9px] text-zinc-900/80 font-bold leading-none mt-0.5">
                Dúvidas & Financiamento
              </span>
            </div>

            <Sparkles className="w-4 h-4 text-zinc-950 animate-bounce" />
          </>
        )}
      </button>
    </div>
  );
};
