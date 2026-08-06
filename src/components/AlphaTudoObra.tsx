import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Calculator,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck,
  FileText,
  HardHat,
  Layers,
  Link,
  Plus,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  Wrench,
  Building2,
  Boxes,
  Zap,
  Globe,
  Wallet,
  Bell,
  BellRing,
  Send,
  X,
  Volume2,
  VolumeX,
  Sliders,
  Edit3,
  PlusCircle,
  History,
  Smartphone,
  Info,
  CheckCheck,
  AlertTriangle,
  SlidersHorizontal,
  Trash2,
  Leaf,
  Trees,
  Recycle,
  Droplets,
  Award,
  TrendingDown,
  Filter,
  Download,
  BarChart2,
} from "lucide-react";
import { OFFICIAL_COMPANY_DATA } from "../data/initialData";
import { CumulativeEcoReport } from "./CumulativeEcoReport";
import { CostDashboardModule } from "./CostDashboardModule";

export interface ScheduleStage {
  id: string;
  stage: string;
  progress: number;
  status: "Concluído" | "Em Andamento" | "Iniciando" | "Aguardando" | "Atrasado";
  date: string;
  responsible: string;
  lastUpdated: string;
  observations: string;
}

export interface PushNotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  stageName: string;
  type: "progress" | "status" | "delay" | "completion" | "system";
  read: boolean;
}

export interface PushPreferences {
  notifyProgress: boolean;
  notifyCompletion: boolean;
  notifyDelay: boolean;
  notifyFieldUpdates: boolean;
  notifySystem: boolean;
  soundEnabled: boolean;
  quietHours: boolean;
  emailBackup: boolean;
}

interface MaterialItem {
  id: string;
  name: string;
  category: "Estrutura" | "Alvenaria" | "Acabamento" | "Móveis GDM" | "Elétrica/Hidráulica";
  unit: string;
  quantityNeeded: number;
  quantityBought: number;
  unitPrice: number;
  supplier: string;
}

interface LaborItem {
  id: string;
  role: string;
  workersCount: number;
  dailyRate: number;
  daysWorked: number;
  status: "Em Atividade" | "Concluído" | "Agendado";
}

interface PhotoLog {
  id: string;
  title: string;
  stage: string;
  date: string;
  imageUrl: string;
  description: string;
  approvedByClient: boolean;
}

