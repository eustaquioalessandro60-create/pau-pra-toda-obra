import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  Compass,
  Layers,
  Building2,
  Boxes,
  Trees,
  Wrench,
  Axe,
  ShieldCheck,
  Sun,
  Eye,
  FileText,
  PhoneCall,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Wand2,
  X,
  History,
  Trash2,
  ChevronDown,
  Camera,
  Clock,
  Save,
  Settings,
  DollarSign,
  ShieldAlert,
  AlertTriangle,
  ShoppingBag,
  Radio,
  MapPin,
} from "lucide-react";
import { ThreeCanvas } from "./ThreeCanvas";
import { VoiceGuideModal } from "./ThreeDStudio/VoiceGuideModal";
import { VoiceCommandHistory, VoiceCommandHistoryItem, VoiceCommandHistoryProps } from "./VoiceCommandHistory";
import { ProjectSnapshotManager } from "./ProjectSnapshotManager";
import { AutoSaveSettingsModal } from "./ThreeDStudio/AutoSaveSettingsModal";
import { BudgetControlPanel, calculateEstimatedProjectCost } from "./ThreeDStudio/BudgetControlPanel";
import { FurnitureCartDrawer } from "./ThreeDStudio/FurnitureCartDrawer";
import { FurnitureCatalogSection } from "./ThreeDStudio/FurnitureCatalogSection";
import { CatalogFurnitureItem, FURNITURE_CATALOG } from "./ThreeDStudio/furnitureCatalogData";
export { VoiceGuideModal, VoiceCommandHistory };
export type { VoiceCommandHistoryItem, VoiceCommandHistoryProps };
import { Project3DState, ConstructionStep, MainTab, ProjectStateSnapshot, FurnitureCartItem } from "../types";

interface ThreeDStudioProps {
  projectState: Project3DState;
  setProjectState: React.Dispatch<React.SetStateAction<Project3DState>>;
  setActiveTab: (tab: MainTab) => void;
  isOnline: boolean;
}

