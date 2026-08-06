import React, { useState } from "react";
import {
  HardHat,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  Boxes,
  ShieldCheck,
  TrendingUp,
  Filter,
  Search,
  Plus,
  ChevronRight,
  UserCheck,
  MapPin,
  Send,
  PieChart,
  ListTodo,
  X,
  Sparkles,
  ArrowUpRight,
  Briefcase,
  Check,
  FileText,
  Printer,
  Download,
  Bell,
  BellRing,
  BellOff,
  Trash2,
  AlertCircle,
  Smartphone,
  Volume2,
  Flame,
  Cloud
} from "lucide-react";
import { MainTab, Project3DState } from "../types";
import { INITIAL_PROJECT_3D } from "../data/initialData";
import { TimelineVisualizer } from "./TimelineVisualizer";
import { ConstructionAchievements } from "./ConstructionAchievements";
import { Trophy } from "lucide-react";
import { FirestoreSyncModal } from "./FirestoreSyncModal";

export interface ConstructionReminder {
  id: string;
  workId: string;
  workTitle: string;
  type: "medicao" | "entrega_material" | "vistoria" | "pagamento" | "outro";
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  priority: "alta" | "media" | "normal";
  status: "pending" | "completed";
  pushEnabled: boolean;
  createdAt: string;
}

export interface ActiveWorkStep {
  id: number;
  name: string;
  status: "completed" | "in_progress" | "pending";
  completedDate?: string;
  expectedDate?: string;
}

export interface ActiveWork {
  id: string;
  title: string;
  clientName: string;
  brand: "WVR" | "GDM" | "UNIVERSO_ADAS" | "PAU PARA TODA OBRA";
  location: string;
  budgetTotal: number;
  spentAmount: number;
  startDate: string;
  expectedCompletionDate: string;
  status: "em_dia" | "adiantado" | "atencao";
  currentStepIndex: number;
  nextPendingStep: string;
  responsibleEngineer: string;
  steps: ActiveWorkStep[];
  notes?: string;
  categoriesBreakdown: {
    materialsSpent: number;
    materialsBudget: number;
    laborSpent: number;
    laborBudget: number;
    finishesSpent: number;
    finishesBudget: number;
  };
}

const INITIAL_ACTIVE_WORKS: ActiveWork[] = [
  {
    id: "obra-01",
    title: "Residência Família Oliveira - Chave na Mão",
    clientName: "Marcos & Patrícia Oliveira",
    brand: "WVR",
    location: "Bairro Aterrado, Volta Redonda - RJ",
    budgetTotal: 320000,
    spentAmount: 185400,
    startDate: "10/01/2026",
    expectedCompletionDate: "15/11/2026",
    status: "em_dia",
    currentStepIndex: 3,
    nextPendingStep: "Instalação de esquadrias de alumínio, vidros e fiação da rede elétrica",
    responsibleEngineer: "Eng. Amanda Silva (CREA-RJ)",
    steps: [
      { id: 1, name: "Terraplenagem & Sondagem", status: "completed", completedDate: "25/01/2026" },
      { id: 2, name: "Fundação Radiê Reforçada", status: "completed", completedDate: "20/02/2026" },
      { id: 3, name: "Alvenaria & Laje 2º Piso", status: "completed", completedDate: "15/04/2026" },
      { id: 4, name: "Cobertura & Esquadrias", status: "in_progress", expectedDate: "20/08/2026" },
      { id: 5, name: "Instalações Hidroelétricas", status: "pending", expectedDate: "25/09/2026" },
      { id: 6, name: "Acabamento & Entrega da Chave", status: "pending", expectedDate: "15/11/2026" },
    ],
    notes: "Fundação reforçada concluída sem intercorrências. Material de esquadria já encomendado.",
    categoriesBreakdown: {
      materialsSpent: 98000,
      materialsBudget: 150000,
      laborSpent: 62400,
      laborBudget: 110000,
      finishesSpent: 25000,
      finishesBudget: 60000,
    }
  },
  {
    id: "obra-02",
    title: "Apartamento Jardim Amália - Móveis GDM",
    clientName: "Dra. Renata Vasconcelos",
    brand: "GDM",
    location: "Jardim Amália, Volta Redonda - RJ",
    budgetTotal: 48500,
    spentAmount: 42000,
    startDate: "05/06/2026",
    expectedCompletionDate: "28/08/2026",
    status: "adiantado",
    currentStepIndex: 4,
    nextPendingStep: "Ajuste de fitas LED embutidas na cozinha e teste de amortecedores",
    responsibleEngineer: "Marcos GDM (Marcenaria Fina)",
    steps: [
      { id: 1, name: "Medição Laser & Desenho 3D", status: "completed", completedDate: "10/06/2026" },
      { id: 2, name: "Corte MDF Naval & Furação", status: "completed", completedDate: "28/06/2026" },
      { id: 3, name: "Montagem de Caixaria Closet", status: "completed", completedDate: "12/07/2026" },
      { id: 4, name: "Instalação Cozinha & Painéis LED", status: "completed", completedDate: "01/08/2026" },
      { id: 5, name: "Ajuste Fino & Iluminação", status: "in_progress", expectedDate: "15/08/2026" },
      { id: 6, name: "Limpeza Fina & Vistoria Final", status: "pending", expectedDate: "28/08/2026" },
    ],
    notes: "Montagem adiantada em 10 dias. Cliente aprovou o padrão de iluminação cênica.",
    categoriesBreakdown: {
      materialsSpent: 26000,
      materialsBudget: 28000,
      laborSpent: 12000,
      laborBudget: 14500,
      finishesSpent: 4000,
      finishesBudget: 6000,
    }
  },
  {
    id: "obra-03",
    title: "Reforma Comercial Loja Centro",
    clientName: "Grupo Comercial Varejo Sul",
    brand: "WVR",
    location: "Centro, Barra Mansa - RJ",
    budgetTotal: 85000,
    spentAmount: 38200,
    startDate: "01/07/2026",
    expectedCompletionDate: "10/10/2026",
    status: "atencao",
    currentStepIndex: 1,
    nextPendingStep: "Cura do contrapiso para liberação de assentamento do porcelanato 90x90",
    responsibleEngineer: "Mestre Carlos (Alvenaria WVR)",
    steps: [
      { id: 1, name: "Demolição & Remoção de Entulho", status: "completed", completedDate: "12/07/2026" },
      { id: 2, name: "Contrapiso & Rede Elétrica Triásica", status: "in_progress", expectedDate: "10/08/2026" },
      { id: 3, name: "Porcelanato & Revestimentos", status: "pending", expectedDate: "30/08/2026" },
      { id: 4, name: "Pintura Texturizada & Drywall", status: "pending", expectedDate: "20/09/2026" },
      { id: 5, name: "Fachada & Entrega do Ponto", status: "pending", expectedDate: "10/10/2026" },
    ],
    notes: "Pequeno atraso de 3 dias devido ao tempo de cura do contrapiso úmido. Cronograma sob controle.",
    categoriesBreakdown: {
      materialsSpent: 22000,
      materialsBudget: 45000,
      laborSpent: 14200,
      laborBudget: 30000,
      finishesSpent: 2000,
      finishesBudget: 10000,
    }
  },
  {
    id: "obra-04",
    title: "Área Gourmet com Piscina Rancho Verde",
    clientName: "Eng. Fernando & família",
    brand: "PAU PARA TODA OBRA",
    location: "Rancho Verde, Resende - RJ",
    budgetTotal: 145000,
    spentAmount: 98000,
    startDate: "15/03/2026",
    expectedCompletionDate: "05/12/2026",
    status: "em_dia",
    currentStepIndex: 2,
    nextPendingStep: "Instalação do deck ecológico de cumaru e impermeabilização da piscina",
    responsibleEngineer: "Serralheria & Carpintaria ArteMetal",
    steps: [
      { id: 1, name: "Escavação & Estrutura de Concreto", status: "completed", completedDate: "10/04/2026" },
      { id: 2, name: "Piscina Borda Infinita & Pergolado", status: "completed", completedDate: "05/06/2026" },
      { id: 3, name: "Deck de Cumaru & Balcão Gourmet", status: "in_progress", expectedDate: "25/08/2026" },
      { id: 4, name: "Churrasqueira & Móveis Planejados GDM", status: "pending", expectedDate: "15/10/2026" },
      { id: 5, name: "Paisagismo & Iluminação de Jardim", status: "pending", expectedDate: "05/12/2026" },
    ],
    notes: "Piscina estanque testada sem vazamentos. Deck de madeira em montagem.",
    categoriesBreakdown: {
      materialsSpent: 58000,
      materialsBudget: 80000,
      laborSpent: 32000,
      laborBudget: 48000,
      finishesSpent: 8000,
      finishesBudget: 17000,
    }
  }
];