export const AlphaTudoObra: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "orcamento_m2" | "cronograma" | "materiais_mao" | "fotos" | "documentos" | "financeiro_bank_invest" | "impacto_ambiental" | "dashboard_custos"
  >("orcamento_m2");

  // --- SCHEDULE & PUSH NOTIFICATIONS STATE ---
  const [scheduleStages, setScheduleStages] = useState<ScheduleStage[]>(() => {
    const saved = localStorage.getItem("alphatudo_schedule_stages");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "st-1", stage: "1. Projetos, Alvará na Prefeitura & Doc Rimane", progress: 100, status: "Concluído", date: "Mês 1", responsible: "Eng. Rimane", lastUpdated: "15/05/2026", observations: "Documentação e licenças aprovadas sem ressalvas na Prefeitura de Barra Mansa." },
      { id: "st-2", stage: "2. Terraplanagem & Fundação de Estacas WVR", progress: 100, status: "Concluído", date: "Mês 1", responsible: "Mestre de Obras WVR", lastUpdated: "30/05/2026", observations: "Perfuração e concretagem de 24 estacas profundas concluída." },
      { id: "st-3", stage: "3. Alvenaria, Pilares e Vigas Estruturais", progress: 85, status: "Em Andamento", date: "Mês 2", responsible: "Equipe de Edificação WVR", lastUpdated: "04/08/2026", observations: "Paredes externas concluídas, aprontando ferragem para concretagem do respaldo." },
      { id: "st-4", stage: "4. Cobertura, Telhado & Impermeabilização", progress: 35, status: "Em Andamento", date: "Mês 2", responsible: "Equipe WVR Impermeabilização", lastUpdated: "02/08/2026", observations: "Estrutura metálica instalada, aplicação de manta asfáltica e calhas em andamento." },
      { id: "st-5", stage: "5. Instalações Elétricas & Hidráulicas Tubuladas", progress: 10, status: "Iniciando", date: "Mês 3", responsible: "Eletricista Credenciado Rimane", lastUpdated: "01/08/2026", observations: "Passagem de conduítes corrugados e tubulação de água fria/quente iniciada." },
      { id: "st-6", stage: "6. Revestimentos, Porcelanato & Pintura", progress: 0, status: "Aguardando", date: "Mês 3", responsible: "Mestre de Acabamento", lastUpdated: "10/05/2026", observations: "Aguardando término das tubulações embutidas." },
      { id: "st-7", stage: "7. Montagem dos Móveis Planejados GDM (100% MDF)", progress: 0, status: "Aguardando", date: "Mês 4", responsible: "Marcenaria GDM Barra Mansa", lastUpdated: "10/05/2026", observations: "Projetos 3D cortados na fábrica GDM, aguardando fase de acabamento." },
      { id: "st-8", stage: "8. Vistoria Final, Habite-se & Chaves na Mão", progress: 0, status: "Aguardando", date: "Mês 4", responsible: "Eng. Chefe WVR / Cliente", lastUpdated: "10/05/2026", observations: "Agendado para fase final com habite-se e entrega festiva de chaves." },
    ];
  });

  const [pushNotifications, setPushNotifications] = useState<PushNotificationItem[]>(() => {
    const saved = localStorage.getItem("alphatudo_schedule_push_history");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "push-1",
        title: "🏗️ Cronograma Atualizado: Alvenaria & Estrutura",
        body: "A etapa 'Alvenaria, Pilares e Vigas Estruturais' avançou para 85% de conclusão! Paredes do 1º pavimento liberadas.",
        timestamp: "Hoje às 09:30",
        stageName: "Alvenaria, Pilares e Vigas Estruturais",
        type: "progress",
        read: false,
      },
      {
        id: "push-2",
        title: "⚡ Nova Etapa Iniciada: Elétrica & Hidráulica",
        body: "A equipe credenciada iniciou a tubulação Tigre e passagem de conduítes no projeto.",
        timestamp: "Ontem às 14:15",
        stageName: "Instalações Elétricas & Hidráulicas Tubuladas",
        type: "status",
        read: true,
      },
    ];
  });

  const [webPushPermission, setWebPushPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isPushHistoryOpen, setIsPushHistoryOpen] = useState<boolean>(false);
  const [isPushPreferencesOpen, setIsPushPreferencesOpen] = useState<boolean>(false);
  const [editingStage, setEditingStage] = useState<ScheduleStage | null>(null);
  const [isAddingStageModalOpen, setIsAddingStageModalOpen] = useState<boolean>(false);

  // Push preferences state with localStorage persistence
  const [pushPreferences, setPushPreferences] = useState<PushPreferences>(() => {
    const saved = localStorage.getItem("alphatudo_push_preferences");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      notifyProgress: true,
      notifyCompletion: true,
      notifyDelay: true,
      notifyFieldUpdates: true,
      notifySystem: true,
      soundEnabled: true,
      quietHours: false,
      emailBackup: true,
    };
  });

  const [toastNotification, setToastNotification] = useState<{
    visible: boolean;
    title: string;
    body: string;
    stageName: string;
  }>({
    visible: false,
    title: "",
    body: "",
    stageName: "",
  });

  // Form states for stage editing/adding
  const [stageFormData, setStageFormData] = useState<{
    stage: string;
    progress: number;
    status: "Concluído" | "Em Andamento" | "Iniciando" | "Aguardando" | "Atrasado";
    date: string;
    responsible: string;
    observations: string;
    sendPush: boolean;
  }>({
    stage: "",
    progress: 0,
    status: "Em Andamento",
    date: "Mês 2",
    responsible: "Equipe WVR",
    observations: "",
    sendPush: true,
  });

  // Save schedule to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem("alphatudo_schedule_stages", JSON.stringify(scheduleStages));
  }, [scheduleStages]);

  // Save push preferences to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem("alphatudo_push_preferences", JSON.stringify(pushPreferences));
  }, [pushPreferences]);

  // Helper to check if a push category is enabled in user preferences
  const isPushCategoryEnabled = (type: "progress" | "status" | "delay" | "completion" | "system"): boolean => {
    if (type === "progress") return pushPreferences.notifyProgress;
    if (type === "completion") return pushPreferences.notifyCompletion;
    if (type === "delay") return pushPreferences.notifyDelay;
    if (type === "status") return pushPreferences.notifyFieldUpdates;
    if (type === "system") return pushPreferences.notifySystem;
    return true;
  };

  // Audio synthesizer chime for push notifications
  const playPushNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(987.77, now + 0.12);
      gain2.gain.setValueAtTime(0.15, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.5);
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  // Request browser Notification permission
  const requestWebPushPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Seu navegador não possui suporte nativo à API de Notificações Web Push.");
      return;
    }
    try {
      const res = await Notification.requestPermission();
      setWebPushPermission(res);
      if (res === "granted") {
        sendSchedulePushNotification(
          "🔔 Notificações Push Ativadas!",
          "Você receberá alertas instantâneos sempre que houver atualização no cronograma da sua obra WVR.",
          "Configuração de Sistema",
          "system"
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger push notification to client
  const sendSchedulePushNotification = (
    title: string,
    body: string,
    stageName: string,
    type: "progress" | "status" | "delay" | "completion" | "system" = "progress"
  ) => {
    const isAllowed = isPushCategoryEnabled(type);

    const newNotif: PushNotificationItem = {
      id: `push-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: isAllowed ? title : `[Mudo por Preferência] ${title}`,
      body,
      timestamp: `Hoje às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`,
      stageName,
      type,
      read: false,
    };

    setPushNotifications((prev) => {
      const updated = [newNotif, ...prev];
      localStorage.setItem("alphatudo_schedule_push_history", JSON.stringify(updated));
      return updated;
    });

    if (!isAllowed) {
      return; // Stop toast, sound, and browser push if user disabled this category
    }

    const currentHour = new Date().getHours();
    const isQuietHours = pushPreferences.quietHours && (currentHour >= 22 || currentHour < 7);

    if (soundEnabled && pushPreferences.soundEnabled && !isQuietHours) {
      playPushNotificationChime();
    }

    setToastNotification({
      visible: true,
      title,
      body,
      stageName,
    });

    setTimeout(() => {
      setToastNotification((prev) => ({ ...prev, visible: false }));
    }, 6000);

    window.dispatchEvent(
      new CustomEvent("alphatudo-schedule-push", {
        detail: newNotif,
      })
    );

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body,
          icon: "/icon.svg",
          tag: `schedule-update-${Date.now()}`,
        });
      } catch (e) {
        console.error("Native push error", e);
      }
    }
  };

  // Quick increment progress for a stage
  const handleQuickProgressIncrement = (stageId: string) => {
    setScheduleStages((prev) =>
      prev.map((s) => {
        if (s.id === stageId) {
          const newProgress = Math.min(100, s.progress + 10);
          const newStatus = newProgress === 100 ? "Concluído" : "Em Andamento";
          const today = new Date().toLocaleDateString("pt-BR");

          const title =
            newProgress === 100
              ? `🎉 ETAPA CONCLUÍDA: ${s.stage}`
              : `📈 AVANÇO DE OBRA (${newProgress}%): ${s.stage}`;
          const body =
            newProgress === 100
              ? `Parabéns! A etapa "${s.stage}" foi finalizada com 100% de aproveitamento.`
              : `A etapa "${s.stage}" avançou de ${s.progress}% para ${newProgress}%. Responsável: ${s.responsible}.`;

          sendSchedulePushNotification(title, body, s.stage, newProgress === 100 ? "completion" : "progress");

          return {
            ...s,
            progress: newProgress,
            status: newStatus,
            lastUpdated: today,
          };
        }
        return s;
      })
    );
  };

  // Simulate a live field update from site engineer
  const handleSimulateFieldUpdate = () => {
    const activeIndex = scheduleStages.findIndex((s) => s.progress > 0 && s.progress < 100);
    const targetIndex = activeIndex >= 0 ? activeIndex : 2;
    const targetStage = scheduleStages[targetIndex];

    if (!targetStage) return;

    const newProg = Math.min(100, targetStage.progress + 15);
    const today = new Date().toLocaleDateString("pt-BR");

    setScheduleStages((prev) =>
      prev.map((item, idx) =>
        idx === targetIndex
          ? {
              ...item,
              progress: newProg,
              status: newProg === 100 ? "Concluído" : "Em Andamento",
              lastUpdated: today,
              observations: `[Diário de Obra ${today}] Mestre de Obras aplicou novos materiais e acelerou a execução.`,
            }
          : item
      )
    );

    sendSchedulePushNotification(
      `🏗️ DIÁRIO DE CAMPO WVR: ${targetStage.stage}`,
      `O Mestre de Obras atualizou o andamento para ${newProg}%. Vistoria e conferência de segurança aprovadas.`,
      targetStage.stage,
      newProg === 100 ? "completion" : "progress"
    );
  };

  // Open edit modal for stage
  const handleOpenEditStage = (stage: ScheduleStage) => {
    setEditingStage(stage);
    setStageFormData({
      stage: stage.stage,
      progress: stage.progress,
      status: stage.status,
      date: stage.date,
      responsible: stage.responsible,
      observations: stage.observations,
      sendPush: true,
    });
  };

  // Save stage edit
  const handleSaveStageEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStage) return;

    const today = new Date().toLocaleDateString("pt-BR");

    setScheduleStages((prev) =>
      prev.map((s) => {
        if (s.id === editingStage.id) {
          return {
            ...s,
            stage: stageFormData.stage,
            progress: Number(stageFormData.progress),
            status: stageFormData.status,
            date: stageFormData.date,
            responsible: stageFormData.responsible,
            observations: stageFormData.observations,
            lastUpdated: today,
          };
        }
        return s;
      })
    );

    if (stageFormData.sendPush) {
      const type =
        stageFormData.status === "Concluído"
          ? "completion"
          : stageFormData.status === "Atrasado"
          ? "delay"
          : "progress";

      const title =
        stageFormData.status === "Atrasado"
          ? `⚠️ ALERTA DE CRONOGRAMA: ${stageFormData.stage}`
          : stageFormData.status === "Concluído"
          ? `🎉 ETAPA CONCLUÍDA: ${stageFormData.stage}`
          : `📢 ATUALIZAÇÃO NO CRONOGRAMA: ${stageFormData.stage}`;

      const body = `Etapa ajustada para ${stageFormData.progress}% (${stageFormData.status}). Responsável: ${stageFormData.responsible}. Obs: ${
        stageFormData.observations || "Sem observações adicionais."
      }`;

      sendSchedulePushNotification(title, body, stageFormData.stage, type);
    }

    setEditingStage(null);
  };

  // Add new stage
  const handleAddNewStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageFormData.stage.trim()) return;

    const today = new Date().toLocaleDateString("pt-BR");
    const newStage: ScheduleStage = {
      id: `st-${Date.now()}`,
      stage: stageFormData.stage,
      progress: Number(stageFormData.progress),
      status: stageFormData.status,
      date: stageFormData.date || "Mês 3",
      responsible: stageFormData.responsible || "Eng. WVR",
      lastUpdated: today,
      observations: stageFormData.observations || "Nova etapa adicionada ao cronograma físico.",
    };

    setScheduleStages((prev) => [...prev, newStage]);

    if (stageFormData.sendPush) {
      sendSchedulePushNotification(
        `📌 NOVA ETAPA NO CRONOGRAMA: ${newStage.stage}`,
        `A engenharia incluiu a etapa "${newStage.stage}" com previsão para ${newStage.date}. Responsável: ${newStage.responsible}.`,
        newStage.stage,
        "system"
      );
    }

    setIsAddingStageModalOpen(false);
  };

  // Delete stage
  const handleDeleteStage = (id: string, stageName: string) => {
    if (confirm(`Tem certeza que deseja remover a etapa "${stageName}" do cronograma?`)) {
      setScheduleStages((prev) => prev.filter((s) => s.id !== id));
      sendSchedulePushNotification(
        `🗑️ ETAPA REMOVIDA DO CRONOGRAMA`,
        `A etapa "${stageName}" foi reestruturada ou removida da programação oficial pela engenharia.`,
        stageName,
        "system"
      );
    }
  };

  // Mark all notifications as read
  const handleMarkAllNotificationsRead = () => {
    setPushNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem("alphatudo_schedule_push_history", JSON.stringify(updated));
      return updated;
    });
  };

  // Clear notifications
  const handleClearNotificationHistory = () => {
    setPushNotifications([]);
    localStorage.removeItem("alphatudo_schedule_push_history");
  };

  const unreadCount = pushNotifications.filter((n) => !n.read).length;

  // State for m² Calculator
  const [areaM2, setAreaM2] = useState<number>(120);
  const [projectType, setProjectType] = useState<"construcao_completa" | "reforma" | "moveis_gdm" | "area_gourmet">(
    "construcao_completa"
  );
  const [standardLevel, setStandardLevel] = useState<"medio" | "alto" | "luxo">("alto");

  // Sync state with Bank Invest
  const [isSyncingBankInvest, setIsSyncingBankInvest] = useState(false);
  const [bankInvestSyncSuccess, setBankInvestSyncSuccess] = useState(false);

  // Materials State
  const [materials, setMaterials] = useState<MaterialItem[]>([
    {
      id: "mat-1",
      name: "Cimento CP II Mauá (Sacos 50kg)",
      category: "Estrutura",
      unit: "Sacos",
      quantityNeeded: 250,
      quantityBought: 250,
      unitPrice: 34.5,
      supplier: "Cimentaria Barra Mansa",
    },
    {
      id: "mat-2",
      name: "Aço CA-50 Gerdau 10mm (Barra 12m)",
      category: "Estrutura",
      unit: "Barras",
      quantityNeeded: 180,
      quantityBought: 180,
      unitPrice: 58.0,
      supplier: "Aço & Cia Volta Redonda",
    },
    {
      id: "mat-3",
      name: "Tijolo Baiano 9x19x19 (Milheiro)",
      category: "Alvenaria",
      unit: "Milheiros",
      quantityNeeded: 12,
      quantityBought: 10,
      unitPrice: 920.0,
      supplier: "Olaria Vale do Paraíba",
    },
    {
      id: "mat-4",
      name: "Porcelanato Retificado Delta 84x84cm",
      category: "Acabamento",
      unit: "m²",
      quantityNeeded: 140,
      quantityBought: 100,
      unitPrice: 89.9,
      supplier: "Revestir Resende",
    },
    {
      id: "mat-5",
      name: "MDF Naval 18mm GDM Móveis Planejados",
      category: "Móveis GDM",
      unit: "Chapas",
      quantityNeeded: 35,
      quantityBought: 35,
      unitPrice: 380.0,
      supplier: "Fábrica GDM Barra Mansa",
    },
  ]);

  // --- ENVIRONMENTAL IMPACT & SUSTAINABILITY STATE ---
  const [ecoSubView, setEcoSubView] = useState<"relatorio_acumulado" | "projeto_detalhado">("relatorio_acumulado");
  const [selectedEcoCategoryFilter, setSelectedEcoCategoryFilter] = useState<string>("Todas");
  const [ecoToggles, setEcoToggles] = useState({
    wasteSorting: true,
    recycledSteel: true,
    rainwaterHarvesting: true,
    fscMdfGdm: true,
    solarPanelIntegration: false,
    greenRoofOption: false,
  });
  const [isEcoCertificateModalOpen, setIsEcoCertificateModalOpen] = useState(false);

  // Helper function for material eco calculations
  const getMaterialEcoMetrics = (item: MaterialItem) => {
    let unitCO2Kg = 10;
    let wastePercentage = 8;
    let recyclability = 70;
    let ecoNote = "Material padrão de engenharia";

    const name = item.name.toLowerCase();
    const cat = item.category.toLowerCase();

    if (name.includes("cimento")) {
      unitCO2Kg = 38.5; // ~38.5kg CO2 per 50kg bag Mauá
      wastePercentage = ecoToggles.wasteSorting ? 3.5 : 8.0;
      recyclability = 20;
      ecoNote = "Cimento CP II com adições pozolânicas de baixa emissão";
    } else if (name.includes("aço") || name.includes("aco")) {
      unitCO2Kg = ecoToggles.recycledSteel ? 10.5 : 18.2;
      wastePercentage = 2.5; // WVR precision cut
      recyclability = 98;
      ecoNote = ecoToggles.recycledSteel
        ? "Aço Gerdau CA-50 100% reprocessado de sucata limpa"
        : "Aço CA-50 de forno elétrico convencional";
    } else if (name.includes("tijolo") || name.includes("bloco")) {
      unitCO2Kg = 160; // per milheiro
      wastePercentage = ecoToggles.wasteSorting ? 4.0 : 10.5;
      recyclability = 85;
      ecoNote = "Cerâmica vermelha local (Vale do Paraíba) com biomassa";
    } else if (name.includes("porcelanato") || name.includes("piso")) {
      unitCO2Kg = 11.2; // per m²
      wastePercentage = 8.5;
      recyclability = 65;
      ecoNote = "Porcelanato retificado com massa cerâmica reaproveitada";
    } else if (name.includes("mdf") || name.includes("madeira")) {
      unitCO2Kg = ecoToggles.fscMdfGdm ? -4.5 : 2.8; // Carbon credit!
      wastePercentage = ecoToggles.fscMdfGdm ? 1.2 : 4.5;
      recyclability = 82;
      ecoNote = "MDF GDM de pinus reflorestado com selo de cadeia FSC";
    } else if (cat.includes("hidráulica") || cat.includes("elétrica")) {
      unitCO2Kg = 4.2;
      wastePercentage = 3.0;
      recyclability = 92;
      ecoNote = "Material 100% reciclável de alta durabilidade";
    }

    const totalCO2Kg = item.quantityNeeded * unitCO2Kg;
    const wasteQuantity = item.quantityNeeded * (wastePercentage / 100);

    return {
      unitCO2Kg,
      totalCO2Kg,
      wastePercentage,
      wasteQuantity,
      recyclability,
      ecoNote,
    };
  };

  const ecoCalculations = React.useMemo(() => {
    let rawCO2Kg = 0;
    let totalWasteKg = 0;

    materials.forEach((m) => {
      const metrics = getMaterialEcoMetrics(m);
      rawCO2Kg += metrics.totalCO2Kg;
      totalWasteKg += metrics.wasteQuantity * (m.unitPrice > 100 ? 6 : 18);
    });

    let co2Modifier = 1.0;
    if (ecoToggles.rainwaterHarvesting) co2Modifier -= 0.06;
    if (ecoToggles.solarPanelIntegration) co2Modifier -= 0.18;
    if (ecoToggles.greenRoofOption) co2Modifier -= 0.08;

    const finalCO2Kg = Math.max(0, rawCO2Kg * co2Modifier);
    const finalCO2Tons = finalCO2Kg / 1000;

    const baselineCO2Kg = rawCO2Kg * 1.38;
    const co2SavedKg = Math.max(0, baselineCO2Kg - finalCO2Kg);

    const treesToPlant = Math.ceil(finalCO2Kg / 150);

    const wasteVolumeM3 = (
      (areaM2 * (ecoToggles.wasteSorting ? 0.024 : 0.055)) +
      (totalWasteKg / 1000)
    ).toFixed(2);

    const wasteSavingsBRL = (
      parseFloat(wasteVolumeM3) * 180 +
      (ecoToggles.wasteSorting ? 1400 : 0) +
      (ecoToggles.recycledSteel ? 850 : 0) +
      (ecoToggles.fscMdfGdm ? 1200 : 0)
    );

    let score = 60;
    if (ecoToggles.wasteSorting) score += 9;
    if (ecoToggles.recycledSteel) score += 8;
    if (ecoToggles.rainwaterHarvesting) score += 7;
    if (ecoToggles.fscMdfGdm) score += 8;
    if (ecoToggles.solarPanelIntegration) score += 5;
    if (ecoToggles.greenRoofOption) score += 3;
    const ecoScore = Math.min(100, score);

    let ecoBadge = "Selo Bronze (Ecoeficiente WVR)";
    if (ecoScore >= 90) ecoBadge = "Selo Ouro (Zero Impacto & Alta Sustentabilidade)";
    else if (ecoScore >= 75) ecoBadge = "Selo Prata (Sustentabilidade Avançada)";

    return {
      finalCO2Kg,
      finalCO2Tons,
      co2SavedKg,
      treesToPlant,
      wasteVolumeM3,
      wasteSavingsBRL,
      ecoScore,
      ecoBadge,
    };
  }, [materials, ecoToggles, areaM2]);

  // Labor State
  const [laborList, setLaborList] = useState<LaborItem[]>([
    { id: "lab-1", role: "Mestre de Obras WVR", workersCount: 1, dailyRate: 280, daysWorked: 42, status: "Em Atividade" },
    { id: "lab-2", role: "Pedreiros Oficiais", workersCount: 3, dailyRate: 220, daysWorked: 40, status: "Em Atividade" },
    { id: "lab-3", role: "Ajudantes de Pedreiro", workersCount: 2, dailyRate: 130, daysWorked: 40, status: "Em Atividade" },
    { id: "lab-4", role: "Marceneiros Montadores GDM", workersCount: 2, dailyRate: 250, daysWorked: 12, status: "Agendado" },
    { id: "lab-5", role: "Eletricista Credenciado", workersCount: 1, dailyRate: 240, daysWorked: 15, status: "Concluído" },
  ]);

  // Photos Log
  const [photoLogs] = useState<PhotoLog[]>([
    {
      id: "foto-1",
      title: "Perfuração e Concretagem de Estacas",
      stage: "Fundação",
      date: "12/05/2026",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
      description: "Fundação profunda realizada com sucesso conforme memorial descritivo da engenharia WVR.",
      approvedByClient: true,
    },
    {
      id: "foto-2",
      title: "Levantamento de Alvenaria e Vergas",
      stage: "Alvenaria",
      date: "04/06/2026",
      imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
      description: "Paredes externas e divisórias internas com esquadro verificado de 90 graus.",
      approvedByClient: true,
    },
    {
      id: "foto-3",
      title: "Pré-Montagem Móveis Cozinha GDM",
      stage: "Móveis Planejados",
      date: "28/07/2026",
      imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
      description: "Ajuste milimétrico de gaveteiros e armários em MDF naval produzidos na fábrica de Barra Mansa.",
      approvedByClient: false,
    },
  ]);

  // Calculate Prices per m²
  const basePricePerM2 =
    projectType === "construcao_completa"
      ? standardLevel === "medio" ? 2200 : standardLevel === "alto" ? 2850 : 3600
      : projectType === "reforma"
      ? standardLevel === "medio" ? 850 : standardLevel === "alto" ? 1350 : 1900
      : projectType === "moveis_gdm"
      ? standardLevel === "medio" ? 1100 : standardLevel === "alto" ? 1650 : 2300
      : standardLevel === "medio" ? 1500 : standardLevel === "alto" ? 2100 : 2900;

  const totalCalculatedBudget = areaM2 * basePricePerM2;
  const totalMaterialSpent = materials.reduce((acc, item) => acc + item.quantityBought * item.unitPrice, 0);
  const totalLaborSpent = laborList.reduce((acc, item) => acc + item.workersCount * item.dailyRate * item.daysWorked, 0);
  const totalCostExecuted = totalMaterialSpent + totalLaborSpent;
  const estimatedProfitMargin = totalCalculatedBudget > 0 ? totalCalculatedBudget - totalCostExecuted : 0;

  // Sync to Bank Invest
  const handleSyncToBankInvest = async () => {
    setIsSyncingBankInvest(true);
    setBankInvestSyncSuccess(false);

    try {
      const payload = {
        projectName: `Obra AlphaTudo - ${areaM2}m²`,
        totalBudget: totalCalculatedBudget,
        executedCosts: totalCostExecuted,
        profitMargin: estimatedProfitMargin,
        syncedAt: new Date().toISOString(),
        company: OFFICIAL_COMPANY_DATA.razaoSocial,
        cnpj: OFFICIAL_COMPANY_DATA.cnpj,
      };

      // Save sync data to localStorage for Bank Invest Module
      localStorage.setItem("alphatudo_bank_invest_sync", JSON.stringify(payload));

      await fetch("/api/alphatudo-obra/sync-bank-invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});

      setTimeout(() => {
        setIsSyncingBankInvest(false);
        setBankInvestSyncSuccess(true);
      }, 800);
    } catch (e) {
      console.error(e);
      setIsSyncingBankInvest(false);
    }
  };

  return (
    <section id="alphatudo-obra" className="py-10 bg-zinc-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* HEADER & TOP SYSTEM INTEGRATION BAR */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 shadow-2xl relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Módulo Oficial • Organizações Rimane (CNPJ {OFFICIAL_COMPANY_DATA.cnpj})</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                <span>📊 ALPHATUDO OBRA</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-extrabold">
                  SISTEMA UNIFICADO ATIVO
                </span>
              </h1>

              <p className="text-zinc-300 text-sm max-w-2xl">
                Plataforma integrada de gestão de orçamentos por m², cronograma físico-financeiro, materiais, mão de obra, fotos e sincronização bancária com o <strong>Bank Invest</strong>.
              </p>
            </div>

            {/* Live Integration Status Badges */}
            <div className="flex flex-wrap items-center gap-3 bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 shrink-0">
              <div className="text-left space-y-1">
                <div className="text-[10px] font-black uppercase text-zinc-400">Integrações Automáticas</div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Bank Invest
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                    <Building2 className="w-3.5 h-3.5" /> WVR / GDM
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="inline-flex items-center gap-1 text-sky-400 font-bold">
                    <Globe className="w-3.5 h-3.5" /> FlowHost
                  </span>
                </div>
              </div>

              <button
                onClick={handleSyncToBankInvest}
                disabled={isSyncingBankInvest}
                className="ml-auto px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-amber-500 text-zinc-950 font-black text-xs rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingBankInvest ? "animate-spin" : ""}`} />
                <span>{isSyncingBankInvest ? "Sincronizando..." : "Sincronizar Bank Invest"}</span>
              </button>
            </div>
          </div>

          {bankInvestSyncSuccess && (
            <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Dados do projeto AlphaTudo Obra sincronizados com sucesso no módulo financeiro do Bank Invest!</span>
              </div>
              <span className="text-[10px] text-zinc-400">Org. Rimane • {new Date().toLocaleTimeString("pt-BR")}</span>
            </div>
          )}
        </div>

        {/* NAVIGATION TABS BAR */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("orcamento_m2")}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all ${
              activeTab === "orcamento_m2"
                ? "bg-amber-400 text-zinc-950 shadow-lg scale-105"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Orçamento por m²</span>
          </button>

          <button
            onClick={() => setActiveTab("cronograma")}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all ${
              activeTab === "cronograma"
                ? "bg-amber-400 text-zinc-950 shadow-lg scale-105"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Cronograma de Obra</span>
          </button>

          <button
            onClick={() => setActiveTab("materiais_mao")}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all ${
              activeTab === "materiais_mao"
                ? "bg-amber-400 text-zinc-950 shadow-lg scale-105"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Materiais & Mão de Obra</span>
          </button>

          <button
            onClick={() => setActiveTab("fotos")}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all ${
              activeTab === "fotos"
                ? "bg-amber-400 text-zinc-950 shadow-lg scale-105"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Registro Fotográfico</span>
          </button>

          <button
            onClick={() => setActiveTab("documentos")}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all ${
              activeTab === "documentos"
                ? "bg-amber-400 text-zinc-950 shadow-lg scale-105"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Aprovações & Documentos</span>
          </button>

          <button
            onClick={() => setActiveTab("financeiro_bank_invest")}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all ${
              activeTab === "financeiro_bank_invest"
                ? "bg-emerald-400 text-zinc-950 shadow-lg scale-105"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Custos & Lucro (Bank Invest)</span>
          </button>

          <button
            onClick={() => setActiveTab("impacto_ambiental")}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all ${
              activeTab === "impacto_ambiental"
                ? "bg-emerald-400 text-zinc-950 shadow-lg scale-105"
                : "bg-zinc-900 text-emerald-400 hover:text-white border border-emerald-500/30"
            }`}
          >
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Impacto Ambiental</span>
          </button>

          <button
            onClick={() => setActiveTab("dashboard_custos")}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all ${
              activeTab === "dashboard_custos"
                ? "bg-amber-400 text-zinc-950 shadow-lg scale-105"
                : "bg-zinc-900 text-amber-400 hover:text-white border border-amber-500/30"
            }`}
          >
            <BarChart2 className="w-4 h-4 text-amber-400" />
            <span>Dashboard de Custos (Firestore)</span>
          </button>
        </div>

        {/* TAB 1: ORÇAMENTO POR M² */}
        {activeTab === "orcamento_m2" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  <span>Calculadora de Custo por Metro Quadrado (m²)</span>
                </h3>
                <span className="text-xs bg-amber-500/20 text-amber-300 font-extrabold px-3 py-1 rounded-full">
                  Tabela SINAPI / Sul Fluminense
                </span>
              </div>

              {/* Area Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-extrabold text-amber-400">
                  <span>Área Total de Construção / Reforma:</span>
                  <span className="text-2xl font-black text-white">{areaM2} m²</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={600}
                  step={5}
                  value={areaM2}
                  onChange={(e) => setAreaM2(Number(e.target.value))}
                  className="w-full accent-amber-400 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>30 m² (Compacto)</span>
                  <span>150 m² (Padrão)</span>
                  <span>300 m² (Grande)</span>
                  <span>600 m² (Mansão / Comercial)</span>
                </div>
              </div>

              {/* Project Category */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase text-zinc-400">
                  Modalidade do Projeto:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                  <button
                    onClick={() => setProjectType("construcao_completa")}
                    className={`p-3 rounded-2xl border transition-all text-center ${
                      projectType === "construcao_completa"
                        ? "bg-amber-400 text-zinc-950 border-amber-400 font-black shadow-md"
                        : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    Construção Completa WVR
                  </button>

                  <button
                    onClick={() => setProjectType("reforma")}
                    className={`p-3 rounded-2xl border transition-all text-center ${
                      projectType === "reforma"
                        ? "bg-amber-400 text-zinc-950 border-amber-400 font-black shadow-md"
                        : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    Reforma Geral WVR
                  </button>

                  <button
                    onClick={() => setProjectType("moveis_gdm")}
                    className={`p-3 rounded-2xl border transition-all text-center ${
                      projectType === "moveis_gdm"
                        ? "bg-amber-400 text-zinc-950 border-amber-400 font-black shadow-md"
                        : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    Móveis Planejados GDM
                  </button>

                  <button
                    onClick={() => setProjectType("area_gourmet")}
                    className={`p-3 rounded-2xl border transition-all text-center ${
                      projectType === "area_gourmet"
                        ? "bg-amber-400 text-zinc-950 border-amber-400 font-black shadow-md"
                        : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    Área Gourmet & Lazer
                  </button>
                </div>
              </div>

              {/* Finish Standard Level */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase text-zinc-400">
                  Padrão de Acabamento & Materiais:
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs font-bold">
                  <button
                    onClick={() => setStandardLevel("medio")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      standardLevel === "medio"
                        ? "bg-emerald-500 text-zinc-950 border-emerald-400 font-black"
                        : "bg-zinc-950 text-zinc-300 border-zinc-800"
                    }`}
                  >
                    Padrão Médio
                  </button>
                  <button
                    onClick={() => setStandardLevel("alto")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      standardLevel === "alto"
                        ? "bg-amber-400 text-zinc-950 border-amber-400 font-black"
                        : "bg-zinc-950 text-zinc-300 border-zinc-800"
                    }`}
                  >
                    Alto Padrão WVR
                  </button>
                  <button
                    onClick={() => setStandardLevel("luxo")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      standardLevel === "luxo"
                        ? "bg-sky-400 text-zinc-950 border-sky-400 font-black"
                        : "bg-zinc-950 text-zinc-300 border-zinc-800"
                    }`}
                  >
                    Luxo Premium GDM
                  </button>
                </div>
              </div>

              {/* Itemized Cost Breakdown */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3 text-xs">
                <div className="font-extrabold text-white pb-2 border-b border-zinc-800">
                  Estimativa de Custo Discriminada por m² (R$ {basePricePerM2.toLocaleString("pt-BR")}/m²):
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-zinc-300">
                    <span>Estrutura & Alvenaria (40%):</span>
                    <span className="font-bold text-white">
                      R$ {(totalCalculatedBudget * 0.4).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between text-zinc-300">
                    <span>Acabamentos & Revestimentos (25%):</span>
                    <span className="font-bold text-white">
                      R$ {(totalCalculatedBudget * 0.25).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between text-zinc-300">
                    <span>Mão de Obra Especializada WVR (20%):</span>
                    <span className="font-bold text-white">
                      R$ {(totalCalculatedBudget * 0.2).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between text-zinc-300">
                    <span>Móveis Planejados GDM 100% MDF (15%):</span>
                    <span className="font-bold text-amber-400">
                      R$ {(totalCalculatedBudget * 0.15).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Summary Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/40 p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 shadow-2xl space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                  Valor Total Estimado do Projeto
                </span>
                <div className="text-4xl font-black text-white">
                  R$ {totalCalculatedBudget.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-zinc-400">
                  Garantia de orçamento travado sem acréscimos indevidos pela WVR Construções.
                </p>
              </div>

              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3 text-xs">
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Responsável Técnico:</span>
                  <span className="font-bold text-white">{OFFICIAL_COMPANY_DATA.responsavel}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Empresa:</span>
                  <span className="font-bold text-amber-400">{OFFICIAL_COMPANY_DATA.razaoSocial}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">CNPJ Registrado:</span>
                  <span className="font-bold text-zinc-200">{OFFICIAL_COMPANY_DATA.cnpj}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Sede Oficial:</span>
                  <span className="font-bold text-zinc-200">Barra Mansa / RJ</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSyncToBankInvest}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400 text-zinc-950 font-black text-sm rounded-2xl shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Wallet className="w-5 h-5 stroke-[2.5]" />
                  <span>ENVIAR PARA CONTROLE FINANCEIRO BANK INVEST</span>
                </button>

                <a
                  href={`https://wa.me/${OFFICIAL_COMPANY_DATA.whatsapp}?text=Olá!%20Simulei%20uma%20obra%20de%20${areaM2}m²%20no%20AlphaTudo%20Obra%20e%20gostaria%20de%20fechar%20o%20orçamento!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>APROVAR ORÇAMENTO NO WHATSAPP</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CRONOGRAMA DE OBRA & SISTEMA DE NOTIFICAÇÕES PUSH */}
        {activeTab === "cronograma" && (
          <div className="bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6">
            {/* Header & Status Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider mb-1">
                  <BellRing className="w-4 h-4 animate-pulse" />
                  <span>Sistema de Notificações Push Ativo</span>
                </div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span>Cronograma Físico-Financeiro & Alertas do Cliente</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Atualize o progresso das etapas de construção para disparar avisos push instantâneos ao cliente.
                </p>
              </div>

              {/* Push System Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {webPushPermission !== "granted" ? (
                  <button
                    onClick={requestWebPushPermission}
                    className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 animate-bounce"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Ativar Push no Navegador</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold text-xs rounded-xl flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Push Web Ativo</span>
                  </span>
                )}

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-xl border transition-colors ${
                    soundEnabled
                      ? "bg-zinc-800 border-amber-500/40 text-amber-400"
                      : "bg-zinc-950 border-zinc-800 text-zinc-500"
                  }`}
                  title={soundEnabled ? "Som Ativado" : "Som Desativado"}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsPushHistoryOpen(true)}
                  className="relative px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl border border-zinc-700 flex items-center gap-2 transition-all"
                >
                  <History className="w-4 h-4 text-amber-400" />
                  <span>Histórico Push</span>
                  {unreadCount > 0 && (
                    <span className="bg-amber-400 text-zinc-950 text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsPushPreferencesOpen(true)}
                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-extrabold text-xs rounded-xl border border-amber-500/40 flex items-center gap-1.5 transition-all shadow"
                  title="Configurar preferências de notificações push"
                >
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <span>Preferências Push</span>
                </button>

                <button
                  onClick={handleSimulateFieldUpdate}
                  className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:opacity-90 text-zinc-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Simular Atualização de Obra</span>
                </button>

                <button
                  onClick={() => {
                    setStageFormData({
                      stage: "",
                      progress: 0,
                      status: "Aguardando",
                      date: "Mês 3",
                      responsible: "Equipe WVR",
                      observations: "",
                      sendPush: true,
                    });
                    setIsAddingStageModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Nova Etapa</span>
                </button>
              </div>
            </div>

            {/* Stages List */}
            <div className="space-y-4">
              {scheduleStages.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    item.status === "Atrasado"
                      ? "bg-red-950/20 border-red-500/40"
                      : item.status === "Concluído"
                      ? "bg-zinc-950/90 border-emerald-500/30"
                      : item.status === "Em Andamento"
                      ? "bg-zinc-950 border-amber-500/40"
                      : "bg-zinc-950/60 border-zinc-800"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-black text-sm sm:text-base">{item.stage}</span>
                        <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-lg">
                          📅 {item.date}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                        <span>👤 Responsável: <strong className="text-zinc-200">{item.responsible}</strong></span>
                        <span>•</span>
                        <span>🕒 Atualizado: <strong className="text-zinc-300">{item.lastUpdated}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black border ${
                          item.status === "Concluído"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : item.status === "Em Andamento"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                            : item.status === "Iniciando"
                            ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                            : item.status === "Atrasado"
                            ? "bg-red-500/20 text-red-300 border-red-500/40"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}
                      >
                        {item.status} ({item.progress}%)
                      </span>

                      {item.progress < 100 && (
                        <button
                          onClick={() => handleQuickProgressIncrement(item.id)}
                          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-[11px] rounded-lg shadow transition-all flex items-center gap-1"
                          title="Avançar 10% e Notificar Cliente via Push"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+10% & Push</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEditStage(item)}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors border border-zinc-700"
                        title="Editar Etapa e Notificar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteStage(item.id, item.stage)}
                        className="p-1.5 bg-zinc-900 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 rounded-lg transition-colors border border-zinc-800"
                        title="Remover Etapa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.status === "Concluído"
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                          : item.status === "Atrasado"
                          ? "bg-gradient-to-r from-red-500 to-amber-500"
                          : "bg-gradient-to-r from-amber-500 to-emerald-400"
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>

                  {/* Observations Note */}
                  {item.observations && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-start gap-2 text-xs text-zinc-400">
                      <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{item.observations}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MATERIAIS & MÃO DE OBRA */}
        {activeTab === "materiais_mao" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Materials Table */}
            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-amber-400" />
                  <span>Lista de Materiais de Obra</span>
                </h3>
                <span className="text-xs font-black text-amber-400">
                  Total: R$ {totalMaterialSpent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {materials.map((m) => (
                  <div key={m.id} className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>{m.name}</span>
                      <span className="text-amber-400">
                        R$ {(m.quantityBought * m.unitPrice).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>Fornecedor: {m.supplier}</span>
                      <span>
                        Qtd: {m.quantityBought}/{m.quantityNeeded} {m.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Labor Table */}
            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <HardHat className="w-5 h-5 text-emerald-400" />
                  <span>Mão de Obra e Profissionais WVR/GDM</span>
                </h3>
                <span className="text-xs font-black text-emerald-400">
                  Total: R$ {totalLaborSpent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {laborList.map((l) => (
                  <div key={l.id} className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>{l.role} ({l.workersCount} prof.)</span>
                      <span className="text-emerald-400">
                        R$ {(l.workersCount * l.dailyRate * l.daysWorked).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>Diária: R$ {l.dailyRate} | Dias: {l.daysWorked}</span>
                      <span className="font-bold text-zinc-300">{l.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REGISTRO FOTOGRÁFICO DA OBRA */}
        {activeTab === "fotos" && (
          <div className="bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-amber-400" />
                  <span>Registro Fotográfico da Obra em Tempo Real</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Transparência total para acompanhamento de longe ou aprovações pelo celular.
                </p>
              </div>

              <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-bold">
                Aprovação Direta pelo Cliente
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {photoLogs.map((photo) => (
                <div key={photo.id} className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden space-y-3 pb-4">
                  <div className="relative h-48 overflow-hidden group">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black text-amber-400 uppercase">
                      {photo.stage}
                    </span>
                    <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-zinc-300">
                      {photo.date}
                    </span>
                  </div>

                  <div className="px-4 space-y-2 text-xs">
                    <h4 className="font-extrabold text-white text-sm">{photo.title}</h4>
                    <p className="text-zinc-400">{photo.description}</p>

                    <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
                      <span className="text-[11px] text-zinc-400">Status Cliente:</span>
                      {photo.approvedByClient ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                          <Clock className="w-3.5 h-3.5" /> Aguardando Vistoria
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: APROVAÇÕES E DOCUMENTOS */}
        {activeTab === "documentos" && (
          <div className="bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-amber-400" />
                  <span>Aprovações, Projetos & Documentação Oficial</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Gerenciamento conduzido pela equipe de engenharia e assessoria das Organizações Rimane.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {[
                { title: "Planta Baixa Arquitetônica Aprovada", status: "Aprovado Prefeitura", date: "20/04/2026", type: "PDF" },
                { title: "ART - Anotação de Responsabilidade Técnica", status: "Registrado CREA/RJ", date: "25/04/2026", type: "PDF" },
                { title: "Proposta de Empreendimento Caixa (PCI)", status: "Aprovado Financiamento", date: "02/05/2026", type: "PDF" },
                { title: "Habite-se Residencial Barra Mansa", status: "Em Emissão", date: "Previsão Mês 4", type: "DOC" },
                { title: "Matrícula do Imóvel Atualizada Rimane", status: "Legalizado Cartório", date: "15/05/2026", type: "PDF" },
                { title: "Contrato de Empreitada WVR Construções", status: "Assinado & Válido", date: "10/04/2026", type: "PDF" },
              ].map((doc, idx) => (
                <div key={idx} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 font-black text-xs">
                    {doc.type}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white">{doc.title}</h4>
                    <p className="text-emerald-400 font-extrabold text-[11px]">{doc.status}</p>
                    <p className="text-zinc-500 text-[10px]">{doc.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: FINANCEIRO & INTEGRACAO BANK INVEST */}
        {activeTab === "financeiro_bank_invest" && (
          <div className="bg-zinc-900 p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">
                  <Wallet className="w-4 h-4" />
                  <span>Módulo Unificado com Bank Invest</span>
                </div>
                <h3 className="text-2xl font-black text-white">
                  Controle Financeiro de Custos e Margem de Lucro
                </h3>
              </div>

              <button
                onClick={handleSyncToBankInvest}
                disabled={isSyncingBankInvest}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-xl transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingBankInvest ? "animate-spin" : ""}`} />
                <span>SINCRONIZAR AGORA COM BANK INVEST</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-zinc-400 font-bold uppercase text-[10px]">Orçamento Total Aprovado</span>
                <div className="text-2xl font-black text-white">
                  R$ {totalCalculatedBudget.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-amber-400">Preço Fixo Contratual</span>
              </div>

              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-zinc-400 font-bold uppercase text-[10px]">Gastos Executados (Mat + Mão)</span>
                <div className="text-2xl font-black text-amber-400">
                  R$ {totalCostExecuted.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-zinc-400">Lançado no Bank Invest</span>
              </div>

              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-zinc-400 font-bold uppercase text-[10px]">Saldo Restante em Caixa</span>
                <div className="text-2xl font-black text-sky-400">
                  R$ {(totalCalculatedBudget - totalCostExecuted).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-sky-400">Disponível para Etapas Futuras</span>
              </div>

              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-zinc-400 font-bold uppercase text-[10px]">Margem Bruta Estimada</span>
                <div className="text-2xl font-black text-emerald-400">
                  R$ {estimatedProfitMargin.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-emerald-400">Retorno da Operação WVR/GDM</span>
              </div>
            </div>

            {/* Portal Link Box via FlowHost */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white">Link do Portal do Cliente via FlowHost</h4>
                  <p className="text-zinc-400">Acesso seguro protegido por criptografia para o cliente ver gastos e boletim físico.</p>
                </div>
              </div>

              <a
                href="https://flowhost.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sky-300 font-bold rounded-xl border border-zinc-700 shrink-0 transition-colors"
              >
                https://flowhost.com.br/cliente/alphatudo-obra
              </a>
            </div>
          </div>
        )}

        {/* TAB 7: IMPACTO AMBIENTAL & SUSTENTABILIDADE */}
        {activeTab === "impacto_ambiental" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* SUB-VIEW NAV TOGGLE: ACUMULADO VS PROJETO ATUAL */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/90 p-2 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEcoSubView("relatorio_acumulado")}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                    ecoSubView === "relatorio_acumulado"
                      ? "bg-emerald-400 text-zinc-950 shadow-lg scale-105"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Relatório Acumulado (Gráficos Recharts)</span>
                </button>

                <button
                  onClick={() => setEcoSubView("projeto_detalhado")}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                    ecoSubView === "projeto_detalhado"
                      ? "bg-emerald-400 text-zinc-950 shadow-lg scale-105"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Leaf className="w-4 h-4" />
                  <span>Simulador & Obra Atual ({areaM2} m²)</span>
                </button>
              </div>

              <button
                onClick={() => setIsEcoCertificateModalOpen(true)}
                className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all ml-auto"
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Certificado Obra Verde</span>
              </button>
            </div>

            {/* VIEW 1: CUMULATIVE RECHARTS VISUAL REPORT */}
            {ecoSubView === "relatorio_acumulado" && <CumulativeEcoReport />}

            {/* VIEW 2: SINGLE PROJECT SIMULATOR & DETAILED BREAKDOWN */}
            {ecoSubView === "projeto_detalhado" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* HEADER BANNER */}
                <div className="bg-gradient-to-br from-emerald-950/60 via-zinc-900 to-zinc-950 p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/40 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
                      <Leaf className="w-3.5 h-3.5" />
                      <span>Sustentabilidade & Engenharia Verde WVR</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                      <span>Impacto Ambiental dos Materiais do Projeto</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Cálculo em tempo real da pegada de carbono (CO₂e), estimativa de desperdício e entulho (Resolução CONAMA 307) e pontuação de eficiência ecológica para o projeto de <span className="text-emerald-400 font-bold">{areaM2} m²</span>.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      onClick={() => setIsEcoCertificateModalOpen(true)}
                      className="px-5 py-3 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-zinc-950 font-black text-xs rounded-2xl shadow-xl flex items-center gap-2 transition-all scale-100 hover:scale-105"
                    >
                      <Award className="w-4 h-4" />
                      <span>Emitir Certificado Obra Verde</span>
                    </button>
                  </div>
                </div>

            {/* 4 CORE KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* KPI 1: Pegada de Carbono */}
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-2 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                    Pegada de Carbono Total
                  </span>
                  <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <Leaf className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">
                  {ecoCalculations.finalCO2Tons.toFixed(2)}{" "}
                  <span className="text-sm font-extrabold text-emerald-400">t CO₂e</span>
                </div>
                <p className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>-{ecoCalculations.co2SavedKg.toFixed(0)} kg CO₂ economizados vs. obra padrão</span>
                </p>
              </div>

              {/* KPI 2: Desperdício de Entulho */}
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-2 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
                <div className="flex items-center justify-between text-amber-400">
                  <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                    Desperdício Est. de Entulho
                  </span>
                  <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <Trash2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">
                  {ecoCalculations.wasteVolumeM3}{" "}
                  <span className="text-sm font-extrabold text-amber-400">m³</span>
                </div>
                <p className="text-[11px] text-amber-300 font-medium">
                  Economia de R$ {ecoCalculations.wasteSavingsBRL.toLocaleString("pt-BR", { minimumFractionDigits: 0 })} em caçambas & refugo
                </p>
              </div>

              {/* KPI 3: Compensação Florestal */}
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-2 relative overflow-hidden group hover:border-teal-500/50 transition-colors">
                <div className="flex items-center justify-between text-teal-400">
                  <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                    Compensação Florestal
                  </span>
                  <div className="p-2 bg-teal-500/10 rounded-xl border border-teal-500/20">
                    <Trees className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">
                  {ecoCalculations.treesToPlant}{" "}
                  <span className="text-sm font-extrabold text-teal-400">Árvores</span>
                </div>
                <p className="text-[11px] text-teal-300 font-medium">
                  Necessárias para neutralizar CO₂ na vida útil do imóvel
                </p>
              </div>

              {/* KPI 4: Score EcoBuild WVR */}
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-2 relative overflow-hidden group hover:border-sky-500/50 transition-colors">
                <div className="flex items-center justify-between text-sky-400">
                  <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                    Pontuação EcoBuild WVR
                  </span>
                  <div className="p-2 bg-sky-500/10 rounded-xl border border-sky-500/20">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">
                  {ecoCalculations.ecoScore}{" "}
                  <span className="text-sm font-extrabold text-sky-400">/ 100</span>
                </div>
                <p className="text-[11px] text-sky-300 font-extrabold truncate">
                  {ecoCalculations.ecoBadge}
                </p>
              </div>
            </div>

            {/* TOGGLES INTERATIVOS DE TECNOLOGIAS ECOLÓGICAS */}
            <div className="bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
                <div>
                  <h4 className="text-lg font-black text-white flex items-center gap-2">
                    <Recycle className="w-5 h-5 text-emerald-400" />
                    <span>Simulador de Práticas & Tecnologias Sustentáveis</span>
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Ative ou desative diretrizes de engenharia ecológica para ver o impacto direto nos indicadores da sua obra.
                  </p>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full shrink-0">
                  Simulação em Tempo Real
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* Toggle 1 */}
                <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  ecoToggles.wasteSorting ? "bg-emerald-950/30 border-emerald-500/60 shadow-lg" : "bg-zinc-950 border-zinc-800 opacity-70"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-extrabold text-white text-sm flex items-center gap-1.5">
                        📦 Coleta Seletiva & Triagem
                      </span>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        Separação no canteiro para reciclagem Classe A/B (CONAMA 307).
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={ecoToggles.wasteSorting}
                      onChange={(e) => setEcoToggles({ ...ecoToggles, wasteSorting: e.target.checked })}
                      className="w-5 h-5 accent-emerald-400 cursor-pointer shrink-0 mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px]">
                    <span className="text-emerald-400 font-bold">-55% Entulho residual</span>
                    <span className="text-zinc-400 font-bold">+9 Pontos Eco</span>
                  </div>
                </label>

                {/* Toggle 2 */}
                <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  ecoToggles.recycledSteel ? "bg-emerald-950/30 border-emerald-500/60 shadow-lg" : "bg-zinc-950 border-zinc-800 opacity-70"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-extrabold text-white text-sm flex items-center gap-1.5">
                        🔩 Aço CA-50 100% Reciclado
                      </span>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        Aço Gerdau reprocessado de sucata industrial e automotiva.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={ecoToggles.recycledSteel}
                      onChange={(e) => setEcoToggles({ ...ecoToggles, recycledSteel: e.target.checked })}
                      className="w-5 h-5 accent-emerald-400 cursor-pointer shrink-0 mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px]">
                    <span className="text-emerald-400 font-bold">-40% CO₂ no Aço</span>
                    <span className="text-zinc-400 font-bold">+8 Pontos Eco</span>
                  </div>
                </label>

                {/* Toggle 3 */}
                <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  ecoToggles.fscMdfGdm ? "bg-emerald-950/30 border-emerald-500/60 shadow-lg" : "bg-zinc-950 border-zinc-800 opacity-70"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-extrabold text-white text-sm flex items-center gap-1.5">
                        🌲 MDF GDM Certificado FSC
                      </span>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        Móveis em madeira 100% reflorestada com corte otimizado GDM.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={ecoToggles.fscMdfGdm}
                      onChange={(e) => setEcoToggles({ ...ecoToggles, fscMdfGdm: e.target.checked })}
                      className="w-5 h-5 accent-emerald-400 cursor-pointer shrink-0 mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px]">
                    <span className="text-emerald-400 font-bold">Sequestro de Carbono</span>
                    <span className="text-zinc-400 font-bold">+8 Pontos Eco</span>
                  </div>
                </label>

                {/* Toggle 4 */}
                <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  ecoToggles.rainwaterHarvesting ? "bg-emerald-950/30 border-emerald-500/60 shadow-lg" : "bg-zinc-950 border-zinc-800 opacity-70"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-extrabold text-white text-sm flex items-center gap-1.5">
                        💧 Captação de Água de Chuva
                      </span>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        Tanque temporário para lavagem, cura do concreto e limpeza de canteiro.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={ecoToggles.rainwaterHarvesting}
                      onChange={(e) => setEcoToggles({ ...ecoToggles, rainwaterHarvesting: e.target.checked })}
                      className="w-5 h-5 accent-emerald-400 cursor-pointer shrink-0 mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px]">
                    <span className="text-emerald-400 font-bold">-12.000 L Água Potável</span>
                    <span className="text-zinc-400 font-bold">+7 Pontos Eco</span>
                  </div>
                </label>

                {/* Toggle 5 */}
                <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  ecoToggles.solarPanelIntegration ? "bg-emerald-950/30 border-emerald-500/60 shadow-lg" : "bg-zinc-950 border-zinc-800 opacity-70"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-extrabold text-white text-sm flex items-center gap-1.5">
                        ☀️ Painéis Solares Fotovoltaicos
                      </span>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        Geração própria de energia renovável integrada ao projeto elétrico.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={ecoToggles.solarPanelIntegration}
                      onChange={(e) => setEcoToggles({ ...ecoToggles, solarPanelIntegration: e.target.checked })}
                      className="w-5 h-5 accent-emerald-400 cursor-pointer shrink-0 mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px]">
                    <span className="text-emerald-400 font-bold">-18% CO₂ Residual</span>
                    <span className="text-zinc-400 font-bold">+5 Pontos Eco</span>
                  </div>
                </label>

                {/* Toggle 6 */}
                <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  ecoToggles.greenRoofOption ? "bg-emerald-950/30 border-emerald-500/60 shadow-lg" : "bg-zinc-950 border-zinc-800 opacity-70"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-extrabold text-white text-sm flex items-center gap-1.5">
                        🌱 Cobertura Térmica Eco-Verde
                      </span>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        Isolamento natural da laje reduzindo necessidade de ar-condicionado.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={ecoToggles.greenRoofOption}
                      onChange={(e) => setEcoToggles({ ...ecoToggles, greenRoofOption: e.target.checked })}
                      className="w-5 h-5 accent-emerald-400 cursor-pointer shrink-0 mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px]">
                    <span className="text-emerald-400 font-bold">-3.5°C Temperatura Térmica</span>
                    <span className="text-zinc-400 font-bold">+3 Pontos Eco</span>
                  </div>
                </label>
              </div>
            </div>

            {/* TABELA DE MATERIAIS E PEGADA DE CARBONO INDIVIDUAL */}
            <div className="bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <h4 className="text-lg font-black text-white flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-amber-400" />
                    <span>Análise Detalhada por Material Selecionado</span>
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Demonstrativo de emissões unitárias, descarte estimado e notas de rastreabilidade ambiental.
                  </p>
                </div>

                {/* Filtro por Categoria */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  {["Todas", "Estrutura", "Alvenaria", "Acabamento", "Móveis GDM"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedEcoCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        selectedEcoCategoryFilter === cat
                          ? "bg-emerald-400 text-zinc-950 font-black shadow"
                          : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* TABELA */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase font-black text-[10px] tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="p-3.5 rounded-l-xl">Material & Supplier</th>
                      <th className="p-3.5">Qtd. Selecionada</th>
                      <th className="p-3.5">Emissão Un. (kg CO₂)</th>
                      <th className="p-3.5">Pegada Total (kg CO₂)</th>
                      <th className="p-3.5">Desperdício Est. (%)</th>
                      <th className="p-3.5">Reciclabilidade</th>
                      <th className="p-3.5 rounded-r-xl">Selo / Rastreabilidade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-medium">
                    {materials
                      .filter(
                        (m) =>
                          selectedEcoCategoryFilter === "Todas" ||
                          m.category.toLowerCase().includes(selectedEcoCategoryFilter.toLowerCase())
                      )
                      .map((item) => {
                        const eco = getMaterialEcoMetrics(item);
                        const isNegativeCO2 = eco.totalCO2Kg < 0;

                        return (
                          <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                            <td className="p-3.5 font-bold text-white">
                              <div>{item.name}</div>
                              <div className="text-[10px] font-normal text-zinc-400">{item.supplier} • {item.category}</div>
                            </td>
                            <td className="p-3.5 font-bold text-zinc-200">
                              {item.quantityNeeded} {item.unit}
                            </td>
                            <td className="p-3.5 font-bold text-zinc-300">
                              {eco.unitCO2Kg > 0 ? `+${eco.unitCO2Kg}` : eco.unitCO2Kg} kg
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`inline-flex items-center gap-1 font-black px-2.5 py-1 rounded-lg text-xs ${
                                  isNegativeCO2
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                    : "bg-zinc-950 text-amber-300 border border-zinc-800"
                                }`}
                              >
                                {isNegativeCO2 ? (
                                  <>🌱 {eco.totalCO2Kg.toFixed(1)} kg (Crédito)</>
                                ) : (
                                  <>{eco.totalCO2Kg.toLocaleString("pt-BR")} kg CO₂</>
                                )}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-amber-400">
                              {eco.wastePercentage.toFixed(1)}% ({eco.wasteQuantity.toFixed(1)} {item.unit})
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-400 rounded-full"
                                    style={{ width: `${eco.recyclability}%` }}
                                  ></div>
                                </div>
                                <span className="text-[11px] font-bold text-emerald-400">{eco.recyclability}%</span>
                              </div>
                            </td>
                            <td className="p-3.5 text-[11px] text-zinc-400 italic max-w-xs truncate">
                              {eco.ecoNote}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DESTRUCTIVE WASTE DESTINATION & CONAMA 307 BAR */}
            <div className="bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
                <div>
                  <h4 className="text-lg font-black text-white flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-amber-400" />
                    <span>Plano de Gestão de Resíduos de Construção Civil (PGRCC / CONAMA 307)</span>
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Destinação sustentável estimada para as <span className="text-amber-400 font-bold">{ecoCalculations.wasteVolumeM3} m³</span> de sobra técnica da obra.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* Bar 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-extrabold text-white">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Classe A - Agregados Reciclados (Tijolos, Concreto e Argamassa)
                    </span>
                    <span>68% ({((parseFloat(ecoCalculations.wasteVolumeM3) * 0.68)).toFixed(2)} m³)</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: "68%" }}></div>
                  </div>
                  <p className="text-[10px] text-zinc-400">Triturado para sub-base de calçadas, contrapiso e pavimentação local.</p>
                </div>

                {/* Bar 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-extrabold text-white">
                    <span className="flex items-center gap-1.5 text-sky-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Classe B - Recicláveis Siderúrgicos & Plásticos (Aço CA-50, PVC, Embalagens)
                    </span>
                    <span>22% ({((parseFloat(ecoCalculations.wasteVolumeM3) * 0.22)).toFixed(2)} m³)</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: "22%" }}></div>
                  </div>
                  <p className="text-[10px] text-zinc-400">Encaminhado para siderúrgicas Gerdau e cooperativas de reciclagem em Volta Redonda.</p>
                </div>

                {/* Bar 3 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-extrabold text-white">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Sobra Reaproveitável de Madeira & MDF GDM 100% FSC
                    </span>
                    <span>7% ({((parseFloat(ecoCalculations.wasteVolumeM3) * 0.07)).toFixed(2)} m³)</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: "7%" }}></div>
                  </div>
                  <p className="text-[10px] text-zinc-400">Retalhos transformados em calços de fôrmas ou biomassa energética.</p>
                </div>

                {/* Bar 4 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-extrabold text-white">
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      Classe C/D - Descarte Residual Mínimo em Aterro Licenciado
                    </span>
                    <span>3% ({((parseFloat(ecoCalculations.wasteVolumeM3) * 0.03)).toFixed(2)} m³)</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div className="h-full bg-zinc-600 rounded-full" style={{ width: "3%" }}></div>
                  </div>
                  <p className="text-[10px] text-zinc-400">Apenas resíduos não recicláveis com destinação final auditada.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )}

        {/* TAB 8: DASHBOARD DE CUSTOS (FIRESTORE) */}
        {activeTab === "dashboard_custos" && <CostDashboardModule />}

        {/* MODAL: CERTIFICADO DIGITAL DE OBRA VERDE */}
        {isEcoCertificateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-zinc-950 border-2 border-emerald-500/80 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white shadow-2xl relative max-h-[92vh] flex flex-col animate-in zoom-in fade-in duration-200">
              <button
                onClick={() => setIsEcoCertificateModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto space-y-6 pr-1 flex-1 text-center border-4 border-emerald-500/30 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-emerald-950/20 relative">
                {/* WATERMARK BADGE */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50 flex items-center justify-center shadow-xl">
                    <Award className="w-10 h-10" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">
                    ORGANIZAÇÕES RIMANE • WVR ENGENHARIA • GDM MÓVEIS
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    Certificado de Obra Sustentável & Baixa Emissão
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Selo Oficial de Responsabilidade Ecológica e Eficiência de Materiais
                  </p>
                </div>

                <div className="py-4 border-y border-zinc-800 space-y-3 text-xs text-zinc-300 text-left">
                  <p>
                    Atestamos para os devidos fins de licenciamento e valorização imobiliária que o empreendimento <strong className="text-white">AlphaTudo Obra ({areaM2} m²)</strong> atende aos critérios internacionais de construção de baixo impacto ambiental, utilizando materiais de procedência auditada.
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-zinc-400 font-bold">Pegada Calculada CO₂e:</span>
                      <div className="font-black text-emerald-400 text-sm">{ecoCalculations.finalCO2Tons.toFixed(2)} Toneladas</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-zinc-400 font-bold">Resíduos / Entulho:</span>
                      <div className="font-black text-amber-400 text-sm">{ecoCalculations.wasteVolumeM3} m³ (Classe A/B)</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-zinc-400 font-bold">Pontuação EcoBuild:</span>
                      <div className="font-black text-sky-400 text-sm">{ecoCalculations.ecoScore} / 100 Pts</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-zinc-400 font-bold">Selo Concedido:</span>
                      <div className="font-black text-emerald-300 text-sm">{ecoCalculations.ecoBadge}</div>
                    </div>
                  </div>
                </div>

                {/* SIGNATURES */}
                <div className="grid grid-cols-2 gap-6 pt-2 text-center text-[11px]">
                  <div className="space-y-1">
                    <div className="border-b border-zinc-700 pb-1 font-bold text-white">Eng. Resp. WVR Construções</div>
                    <div className="text-[10px] text-zinc-400">CREA/RJ 2026-88412</div>
                  </div>
                  <div className="space-y-1">
                    <div className="border-b border-zinc-700 pb-1 font-bold text-white">Diretoria Organizações Rimane</div>
                    <div className="text-[10px] text-zinc-400">Barra Mansa / Sul Fluminense</div>
                  </div>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
                <span className="text-[10px] text-zinc-400 italic">
                  Código de Autenticidade: ECO-{Math.random().toString(36).substring(2, 9).toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Imprimir / PDF</span>
                  </button>
                  <button
                    onClick={() => setIsEcoCertificateModalOpen(false)}
                    className="px-5 py-2 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-black text-xs rounded-xl shadow-lg transition-colors"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FLOATING PUSH TOAST BANNER */}
        {toastNotification.visible && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-zinc-950 border-2 border-amber-500/80 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom duration-300 text-white space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <BellRing className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-amber-400 uppercase tracking-wider">
                    {toastNotification.title}
                  </h4>
                  <span className="text-[10px] text-zinc-400">Etapa: {toastNotification.stageName}</span>
                </div>
              </div>
              <button
                onClick={() => setToastNotification((prev) => ({ ...prev, visible: false }))}
                className="p-1 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-200 pl-11">{toastNotification.body}</p>
            <div className="pl-11 pt-1 flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab("cronograma");
                  setToastNotification((prev) => ({ ...prev, visible: false }));
                }}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-[10px] rounded-lg transition-all"
              >
                Ver Cronograma
              </button>
            </div>
          </div>
        )}

        {/* MODAL: HISTÓRICO DE NOTIFICAÇÕES PUSH */}
        {isPushHistoryOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-950 border-2 border-amber-500/80 rounded-3xl p-6 max-w-xl w-full text-white shadow-2xl relative max-h-[85vh] flex flex-col animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setIsPushHistoryOpen(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Central de Notificações Push da Obra</h3>
                  <p className="text-xs text-zinc-400">
                    Histórico de avisos de cronograma enviados ao cliente.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between pb-3 text-xs">
                <span className="text-zinc-400 font-bold">
                  {pushNotifications.length} Notificação(ões) • {unreadCount} não lida(s)
                </span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllNotificationsRead}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded-lg text-[11px] font-bold transition-colors"
                    >
                      Marcar Lidas
                    </button>
                  )}
                  {pushNotifications.length > 0 && (
                    <button
                      onClick={handleClearNotificationHistory}
                      className="px-2.5 py-1 bg-zinc-900 hover:bg-red-950 text-red-400 rounded-lg text-[11px] font-bold border border-zinc-800 transition-colors"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </div>

              {/* Notification Items List */}
              <div className="overflow-y-auto space-y-3 pr-1 flex-1">
                {pushNotifications.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 text-xs space-y-2">
                    <Bell className="w-8 h-8 mx-auto opacity-40 text-amber-400" />
                    <p>Nenhuma notificação enviada no histórico.</p>
                  </div>
                ) : (
                  pushNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-2xl border text-xs space-y-1 transition-all ${
                        !notif.read
                          ? "bg-amber-950/20 border-amber-500/50"
                          : "bg-zinc-900 border-zinc-800"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-white text-xs sm:text-sm font-extrabold">{notif.title}</span>
                        <span className="text-[10px] text-zinc-400 shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{notif.body}</p>
                      <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-500">
                        <span>Etapa: <strong className="text-amber-400">{notif.stageName}</strong></span>
                        {!notif.read && (
                          <span className="text-amber-400 font-black bg-amber-500/20 px-2 py-0.5 rounded-full">
                            NOVA
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <button
                  onClick={() => setIsPushHistoryOpen(false)}
                  className="px-5 py-2.5 bg-amber-400 text-zinc-950 font-black text-xs rounded-xl hover:bg-amber-300 transition-colors"
                >
                  Fechar Central
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: EDITAR ETAPA DE CRONOGRAMA & ENVIAR PUSH */}
        {editingStage && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-950 border-2 border-amber-500/80 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setEditingStage(null)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Editar Etapa do Cronograma</h3>
                  <p className="text-xs text-zinc-400">Atualização do andamento e envio de Push Notification.</p>
                </div>
              </div>

              <form onSubmit={handleSaveStageEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Nome da Etapa:</label>
                  <input
                    type="text"
                    value={stageFormData.stage}
                    onChange={(e) => setStageFormData({ ...stageFormData, stage: e.target.value })}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Progresso (%):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stageFormData.progress}
                        onChange={(e) => setStageFormData({ ...stageFormData, progress: Number(e.target.value) })}
                        className="w-full accent-amber-400"
                      />
                      <span className="font-black text-white text-sm w-12 text-right">{stageFormData.progress}%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Status da Etapa:</label>
                    <select
                      value={stageFormData.status}
                      onChange={(e) =>
                        setStageFormData({
                          ...stageFormData,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                    >
                      <option value="Concluído">Concluído</option>
                      <option value="Em Andamento">Em Andamento</option>
                      <option value="Iniciando">Iniciando</option>
                      <option value="Aguardando">Aguardando</option>
                      <option value="Atrasado">Atrasado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Previsão (Mês/Data):</label>
                    <input
                      type="text"
                      value={stageFormData.date}
                      onChange={(e) => setStageFormData({ ...stageFormData, date: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Eng. / Responsável:</label>
                    <input
                      type="text"
                      value={stageFormData.responsible}
                      onChange={(e) => setStageFormData({ ...stageFormData, responsible: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Observações da Engenharia WVR:</label>
                  <textarea
                    rows={2}
                    value={stageFormData.observations}
                    onChange={(e) => setStageFormData({ ...stageFormData, observations: e.target.value })}
                    placeholder="Resumo técnico do trabalho realizado no dia..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-amber-300 text-xs">Enviar Notificação Push ao Cliente</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={stageFormData.sendPush}
                    onChange={(e) => setStageFormData({ ...stageFormData, sendPush: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingStage(null)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl shadow-lg flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Salvar & Notificar</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADICIONAR NOVA ETAPA DE CRONOGRAMA */}
        {isAddingStageModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-950 border-2 border-amber-500/80 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setIsAddingStageModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Incluir Nova Etapa de Obra</h3>
                  <p className="text-xs text-zinc-400">Adicione uma fase personalizada ao planejamento da construção.</p>
                </div>
              </div>

              <form onSubmit={handleAddNewStage} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Nome da Nova Etapa:</label>
                  <input
                    type="text"
                    placeholder="Ex: Instalação de Energia Solar Photovoltaica"
                    value={stageFormData.stage}
                    onChange={(e) => setStageFormData({ ...stageFormData, stage: e.target.value })}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Previsão de Entrega:</label>
                    <input
                      type="text"
                      placeholder="Ex: Mês 3 ou 15/09/2026"
                      value={stageFormData.date}
                      onChange={(e) => setStageFormData({ ...stageFormData, date: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Engenheiro / Responsável:</label>
                    <input
                      type="text"
                      placeholder="Ex: Eng. Rimane WVR"
                      value={stageFormData.responsible}
                      onChange={(e) => setStageFormData({ ...stageFormData, responsible: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Descrição / Detalhes Iniciais:</label>
                  <textarea
                    rows={2}
                    placeholder="Descreva os materiais e especificações técnicas da fase..."
                    value={stageFormData.observations}
                    onChange={(e) => setStageFormData({ ...stageFormData, observations: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-amber-300 text-xs">Disparar Alerta Push ao Cliente</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={stageFormData.sendPush}
                    onChange={(e) => setStageFormData({ ...stageFormData, sendPush: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingStageModalOpen(false)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl shadow-lg flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Adicionar & Notificar</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: PAINEL DE PREFERÊNCIAS DE NOTIFICAÇÕES PUSH */}
        {isPushPreferencesOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-950 border-2 border-amber-500/80 rounded-3xl p-6 max-w-xl w-full text-white shadow-2xl relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setIsPushPreferencesOpen(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Preferências de Notificação Push</h3>
                  <p className="text-xs text-zinc-400">
                    Configure quais avisos de cronograma da sua obra devem disparar notificações instantâneas.
                  </p>
                </div>
              </div>

              <div className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs">
                {/* CATEGORIAS DE ALERTA */}
                <div className="space-y-3">
                  <h4 className="font-black text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <BellRing className="w-4 h-4" />
                    <span>Categorias de Atualizações do Cronograma</span>
                  </h4>

                  {/* Toggle 1: Progresso & Percentuais */}
                  <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors">
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-white text-xs sm:text-sm flex items-center gap-1.5">
                        📈 Avanço de Obra & Percentuais
                      </span>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Push quando o progresso percentual de uma etapa for atualizado (ex: +10% de avanço).
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={pushPreferences.notifyProgress}
                        onChange={(e) =>
                          setPushPreferences({ ...pushPreferences, notifyProgress: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                    </label>
                  </div>

                  {/* Toggle 2: Conclusão de Etapas */}
                  <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors">
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-white text-xs sm:text-sm flex items-center gap-1.5">
                        🎉 Conclusão de Etapas (100%)
                      </span>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Push comemorativo quando qualquer fase do projeto atingir 100% de conclusão.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={pushPreferences.notifyCompletion}
                        onChange={(e) =>
                          setPushPreferences({ ...pushPreferences, notifyCompletion: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-400"></div>
                    </label>
                  </div>

                  {/* Toggle 3: Atrasos & Alertas */}
                  <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors">
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-white text-xs sm:text-sm flex items-center gap-1.5">
                        ⚠️ Alertas de Atraso & Prazos
                      </span>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Notificações prioritárias caso haja reprogramação técnica de datas ou atrasos.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={pushPreferences.notifyDelay}
                        onChange={(e) =>
                          setPushPreferences({ ...pushPreferences, notifyDelay: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-400"></div>
                    </label>
                  </div>

                  {/* Toggle 4: Diário de Campo & Entregas */}
                  <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors">
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-white text-xs sm:text-sm flex items-center gap-1.5">
                        🛠️ Diário de Campo & Entregas
                      </span>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Relatórios técnicos do Mestre de Obras, conferências de materiais e vistorias.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={pushPreferences.notifyFieldUpdates}
                        onChange={(e) =>
                          setPushPreferences({ ...pushPreferences, notifyFieldUpdates: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-400"></div>
                    </label>
                  </div>

                  {/* Toggle 5: Avisos do Sistema */}
                  <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors">
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-white text-xs sm:text-sm flex items-center gap-1.5">
                        📌 Sistema & Inclusão de Fases
                      </span>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Push ao incluir novas etapas, alterar responsáveis ou reestruturar o planejamento.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={pushPreferences.notifySystem}
                        onChange={(e) =>
                          setPushPreferences({ ...pushPreferences, notifySystem: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                    </label>
                  </div>
                </div>

                {/* SINAIS SONOROS & HORÁRIO NOTURNO */}
                <div className="pt-2 border-t border-zinc-800 space-y-3">
                  <h4 className="font-black text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4" />
                    <span>Canais & Sinais Sonoros</span>
                  </h4>

                  {/* Sound Enabled */}
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-white">Efeito Sonoro Acústico</span>
                      <p className="text-[11px] text-zinc-400">Tocar sinal sonoro no alto-falante ao receber atualizações.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={pushPreferences.soundEnabled}
                      onChange={(e) => setPushPreferences({ ...pushPreferences, soundEnabled: e.target.checked })}
                      className="w-4 h-4 accent-amber-400 cursor-pointer shrink-0"
                    />
                  </div>

                  {/* Quiet Hours */}
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-white">Modo Silencioso Noturno (22:00 às 07:00)</span>
                      <p className="text-[11px] text-zinc-400">Muta os alertas de áudio durante a noite para preservar seu sono.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={pushPreferences.quietHours}
                      onChange={(e) => setPushPreferences({ ...pushPreferences, quietHours: e.target.checked })}
                      className="w-4 h-4 accent-amber-400 cursor-pointer shrink-0"
                    />
                  </div>

                  {/* Email Backup */}
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-white">Resumo por E-mail Oficial</span>
                      <p className="text-[11px] text-zinc-400">Envia espelho do push para o e-mail do cliente cadastrado na WVR.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={pushPreferences.emailBackup}
                      onChange={(e) => setPushPreferences({ ...pushPreferences, emailBackup: e.target.checked })}
                      className="w-4 h-4 accent-amber-400 cursor-pointer shrink-0"
                    />
                  </div>
                </div>

                {/* PERSISTENCE NOTE */}
                <div className="pt-2 p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-[11px] text-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Preferências salvas e sincronizadas automaticamente no localStorage.</span>
                  </div>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPushPreferences({
                      notifyProgress: true,
                      notifyCompletion: true,
                      notifyDelay: true,
                      notifyFieldUpdates: true,
                      notifySystem: true,
                      soundEnabled: true,
                      quietHours: false,
                      emailBackup: true,
                    });
                  }}
                  className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold text-xs rounded-xl border border-zinc-800 transition-colors"
                >
                  Restaurar Padrão
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sendSchedulePushNotification(
                        "🧪 TESTE DE PREFERÊNCIAS PUSH",
                        "Configurações de Push aplicadas com sucesso no AlphaTudo Obra!",
                        "Painel de Configurações",
                        "system"
                      );
                    }}
                    className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition-colors"
                  >
                    Testar Push
                  </button>

                  <button
                    onClick={() => setIsPushPreferencesOpen(false)}
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl shadow-lg transition-colors"
                  >
                    Salvar & Concluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