export const ThreeDStudio: React.FC<ThreeDStudioProps> = ({
  projectState,
  setProjectState,
  setActiveTab,
  isOnline,
}) => {
  const [viewMode, setViewMode] = useState<"exterior" | "interior" | "topdown">("exterior");
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiStatusMessage, setAiStatusMessage] = useState<string | null>(null);
  const [proMode, setProMode] = useState(false);
  const [isParsingVoice, setIsParsingVoice] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "processing" | "success" | "error">("idle");
  const voiceStatusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerVoiceStatus = (
    status: "idle" | "listening" | "processing" | "success" | "error",
    autoResetMs?: number
  ) => {
    if (voiceStatusTimeoutRef.current) {
      clearTimeout(voiceStatusTimeoutRef.current);
      voiceStatusTimeoutRef.current = null;
    }
    setVoiceStatus(status);
    if (autoResetMs) {
      voiceStatusTimeoutRef.current = setTimeout(() => {
        setVoiceStatus("idle");
      }, autoResetMs);
    }
  };
  const [showVoiceGuide, setShowVoiceGuide] = useState(false);
  const [voiceGuideInitialTab, setVoiceGuideInitialTab] = useState<"tour" | "dictionary">("tour");
  const [showSnapshotManager, setShowSnapshotManager] = useState(false);
  const [showAutoSaveSettingsModal, setShowAutoSaveSettingsModal] = useState(false);
  const [settingsModalTab, setSettingsModalTab] = useState<"autosave" | "geolocation">("autosave");
  const [showFurnitureCartDrawer, setShowFurnitureCartDrawer] = useState(false);

  // 🛒 SHOPPING CART / LISTA DE COMPRAS GLOBAL
  const [cartItems, setCartItems] = useState<FurnitureCartItem[]>(() => {
    try {
      const saved = localStorage.getItem("universo_adas_furniture_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Erro ao carregar carrinho de mobília:", e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("universo_adas_furniture_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Erro ao salvar carrinho de mobília:", e);
    }
  }, [cartItems]);

  const handleAddToCart = (catalogItem: CatalogFurnitureItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === catalogItem.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1,
        };
        return updated;
      } else {
        const newItem: FurnitureCartItem = {
          id: catalogItem.id,
          name: catalogItem.name,
          category: catalogItem.category,
          price: catalogItem.price,
          dimensions: catalogItem.dimensions,
          quantity: 1,
          is3dPositioned: true,
          addedAt: new Date().toISOString(),
        };
        return [newItem, ...prev];
      }
    });

    if (catalogItem.projectStateKey) {
      const { group, field } = catalogItem.projectStateKey;
      setProjectState((p) => {
        const next = { ...p };
        if (group === "furniture") {
          next.furniture = { ...next.furniture, [field]: true };
        } else if (group === "gourmet") {
          next.gourmet = { ...next.gourmet, hasGourmet: true, [field]: true };
        } else if (group === "pool") {
          next.pool = { ...next.pool, hasPool: true };
        }
        return next;
      });
    }

    setAutoSaveToast(`Objeto #${catalogItem.id} adicionado ao carrinho de compras!`);
    setTimeout(() => setAutoSaveToast(null), 4000);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = (item.quantity || 1) + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as FurnitureCartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setAutoSaveToast(`Item #${id} removido do carrinho.`);
    setTimeout(() => setAutoSaveToast(null), 3000);
  };

  const handleClearCart = () => {
    setCartItems([]);
    setAutoSaveToast("Carrinho de compras limpo.");
    setTimeout(() => setAutoSaveToast(null), 3000);
  };

  const handleSyncCartTo3D = () => {
    FURNITURE_CATALOG.forEach((catItem) => {
      if (cartItems.some((c) => c.id === catItem.id) && catItem.projectStateKey) {
        const { group, field } = catItem.projectStateKey;
        setProjectState((p) => {
          const next = { ...p };
          if (group === "furniture") {
            next.furniture = { ...next.furniture, [field]: true };
          } else if (group === "gourmet") {
            next.gourmet = { ...next.gourmet, hasGourmet: true, [field]: true };
          } else if (group === "pool") {
            next.pool = { ...next.pool, hasPool: true };
          }
          return next;
        });
      }
    });
    setAutoSaveToast("Cenário 3D sincronizado com os itens do carrinho!");
    setTimeout(() => setAutoSaveToast(null), 4000);
  };

  // ⏱️ SISTEMA DE AGENDAMENTO DE SNAPSHOTS AUTOMÁTICOS (CONFIGURÁVEL: 15, 30 ou 60 MINUTOS)
  const [autoSaveMinutes, setAutoSaveMinutes] = useState<number>(() => {
    const saved = localStorage.getItem("universo_adas_autosave_minutes");
    return saved ? parseInt(saved, 10) || 30 : 30;
  });

  const [autoSaveDestination, setAutoSaveDestination] = useState<"localStorage" | "download">(() => {
    const saved = localStorage.getItem("universo_adas_autosave_destination");
    return saved === "download" ? "download" : "localStorage";
  });

  const [autoSaveSecondsLeft, setAutoSaveSecondsLeft] = useState<number>(autoSaveMinutes * 60);
  const [autoSaveToast, setAutoSaveToast] = useState<string | null>(null);

  // Refs for timer callback consistency
  const projectStateRef = React.useRef(projectState);
  useEffect(() => {
    projectStateRef.current = projectState;
  }, [projectState]);

  const autoSaveMinutesRef = React.useRef(autoSaveMinutes);
  useEffect(() => {
    autoSaveMinutesRef.current = autoSaveMinutes;
    localStorage.setItem("universo_adas_autosave_minutes", autoSaveMinutes.toString());
  }, [autoSaveMinutes]);

  const autoSaveDestinationRef = React.useRef(autoSaveDestination);
  useEffect(() => {
    autoSaveDestinationRef.current = autoSaveDestination;
    localStorage.setItem("universo_adas_autosave_destination", autoSaveDestination);
  }, [autoSaveDestination]);

  // When autoSaveMinutes changes, reset timer
  const handleSetAutoSaveMinutes = (minutes: number) => {
    setAutoSaveMinutes(minutes);
    setAutoSaveSecondsLeft(minutes * 60);
  };

  const triggerAutoSaveSnapshot = () => {
    try {
      const currentState = projectStateRef.current;
      const minutes = autoSaveMinutesRef.current;
      const dest = autoSaveDestinationRef.current;
      const now = new Date();
      const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

      const newSnap: ProjectStateSnapshot = {
        id: `auto-snap-${now.getTime()}`,
        name: `⚡ Auto-Save (${minutes}m) - ${timeStr}`,
        createdAt: now.toISOString(),
        note: `Salvamento automático periódico do estúdio 3D. Modo: ${dest === "localStorage" ? "LocalStorage" : "Download Direto"}. Etapa: ${currentState.step.toUpperCase()}`,
        state: JSON.parse(JSON.stringify(currentState)),
      };

      if (dest === "localStorage") {
        const STORAGE_KEY = "universo_adas_project_snapshots";
        const existingStr = localStorage.getItem(STORAGE_KEY);
        let snapshots: ProjectStateSnapshot[] = [];
        if (existingStr) {
          try {
            const parsed = JSON.parse(existingStr);
            if (Array.isArray(parsed)) snapshots = parsed;
          } catch (e) {
            console.error(e);
          }
        }

        const updated = [newSnap, ...snapshots].slice(0, 30);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        setAutoSaveToast(`Auto-Save (${minutes}m) salvo no LocalStorage às ${timeStr}!`);
      } else {
        // Direct browser file download
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newSnap, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute(
          "download",
          `backup_universo_adas_3d_${now.toISOString().slice(0, 10)}_${now.getTime()}.json`
        );
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        setAutoSaveToast(`Backup automático (${minutes}m) baixado em .json às ${timeStr}!`);
      }

      setTimeout(() => setAutoSaveToast(null), 5000);
    } catch (e) {
      console.error("Erro ao realizar Auto-Save:", e);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoSaveSecondsLeft((prev) => {
        if (prev <= 1) {
          triggerAutoSaveSnapshot();
          return autoSaveMinutesRef.current * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatAutoSaveTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };
  const [commandHistory, setCommandHistory] = useState<
    Array<{ id: string; command: string; timestamp: string; isEdited?: boolean }>
  >([
    {
      id: "cmd-init-1",
      command: "Adicionar piscina de borda infinita e área gourmet",
      timestamp: "14:10",
    },
  ]);

  const addCommandToHistory = (cmdText: string) => {
    if (!cmdText || cmdText.trim() === "" || cmdText === "Ouvindo seu comando em português...") return;
    const timeStr = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      command: cmdText.trim(),
      timestamp: timeStr,
    };
    setCommandHistory((prev) => {
      if (prev.length > 0 && prev[0].command.trim().toLowerCase() === cmdText.trim().toLowerCase()) {
        return prev;
      }
      return [newItem, ...prev].slice(0, 10);
    });
  };

  const handleEditCommandHistory = (id: string, newCommand: string) => {
    setCommandHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, command: newCommand, isEdited: true } : item
      )
    );
  };

  const handleDeleteCommandHistory = (id: string) => {
    setCommandHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const phoneWhatsApp = "5524998729266";

  // Calculate terrain total area and budget status
  const terrainArea = (projectState.terrain.width || 10) * (projectState.terrain.length || 20);
  const { total: currentCost } = calculateEstimatedProjectCost(projectState);
  const maxBudget = projectState.maxBudget || 200000;
  const isOverBudget = currentCost > maxBudget;
  const budgetDiff = currentCost - maxBudget;

  // Steps definition
  const stepsList: { id: ConstructionStep; label: string; number: string }[] = [
    { id: "terreno", label: "Terreno & Esquadro", number: "1" },
    { id: "fundacao", label: "Fundação", number: "2" },
    { id: "paredes", label: "Paredes & Fachada", number: "3" },
    { id: "esquadrias", label: "Portas & Janelas", number: "4" },
    { id: "telhado", label: "Telhado", number: "5" },
    { id: "decoracao", label: "Planejados & Lazer", number: "6" },
    { id: "orcamento", label: "Teto de Orçamento", number: "7" },
  ];

  // Ref for speech recognition transcript to avoid closure staleness
  const transcriptRef = useRef(transcript);
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Speech Recognition setup (Web Speech API)
  const handleToggleVoiceCommand = () => {
    const windowObj = window as any;
    const SpeechRecognition =
      windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Navegador sem suporte direto à Web Speech API. Digite seu comando na caixa de texto.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      triggerVoiceStatus("idle");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "pt-BR";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("Ouvindo seu comando em português...");
        transcriptRef.current = "Ouvindo seu comando em português...";
        triggerVoiceStatus("listening");
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultText = event.results[current][0].transcript;
        setTranscript(resultText);
        transcriptRef.current = resultText;
        triggerVoiceStatus("listening");
      };

      recognition.onerror = (event: any) => {
        console.error("Erro no reconhecimento de voz:", event.error);
        setIsListening(false);
        triggerVoiceStatus("error", 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
        const speechText = transcriptRef.current;
        if (
          speechText &&
          speechText !== "Ouvindo seu comando em português..." &&
          speechText.trim() !== ""
        ) {
          triggerVoiceStatus("processing");
          processVoiceCommand(speechText);
        } else {
          triggerVoiceStatus("idle");
        }
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
      triggerVoiceStatus("error", 3500);
    }
  };

  // Process voice command with AI endpoint or local fallback regex
  const processVoiceCommand = async (cmdText: string) => {
    setIsParsingVoice(true);
    triggerVoiceStatus("processing");
    setAiStatusMessage("Interpretando comando de voz com IA...");
    addCommandToHistory(cmdText);

    try {
      if (isOnline) {
        const res = await fetch("/api/ai/parse-voice-command", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command: cmdText }),
        });

        const data = await res.json();
        if (data.parsed && Object.keys(data.parsed).length > 0) {
          applyParsedDataToState(data.parsed);
          setAiStatusMessage(data.parsed.actionMessage || "Projeto 3D atualizado via IA!");
          setIsParsingVoice(false);
          triggerVoiceStatus("success", 4500);
          return;
        }
      }
    } catch (err) {
      console.log("Servidor IA indisponível. Usando interpretação local por palavras-chave.", err);
    }

    // Local Fallback Parser
    applyLocalFallback(cmdText);
    setIsParsingVoice(false);
    triggerVoiceStatus("success", 4500);
  };

  const applyParsedDataToState = (parsed: any) => {
    setProjectState((prev) => {
      const next = { ...prev };
      if (parsed.width) next.terrain.width = Number(parsed.width);
      if (parsed.length) next.terrain.length = Number(parsed.length);
      if (parsed.step) next.step = parsed.step;
      if (parsed.hasFoundation !== undefined) next.hasFoundation = Boolean(parsed.hasFoundation);
      if (parsed.wallColor) next.wallColor = parsed.wallColor;
      if (parsed.wallMaterial) next.wallMaterial = parsed.wallMaterial;
      if (parsed.roofType) next.roofType = parsed.roofType;
      if (parsed.hasPool !== undefined) next.pool.hasPool = Boolean(parsed.hasPool);
      if (parsed.poolType) next.pool.type = parsed.poolType;
      if (parsed.hasGourmet !== undefined) next.gourmet.hasGourmet = Boolean(parsed.hasGourmet);
      if (parsed.lighting) next.lighting.preset = parsed.lighting;

      if (parsed.furniture) {
        next.furniture = { ...next.furniture, ...parsed.furniture };
      }
      return next;
    });
  };

  const applyLocalFallback = (cmdText: string) => {
    const lower = cmdText.toLowerCase();
    let msg = "Comando de voz aplicado: ";

    setProjectState((prev) => {
      const next = { ...prev };

      // 1. ADICIONAR MESA / MESA DE JANTAR / MESA DE SINUCA
      if (lower.includes("mesa")) {
        if (lower.includes("sinuca")) {
          next.gourmet = { ...next.gourmet, hasGourmet: true, mesaSinuca: true };
          msg += "Mesa de sinuca adicionada na área gourmet. ";
        } else {
          next.furniture = {
            ...next.furniture,
            mesaJantar: true,
            cozinha: true,
            salaTV: true,
          };
          msg += "Mesa de jantar e ambiente de refeições adicionados ao 3D. ";
        }
      }

      // 2. MOVER POLTRONA / MOVER SOFÁ / POLTRONA / MOVER MÓVEL
      if (
        lower.includes("poltrona") ||
        lower.includes("sofá") ||
        lower.includes("sofa") ||
        lower.includes("mover") ||
        lower.includes("deslocar") ||
        lower.includes("reposicionar")
      ) {
        const currentOffset = prev.furniture?.poltronaOffset || 0;
        next.furniture = {
          ...next.furniture,
          salaTV: true,
          sofaPoltrona: true,
          poltronaOffset: currentOffset + 1,
        };
        msg += `Poltrona e estofados reposicionados na sala 3D (Posição #${currentOffset + 2}). `;
      }

      // 3. MUDAR COR DA PAREDE
      if (
        lower.includes("cor") ||
        lower.includes("parede") ||
        lower.includes("pintar") ||
        lower.includes("mudar cor")
      ) {
        if (lower.includes("azul")) {
          next.wallColor = "#3b82f6";
          msg += "Cor da parede alterada para azul moderno. ";
        } else if (lower.includes("verde")) {
          next.wallColor = "#22c55e";
          msg += "Cor da parede alterada para verde botânico. ";
        } else if (lower.includes("amarelo") || lower.includes("amarela") || lower.includes("dourado")) {
          next.wallColor = "#eab308";
          msg += "Cor da parede alterada para amarelo ensolarado. ";
        } else if (lower.includes("vermelho") || lower.includes("vermelha") || lower.includes("terracota")) {
          next.wallColor = "#ef4444";
          msg += "Cor da parede alterada para vermelho terracota. ";
        } else if (lower.includes("bege") || lower.includes("creme") || lower.includes("areia")) {
          next.wallColor = "#f5f5dc";
          msg += "Cor da parede alterada para bege clássico. ";
        } else if (lower.includes("branco") || lower.includes("branca") || lower.includes("claro")) {
          next.wallColor = "#ffffff";
          msg += "Cor da parede alterada para branco puro. ";
        } else if (lower.includes("preto") || lower.includes("preta") || lower.includes("escuro") || lower.includes("grafite")) {
          next.wallColor = "#18181b";
          msg += "Cor da parede alterada para tom escuro/grafite modernista. ";
        } else if (lower.includes("cinza") || lower.includes("cinzento")) {
          next.wallColor = "#6b7280";
          msg += "Cor da parede alterada para cinza urbano. ";
        } else if (lower.includes("rosa") || lower.includes("rosado")) {
          next.wallColor = "#ec4899";
          msg += "Cor da parede alterada para rosa suave. ";
        } else if (lower.includes("roxo") || lower.includes("violeta")) {
          next.wallColor = "#8b5cf6";
          msg += "Cor da parede alterada para roxo sofisticado. ";
        } else if (lower.includes("laranja")) {
          next.wallColor = "#f97316";
          msg += "Cor da parede alterada para laranja vibrante. ";
        } else if (lower.includes("marrom")) {
          next.wallColor = "#78350f";
          msg += "Cor da parede alterada para marrom amadeirado. ";
        }
      }

      // 4. TEXTURAS E MATERIAIS
      if (lower.includes("tijolo")) {
        next.wallMaterial = "tijolo";
        msg += "Textura de tijolo rústico aplicada. ";
      } else if (lower.includes("madeira")) {
        next.wallMaterial = "madeira";
        msg += "Textura de madeira de demolição aplicada. ";
      } else if (lower.includes("concreto")) {
        next.wallMaterial = "concreto";
        msg += "Textura de concreto aparente aplicada. ";
      } else if (lower.includes("pedra")) {
        next.wallMaterial = "pedra";
        msg += "Textura de pedra natural aplicada. ";
      }

      // 5. PISCINA E LAZER
      if (lower.includes("piscina") || lower.includes("borda infinita")) {
        next.pool.hasPool = true;
        if (lower.includes("borda infinita")) next.pool.type = "borda_infinita";
        msg += "Piscina ativada no projeto. ";
      }

      // 6. ÁREA GOURMET E CHURRASQUEIRA
      if (lower.includes("gourmet") || lower.includes("churrasqueira") || lower.includes("pergolado")) {
        next.gourmet.hasGourmet = true;
        if (lower.includes("churrasqueira")) next.gourmet.churrasqueira = true;
        if (lower.includes("pergolado")) next.gourmet.pergolado = true;
        msg += "Área Gourmet configurada. ";
      }

      // 7. MÓVEIS PLANEJADOS GDM (OUTROS CÔMODOS)
      if (
        lower.includes("armário") ||
        lower.includes("armario") ||
        lower.includes("quarto") ||
        lower.includes("closet") ||
        lower.includes("cozinha")
      ) {
        next.furniture = {
          ...next.furniture,
          cozinha: true,
          quartoCasal: true,
        };
        msg += "Móveis planejados GDM adicionados. ";
      }

      // 8. ALTURA DO PÉ-DIREITO
      if (lower.includes("pé-direito") || lower.includes("pe direito") || lower.includes("3.5m") || lower.includes("3,5m")) {
        next.wallHeight = 3.5;
        msg += "Pé-direito ajustado para 3.5m. ";
      }

      // 9. ILUMINAÇÃO
      if (lower.includes("noite") || lower.includes("spot") || lower.includes("luz")) {
        next.lighting.preset = "noite_spots";
        msg += "Iluminação noturna com spots acesa. ";
      } else if (lower.includes("pôr do sol") || lower.includes("por do sol") || lower.includes("tarde")) {
        next.lighting.preset = "por_do_sol";
        msg += "Iluminação de pôr do sol aplicada. ";
      } else if (lower.includes("dia") || lower.includes("sol")) {
        next.lighting.preset = "dia";
        msg += "Iluminação diurna configurada. ";
      }

      // 10. TELHADO
      if (lower.includes("telhado colonial")) {
        next.roofType = "colonial";
        msg += "Telhado colonial ativado. ";
      } else if (lower.includes("telhado flat") || lower.includes("platibanda")) {
        next.roofType = "flat";
        msg += "Telhado flat/platibanda ativado. ";
      }

      return next;
    });

    setAiStatusMessage(msg);
  };

  const handleQuickCommand = (text: string) => {
    setTranscript(text);
    processVoiceCommand(text);
  };

  return (
    <section className="py-8 bg-zinc-900 text-white min-h-screen border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Modelador Interativo 3D com Comando de Voz</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              PROJETOR <span className="text-amber-400">DO TERRENO À CHAVE</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Fale ou ajuste os controles abaixo para ver sua obra e móveis planejados se realizarem em 3D.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 🛒 WIDGET CARRINHO DE COMPRAS DE MOBÍLIA */}
            <button
              onClick={() => setShowFurnitureCartDrawer(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 bg-zinc-950/90 border border-amber-500/60 text-amber-300 hover:text-white rounded-xl shadow-lg transition-all hover:scale-105"
              title="Abrir carrinho de compras de mobília e ver o custo total dos itens posicionados"
            >
              <div className="p-1 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 relative">
                <ShoppingBag className="w-4 h-4" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-zinc-950 font-mono font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItems.reduce((a, b) => a + (b.quantity || 1), 0)}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">
                  Carrinho ({cartItems.reduce((a, b) => a + (b.quantity || 1), 0)})
                </span>
                <span className="text-xs font-mono font-black text-white">
                  R${" "}
                  {cartItems
                    .reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)
                    .toLocaleString("pt-BR")}
                </span>
              </div>
            </button>

            {/* 💰 WIDGET DE STATUS DO ORÇAMENTO DO PROJETO */}
            <button
              onClick={() => {
                setProjectState((p) => ({ ...p, step: "orcamento" }));
                setMobileControlsOpen(true);
              }}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl shadow-lg border transition-all hover:scale-105 ${
                isOverBudget
                  ? "bg-red-950/90 border-red-500 text-red-200 animate-pulse"
                  : "bg-zinc-950/90 border-emerald-500/60 text-emerald-300"
              }`}
              title="Clique para abrir e gerenciar o Teto de Orçamento do Projeto"
            >
              <div
                className={`p-1 rounded-lg shrink-0 ${
                  isOverBudget
                    ? "bg-red-500/20 text-red-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {isOverBudget ? (
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                ) : (
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider ${
                      isOverBudget ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {isOverBudget ? "Orçamento Excedido!" : "Orçamento em Dia"}
                  </span>
                </div>
                <span className="text-xs font-mono font-black text-white">
                  R$ {currentCost.toLocaleString("pt-BR")}{" "}
                  <span className="text-[10px] text-zinc-400 font-normal">
                    / R$ {(maxBudget / 1000).toFixed(0)}k
                  </span>
                </span>
              </div>
            </button>

            {/* ⏱️ WIDGET AGENDAMENTO DE AUTO-SAVE CONFIGURÁVEL */}
            <div className="flex items-center gap-2 bg-zinc-950/90 border border-amber-500/50 px-3 py-1.5 rounded-xl shadow-lg">
              <div className="p-1 bg-amber-500/20 text-amber-400 rounded-lg animate-pulse shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">
                    Auto-Save {autoSaveMinutes}m
                  </span>
                  <span className="text-[8px] font-mono px-1 rounded bg-zinc-800 text-amber-300 font-bold border border-zinc-700 uppercase">
                    {autoSaveDestination === "localStorage" ? "Storage" : "Download"}
                  </span>
                </div>
                <span className="text-xs font-mono font-black text-white">
                  {formatAutoSaveTime(autoSaveSecondsLeft)}
                </span>
              </div>
              <button
                onClick={() => {
                  triggerAutoSaveSnapshot();
                  setAutoSaveSecondsLeft(autoSaveMinutes * 60);
                }}
                className="ml-1 px-2 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 hover:text-white border border-amber-500/40 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 hover:scale-105"
                title={`Forçar salvamento do snapshot agora e reiniciar temporizador (${autoSaveMinutes} min)`}
              >
                <Save className="w-3 h-3 text-amber-400" />
                <span>Salvar Já</span>
              </button>
              <button
                onClick={() => {
                  setSettingsModalTab("autosave");
                  setShowAutoSaveSettingsModal(true);
                }}
                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 border border-zinc-700 rounded-lg transition-all hover:scale-105"
                title="Configurações de Auto-Save, Backup e Alertas"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setSettingsModalTab("geolocation");
                  setShowAutoSaveSettingsModal(true);
                }}
                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 border border-zinc-700 rounded-lg transition-all hover:scale-105 flex items-center gap-1.5 px-2"
                title="Alertas de Geolocalização (Avisos Push ao Chegar Perto da Obra)"
              >
                <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-amber-300 hidden sm:inline">Alertas GPS</span>
              </button>
            </div>

            <button
              onClick={() => setShowSnapshotManager(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg hover:scale-105"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>Controle de Versões (Snapshots)</span>
            </button>
            <button
              onClick={() => setActiveTab("realidade_aumentada")}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-zinc-950 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg hover:scale-105"
            >
              <Camera className="w-4 h-4 stroke-[2.5]" />
              <span>Câmera RA (Móveis no Seu Espaço)</span>
            </button>
            <button
              onClick={() => {
                setVoiceGuideInitialTab("tour");
                setShowVoiceGuide(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-zinc-950 font-black rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg hover:scale-105"
            >
              <Compass className="w-4 h-4 stroke-[2.5]" />
              <span>Tour Interativo de Voz</span>
            </button>
            <button
              onClick={() => {
                setVoiceGuideInitialTab("dictionary");
                setShowVoiceGuide(true);
              }}
              className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-md hover:scale-105"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Comandos</span>
            </button>
            <button
              onClick={() => setProMode(!proMode)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${
                proMode
                  ? "bg-emerald-500 text-zinc-950 border-emerald-400 font-extrabold"
                  : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Modo Profissional (Arquitetos/Decoradores)</span>
            </button>
          </div>
        </div>

        {/* 🗣️ VOICE COMMAND BANNER */}
        <div className="bg-gradient-to-r from-amber-950/80 via-zinc-900 to-emerald-950/80 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-6 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={handleToggleVoiceCommand}
                disabled={isParsingVoice}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-xl transition-all relative ${
                  voiceStatus === "listening"
                    ? "bg-red-600 text-white animate-bounce shadow-[0_0_35px_rgba(239,68,68,0.9)] ring-4 ring-red-400/60"
                    : voiceStatus === "processing"
                    ? "bg-sky-500 text-zinc-950 animate-pulse shadow-[0_0_35px_rgba(14,165,233,0.9)] ring-4 ring-sky-300/60"
                    : voiceStatus === "success"
                    ? "bg-emerald-500 text-zinc-950 shadow-[0_0_35px_rgba(34,197,94,0.9)] ring-4 ring-emerald-300/60 scale-105"
                    : "bg-amber-400 text-zinc-950 hover:bg-amber-300 hover:scale-105"
                }`}
                title="Clique e Fale seu Comando de Voz"
              >
                {/* Aura Ring Indicator */}
                {(voiceStatus === "listening" || voiceStatus === "processing" || voiceStatus === "success") && (
                  <span
                    className={`absolute inset-0 rounded-2xl animate-ping opacity-75 ${
                      voiceStatus === "listening"
                        ? "bg-red-500"
                        : voiceStatus === "processing"
                        ? "bg-sky-400"
                        : "bg-emerald-400"
                    }`}
                  ></span>
                )}

                <div className="relative z-10">
                  {voiceStatus === "listening" ? (
                    <MicOff className="w-8 h-8 text-white" />
                  ) : voiceStatus === "processing" ? (
                    <Wand2 className="w-8 h-8 text-zinc-950 animate-spin" />
                  ) : voiceStatus === "success" ? (
                    <CheckCircle2 className="w-8 h-8 text-zinc-950 stroke-[2.5]" />
                  ) : (
                    <Mic className="w-8 h-8 text-zinc-950" />
                  )}
                </div>
              </button>

              <div className="flex-1">
                <div className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <Wand2 className="w-4 h-4 text-amber-400" />
                    <span>Comando por Voz Inteligente (Fale em Português)</span>
                  </div>

                  {/* Glowing Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      voiceStatus === "listening"
                        ? "bg-red-500/20 text-red-300 border border-red-500/50 animate-pulse"
                        : voiceStatus === "processing"
                        ? "bg-sky-500/20 text-sky-300 border border-sky-500/50 animate-pulse"
                        : voiceStatus === "success"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-extrabold shadow-[0_0_12px_rgba(34,197,94,0.5)]"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        voiceStatus === "listening"
                          ? "bg-red-400 animate-ping"
                          : voiceStatus === "processing"
                          ? "bg-sky-400 animate-ping"
                          : voiceStatus === "success"
                          ? "bg-emerald-400"
                          : "bg-zinc-500"
                      }`}
                    ></span>
                    {voiceStatus === "listening" && "Ouvindo Voz..."}
                    {voiceStatus === "processing" && "Processando IA..."}
                    {voiceStatus === "success" && "Comando Processado!"}
                    {voiceStatus === "idle" && "Pronto para Ouvir"}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  {transcript || "Ex: 'Adicionar piscina de borda infinita com área gourmet e móveis na cozinha'"}
                </div>
                {aiStatusMessage && (
                  <div className={`text-xs mt-1 font-bold flex items-center gap-1 transition-colors ${
                    voiceStatus === "success" ? "text-emerald-300 font-black text-sm" : "text-emerald-400"
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{aiStatusMessage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap gap-2 text-xs font-bold shrink-0 items-center">
              <button
                onClick={() => {
                  setVoiceGuideInitialTab("tour");
                  setShowVoiceGuide(true);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black border border-amber-400 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md hover:scale-105"
              >
                <Compass className="w-4 h-4 stroke-[2.5]" />
                <span>Tour Guiado por Voz</span>
              </button>
              <button
                onClick={() => {
                  setVoiceGuideInitialTab("dictionary");
                  setShowVoiceGuide(true);
                }}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-md hover:scale-105"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Guia Completo</span>
              </button>
              <button
                onClick={() => handleQuickCommand("Adicionar mesa")}
                className="bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-colors"
              >
                + Adicionar Mesa
              </button>
              <button
                onClick={() => handleQuickCommand("Mover poltrona")}
                className="bg-zinc-800 hover:bg-zinc-700 text-sky-300 border border-sky-500/30 px-3 py-1.5 rounded-xl transition-colors"
              >
                ⇄ Mover Poltrona
              </button>
              <button
                onClick={() => handleQuickCommand("Mudar cor da parede para azul")}
                className="bg-zinc-800 hover:bg-zinc-700 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-xl transition-colors"
              >
                🎨 Parede Azul
              </button>
              <button
                onClick={() => handleQuickCommand("Adicionar piscina de borda infinita e área gourmet")}
                className="bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-colors"
              >
                + Piscina Infinita
              </button>
              <button
                onClick={() => handleQuickCommand("Colocar móveis planejados GDM na cozinha e quarto")}
                className="bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl transition-colors"
              >
                + Planejados GDM
              </button>
              <button
                onClick={() => handleQuickCommand("Ativar iluminação noturna com spots e lustres")}
                className="bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-colors"
              >
                + Luz Noturna
              </button>
            </div>
          </div>

          {/* 📜 HISTÓRICO DE COMANDOS DE VOZ RECENTES */}
          <VoiceCommandHistory
            history={commandHistory}
            onReapplyCommand={handleQuickCommand}
            onEditCommand={handleEditCommandHistory}
            onDeleteCommand={handleDeleteCommandHistory}
            onClearHistory={() => setCommandHistory([])}
            onAddCustomCommand={handleQuickCommand}
          />
        </div>

        {/* STEP-BY-STEP WIZARD BAR */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {stepsList.map((st) => {
            const isActive = projectState.step === st.id;
            return (
              <button
                key={st.id}
                onClick={() => {
                  setProjectState((prev) => ({ ...prev, step: st.id }));
                  setMobileControlsOpen(true);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-amber-400 text-zinc-950 border-amber-400 shadow-lg scale-105"
                    : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isActive ? "bg-zinc-950 text-amber-400" : "bg-zinc-700 text-white"
                  }`}
                >
                  {st.number}
                </span>
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>

        {/* 📱 MOBILE EXPANDABLE EDITING MENU TRIGGER (< 768px) */}
        <div className="md:hidden mb-6">
          <button
            type="button"
            onClick={() => setMobileControlsOpen(!mobileControlsOpen)}
            className="w-full bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border-2 border-amber-500/50 hover:border-amber-400 p-3.5 rounded-2xl flex items-center justify-between text-left transition-all shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Menu de Edição & Parâmetros
                </div>
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>
                    Passo {stepsList.find((s) => s.id === projectState.step)?.number}:{" "}
                    {stepsList.find((s) => s.id === projectState.step)?.label}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-amber-400 text-zinc-950 font-black text-xs px-3 py-2 rounded-xl shadow shrink-0">
              <span>{mobileControlsOpen ? "Ocultar Controles" : "Abrir Controles"}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  mobileControlsOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* MAIN STUDIO GRID: 3D CANVAS + CONTROL PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 3D CANVAS VIEWPORT (8 Columns) */}
          <div className="lg:col-span-8 space-y-4 relative">
            <div className="relative">
              <ThreeCanvas projectState={projectState} viewMode={viewMode} />

              {/* 🎤 INDICADOR VISUAL PULSANTE DE RECONHECIMENTO DE FALA & CONFIRMAÇÃO DE COMANDO DE VOZ */}
              {voiceStatus !== "idle" && (
                <div className="absolute top-4 left-4 z-30 pointer-events-none transition-all duration-300 transform animate-in fade-in slide-in-from-top-3">
                  <div
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl border-2 backdrop-blur-md shadow-2xl transition-all duration-300 ${
                      voiceStatus === "listening"
                        ? "bg-red-950/90 border-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.8)] animate-pulse"
                        : voiceStatus === "processing"
                        ? "bg-sky-950/90 border-sky-400 text-sky-100 shadow-[0_0_30px_rgba(14,165,233,0.8)] animate-pulse"
                        : voiceStatus === "success"
                        ? "bg-emerald-950/95 border-emerald-400 text-emerald-100 shadow-[0_0_35px_rgba(34,197,94,0.9)] scale-105"
                        : "bg-rose-950/90 border-rose-500 text-rose-100 shadow-[0_0_30px_rgba(244,63,94,0.8)]"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold shadow-lg ${
                        voiceStatus === "listening"
                          ? "bg-red-600 text-white animate-bounce"
                          : voiceStatus === "processing"
                          ? "bg-sky-500 text-zinc-950 animate-spin"
                          : voiceStatus === "success"
                          ? "bg-emerald-500 text-zinc-950 animate-bounce scale-110"
                          : "bg-rose-600 text-white"
                      }`}
                    >
                      {voiceStatus === "listening" && <Mic className="w-5 h-5 text-white" />}
                      {voiceStatus === "processing" && <Wand2 className="w-5 h-5 text-zinc-950" />}
                      {voiceStatus === "success" && <CheckCircle2 className="w-5 h-5 text-zinc-950 stroke-[2.5]" />}
                      {voiceStatus === "error" && <AlertCircle className="w-5 h-5 text-white" />}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        {voiceStatus === "listening" && (
                          <>
                            <span className="text-xs font-black uppercase tracking-wider text-red-300">
                              Reconhecimento de Voz Ativo
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="w-1 h-3 bg-red-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                              <span className="w-1 h-4 bg-red-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                              <span className="w-1 h-2 bg-red-400 rounded-full animate-bounce"></span>
                            </div>
                          </>
                        )}

                        {voiceStatus === "processing" && (
                          <span className="text-xs font-black uppercase tracking-wider text-sky-300">
                            Processando IA do Comando...
                          </span>
                        )}

                        {voiceStatus === "success" && (
                          <span className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                            Comando Detectado e Processado com Sucesso!
                          </span>
                        )}

                        {voiceStatus === "error" && (
                          <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                            Falha no Reconhecimento
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-semibold text-zinc-200 max-w-xs truncate">
                        {voiceStatus === "listening"
                          ? transcript || "Ouvindo seu comando em português..."
                          : voiceStatus === "processing"
                          ? "Interpretando e aplicando alterações..."
                          : voiceStatus === "success"
                          ? aiStatusMessage || "Projeto 3D atualizado!"
                          : "Por favor, tente falar novamente."}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Toolbar Controls */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              {/* View Angles */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-zinc-400">Ângulo de Visão:</span>
                <button
                  onClick={() => setViewMode("exterior")}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    viewMode === "exterior"
                      ? "bg-amber-500 text-zinc-950 border-amber-400"
                      : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800"
                  }`}
                >
                  360° Exterior
                </button>
                <button
                  onClick={() => setViewMode("interior")}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    viewMode === "interior"
                      ? "bg-amber-500 text-zinc-950 border-amber-400"
                      : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800"
                  }`}
                >
                  Por Dentro
                </button>
                <button
                  onClick={() => setViewMode("topdown")}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    viewMode === "topdown"
                      ? "bg-amber-500 text-zinc-950 border-amber-400"
                      : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800"
                  }`}
                >
                  Planta Alta
                </button>
              </div>

              {/* Lighting Presets */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-zinc-400">Iluminação:</span>
                <button
                  onClick={() =>
                    setProjectState((p) => ({
                      ...p,
                      lighting: { ...p.lighting, preset: "dia" },
                    }))
                  }
                  className={`p-2 rounded-lg border ${
                    projectState.lighting.preset === "dia"
                      ? "bg-amber-400 text-zinc-950 border-amber-300"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800"
                  }`}
                  title="Luz do Dia"
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setProjectState((p) => ({
                      ...p,
                      lighting: { ...p.lighting, preset: "por_do_sol" },
                    }))
                  }
                  className={`p-2 rounded-lg border ${
                    projectState.lighting.preset === "por_do_sol"
                      ? "bg-amber-400 text-zinc-950 border-amber-300"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800"
                  }`}
                  title="Pôr do Sol"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setProjectState((p) => ({
                      ...p,
                      lighting: { ...p.lighting, preset: "noite_spots" },
                    }))
                  }
                  className={`p-2 rounded-lg border ${
                    projectState.lighting.preset === "noite_spots"
                      ? "bg-amber-400 text-zinc-950 border-amber-300"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800"
                  }`}
                  title="Noite com Spots"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setActiveTab("orcamento")}
                className="flex-1 py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5 text-zinc-950" />
                <span>GERAR ORÇAMENTO COM ESTE PROJETO</span>
              </button>

              <a
                href={`https://wa.me/${phoneWhatsApp}?text=Olá!%20Acabei%20de%20montar%20meu%20projeto%20no%20Projetor%203D%20do%20site%20(${terrainArea}m²%20de%20terreno)%20e%20gostaria%20de%20um%20orçamento!`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-5 h-5 text-white" />
                <span>ENVIAR PARA O WHATSAPP (24) 99872-9266</span>
              </a>
            </div>
          </div>

          {/* PARAMETER CONTROLS SIDEBAR (4 Columns) - Responsive Collapsible on Mobile */}
          <div
            className={`lg:col-span-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6 max-h-[700px] overflow-y-auto custom-scrollbar transition-all duration-300 ${
              mobileControlsOpen ? "block" : "hidden md:block"
            }`}
          >
            {/* Step 1: Terreno */}
            {projectState.step === "terreno" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase">
                  <Compass className="w-5 h-5" />
                  <span>Medidas do Terreno e Esquadro</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">
                      Largura (m):
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      value={projectState.terrain.width}
                      onChange={(e) =>
                        setProjectState((p) => ({
                          ...p,
                          terrain: { ...p.terrain, width: Number(e.target.value) },
                        }))
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">
                      Comprimento (m):
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      value={projectState.terrain.length}
                      onChange={(e) =>
                        setProjectState((p) => ({
                          ...p,
                          terrain: { ...p.terrain, length: Number(e.target.value) },
                        }))
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white font-bold"
                    />
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center">
                  <div className="text-xs font-bold text-amber-400 uppercase">
                    Área Total Calculada:
                  </div>
                  <div className="text-2xl font-black text-white mt-0.5">
                    {terrainArea} m²
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Fundação */}
            {projectState.step === "fundacao" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase">
                  <Building2 className="w-5 h-5" />
                  <span>Fundação & Estrutura WVR</span>
                </div>

                <label className="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectState.hasFoundation}
                    onChange={(e) =>
                      setProjectState((p) => ({ ...p, hasFoundation: e.target.checked }))
                    }
                    className="w-5 h-5 accent-amber-500 rounded"
                  />
                  <span className="text-sm font-bold text-white">
                    Incluir Fundação Reforçada com Radier e Sapatas
                  </span>
                </label>
              </div>
            )}

            {/* Step 3: Paredes */}
            {projectState.step === "paredes" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase">
                  <Layers className="w-5 h-5" />
                  <span>Paredes, Fachada & Tintas</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">
                    Altura do Pé-Direito (m): {projectState.wallHeight}m
                  </label>
                  <input
                    type="range"
                    min="2.6"
                    max="4.5"
                    step="0.1"
                    value={projectState.wallHeight}
                    onChange={(e) =>
                      setProjectState((p) => ({ ...p, wallHeight: Number(e.target.value) }))
                    }
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">
                    Cor da Pintura da Fachada:
                  </label>
                  <div className="flex gap-2">
                    {["#f8fafc", "#fef3c7", "#e2e8f0", "#78350f", "#18181b"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setProjectState((p) => ({ ...p, wallColor: c }))}
                        style={{ backgroundColor: c }}
                        className={`w-8 h-8 rounded-full border-2 ${
                          projectState.wallColor === c ? "border-amber-400 scale-110" : "border-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Esquadrias (Portas & Janelas) */}
            {projectState.step === "esquadrias" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase">
                  <Wrench className="w-5 h-5" />
                  <span>Portas, Janelas & Esquadrias</span>
                </div>

                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-3 text-xs font-bold text-zinc-300">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={projectState.carpentry.customDoors}
                      onChange={(e) =>
                        setProjectState((p) => ({
                          ...p,
                          carpentry: { ...p.carpentry, customDoors: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span>Porta Principal Pivotante em Madeira Nobre</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={projectState.locksmith.glassRailings}
                      onChange={(e) =>
                        setProjectState((p) => ({
                          ...p,
                          locksmith: { ...p.locksmith, glassRailings: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span>Janelas em Alumínio Preto & Vidro Temperado</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={projectState.locksmith.gateAutomatic}
                      onChange={(e) =>
                        setProjectState((p) => ({
                          ...p,
                          locksmith: { ...p.locksmith, gateAutomatic: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span>Portão Automático de Garagem em Alumínio</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 5: Telhado */}
            {projectState.step === "telhado" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase">
                  <Axe className="w-5 h-5" />
                  <span>Modelo de Telhado</span>
                </div>

                <div className="space-y-2">
                  {[
                    { id: "colonial", label: "Colonial Tradicional (Telha Cerâmica)" },
                    { id: "flat", label: "Plano / Platibanda Moderno" },
                    { id: "sem", label: "Sem Telhado (Terraço Aberto)" },
                  ].map((roof) => (
                    <button
                      key={roof.id}
                      onClick={() =>
                        setProjectState((p) => ({ ...p, roofType: roof.id as any }))
                      }
                      className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-colors ${
                        projectState.roofType === roof.id
                          ? "bg-amber-500/20 text-amber-300 border-amber-500"
                          : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800"
                      }`}
                    >
                      {roof.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Decoração & Lazer */}
            {projectState.step === "decoracao" && (
              <FurnitureCatalogSection
                projectState={projectState}
                onUpdateState={setProjectState}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onOpenCartDrawer={() => setShowFurnitureCartDrawer(true)}
              />
            )}

            {/* Step 7: Teto de Orçamento */}
            {projectState.step === "orcamento" && (
              <BudgetControlPanel
                projectState={projectState}
                onUpdateState={setProjectState}
              />
            )}
          </div>
        </div>
      </div>

      {/* 🛒 DRAWER/MODAL CARRINHO GLOBAL DE MOBÍLIA */}
      <FurnitureCartDrawer
        isOpen={showFurnitureCartDrawer}
        onClose={() => setShowFurnitureCartDrawer(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        projectState={projectState}
        onSyncCartTo3D={handleSyncCartTo3D}
      />

      {/* 🎤 MODAL GUIA DE COMANDOS DE VOZ & TOUR INTERATIVO */}
      <VoiceGuideModal
        isOpen={showVoiceGuide}
        onClose={() => setShowVoiceGuide(false)}
        initialTab={voiceGuideInitialTab}
        onSelectCommand={(cmd) => {
          handleQuickCommand(cmd);
          setShowVoiceGuide(false);
        }}
      />

      {/* 📜 MODAL CONTROLE DE VERSÕES (SNAPSHOTS) */}
      <ProjectSnapshotManager
        projectState={projectState}
        setProjectState={setProjectState}
        isOpen={showSnapshotManager}
        onClose={() => setShowSnapshotManager(false)}
      />

      {/* ⚙️ MODAL DE CONFIGURAÇÕES DO AGENDADOR DE AUTO-SAVE & GEOLOCALIZAÇÃO */}
      <AutoSaveSettingsModal
        isOpen={showAutoSaveSettingsModal}
        onClose={() => setShowAutoSaveSettingsModal(false)}
        autoSaveMinutes={autoSaveMinutes}
        setAutoSaveMinutes={handleSetAutoSaveMinutes}
        autoSaveDestination={autoSaveDestination}
        setAutoSaveDestination={setAutoSaveDestination}
        onTriggerSaveNow={() => {
          triggerAutoSaveSnapshot();
          setAutoSaveSecondsLeft(autoSaveMinutes * 60);
        }}
        secondsLeft={autoSaveSecondsLeft}
        initialTab={settingsModalTab}
        onShowToast={(msg) => {
          setAutoSaveToast(msg);
          setTimeout(() => setAutoSaveToast(null), 5000);
        }}
      />

      {/* ⚡ FLOATING NOTIFICATION BANNER DO AUTO-SAVE */}
      {autoSaveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-950/90 border-2 border-amber-400 text-amber-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              Agendador de Snapshots 3D
            </div>
            <div className="text-xs font-bold text-white">{autoSaveToast}</div>
          </div>
          <button
            onClick={() => setAutoSaveToast(null)}
            className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