const INITIAL_REMINDERS: ConstructionReminder[] = [
  {
    id: "rem-1",
    workId: "work-1",
    workTitle: "Residencial Jardim das Palmeiras - Bloco A",
    type: "medicao",
    title: "Medição de Etapa 2 - Concretagem de Laje",
    description: "Realizar medição técnica e fotográfica da laje do 2º pavimento para liberação de medição de mão de obra.",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    dueTime: "09:00",
    priority: "alta",
    status: "pending",
    pushEnabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "rem-2",
    workId: "work-2",
    workTitle: "Edifício Comercial Toscana",
    type: "entrega_material",
    title: "Entrega de Material - Porcelanatos & Revestimentos",
    description: "Recebimento da carreta Portobello na obra. Conferência de nota fiscal e teste de peças quebradas.",
    dueDate: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    dueTime: "14:00",
    priority: "alta",
    status: "pending",
    pushEnabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "rem-3",
    workId: "work-3",
    workTitle: "Reforma & Interiores Casa Alphaville",
    type: "vistoria",
    title: "Vistoria da Caixilharia & Marceneiro GDM",
    description: "Acompanhamento da instalação das ilhas de MDF Naval e esquadrias de alumínio preto fosco.",
    dueDate: new Date(Date.now() + 259200000).toISOString().split("T")[0],
    dueTime: "10:30",
    priority: "media",
    status: "pending",
    pushEnabled: true,
    createdAt: new Date().toISOString(),
  },
];

interface ActiveProjectsDashboardProps {
  setActiveTab?: (tab: MainTab) => void;
  projectState?: Project3DState;
  setProjectState?: React.Dispatch<React.SetStateAction<Project3DState>>;
}

export const ActiveProjectsDashboard: React.FC<ActiveProjectsDashboardProps> = ({
  setActiveTab,
  projectState: externalProjectState,
  setProjectState: externalSetProjectState,
}) => {
  const [internalProjectState, setInternalProjectState] = useState<Project3DState>(INITIAL_PROJECT_3D);
  const projectState = externalProjectState || internalProjectState;
  const setProjectState = externalSetProjectState || setInternalProjectState;

  const [isFirestoreSyncOpen, setIsFirestoreSyncOpen] = useState<boolean>(false);
  const [works, setWorks] = useState<ActiveWork[]>(INITIAL_ACTIVE_WORKS);
  const [filterBrand, setFilterBrand] = useState<string>("TODAS");
  const [filterStatus, setFilterStatus] = useState<string>("TODOS");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedWorkModal, setSelectedWorkModal] = useState<ActiveWork | null>(null);
  const [showAddWorkModal, setShowAddWorkModal] = useState<boolean>(false);
  const [pdfReportWork, setPdfReportWork] = useState<ActiveWork | null>(null);

  // Reminders & Push Notification state
  const [reminders, setReminders] = useState<ConstructionReminder[]>(INITIAL_REMINDERS);
  const [showRemindersModal, setShowRemindersModal] = useState<boolean>(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default"
  );
  const [pushToastMessage, setPushToastMessage] = useState<{ title: string; body: string } | null>(null);

  // New Reminder Form State
  const [newRemWorkId, setNewRemWorkId] = useState<string>("");
  const [newRemType, setNewRemType] = useState<"medicao" | "entrega_material" | "vistoria" | "pagamento" | "outro">("medicao");
  const [newRemTitle, setNewRemTitle] = useState<string>("");
  const [newRemDesc, setNewRemDesc] = useState<string>("");
  const [newRemDueDate, setNewRemDueDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [newRemDueTime, setNewRemDueTime] = useState<string>("09:00");
  const [newRemPriority, setNewRemPriority] = useState<"alta" | "media" | "normal">("alta");
  const [newRemPush, setNewRemPush] = useState<boolean>(true);

  // Request Native Browser Push Permission
  const handleRequestPushPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === "granted") {
          sendPushNotification(
            "🔔 Notificações Ativadas!",
            "Você agora receberá alertas push em tempo real para medições e entregas das obras."
          );
        } else if (perm === "denied") {
          alert("Permissão para notificações do navegador negada nas configurações do seu dispositivo. Os alertas visuais no painel continuarão ativos.");
        }
      } catch (err) {
        console.error("Erro ao solicitar permissão de notificações:", err);
      }
    } else {
      alert("Seu navegador não possui suporte à API nativa de Notificações Push, mas o sistema exibe notificações visuais diretamente na tela.");
    }
  };

  // Dispatch Push Notification (Browser Native + In-App Banner)
  const sendPushNotification = (title: string, body: string) => {
    // In-App Toast Banner
    setPushToastMessage({ title, body });
    setTimeout(() => setPushToastMessage(null), 7000);

    // Browser Native Push Notification
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body,
          icon: "/favicon.ico",
          tag: "universo-adas-lembrete",
        });
      } catch (e) {
        console.log("Erro ao disparar notificação nativa do navegador:", e);
      }
    }
  };

  // Open Reminder Modal pre-filled for a specific work
  const handleQuickAddReminderForWork = (work: ActiveWork) => {
    setNewRemWorkId(work.id);
    setNewRemTitle(`Medição / Entrega: ${work.nextPendingStep}`);
    setNewRemType("medicao");
    setShowRemindersModal(true);
  };

  // Submit New Reminder
  const handleAddReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemTitle.trim()) {
      alert("Por favor, informe o título do lembrete.");
      return;
    }

    const targetWork = works.find((w) => w.id === newRemWorkId) || works[0];

    const newReminderItem: ConstructionReminder = {
      id: `rem-${Date.now()}`,
      workId: targetWork.id,
      workTitle: targetWork.title,
      type: newRemType,
      title: newRemTitle.trim(),
      description: newRemDesc.trim() || "Acompanhamento da etapa da obra.",
      dueDate: newRemDueDate,
      dueTime: newRemDueTime,
      priority: newRemPriority,
      status: "pending",
      pushEnabled: newRemPush,
      createdAt: new Date().toISOString(),
    };

    setReminders([newReminderItem, ...reminders]);

    // Send push confirmation
    if (newRemPush) {
      sendPushNotification(
        `📌 Lembrete Agendado: ${targetWork.title}`,
        `${newRemTitle} agendado para ${newRemDueDate} às ${newRemDueTime}.`
      );
    }

    // Reset Form
    setNewRemTitle("");
    setNewRemDesc("");
    alert("Lembrete agendado com sucesso!");
  };

  const handleToggleReminderStatus = (id: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === "pending" ? "completed" : "pending" } : r
      )
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // Helper to generate basic materials list per work
  const getMaterialsListForWork = (work: ActiveWork) => {
    return [
      { name: "Cimento CP II-Z 50kg (Fundação e Alvenaria)", category: "Estrutura & Alvenaria", qty: "120 sacos", estCost: Math.round(work.categoriesBreakdown.materialsSpent * 0.35) },
      { name: "Aço Estrutural CA-50 10mm / CA-60 5mm", category: "Estrutura & Alvenaria", qty: "480 kg", estCost: Math.round(work.categoriesBreakdown.materialsSpent * 0.25) },
      { name: "Tijolo Cerâmico / Bloco 14x19x29cm", category: "Alvenaria", qty: "3.200 un", estCost: Math.round(work.categoriesBreakdown.materialsSpent * 0.15) },
      { name: "Tubos PVC Esgoto/Água Fria + Conexões Tigre", category: "Instalações Hidráulicas", qty: "1 kit completo", estCost: Math.round(work.categoriesBreakdown.materialsSpent * 0.12) },
      { name: "Cabos Elétricos Flexíveis 2.5mm²/4.0mm² Sil", category: "Instalações Elétricas", qty: "350 metros", estCost: Math.round(work.categoriesBreakdown.materialsSpent * 0.13) },
      { name: "Porcelanato Retificado 80x80cm + Argamassa AC-III", category: "Acabamentos", qty: "160 m²", estCost: Math.round(work.categoriesBreakdown.finishesBudget * 0.55) },
      { name: "Tinta Acrílica Suvinil + Massa Corrida PVA", category: "Pintura", qty: "5 latas 18L", estCost: Math.round(work.categoriesBreakdown.finishesBudget * 0.45) },
      { name: "Chapas MDF Naval / Melamínico (Marcenaria GDM)", category: "Mobiliário Sob Medida", qty: "Projeto 3D GDM", estCost: Math.round(work.categoriesBreakdown.materialsBudget * 0.30) },
    ];
  };

  const handlePrintPdfReport = (work: ActiveWork) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Por favor, permita pop-ups no seu navegador para baixar ou imprimir o PDF.");
      return;
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const materials = getMaterialsListForWork(work);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Relatorio_Obra_${work.title.replace(/[^a-zA-Z0-9]/g, "_")}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; background: #ffffff; margin: 0; padding: 20px; line-height: 1.5; font-size: 12px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #f59e0b; padding-bottom: 12px; margin-bottom: 20px; }
          .brand-badge { background: #111827; color: #fbbf24; font-weight: 900; font-size: 10px; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 6px; }
          .title { font-size: 20px; font-weight: 900; color: #111827; margin: 0 0 4px 0; }
          .subtitle { font-size: 12px; color: #4b5563; margin: 0; }
          .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #b45309; border-bottom: 1.5px solid #fde68a; padding-bottom: 4px; margin-top: 22px; margin-bottom: 10px; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
          .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; }
          .label { font-size: 10px; text-transform: uppercase; font-weight: 700; color: #6b7280; display: block; }
          .val { font-size: 13px; font-weight: 800; color: #111827; margin-top: 2px; display: block; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; }
          th { background: #111827; color: #fbbf24; font-weight: 800; text-transform: uppercase; font-size: 10px; text-align: left; padding: 8px 10px; }
          td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; color: #374151; }
          tr:nth-child(even) { background: #f9fafb; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
          .badge-completed { background: #d1fae5; color: #047857; }
          .badge-in_progress { background: #fef3c7; color: #b45309; }
          .badge-pending { background: #f3f4f6; color: #6b7280; }
          .footer { margin-top: 35px; border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 10px; color: #9ca3af; display: flex; justify-content: space-between; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 16px; text-align: right;">
          <button onclick="window.print()" style="background: #f59e0b; color: #000; font-weight: 800; padding: 10px 22px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px;">
            🖨️ Imprimir ou Salvar como PDF
          </button>
        </div>

        <div class="header">
          <div>
            <div class="brand-badge">${work.brand} • UNIVERSO ADAS / PAU PARA TODA OBRA</div>
            <h1 class="title">${work.title}</h1>
            <p class="subtitle">Relatório Executivo de Engenharia & Orçamento | Emissão: ${dateFormatted}</p>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 10px; font-weight: 800; color: #b45309; text-transform: uppercase;">Status Atual</span>
            <div style="font-size: 14px; font-weight: 900; color: #111827; text-transform: uppercase;">${work.status.replace("_", " ")}</div>
          </div>
        </div>

        <!-- Identificação -->
        <div class="grid-2" style="margin-bottom: 12px;">
          <div class="card">
            <span class="label">Cliente Responsável</span>
            <span class="val">${work.clientName}</span>
          </div>
          <div class="card">
            <span class="label">Engenheiro / Resp. Técnico</span>
            <span class="val">${work.responsibleEngineer}</span>
          </div>
          <div class="card">
            <span class="label">Local da Obra</span>
            <span class="val">${work.location}</span>
          </div>
          <div class="card">
            <span class="label">Período de Execução</span>
            <span class="val">${work.startDate} a ${work.expectedCompletionDate}</span>
          </div>
        </div>

        <!-- Orçamento Estimado -->
        <div class="section-title">1. Orçamento Estimado & Balanço Financeiro</div>
        <div class="grid-3" style="margin-bottom: 12px;">
          <div class="card" style="border-left: 4px solid #f59e0b;">
            <span class="label">Orçamento Total Orçado</span>
            <span class="val">${formatBRL(work.budgetTotal)}</span>
          </div>
          <div class="card" style="border-left: 4px solid #10b981;">
            <span class="label">Total Executado / Gasto</span>
            <span class="val">${formatBRL(work.spentAmount)}</span>
          </div>
          <div class="card" style="border-left: 4px solid #3b82f6;">
            <span class="label">Saldo Disponível</span>
            <span class="val">${formatBRL(work.budgetTotal - work.spentAmount)}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Categoria de Orçamento</th>
              <th>Valor Executado (Gasto)</th>
              <th>Valor Orçado Total</th>
              <th>Execução %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Materiais de Construção & Insumos</strong></td>
              <td>${formatBRL(work.categoriesBreakdown.materialsSpent)}</td>
              <td>${formatBRL(work.categoriesBreakdown.materialsBudget)}</td>
              <td>${Math.round((work.categoriesBreakdown.materialsSpent / work.categoriesBreakdown.materialsBudget) * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Mão de Obra Especializada</strong></td>
              <td>${formatBRL(work.categoriesBreakdown.laborSpent)}</td>
              <td>${formatBRL(work.categoriesBreakdown.laborBudget)}</td>
              <td>${Math.round((work.categoriesBreakdown.laborSpent / work.categoriesBreakdown.laborBudget) * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Acabamentos & Marcenaria Fina</strong></td>
              <td>${formatBRL(work.categoriesBreakdown.finishesSpent)}</td>
              <td>${formatBRL(work.categoriesBreakdown.finishesBudget)}</td>
              <td>${Math.round((work.categoriesBreakdown.finishesSpent / work.categoriesBreakdown.finishesBudget) * 100)}%</td>
            </tr>
          </tbody>
        </table>

        <!-- Cronograma -->
        <div class="section-title">2. Resumo do Cronograma de Etapas da Obra</div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Etapa de Engenharia</th>
              <th>Status Atual</th>
              <th>Data Conclusão / Previsão</th>
            </tr>
          </thead>
          <tbody>
            ${work.steps
              .map(
                (st) => `
              <tr>
                <td><strong>${st.id}</strong></td>
                <td>${st.name}</td>
                <td>
                  <span class="badge badge-${st.status}">
                    ${st.status === 'completed' ? 'Concluído' : st.status === 'in_progress' ? 'Em andamento' : 'Pendente'}
                  </span>
                </td>
                <td>${st.completedDate || st.expectedDate || 'A definir'}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <!-- Materiais Básicos -->
        <div class="section-title">3. Lista de Materiais Básicos & Insumos Estimados</div>
        <table>
          <thead>
            <tr>
              <th>Material / Descrição Técnica</th>
              <th>Categoria</th>
              <th>Qtd. Estimada</th>
              <th>Custo Est. (R$)</th>
            </tr>
          </thead>
          <tbody>
            ${materials.map(
              (m) => `
              <tr>
                <td><strong>${m.name}</strong></td>
                <td>${m.category}</td>
                <td>${m.qty}</td>
                <td>${formatBRL(m.estCost)}</td>
              </tr>
            `
            ).join("")}
          </tbody>
        </table>

        ${
          work.notes
            ? `
          <div class="section-title">4. Notas do Engenheiro Responsável</div>
          <div class="card" style="background: #fffbeb; border-color: #fde68a; color: #78350f;">
            ${work.notes}
          </div>
        `
            : ""
        }

        <div class="footer">
          <span>UNIVERSO ADAS • Gestão Integrada de Obras e Engenharia</span>
          <span>Acompanhamento Técnico WVR / GDM / PAU PARA TODA OBRA</span>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // New Work Form state
  const [newTitle, setNewTitle] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newBrand, setNewBrand] = useState<"WVR" | "GDM" | "PAU PARA TODA OBRA">("WVR");
  const [newLocation, setNewLocation] = useState("");
  const [newBudget, setNewBudget] = useState("");

  const filteredWorks = works.filter((w) => {
    const matchBrand = filterBrand === "TODAS" || w.brand === filterBrand;
    const matchStatus = filterStatus === "TODOS" || w.status === filterStatus;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      w.clientName.toLowerCase().includes(q) ||
      w.location.toLowerCase().includes(q) ||
      w.title.toLowerCase().includes(q) ||
      w.responsibleEngineer.toLowerCase().includes(q);
    return matchBrand && matchStatus && matchSearch;
  });

  // Calculate Overall KPIs
  const totalWorks = works.length;
  const totalBudget = works.reduce((acc, w) => acc + w.budgetTotal, 0);
  const totalSpent = works.reduce((acc, w) => acc + w.spentAmount, 0);
  const overallPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const totalSteps = works.reduce((acc, w) => acc + w.steps.length, 0);
  const completedSteps = works.reduce(
    (acc, w) => acc + w.steps.filter((s) => s.status === "completed").length,
    0
  );
  const scheduleProgressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const formatBRL = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleCreateWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newClient.trim() || !newBudget) return;

    const budget = parseFloat(newBudget) || 100000;
    const newWorkItem: ActiveWork = {
      id: `obra-${Date.now()}`,
      title: newTitle.trim(),
      clientName: newClient.trim(),
      brand: newBrand,
      location: newLocation.trim() || "Volta Redonda - RJ",
      budgetTotal: budget,
      spentAmount: 0,
      startDate: new Date().toLocaleDateString("pt-BR"),
      expectedCompletionDate: "30/12/2026",
      status: "em_dia",
      currentStepIndex: 0,
      nextPendingStep: "Sondagem de terreno e alinhamento inicial",
      responsibleEngineer: "Eng. Responsável UNIVERSO ADAS",
      steps: [
        { id: 1, name: "Sondagem & Terraplenagem", status: "in_progress", expectedDate: "20/08/2026" },
        { id: 2, name: "Fundação & Estrutura", status: "pending", expectedDate: "30/09/2026" },
        { id: 3, name: "Alvenaria & Cobertura", status: "pending", expectedDate: "15/11/2026" },
        { id: 4, name: "Instalações & Acabamentos", status: "pending", expectedDate: "30/12/2026" },
      ],
      categoriesBreakdown: {
        materialsSpent: 0,
        materialsBudget: Math.round(budget * 0.5),
        laborSpent: 0,
        laborBudget: Math.round(budget * 0.35),
        finishesSpent: 0,
        finishesBudget: Math.round(budget * 0.15),
      }
    };

    setWorks([newWorkItem, ...works]);
    setShowAddWorkModal(false);
    setNewTitle("");
    setNewClient("");
    setNewBudget("");
    setNewLocation("");
  };

  const handleToggleStepStatus = (workId: string, stepId: number) => {
    setWorks((prevWorks) =>
      prevWorks.map((work) => {
        if (work.id !== workId) return work;

        const updatedSteps = work.steps.map((st) => {
          if (st.id !== stepId) return st;
          const nextStatus: ActiveWorkStep["status"] =
            st.status === "pending"
              ? "in_progress"
              : st.status === "in_progress"
              ? "completed"
              : "pending";

          const isNowCompleted = nextStatus === "completed";

          // Trigger badge unlocks if completed
          if (isNowCompleted && typeof window !== "undefined") {
            const nameLower = st.name.toLowerCase();
            if (nameLower.includes("sondagem") || nameLower.includes("terraplenagem")) {
              window.dispatchEvent(new CustomEvent("unlock-construction-badge", { detail: { badgeId: "planta_aprovada" } }));
            }
            if (nameLower.includes("fundação") || nameLower.includes("radier")) {
              window.dispatchEvent(new CustomEvent("unlock-construction-badge", { detail: { badgeId: "fundacao_concluida" } }));
            }
            if (nameLower.includes("alvenaria") || nameLower.includes("laje")) {
              window.dispatchEvent(new CustomEvent("unlock-construction-badge", { detail: { badgeId: "alvenaria_laje" } }));
            }
            if (nameLower.includes("cobertura") || nameLower.includes("esquadrias")) {
              window.dispatchEvent(new CustomEvent("unlock-construction-badge", { detail: { badgeId: "cobertura_protegida" } }));
            }
            if (nameLower.includes("hidro") || nameLower.includes("elétrica") || nameLower.includes("instalações")) {
              window.dispatchEvent(new CustomEvent("unlock-construction-badge", { detail: { badgeId: "hidro_eletrica" } }));
            }
            if (nameLower.includes("acabamento") || nameLower.includes("pintura")) {
              window.dispatchEvent(new CustomEvent("unlock-construction-badge", { detail: { badgeId: "mestre_acabamento" } }));
            }
          }

          return {
            ...st,
            status: nextStatus,
            completedDate: isNowCompleted ? new Date().toLocaleDateString("pt-BR") : undefined,
          };
        });

        // Check if 100% completed
        const allCompleted = updatedSteps.every((s) => s.status === "completed");
        if (allCompleted && typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("unlock-construction-badge", { detail: { badgeId: "chave_na_mao" } }));
        }

        // Always unlock gestor_exemplar badge on manual step update
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("unlock-construction-badge", { detail: { badgeId: "gestor_exemplar" } }));
        }

        const updatedWork = { ...work, steps: updatedSteps };
        if (selectedWorkModal?.id === workId) {
          setSelectedWorkModal(updatedWork);
        }
        return updatedWork;
      })
    );
  };

  const getStatusBadge = (status: ActiveWork["status"]) => {
    switch (status) {
      case "em_dia":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dentro do Prazo</span>
          </span>
        );
      case "adiantado":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>Adiantado 🚀</span>
          </span>
        );
      case "atencao":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Atenção / Secagem</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/90 border border-amber-500/30 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-zinc-950 uppercase tracking-widest flex items-center gap-1">
                <HardHat className="w-3.5 h-3.5" /> Gestão Operacional
              </span>
              <span className="text-xs text-emerald-400 font-extrabold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                ● Atualizado Hoje
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Dashboard de <span className="text-amber-400">Obras Ativas</span>
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Sintetizador visual em tempo real do grupo PAU PARA TODA OBRA, WVR e GDM. Acompanhe cronogramas, balanço financeiro orçado vs. gasto e próximas etapas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
            <button
              onClick={() => setIsFirestoreSyncOpen(true)}
              className="px-4 py-3 bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs rounded-2xl border border-amber-500/50 flex items-center gap-2 shadow-lg transition-all hover:scale-105"
            >
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Sincronizar Cloud (Firestore)</span>
            </button>

            <button
              onClick={() => setShowRemindersModal(true)}
              className="px-4 py-3 bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs rounded-2xl border border-amber-500/50 flex items-center gap-2 shadow-lg transition-all hover:scale-105 relative"
            >
              <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Notificações Push</span>
              {reminders.filter((r) => r.status === "pending").length > 0 && (
                <span className="ml-1 bg-amber-500 text-zinc-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {reminders.filter((r) => r.status === "pending").length}
                </span>
              )}
            </button>

            <button
              onClick={() => handlePrintPdfReport(works[0])}
              className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-extrabold text-xs rounded-2xl border border-amber-500/40 flex items-center gap-2 shadow-lg transition-all hover:scale-105"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Relatório PDF Obra</span>
            </button>

            <button
              onClick={() => setShowAddWorkModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nova Obra</span>
            </button>
          </div>
        </div>

        {/* Global KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Active Works */}
          <div className="bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 p-5 rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Obras em Andamento</span>
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white mb-1">{totalWorks} <span className="text-sm font-semibold text-zinc-400">Obras</span></div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% com acompanhamento técnico
            </div>
          </div>

          {/* KPI 2: Budget vs Spent */}
          <div className="bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 p-5 rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Gasto vs. Orçado Geral</span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mb-1">
              {formatBRL(totalSpent)}
              <span className="text-xs text-zinc-500 block font-normal">de {formatBRL(totalBudget)}</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(overallPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-zinc-400 mt-1">
              <span>Executado:</span>
              <span className="font-extrabold text-amber-400">{overallPercentage}% do total</span>
            </div>
          </div>

          {/* KPI 3: Schedule Progress */}
          <div className="bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 p-5 rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Avanço Físico Médio</span>
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white mb-1">{scheduleProgressPercent}%</div>
            <div className="w-full bg-zinc-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${scheduleProgressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              {completedSteps} de {totalSteps} etapas de engenharia concluídas
            </div>
          </div>

          {/* KPI 4: Pending Milestones */}
          <div className="bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 p-5 rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Avisos & Próximas Etapas</span>
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 mb-1">
              {works.filter((w) => w.status === "atencao").length} <span className="text-xs font-normal text-zinc-400">Atenção</span>
            </div>
            <div className="text-[11px] text-zinc-300 line-clamp-2">
              Próximo marco: Instalação das esquadrias e acabamentos finos GDM.
            </div>
          </div>
        </div>

        {/* Timeline Visualizer (Gantt Chart for Construction Milestones) */}
        <TimelineVisualizer works={works} />

        {/* Filter Controls Bar with Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-zinc-900 p-4 rounded-2xl border border-zinc-800 shadow-xl">
          <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 flex-1">
            {/* Search Input Bar */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por cliente ou endereço da obra..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/80 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  title="Limpar busca"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 shrink-0 overflow-x-auto">
              {["TODAS", "WVR", "GDM", "PAU PARA TODA OBRA"].map((b) => (
                <button
                  key={b}
                  onClick={() => setFilterBrand(b)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    filterBrand === b
                      ? "bg-amber-500 text-zinc-950 shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 shrink-0 overflow-x-auto">
              {[
                { label: "Todos", val: "TODOS" },
                { label: "Dentro do Prazo", val: "em_dia" },
                { label: "Adiantados", val: "adiantado" },
                { label: "Atenção", val: "atencao" },
              ].map((s) => (
                <button
                  key={s.val}
                  onClick={() => setFilterStatus(s.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    filterStatus === s.val
                      ? "bg-amber-500 text-zinc-950 shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-zinc-400 font-mono text-right shrink-0">
            Exibindo <span className="text-white font-bold">{filteredWorks.length}</span> de {works.length} obras
          </div>
        </div>

        {/* Active Works Cards List or Empty Search State */}
        {filteredWorks.length === 0 ? (
          <div className="p-12 text-center bg-zinc-900/60 border border-zinc-800 rounded-3xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 text-amber-400 mx-auto flex items-center justify-center border border-zinc-700">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Nenhuma obra encontrada</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Não encontramos nenhuma obra correspondente ao termo <span className="text-amber-400 font-bold">"{searchQuery}"</span> com os filtros selecionados.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterBrand("TODAS");
                setFilterStatus("TODOS");
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-all"
            >
              Limpar Filtros e Busca
            </button>
          </div>
        ) : (
          <div className="space-y-6">
          {filteredWorks.map((work) => {
            const workPercent = Math.round((work.spentAmount / work.budgetTotal) * 100);

            return (
              <div
                key={work.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-3xl p-6 shadow-2xl transition-all duration-200 relative overflow-hidden group"
              >
                {/* Brand Accent Top Line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600" />

                {/* Card Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pt-1">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/30">
                        {work.brand}
                      </span>
                      {getStatusBadge(work.status)}
                      <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {work.location}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                      {work.title}
                    </h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Cliente: <span className="text-zinc-200 font-semibold">{work.clientName}</span>
                      <span>•</span>
                      <span>Resp. Técnico: <strong className="text-zinc-300">{work.responsibleEngineer}</strong></span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                    <button
                      onClick={() => handleQuickAddReminderForWork(work)}
                      className="px-3.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-extrabold text-xs rounded-xl transition-all border border-amber-500/30 flex items-center gap-1.5 shadow-sm"
                      title="Agendar lembrete ou notificação para medição ou entrega de material"
                    >
                      <Bell className="w-3.5 h-3.5 text-amber-400" />
                      <span>Agendar Lembrete</span>
                    </button>

                    <button
                      onClick={() => handlePrintPdfReport(work)}
                      className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs rounded-xl transition-all border border-amber-500/40 flex items-center gap-1.5 shadow-sm"
                      title="Gerar relatório impresso ou baixar PDF"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Relatório PDF</span>
                    </button>

                    <button
                      onClick={() => setSelectedWorkModal(work)}
                      className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-black text-xs rounded-xl transition-all border border-zinc-700 flex items-center gap-1.5 shadow-sm"
                    >
                      <PieChart className="w-4 h-4" />
                      <span>Detalhes & Gráficos</span>
                    </button>
                  </div>
                </div>

                {/* Main Content Grid: Financial Bar + Timeline Steps */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Budget vs Spent (5 Cols) */}
                  <div className="lg:col-span-5 bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-emerald-400" /> Balanço Financeiro
                      </span>
                      <span className="text-amber-400 font-black">{workPercent}% Executado</span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Gasto Atual</span>
                        <span className="text-xl font-black text-emerald-400">{formatBRL(work.spentAmount)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Orçado Total</span>
                        <span className="text-sm font-bold text-zinc-300">{formatBRL(work.budgetTotal)}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          workPercent > 90
                            ? "bg-amber-500"
                            : workPercent > 100
                            ? "bg-red-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(workPercent, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-900">
                      <span>Saldo Restante:</span>
                      <span className="font-bold text-white">
                        {formatBRL(Math.max(0, work.budgetTotal - work.spentAmount))}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Timeline & Next Pending Step (7 Cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Next Pending Step Highlight Box */}
                    <div className="bg-amber-950/40 border border-amber-500/50 p-3.5 rounded-2xl flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                        <ListTodo className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                          Próxima Etapa Pendente / Em Andamento
                        </span>
                        <p className="text-xs text-white font-semibold mt-0.5 leading-snug">
                          {work.nextPendingStep}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Step Badges */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-400 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" /> Cronograma de Engenharia
                        </span>
                        <span className="text-zinc-500 text-[11px]">
                          Previsão de Entrega: <strong className="text-amber-300">{work.expectedCompletionDate}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                        {work.steps.map((step, idx) => {
                          const isDone = step.status === "completed";
                          const isCurrent = step.status === "in_progress";

                          return (
                            <div
                              key={step.id}
                              onClick={() => handleToggleStepStatus(work.id, step.id)}
                              title="Clique para alternar o status e desbloquear conquistas!"
                              className={`p-2 rounded-xl text-center border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                                isDone
                                  ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-300 hover:border-emerald-400"
                                  : isCurrent
                                  ? "bg-amber-950/80 border-amber-400 text-amber-300 font-bold animate-pulse shadow-md hover:border-amber-300"
                                  : "bg-zinc-950/60 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                              }`}
                            >
                              <div className="text-[10px] font-mono mb-0.5">
                                #{idx + 1} {isDone ? "✓ Concluído" : isCurrent ? "▶ Em Andamento" : "⏳ Pendente"}
                              </div>
                              <div className="text-[11px] leading-tight font-semibold line-clamp-2">
                                {step.name}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes footer */}
                {work.notes && (
                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                    <span className="text-zinc-500 italic truncate">
                      💡 Observação Técnica: {work.notes}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                      Início: {work.startDate}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        )}

        {/* Gamification Badges & Construction Achievements */}
        <div className="mt-8">
          <ConstructionAchievements
            completedStepsCount={completedSteps}
            totalStepsCount={totalSteps}
          />
        </div>

        {/* Detailed Inspection Modal */}
        {selectedWorkModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-zinc-950 border-2 border-amber-500/80 rounded-3xl p-6 max-w-3xl w-full text-white shadow-2xl relative my-8 animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setSelectedWorkModal(null)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full border border-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 border-b border-zinc-800 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                  <HardHat className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Detalhamento de Obra #{selectedWorkModal.id}
                  </span>
                  <h3 className="text-xl font-black text-white">{selectedWorkModal.title}</h3>
                  <p className="text-xs text-zinc-400">
                    Cliente: {selectedWorkModal.clientName} | Local: {selectedWorkModal.location}
                  </p>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <PieChart className="w-4 h-4" /> Decomposição Orçamentária por Categoria
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Category 1: Materiais */}
                  <div className="bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800">
                    <span className="text-xs font-bold text-zinc-400 block mb-1">Materiais & Insumos</span>
                    <span className="text-lg font-black text-emerald-400 block">
                      {formatBRL(selectedWorkModal.categoriesBreakdown.materialsSpent)}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      de {formatBRL(selectedWorkModal.categoriesBreakdown.materialsBudget)} orçados
                    </span>
                  </div>

                  {/* Category 2: Mão de Obra */}
                  <div className="bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800">
                    <span className="text-xs font-bold text-zinc-400 block mb-1">Mão de Obra Especializada</span>
                    <span className="text-lg font-black text-amber-400 block">
                      {formatBRL(selectedWorkModal.categoriesBreakdown.laborSpent)}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      de {formatBRL(selectedWorkModal.categoriesBreakdown.laborBudget)} orçados
                    </span>
                  </div>

                  {/* Category 3: Acabamento */}
                  <div className="bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800">
                    <span className="text-xs font-bold text-zinc-400 block mb-1">Acabamentos & Detalhes</span>
                    <span className="text-lg font-black text-blue-400 block">
                      {formatBRL(selectedWorkModal.categoriesBreakdown.finishesSpent)}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      de {formatBRL(selectedWorkModal.categoriesBreakdown.finishesBudget)} orçados
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Steps Cronogram */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <ListTodo className="w-4 h-4" /> Histórico Sequencial de Etapas
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedWorkModal.steps.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => handleToggleStepStatus(selectedWorkModal.id, st.id)}
                      title="Clique para avançar o status desta etapa!"
                      className="p-3 bg-zinc-900 hover:bg-zinc-800/80 rounded-xl border border-zinc-800 flex items-center justify-between text-xs cursor-pointer transition-all active:scale-98"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            st.status === "completed"
                              ? "bg-emerald-500 text-zinc-950"
                              : st.status === "in_progress"
                              ? "bg-amber-400 text-zinc-950 animate-pulse"
                              : "bg-zinc-800 text-zinc-500"
                          }`}
                        >
                          {st.id}
                        </div>
                        <span className="font-semibold text-white">{st.name}</span>
                      </div>

                      <div className="text-right font-mono text-[11px] flex items-center gap-2">
                        {st.status === "completed" && (
                          <span className="text-emerald-400 font-bold">✓ Concluído ({st.completedDate || "Hoje"})</span>
                        )}
                        {st.status === "in_progress" && (
                          <span className="text-amber-400 font-bold">▶ Em andamento</span>
                        )}
                        {st.status === "pending" && (
                          <span className="text-zinc-500">⏳ Pendente</span>
                        )}
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          Alterar 🔄
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => handlePrintPdfReport(selectedWorkModal)}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs rounded-xl border border-amber-500/50 flex items-center gap-2 shadow-lg transition-all"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Exportar Relatório PDF</span>
                </button>

                <button
                  onClick={() => setSelectedWorkModal(null)}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl"
                >
                  Fechar Visualização
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Work Modal */}
        {showAddWorkModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-950 border-2 border-amber-500/80 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setShowAddWorkModal(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full border border-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 border-b border-zinc-800 pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Cadastrar Nova Obra</h3>
                  <p className="text-xs text-zinc-400">Inicie o acompanhamento de um novo projeto</p>
                </div>
              </div>

              <form onSubmit={handleCreateWork} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase block mb-1">Título da Obra</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Reforma Comercial Loja Bairro Amália"
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase block mb-1">Nome do Cliente</label>
                  <input
                    type="text"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    placeholder="Ex: Dr. Carlos Mendes"
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 uppercase block mb-1">Marca Responsável</label>
                    <select
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="WVR">WVR Construções</option>
                      <option value="GDM">GDM Móveis</option>
                      <option value="PAU PARA TODA OBRA">Pau Para Toda Obra</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 uppercase block mb-1">Orçamento (R$)</label>
                    <input
                      type="number"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      placeholder="Ex: 150000"
                      required
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase block mb-1">Localização / Cidade</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Ex: Volta Redonda - RJ"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddWorkModal(false)}
                    className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl shadow-lg"
                  >
                    Cadastrar Obra
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Floating In-App Push Notification Banner */}
        {pushToastMessage && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-zinc-900 border-2 border-amber-500/80 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40 shrink-0">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Notificação Push da Obra</span>
                  <button
                    onClick={() => setPushToastMessage(null)}
                    className="text-zinc-500 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-sm font-black text-white mt-0.5">{pushToastMessage.title}</h4>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{pushToastMessage.body}</p>
              </div>
            </div>
          </div>
        )}

        {/* Reminders & Push Notification Modal */}
        {showRemindersModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowRemindersModal(false)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
                  <BellRing className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Central de Lembretes & Push Notifications</h3>
                  <p className="text-xs text-zinc-400">Agende alertas para medições de etapa, vistorias e entregas de materiais</p>
                </div>
              </div>

              {/* Web Push Permission Bar */}
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Notificações no Navegador / Dispositivo:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        notificationPermission === 'granted'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : notificationPermission === 'denied'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {notificationPermission === 'granted' ? 'Concedido' : notificationPermission === 'denied' ? 'Bloqueado' : 'Pendente'}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {notificationPermission === 'granted'
                        ? 'Você receberá pop-ups nativos no computador/smartphone quando um lembrete vencer.'
                        : 'Ative a permissão para receber alertas nativos de medição e entrega.'}
                    </p>
                  </div>
                </div>

                {notificationPermission !== 'granted' ? (
                  <button
                    onClick={handleRequestPushPermission}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-xl transition-all shrink-0"
                  >
                    Ativar Push Browser
                  </button>
                ) : (
                  <button
                    onClick={() => sendPushNotification("🔔 Notificação Teste Disparada!", "Sua central de push notifications da obra está funcionando perfeitamente!")}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition-all shrink-0"
                  >
                    Testar Push Agora
                  </button>
                )}
              </div>

              {/* Form: Schedule New Reminder */}
              <form onSubmit={handleAddReminderSubmit} className="bg-zinc-950/80 p-4 border border-zinc-800 rounded-2xl space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Agendar Novo Lembrete de Obra
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">Obra Alvo</label>
                    <select
                      value={newRemWorkId}
                      onChange={(e) => setNewRemWorkId(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="">-- Selecionar Obra --</option>
                      {works.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.title} ({w.brand})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">Tipo de Evento Crítico</label>
                    <select
                      value={newRemType}
                      onChange={(e) => setNewRemType(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="medicao">📏 Medição de Etapa / Liberação</option>
                      <option value="entrega_material">🚚 Entrega de Material de Construção</option>
                      <option value="vistoria">🔍 Vistoria Técnica / Engenharia</option>
                      <option value="pagamento">💰 Pagamento / Financiamento</option>
                      <option value="outro">📌 Outro Lembrete Operacional</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">Título do Lembrete</label>
                  <input
                    type="text"
                    value={newRemTitle}
                    onChange={(e) => setNewRemTitle(e.target.value)}
                    placeholder="Ex: Medição da Laje do 2º Pavimento ou Recebimento de Porcelanato"
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">Observações / Instruções</label>
                  <input
                    type="text"
                    value={newRemDesc}
                    onChange={(e) => setNewRemDesc(e.target.value)}
                    placeholder="Ex: Conferir se o caminhão de concreto chegou no horário estipulado"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">Data Agendada</label>
                    <input
                      type="date"
                      value={newRemDueDate}
                      onChange={(e) => setNewRemDueDate(e.target.value)}
                      required
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">Horário Alvo</label>
                    <input
                      type="time"
                      value={newRemDueTime}
                      onChange={(e) => setNewRemDueTime(e.target.value)}
                      required
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">Prioridade</label>
                    <select
                      value={newRemPriority}
                      onChange={(e) => setNewRemPriority(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="alta">🚨 Alta (Medição/Insumos)</option>
                      <option value="media">⚡ Média (Acompanhamento)</option>
                      <option value="normal">🔹 Normal (Rotina)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={newRemPush}
                      onChange={(e) => setNewRemPush(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-400"
                    />
                    <span>Disparar notificação Push no momento da criação</span>
                  </label>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                  >
                    Agendar Lembrete
                  </button>
                </div>
              </form>

              {/* Reminders List Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" /> Lembretes Agendados ({reminders.length})
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {reminders.filter((r) => r.status === 'pending').length} pendentes
                  </span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {reminders.length === 0 ? (
                    <div className="p-6 text-center text-xs text-zinc-500 bg-zinc-950 rounded-xl border border-zinc-800">
                      Nenhum lembrete agendado no momento.
                    </div>
                  ) : (
                    reminders.map((r) => (
                      <div
                        key={r.id}
                        className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                          r.status === 'completed'
                            ? 'bg-zinc-950/40 border-zinc-800/60 opacity-60'
                            : 'bg-zinc-950 border-zinc-800 hover:border-amber-500/40'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <button
                            onClick={() => handleToggleReminderStatus(r.id)}
                            className="mt-0.5 text-zinc-500 hover:text-emerald-400 transition-colors shrink-0"
                            title={r.status === 'completed' ? 'Marcar como pendente' : 'Marcar como concluído'}
                          >
                            {r.status === 'completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-zinc-600 hover:border-emerald-400" />
                            )}
                          </button>

                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                  r.type === 'medicao'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : r.type === 'entrega_material'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                {r.type === 'medicao'
                                  ? '📏 Medição'
                                  : r.type === 'entrega_material'
                                  ? '🚚 Material'
                                  : r.type === 'vistoria'
                                  ? '🔍 Vistoria'
                                  : '📌 Lembrete'}
                              </span>

                              <span className="text-[10px] font-bold text-zinc-400">
                                {r.workTitle}
                              </span>
                            </div>

                            <h5
                              className={`text-xs font-bold ${
                                r.status === 'completed' ? 'line-through text-zinc-500' : 'text-white'
                              }`}
                            >
                              {r.title}
                            </h5>
                            <p className="text-[11px] text-zinc-400 leading-tight">{r.description}</p>

                            <div className="flex items-center gap-3 text-[10px] text-amber-400 font-mono pt-0.5">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-zinc-400" /> {r.dueDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-zinc-400" /> {r.dueTime}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => sendPushNotification(`🔔 Lembrete: ${r.title}`, `${r.workTitle} - ${r.description}`)}
                            className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30 transition-all"
                            title="Disparar notificação push teste agora"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteReminder(r.id)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30 transition-all"
                            title="Excluir lembrete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Firestore Sync Modal */}
        <FirestoreSyncModal
          projectState={projectState}
          setProjectState={setProjectState}
          isOpen={isFirestoreSyncOpen}
          onClose={() => setIsFirestoreSyncOpen(false)}
        />
      </div>
    </div>
  );
};
