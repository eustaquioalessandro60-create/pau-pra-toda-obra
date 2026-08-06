import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  Camera,
  CameraOff,
  RotateCw,
  Move,
  Maximize2,
  Sparkles,
  Download,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Box,
  Palette,
  Eye,
  RefreshCw,
  Sun,
  Sliders,
  DollarSign,
  Info,
  ChevronRight,
  SlidersHorizontal,
  Grid,
  Zap,
  HardHat,
  X,
  Share2,
  Bell,
  Calendar,
  Clock,
  AlertTriangle,
  Trash2,
  Bookmark,
  ShoppingBag,
  Wrench,
  Tag,
  Filter,
  Edit3,
  PanelRightClose,
  PanelRightOpen,
  Check,
  ListFilter,
  QrCode,
  Scan,
  HelpCircle,
  Lightbulb,
  Compass,
  Smartphone,
  Target,
  Ruler,
  Map,
  Layout,
  Image as ImageIcon,
  FileJson,
  Upload,
  HardDrive,
  FolderArchive,
} from "lucide-react";
import { MainTab } from "../types";

export interface FurnitureModel3D {
  id: string;
  name: string;
  category: "cozinha" | "sala" | "quarto" | "banheiro" | "gourmet" | "externo";
  brand: "GDM" | "PAU PARA TODA OBRA" | "WVR";
  price: number;
  dimensions: string; // e.g. "2.20m x 0.60m x 0.85m"
  description: string;
  defaultFinish: string;
  finishes: { name: string; hex: string; roughness: number; metalness: number }[];
  modelType:
    | "armario_cozinha"
    | "painel_tv"
    | "closet"
    | "sofa_l"
    | "mesa_gourmet"
    | "balcao_banheiro"
    | "balcao_chopp"
    | "pergolado";
}

const CATALOGUE_FURNITURE: FurnitureModel3D[] = [
  {
    id: "gdm-cozinha-01",
    name: "Armário de Cozinha Gourmet GDM LED",
    category: "cozinha",
    brand: "GDM",
    price: 4850,
    dimensions: "2.40m x 0.60m x 2.10m",
    description: "Cozinha planejada modulada em MDF Naval resistente à umidade, com torre quente, balcão e perfil LED embutido.",
    defaultFinish: "MDF Freijó & Grafite",
    finishes: [
      { name: "Freijó & Grafite", hex: "#78350f", roughness: 0.6, metalness: 0.1 },
      { name: "Branco Lacca", hex: "#f8fafc", roughness: 0.2, metalness: 0.1 },
      { name: "Carvalho Real", hex: "#a16207", roughness: 0.7, metalness: 0.0 },
      { name: "Mármore Calacatta", hex: "#e2e8f0", roughness: 0.3, metalness: 0.2 },
    ],
    modelType: "armario_cozinha",
  },
  {
    id: "gdm-painel-02",
    name: "Painel Ripado LED & Rack de Sala",
    category: "sala",
    brand: "GDM",
    price: 3200,
    dimensions: "2.20m x 0.40m x 2.20m",
    description: "Painel ripado em MDF de alta densidade com fita LED embutida e rack suspenso com gaveteiros touch.",
    defaultFinish: "MDF Freijó Natural",
    finishes: [
      { name: "Freijó Natural", hex: "#854d0e", roughness: 0.6, metalness: 0.1 },
      { name: "Grafite Fosco", hex: "#3f3f46", roughness: 0.8, metalness: 0.2 },
      { name: "Nogueira Nobre", hex: "#451a03", roughness: 0.5, metalness: 0.0 },
    ],
    modelType: "painel_tv",
  },
  {
    id: "gdm-closet-03",
    name: "Closet Casal Modulado Suspenso",
    category: "quarto",
    brand: "GDM",
    price: 5900,
    dimensions: "3.00m x 0.55m x 2.40m",
    description: "Closet inteligente sem portas com nichos para sapatos, cabideiros em alumínio anodizado e sapateira deslizante.",
    defaultFinish: "MDF Carvalho Natural",
    finishes: [
      { name: "Carvalho Natural", hex: "#b45309", roughness: 0.6, metalness: 0.1 },
      { name: "Branco Texturizado", hex: "#f1f5f9", roughness: 0.4, metalness: 0.0 },
      { name: "Cinza Sagrado", hex: "#52525b", roughness: 0.7, metalness: 0.1 },
    ],
    modelType: "closet",
  },
  {
    id: "gdm-sofa-04",
    name: "Sofá Retrátil L-Shape Confort",
    category: "sala",
    brand: "GDM",
    price: 2950,
    dimensions: "2.60m x 1.10m x 0.90m",
    description: "Sofá modular reclinável com chaise longue para área de estar, estofado de alta resiliência e pernas ocultas.",
    defaultFinish: "Estofado Cinza Chumbo",
    finishes: [
      { name: "Cinza Chumbo", hex: "#334155", roughness: 0.9, metalness: 0.0 },
      { name: "Bege Fendi", hex: "#d6d3d1", roughness: 0.9, metalness: 0.0 },
      { name: "Azul Petróleo", hex: "#0f4c81", roughness: 0.9, metalness: 0.0 },
    ],
    modelType: "sofa_l",
  },
  {
    id: "pau-mesa-05",
    name: "Conjunto Mesa Gourmet Maciça & Banco",
    category: "gourmet",
    brand: "PAU PARA TODA OBRA",
    price: 4100,
    dimensions: "2.20m x 0.90m x 0.78m",
    description: "Mesa rústica maciça de tora tratada com pés em aço carbono preto e banco longo sob medida.",
    defaultFinish: "Madeira Cumaru Rústica",
    finishes: [
      { name: "Cumaru Rústico", hex: "#713f12", roughness: 0.8, metalness: 0.1 },
      { name: "Jequitibá Escuro", hex: "#3b1a03", roughness: 0.7, metalness: 0.0 },
      { name: "Peroba Rosa", hex: "#9a3412", roughness: 0.8, metalness: 0.0 },
    ],
    modelType: "mesa_gourmet",
  },
  {
    id: "gdm-banheiro-06",
    name: "Gabinete Suspenso & Cuba Esculpida",
    category: "banheiro",
    brand: "GDM",
    price: 1850,
    dimensions: "1.20m x 0.50m x 0.60m",
    description: "Gabinete suspenso marítimo à prova d'água com gavetão oculto, espelheira e cuba em quartzo esculpido.",
    defaultFinish: "Lacca Branca Marítima",
    finishes: [
      { name: "Lacca Branca", hex: "#f8fafc", roughness: 0.2, metalness: 0.1 },
      { name: "Preto Absoluto", hex: "#18181b", roughness: 0.3, metalness: 0.2 },
      { name: "Freijó Baunilha", hex: "#ca8a04", roughness: 0.6, metalness: 0.0 },
    ],
    modelType: "balcao_banheiro",
  },
  {
    id: "pau-chopp-07",
    name: "Balcão Bar & Estação de Chopp",
    category: "gourmet",
    brand: "PAU PARA TODA OBRA",
    price: 3800,
    dimensions: "1.80m x 0.70m x 1.10m",
    description: "Balcão estilo pub com tampo em inox escovado, torneira de chopp embutida e nicho refrigerado.",
    defaultFinish: "Inox & Carvalho Rústico",
    finishes: [
      { name: "Inox Escovado", hex: "#94a3b8", roughness: 0.3, metalness: 0.8 },
      { name: "Preto Industrial", hex: "#27272a", roughness: 0.7, metalness: 0.5 },
    ],
    modelType: "balcao_chopp",
  },
  {
    id: "pau-pergolado-08",
    name: "Pergolado de Madeira & Balanço",
    category: "externo",
    brand: "PAU PARA TODA OBRA",
    price: 6200,
    dimensions: "3.50m x 3.00m x 2.60m",
    description: "Pergolado de madeira autoclavada com cobertura em policarbonato e balanço gourmet integrado.",
    defaultFinish: "Cumaru Autoclavado",
    finishes: [
      { name: "Cumaru Autoclavado", hex: "#854d0e", roughness: 0.8, metalness: 0.1 },
      { name: "Eucalipto Tratado", hex: "#a16207", roughness: 0.9, metalness: 0.0 },
    ],
    modelType: "pergolado",
  }
];

export type ReminderCategory = "Compra" | "Instalação" | "Montagem";

export interface ARPlacementReminder {
  id: string;
  furnitureId: string;
  furnitureName: string;
  brand: string;
  price: number;
  dimensions: string;
  environmentName: string;
  category: ReminderCategory;
  targetDate: string; // Data de vencimento
  timelinePhase: string;
  notes: string;
  savedTransform: {
    posX: number;
    posY: number;
    posZ: number;
    rotY: number;
    scale: number;
    finishIndex: number;
    finishName: string;
  };
  status: "pendente" | "comprado";
  createdAt: string;
}

interface ARFurniturePlacementProps {
  setActiveTab?: (tab: MainTab) => void;
}

const LOCAL_REMINDERS_KEY = "universo_adas_ar_reminders_v1";

export const ARFurniturePlacement: React.FC<ARFurniturePlacementProps> = ({
  setActiveTab,
}) => {
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureModel3D>(
    CATALOGUE_FURNITURE[0]
  );
  const [selectedFinishIndex, setSelectedFinishIndex] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string>("todos");

  // Camera stream state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [useSampleRoomBg, setUseSampleRoomBg] = useState<boolean>(true);

  // 3D Model transformation controls
  const [furniturePosX, setFurniturePosX] = useState<number>(0); // Left / Right
  const [furniturePosY, setFurniturePosY] = useState<number>(0); // Height from ground
  const [furniturePosZ, setFurniturePosZ] = useState<number>(0); // Forward / Back (depth)
  const [furnitureRotY, setFurnitureRotY] = useState<number>(0); // Rotation degrees
  const [furnitureScale, setFurnitureScale] = useState<number>(1.0); // Scale factor
  const [showFloorGrid, setShowFloorGrid] = useState<boolean>(true);
  const [snapshotSuccess, setSnapshotSuccess] = useState<boolean>(false);

  // Reminders & Visual Timeline State
  const [reminders, setReminders] = useState<ARPlacementReminder[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_REMINDERS_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error loading AR reminders", e);
        }
      }
    }
    return [
      {
        id: "rem-demo-1",
        furnitureId: "gdm-cozinha-01",
        furnitureName: "Armário de Cozinha Gourmet GDM LED",
        brand: "GDM",
        price: 4850,
        dimensions: "2.40m x 0.60m x 2.10m",
        environmentName: "Cozinha Integrada",
        category: "Compra",
        targetDate: "2026-08-28",
        timelinePhase: "Antes da Pintura Final",
        notes: "Conferir tubulação de água e ponto elétrico do forno antes de fechar o pedido.",
        savedTransform: {
          posX: 0,
          posY: 0,
          posZ: -0.5,
          rotY: 0,
          scale: 1,
          finishIndex: 0,
          finishName: "MDF Freijó & Grafite",
        },
        status: "pendente",
        createdAt: "03/08/2026",
      },
      {
        id: "rem-demo-2",
        furnitureId: "gdm-painel-02",
        furnitureName: "Painel Ripado LED & Rack de Sala",
        brand: "GDM",
        price: 3200,
        dimensions: "2.20m x 0.40m x 2.20m",
        environmentName: "Sala de Estar TV",
        category: "Instalação",
        targetDate: "2026-09-10",
        timelinePhase: "Fase de Acabamentos",
        notes: "Garantir cabo HDMI e fiação da TV passada por dentro da parede.",
        savedTransform: {
          posX: 0.5,
          posY: 0,
          posZ: 0,
          rotY: -45,
          scale: 1,
          finishIndex: 0,
          finishName: "MDF Freijó Natural",
        },
        status: "pendente",
        createdAt: "03/08/2026",
      },
      {
        id: "rem-demo-3",
        furnitureId: "wpt-pergolado-01",
        furnitureName: "Pergolado Gourmet PAU PARA TODA OBRA",
        brand: "PAU PARA TODA OBRA",
        price: 8900,
        dimensions: "3.50m x 3.00m x 2.60m",
        environmentName: "Área Externa / Gourmet",
        category: "Montagem",
        targetDate: "2026-09-20",
        timelinePhase: "Estrutura Externa",
        notes: "Verificar fixação das sapatas metálicas na base de concreto.",
        savedTransform: {
          posX: 0,
          posY: 0,
          posZ: 1.0,
          rotY: 90,
          scale: 1,
          finishIndex: 0,
          finishName: "Cumaru Autoclavado",
        },
        status: "pendente",
        createdAt: "03/08/2026",
      }
    ];
  });

  // Side Drawer & Modal States
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [panelCategoryFilter, setPanelCategoryFilter] = useState<string>("todas");
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [reminderEnvName, setReminderEnvName] = useState<string>("Sala de Estar");
  const [reminderCategory, setReminderCategory] = useState<ReminderCategory>("Compra");
  const [reminderTargetDate, setReminderTargetDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 20);
    return d.toISOString().split("T")[0];
  });
  const [reminderTimelinePhase, setReminderTimelinePhase] = useState<string>("Fase de Acabamento");
  const [reminderNotes, setReminderNotes] = useState<string>("");
  const [saveSuccessFeedback, setSaveSuccessFeedback] = useState<boolean>(false);

  // Quick edit state for reminders in drawer
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState<ReminderCategory>("Compra");
  const [editTargetDate, setEditTargetDate] = useState<string>("");

  // QR Code Scanner State
  const [showQrScannerModal, setShowQrScannerModal] = useState<boolean>(false);
  const [isQrScanningActive, setIsQrScanningActive] = useState<boolean>(false);
  const [manualQrInput, setManualQrInput] = useState<string>("");
  const [scannedFurnitureResult, setScannedFurnitureResult] = useState<FurnitureModel3D | null>(null);
  const [qrFeedbackMessage, setQrFeedbackMessage] = useState<string | null>(null);

  // AR Quick Guide State (Guia Rápido de AR)
  const [showArGuideModal, setShowArGuideModal] = useState<boolean>(false);
  const [activeGuideStep, setActiveGuideStep] = useState<number>(1);
  const [showInlineGuideTip, setShowInlineGuideTip] = useState<boolean>(true);

  // 2D Humanized Floor Plan State (Planta Humanizada 2D)
  const [showFloorPlanModal, setShowFloorPlanModal] = useState<boolean>(false);
  const [floorTextureStyle, setFloorTextureStyle] = useState<"piso_madeira" | "porcelanato" | "cimento">("piso_madeira");
  const [showDimensionsOn2D, setShowDimensionsOn2D] = useState<boolean>(true);
  const [showLegendOn2D, setShowLegendOn2D] = useState<boolean>(true);
  const [selectedRoomEnv2D, setSelectedRoomEnv2D] = useState<string>("Geral da Obra / Todos os Cômodos");
  const [floorPlanExportSuccess, setFloorPlanExportSuccess] = useState<boolean>(false);
  const canvas2dRef = useRef<HTMLCanvasElement | null>(null);

  // Helper to draw 2D Humanized Floor Plan on HTML Canvas
  const drawHumanized2DFloorPlan = () => {
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1000;
    const height = 720;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // 1. Floor Background Texture
    let bgFill = "#f5eee6";
    let lineStroke = "#e2d7c7";
    if (floorTextureStyle === "porcelanato") {
      bgFill = "#eae7e1";
      lineStroke = "#d6d0c4";
    } else if (floorTextureStyle === "cimento") {
      bgFill = "#e2e2e0";
      lineStroke = "#cbcbc8";
    }

    ctx.fillStyle = bgFill;
    ctx.fillRect(0, 0, width, height);

    // Grid / Floor pattern
    ctx.strokeStyle = lineStroke;
    ctx.lineWidth = 1;
    const step = floorTextureStyle === "piso_madeira" ? 35 : 50;

    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    if (floorTextureStyle !== "piso_madeira") {
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // 2. Room Outer Boundary (Walls)
    const wallLeft = 80;
    const wallTop = 90;
    const wallWidth = 840;
    const wallHeight = 500;
    const wallThick = 18;

    // Room Interior Fill (light)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(wallLeft, wallTop, wallWidth, wallHeight);

    // Redraw interior texture over room floor
    ctx.fillStyle = bgFill;
    ctx.fillRect(wallLeft + wallThick, wallTop + wallThick, wallWidth - wallThick * 2, wallHeight - wallThick * 2);

    // Interior floor grid
    ctx.strokeStyle = lineStroke;
    for (let x = wallLeft + wallThick; x < wallLeft + wallWidth - wallThick; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, wallTop + wallThick);
      ctx.lineTo(x, wallTop + wallHeight - wallThick);
      ctx.stroke();
    }

    // 3. Walls Structure (Dark Slate Hatch / Fill)
    ctx.fillStyle = "#1e293b";
    // Top wall
    ctx.fillRect(wallLeft, wallTop, wallWidth, wallThick);
    // Bottom wall
    ctx.fillRect(wallLeft, wallTop + wallHeight - wallThick, wallWidth, wallThick);
    // Left wall
    ctx.fillRect(wallLeft, wallTop, wallThick, wallHeight);
    // Right wall
    ctx.fillRect(wallLeft + wallWidth - wallThick, wallTop, wallThick, wallHeight);

    // Doorway opening on bottom wall (center-left)
    const doorX = wallLeft + 200;
    ctx.fillStyle = bgFill;
    ctx.fillRect(doorX, wallTop + wallHeight - wallThick - 2, 70, wallThick + 4);
    // Door swing arc
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(doorX, wallTop + wallHeight - wallThick, 65, 0, Math.PI / 2, false);
    ctx.stroke();
    ctx.setLineDash([]);
    // Door panel line
    ctx.beginPath();
    ctx.moveTo(doorX, wallTop + wallHeight - wallThick);
    ctx.lineTo(doorX, wallTop + wallHeight - wallThick - 65);
    ctx.stroke();

    // Window symbol on top wall
    const winX = wallLeft + 450;
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(winX, wallTop + 2, 120, wallThick - 4);
    ctx.strokeStyle = "#0284c7";
    ctx.strokeRect(winX, wallTop + 2, 120, wallThick - 4);

    // 4. Header Banner on Canvas
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, width, 75);
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(0, 72, width, 3);

    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("PLANTA HUMANIZADA 2D DE ARQUITETURA", 25, 35);

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#a1a1aa";
    ctx.fillText(`CÔMODO: ${selectedRoomEnv2D.toUpperCase()} • ESCALA 1:20 (PROJETO RA)`, 25, 55);

    // Norte / Compass Indicator
    const compassX = 930;
    const compassY = 38;
    ctx.beginPath();
    ctx.arc(compassX, compassY, 20, 0, Math.PI * 2);
    ctx.fillStyle = "#18181b";
    ctx.fill();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("N", compassX, compassY - 4);

    ctx.beginPath();
    ctx.moveTo(compassX, compassY - 2);
    ctx.lineTo(compassX - 5, compassY + 8);
    ctx.lineTo(compassX + 5, compassY + 8);
    ctx.closePath();
    ctx.fill();
    ctx.textAlign = "left";

    // 5. Gather Items to Render on 2D Plan
    interface Item2D {
      id: string;
      name: string;
      brand: string;
      dimensions: string;
      posX: number;
      posZ: number;
      rotY: number;
      finishName: string;
      finishHex: string;
      isCurrent: boolean;
      category: string;
      price: number;
    }

    const itemsToDraw: Item2D[] = [];

    // Active AR Item
    itemsToDraw.push({
      id: selectedFurniture.id,
      name: selectedFurniture.name,
      brand: selectedFurniture.brand,
      dimensions: selectedFurniture.dimensions,
      posX: furniturePosX,
      posZ: furniturePosZ,
      rotY: furnitureRotY,
      finishName: selectedFurniture.finishes[selectedFinishIndex]?.name || "Padrão",
      finishHex: selectedFurniture.finishes[selectedFinishIndex]?.hex || "#d97706",
      isCurrent: true,
      category: selectedFurniture.category,
      price: selectedFurniture.price,
    });

    // Saved Reminders Items
    reminders.forEach((rem) => {
      if (
        selectedRoomEnv2D === "Geral da Obra / Todos os Cômodos" ||
        rem.environmentName.toLowerCase().includes(selectedRoomEnv2D.toLowerCase()) ||
        selectedRoomEnv2D.toLowerCase().includes(rem.environmentName.toLowerCase())
      ) {
        // avoid duplicating exact same id if it's current
        if (rem.furnitureId === selectedFurniture.id && itemsToDraw.length === 1 && rem.savedTransform.posX === furniturePosX) {
          return;
        }

        const foundModel = CATALOGUE_FURNITURE.find((m) => m.id === rem.furnitureId);
        itemsToDraw.push({
          id: rem.id,
          name: rem.furnitureName,
          brand: rem.brand,
          dimensions: rem.dimensions,
          posX: rem.savedTransform.posX,
          posZ: rem.savedTransform.posZ,
          rotY: rem.savedTransform.rotY,
          finishName: rem.savedTransform.finishName,
          finishHex: foundModel?.finishes[rem.savedTransform.finishIndex]?.hex || "#b45309",
          isCurrent: false,
          category: rem.category,
          price: rem.price,
        });
      }
    });

    // Center of Room in Canvas coordinates
    const roomCenterX = wallLeft + wallWidth / 2;
    const roomCenterY = wallTop + wallHeight / 2;

    itemsToDraw.forEach((item, idx) => {
      let cx = roomCenterX + item.posX * 120;
      let cy = roomCenterY + item.posZ * 120;

      // Clamp inside room interior
      cx = Math.max(wallLeft + wallThick + 50, Math.min(wallLeft + wallWidth - wallThick - 50, cx));
      cy = Math.max(wallTop + wallThick + 50, Math.min(wallTop + wallHeight - wallThick - 50, cy));

      // Parse width & depth from dimensions string e.g. "2.40m x 0.60m x 2.10m"
      let itemW = 120; // default px
      let itemD = 60;  // default px
      const dimMatch = item.dimensions.match(/([\d.,]+)\s*m\s*x\s*([\d.,]+)\s*m/i);
      if (dimMatch) {
        const parsedW = parseFloat(dimMatch[1].replace(",", "."));
        const parsedD = parseFloat(dimMatch[2].replace(",", "."));
        if (!isNaN(parsedW)) itemW = Math.max(40, Math.min(220, parsedW * 60));
        if (!isNaN(parsedD)) itemD = Math.max(30, Math.min(180, parsedD * 60));
      }

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((item.rotY * Math.PI) / 180);

      // Draw Furniture Shadow / Glow
      if (item.isCurrent) {
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowColor = "rgba(0,0,0,0.25)";
        ctx.shadowBlur = 8;
      }

      // Main Fill
      ctx.fillStyle = item.finishHex || "#b45309";
      ctx.beginPath();
      ctx.roundRect(-itemW / 2, -itemD / 2, itemW, itemD, 8);
      ctx.fill();

      // Border Outline
      ctx.shadowBlur = 0; // reset
      ctx.lineWidth = item.isCurrent ? 3 : 2;
      ctx.strokeStyle = item.isCurrent ? "#f59e0b" : "#78350f";
      ctx.stroke();

      // Top-down inner architectural detail lines
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.rect(-itemW / 2 + 6, -itemD / 2 + 6, itemW - 12, itemD - 12);
      ctx.stroke();

      ctx.restore();

      // Label Box below item
      ctx.fillStyle = item.isCurrent ? "rgba(245, 158, 11, 0.95)" : "rgba(24, 24, 27, 0.9)";
      ctx.strokeStyle = item.isCurrent ? "#f59e0b" : "#3f3f46";
      ctx.lineWidth = 1;

      const labelTxt = `${idx + 1}. ${item.name}`;
      ctx.font = "bold 11px sans-serif";
      const txtWidth = ctx.measureText(labelTxt).width + 16;

      const labelX = cx - txtWidth / 2;
      const labelY = cy + itemD / 2 + 8;

      ctx.fillRect(labelX, labelY, txtWidth, 22);
      ctx.strokeRect(labelX, labelY, txtWidth, 22);

      ctx.fillStyle = item.isCurrent ? "#09090b" : "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labelTxt, cx, labelY + 15);
      ctx.textAlign = "left";

      // Draw Dimension Cotas if enabled
      if (showDimensionsOn2D) {
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);

        // Cota to Left Wall
        ctx.beginPath();
        ctx.moveTo(wallLeft + wallThick, cy);
        ctx.lineTo(cx - itemW / 2, cy);
        ctx.stroke();

        ctx.setLineDash([]);
        const distMeters = Math.abs((cx - itemW / 2 - (wallLeft + wallThick)) / 100).toFixed(2);
        ctx.fillStyle = "#b45309";
        ctx.font = "10px monospace";
        ctx.fillText(`${distMeters}m`, (wallLeft + wallThick + cx - itemW / 2) / 2 - 12, cy - 4);
      }
    });

    // 6. Legend Overlay Table (Bottom Right)
    if (showLegendOn2D && itemsToDraw.length > 0) {
      const legX = wallLeft + wallWidth - 320;
      const legY = wallTop + wallHeight - 20 - itemsToDraw.length * 28 - 35;
      const legW = 300;
      const legH = itemsToDraw.length * 28 + 35;

      ctx.fillStyle = "rgba(9, 9, 11, 0.92)";
      ctx.fillRect(legX, legY, legW, legH);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(legX, legY, legW, legH);

      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("LEGENDA DOS MÓVEIS PLANEJADOS", legX + 12, legY + 22);

      itemsToDraw.forEach((it, i) => {
        const itemY = legY + 42 + i * 26;

        ctx.fillStyle = it.finishHex || "#f59e0b";
        ctx.fillRect(legX + 12, itemY - 10, 14, 14);
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(legX + 12, itemY - 10, 14, 14);

        ctx.fillStyle = "#ffffff";
        ctx.font = "11px sans-serif";
        const trimmedName = it.name.length > 24 ? it.name.substring(0, 22) + "..." : it.name;
        ctx.fillText(`${i + 1}. ${trimmedName} (${it.brand})`, legX + 34, itemY);
      });
    }

    // 7. Footer Stamp / Watermark
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, height - 40, width, 40);
    ctx.fillStyle = "#27272a";
    ctx.fillRect(0, height - 40, width, 1);

    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#a1a1aa";
    ctx.fillText("Gerado via Realidade Aumentada (RA) • Sistema Universo ADAS", 25, height - 16);

    ctx.font = "bold 11px sans-serif";
    ctx.fillStyle = "#f59e0b";
    ctx.textAlign = "right";
    ctx.fillText("GDM MARCENARIA & PAU PARA TODA OBRA", width - 25, height - 16);
    ctx.textAlign = "left";
  };

  // Re-draw 2D plan whenever modal is visible or position/options change
  useEffect(() => {
    if (showFloorPlanModal) {
      const timer = setTimeout(() => {
        drawHumanized2DFloorPlan();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [
    showFloorPlanModal,
    furniturePosX,
    furniturePosZ,
    furnitureRotY,
    selectedFurniture,
    selectedFinishIndex,
    reminders,
    floorTextureStyle,
    showDimensionsOn2D,
    showLegendOn2D,
    selectedRoomEnv2D,
  ]);

  // Export 2D Floor Plan Canvas as PNG Image
  const handleExportFloorPlanImage = () => {
    const canvas = canvas2dRef.current;
    if (!canvas) return;

    drawHumanized2DFloorPlan();

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.download = `planta_humanizada_ra_2d_${dateStr}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFloorPlanExportSuccess(true);
    setTimeout(() => setFloorPlanExportSuccess(false), 3500);
  };

  // 3D Dollhouse Model State (Modelo 3D Esquemático Dollhouse)
  const [showDollhouseModal, setShowDollhouseModal] = useState<boolean>(false);
  const [dollhouseViewPreset, setDollhouseViewPreset] = useState<"iso" | "front" | "top" | "side">("iso");
  const [showDollhouseVolumes, setShowDollhouseVolumes] = useState<boolean>(true);
  const [showDollhouseGrid, setShowDollhouseGrid] = useState<boolean>(true);
  const [dollhouseWallStyle, setDollhouseWallStyle] = useState<"translucido" | "solido" | "esquematico">("translucido");
  const [dollhouseSnapshotSuccess, setDollhouseSnapshotSuccess] = useState<boolean>(false);

  // JSON Project Backup & Restore State
  const [showBackupModal, setShowBackupModal] = useState<boolean>(false);
  const [backupSuccessMessage, setBackupSuccessMessage] = useState<string | null>(null);
  const [backupErrorMessage, setBackupErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const dollhouseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dollhouseRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dollhouseSceneRef = useRef<THREE.Scene | null>(null);
  const dollhouseCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const dollhouseAnimFrameRef = useRef<number | null>(null);

  const dollhouseOrbitRef = useRef({
    radius: 7.0,
    theta: Math.PI / 4,
    phi: Math.PI / 3,
    isDragging: false,
    previousMouseX: 0,
    previousMouseY: 0,
  });

  // Calculate furniture volume in m³
  const parseDimensionsToMeters = (dimStr: string) => {
    let w = 1.8;
    let d = 0.6;
    let h = 1.2;
    const match = dimStr.match(/([\d.,]+)\s*m\s*x\s*([\d.,]+)\s*m\s*x\s*([\d.,]+)\s*m/i);
    if (match) {
      w = parseFloat(match[1].replace(",", "."));
      d = parseFloat(match[2].replace(",", "."));
      h = parseFloat(match[3].replace(",", "."));
    } else {
      const match2 = dimStr.match(/([\d.,]+)\s*m\s*x\s*([\d.,]+)\s*m/i);
      if (match2) {
        w = parseFloat(match2[1].replace(",", "."));
        d = parseFloat(match2[2].replace(",", "."));
      }
    }
    w = isNaN(w) ? 1.8 : w;
    d = isNaN(d) ? 0.6 : d;
    h = isNaN(h) ? 1.2 : h;
    return {
      w,
      d,
      h,
      volume: w * d * h,
    };
  };

  const activeItemMetrics = parseDimensionsToMeters(selectedFurniture.dimensions);
  const totalFurnitureVolumeSum =
    activeItemMetrics.volume +
    reminders.reduce((acc, r) => acc + parseDimensionsToMeters(r.dimensions).volume, 0);
  const roomTotalVolume = 6.0 * 4.0 * 2.8; // 67.2 m³
  const occupiedPercentage = Math.min(100, (totalFurnitureVolumeSum / roomTotalVolume) * 100);
  const freeCirculationPercentage = Math.max(0, 100 - occupiedPercentage);

  // Initialize and update 3D Dollhouse Scene
  useEffect(() => {
    if (!showDollhouseModal) {
      if (dollhouseAnimFrameRef.current) {
        cancelAnimationFrame(dollhouseAnimFrameRef.current);
        dollhouseAnimFrameRef.current = null;
      }
      if (dollhouseRendererRef.current) {
        dollhouseRendererRef.current.dispose();
        dollhouseRendererRef.current = null;
      }
      return;
    }

    const canvas = dollhouseCanvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth || 800;
    const height = canvas.clientHeight || 450;

    // 1. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    dollhouseRendererRef.current = renderer;

    // 2. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b); // dark slate canvas
    dollhouseSceneRef.current = scene;

    // 3. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    dollhouseCameraRef.current = camera;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.2);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xf59e0b, 1.5, 8);
    pointLight.position.set(furniturePosX, furniturePosY + 2.0, furniturePosZ);
    scene.add(pointLight);

    // 5. Dollhouse Room Shell (Cutaway Box)
    const roomWidth = 6.0;
    const roomDepth = 4.0;
    const roomHeight = 2.8;

    // Floor
    const floorGeo = new THREE.BoxGeometry(roomWidth, 0.1, roomDepth);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, -0.05, 0);
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Floor Grid
    if (showDollhouseGrid) {
      const grid = new THREE.GridHelper(roomWidth, 12, 0xf59e0b, 0x475569);
      grid.position.set(0, 0.01, 0);
      scene.add(grid);
    }

    // Cutaway Back Wall (z = -roomDepth / 2)
    const backWallGeo = new THREE.BoxGeometry(roomWidth, roomHeight, 0.12);
    const wallOpacity =
      dollhouseWallStyle === "translucido" ? 0.45 : dollhouseWallStyle === "esquematico" ? 0.2 : 0.95;
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      transparent: true,
      opacity: wallOpacity,
      roughness: 0.5,
      wireframe: dollhouseWallStyle === "esquematico",
    });
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2);
    scene.add(backWall);

    // Cutaway Left Wall (x = -roomWidth / 2)
    const leftWallGeo = new THREE.BoxGeometry(0.12, roomHeight, roomDepth);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
    scene.add(leftWall);

    // Low Knee Wall (Right Wall cutaway x = roomWidth / 2)
    const rightKneeWallGeo = new THREE.BoxGeometry(0.12, 0.8, roomDepth);
    const rightKneeWall = new THREE.Mesh(rightKneeWallGeo, wallMat);
    rightKneeWall.position.set(roomWidth / 2, 0.4, 0);
    scene.add(rightKneeWall);

    // Corner Structural Pillars
    const pillarGeo = new THREE.BoxGeometry(0.15, roomHeight, 0.15);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const p1 = new THREE.Mesh(pillarGeo, pillarMat);
    p1.position.set(-roomWidth / 2, roomHeight / 2, -roomDepth / 2);
    scene.add(p1);

    const p2 = new THREE.Mesh(pillarGeo, pillarMat);
    p2.position.set(roomWidth / 2, roomHeight / 2, -roomDepth / 2);
    scene.add(p2);

    // 6. Placed Furniture 3D Blocks & Volume Wireframes
    const activeFinishHex = selectedFurniture.finishes[selectedFinishIndex]?.hex || "#d97706";
    const itemsToRender = [
      {
        id: selectedFurniture.id,
        name: selectedFurniture.name,
        brand: selectedFurniture.brand,
        dimensions: selectedFurniture.dimensions,
        posX: furniturePosX,
        posY: furniturePosY,
        posZ: furniturePosZ,
        rotY: furnitureRotY,
        hex: activeFinishHex,
        isCurrent: true,
      },
    ];

    reminders.forEach((rem) => {
      if (rem.furnitureId === selectedFurniture.id && rem.savedTransform.posX === furniturePosX) {
        return;
      }
      const foundModel = CATALOGUE_FURNITURE.find((m) => m.id === rem.furnitureId);
      itemsToRender.push({
        id: rem.id,
        name: rem.furnitureName,
        brand: rem.brand,
        dimensions: rem.dimensions,
        posX: rem.savedTransform.posX,
        posY: rem.savedTransform.posY,
        posZ: rem.savedTransform.posZ,
        rotY: rem.savedTransform.rotY,
        hex: foundModel?.finishes[rem.savedTransform.finishIndex]?.hex || "#0284c7",
        isCurrent: false,
      });
    });

    itemsToRender.forEach((item) => {
      const { w, d, h } = parseDimensionsToMeters(item.dimensions);

      const group = new THREE.Group();
      group.position.set(item.posX, item.posY + h / 2, item.posZ);
      group.rotation.y = (item.rotY * Math.PI) / 180;

      // Solid Main Mesh
      const meshGeo = new THREE.BoxGeometry(w, h, d);
      const meshMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(item.hex),
        roughness: 0.4,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(meshGeo, meshMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      // CAD Schematic Edges Line
      const edges = new THREE.EdgesGeometry(meshGeo);
      const lineMat = new THREE.LineBasicMaterial({
        color: item.isCurrent ? 0xf59e0b : 0xffffff,
        linewidth: item.isCurrent ? 2 : 1,
      });
      const line = new THREE.LineSegments(edges, lineMat);
      group.add(line);

      // Translucent Volumetric Bounding Box
      if (showDollhouseVolumes) {
        const volGeo = new THREE.BoxGeometry(w + 0.06, h + 0.06, d + 0.06);
        const volMat = new THREE.MeshBasicMaterial({
          color: item.isCurrent ? 0xf59e0b : 0x38bdf8,
          transparent: true,
          opacity: item.isCurrent ? 0.35 : 0.2,
          wireframe: true,
        });
        const volMesh = new THREE.Mesh(volGeo, volMat);
        group.add(volMesh);
      }

      scene.add(group);
    });

    // 7. Render Loop
    const animate = () => {
      const orb = dollhouseOrbitRef.current;
      const x = orb.radius * Math.sin(orb.phi) * Math.sin(orb.theta);
      const y = orb.radius * Math.cos(orb.phi);
      const z = orb.radius * Math.sin(orb.phi) * Math.cos(orb.theta);

      camera.position.set(x, y, z);
      camera.lookAt(0, 0.8, 0);

      renderer.render(scene, camera);
      dollhouseAnimFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (dollhouseAnimFrameRef.current) {
        cancelAnimationFrame(dollhouseAnimFrameRef.current);
      }
      renderer.dispose();
    };
  }, [
    showDollhouseModal,
    furniturePosX,
    furniturePosY,
    furniturePosZ,
    furnitureRotY,
    selectedFurniture,
    selectedFinishIndex,
    reminders,
    showDollhouseGrid,
    showDollhouseVolumes,
    dollhouseWallStyle,
  ]);

  // Set Preset View for Dollhouse
  const handleSetDollhousePreset = (preset: "iso" | "front" | "top" | "side") => {
    setDollhouseViewPreset(preset);
    const orb = dollhouseOrbitRef.current;
    if (preset === "iso") {
      orb.theta = Math.PI / 4;
      orb.phi = Math.PI / 3;
      orb.radius = 7.0;
    } else if (preset === "front") {
      orb.theta = 0;
      orb.phi = Math.PI / 2 - 0.08;
      orb.radius = 6.5;
    } else if (preset === "top") {
      orb.theta = 0;
      orb.phi = 0.02;
      orb.radius = 7.5;
    } else if (preset === "side") {
      orb.theta = Math.PI / 2;
      orb.phi = Math.PI / 2 - 0.08;
      orb.radius = 6.5;
    }
  };

  // Mouse orbit drag handlers for dollhouse 3D canvas
  const handleDollhouseMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    dollhouseOrbitRef.current.isDragging = true;
    dollhouseOrbitRef.current.previousMouseX = e.clientX;
    dollhouseOrbitRef.current.previousMouseY = e.clientY;
  };

  const handleDollhouseMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const orb = dollhouseOrbitRef.current;
    if (!orb.isDragging) return;

    const deltaX = e.clientX - orb.previousMouseX;
    const deltaY = e.clientY - orb.previousMouseY;

    orb.theta += deltaX * 0.008;
    orb.phi = Math.max(0.05, Math.min(Math.PI / 2 - 0.02, orb.phi + deltaY * 0.008));

    orb.previousMouseX = e.clientX;
    orb.previousMouseY = e.clientY;
  };

  const handleDollhouseMouseUp = () => {
    dollhouseOrbitRef.current.isDragging = false;
  };

  const handleDollhouseWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    const orb = dollhouseOrbitRef.current;
    orb.radius = Math.max(3.0, Math.min(12.0, orb.radius + e.deltaY * 0.005));
  };

  // Export 3D Dollhouse View Snapshot PNG
  const handleTakeDollhouseSnapshot = () => {
    if (!dollhouseRendererRef.current || !dollhouseSceneRef.current || !dollhouseCameraRef.current) return;

    const renderer = dollhouseRendererRef.current;
    const scene = dollhouseSceneRef.current;
    const camera = dollhouseCameraRef.current;

    renderer.render(scene, camera);
    const canvas3D = renderer.domElement;

    const mergeCanvas = document.createElement("canvas");
    mergeCanvas.width = 1280;
    mergeCanvas.height = 720;
    const ctx = mergeCanvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, 1280, 720);

    ctx.drawImage(canvas3D, 0, 0, 1280, 720);

    // Header stamp
    ctx.fillStyle = "rgba(9, 9, 11, 0.85)";
    ctx.fillRect(0, 0, 1280, 70);
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(0, 68, 1280, 2);

    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("MODELO 3D ESQUEMÁTICO - CORTE DOLLHOUSE", 30, 35);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#a1a1aa";
    ctx.fillText(`SIMULAÇÃO DE VOLUME ESPACIAL (RA) • MÓVEL: ${selectedFurniture.name.toUpperCase()}`, 30, 55);

    // Footer stamp
    ctx.fillStyle = "rgba(9, 9, 11, 0.85)";
    ctx.fillRect(0, 680, 1280, 40);
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = "#f59e0b";
    ctx.fillText("GDM MARCENARIA & PAU PARA TODA OBRA • UNIVERSO ADAS", 30, 705);

    const dataUrl = mergeCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `modelo_3d_dollhouse_${selectedFurniture.id}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDollhouseSnapshotSuccess(true);
    setTimeout(() => setDollhouseSnapshotSuccess(false), 3500);
  };

  const handleOpenQrScanner = () => {
    setShowQrScannerModal(true);
    setIsQrScanningActive(true);
    setScannedFurnitureResult(null);
    setQrFeedbackMessage(null);
    setManualQrInput("");
  };

  const handleProcessQrCodeString = (codeStr: string) => {
    setIsQrScanningActive(true);
    setQrFeedbackMessage("Lendo QR Code da etiqueta do showroom...");

    setTimeout(() => {
      const cleanCode = codeStr.trim().toLowerCase();
      // Find matching item by ID or name substring or url
      const found = CATALOGUE_FURNITURE.find(
        (item) =>
          item.id.toLowerCase() === cleanCode ||
          cleanCode.includes(item.id.toLowerCase()) ||
          item.name.toLowerCase().includes(cleanCode) ||
          item.modelType.toLowerCase() === cleanCode
      );

      setIsQrScanningActive(false);

      if (found) {
        setScannedFurnitureResult(found);
        setQrFeedbackMessage(`QR Code Validado! Modelo encontrado: "${found.name}"`);
      } else {
        setScannedFurnitureResult(null);
        setQrFeedbackMessage(`Nenhum móvel encontrado para o código QR "${codeStr}". Tente um código do catálogo!`);
      }
    }, 1200);
  };

  const handleConfirmQrScannedItem = (item: FurnitureModel3D) => {
    setSelectedFurniture(item);
    setSelectedFinishIndex(0);
    setFurniturePosX(0);
    setFurniturePosY(0);
    setFurniturePosZ(0);
    setFurnitureRotY(0);
    setShowQrScannerModal(false);

    // Trigger badge if applicable
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("unlock-construction-badge", {
          detail: { badgeId: "explorador_ra" },
        })
      );
    }

    // Smooth scroll to canvas viewport
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  // Export Project State to JSON file (Native File System API or Blob URL)
  const handleExportProjectJson = async () => {
    try {
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      const timeStr = now.toTimeString().split(" ")[0];

      const backupData = {
        version: "1.0",
        appName: "Universo ADAS - RA & Projeto 3D",
        exportedAt: `${dateStr} ${timeStr}`,
        projectData: {
          currentFurniture: {
            id: selectedFurniture.id,
            name: selectedFurniture.name,
            finishIndex: selectedFinishIndex,
            transform: {
              posX: furniturePosX,
              posY: furniturePosY,
              posZ: furniturePosZ,
              rotY: furnitureRotY,
              scale: furnitureScale,
            },
          },
          reminders: reminders,
          floorPlanSettings: {
            selectedRoomEnv2D,
            floorTextureStyle,
            showDimensionsOn2D,
            showLegendOn2D,
          },
          dollhouseSettings: {
            dollhouseViewPreset,
            dollhouseWallStyle,
            showDollhouseGrid,
            showDollhouseVolumes,
          },
        },
      };

      const jsonStr = JSON.stringify(backupData, null, 2);

      // Check for native File System Access API support
      if (typeof window !== "undefined" && "showSaveFilePicker" in window) {
        try {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: `universo_adas_projeto_backup_${dateStr}.json`,
            types: [
              {
                description: "Arquivo de Backup JSON do Projeto",
                accept: { "application/json": [".json"] },
              },
            ],
          });
          const writable = await handle.createWritable();
          await writable.write(jsonStr);
          await writable.close();

          setBackupErrorMessage(null);
          setBackupSuccessMessage("Estado do projeto salvo com sucesso no seu dispositivo via File System API!");
          setTimeout(() => setBackupSuccessMessage(null), 5000);
          return;
        } catch (abortErr: any) {
          if (abortErr.name === "AbortError") return; // User cancelled
        }
      }

      // Fallback: Blob Object URL Download
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `universo_adas_projeto_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setBackupErrorMessage(null);
      setBackupSuccessMessage(
        `Projeto exportado com sucesso! Arquivo "universo_adas_projeto_backup_${dateStr}.json" baixado.`
      );
      setTimeout(() => setBackupSuccessMessage(null), 5000);
    } catch (err) {
      console.error("Erro ao exportar JSON do projeto:", err);
      setBackupErrorMessage("Ocorreu um erro ao gerar o arquivo JSON de backup do projeto.");
    }
  };

  // Import Project State from JSON file
  const handleImportProjectJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (!content) throw new Error("Arquivo JSON vazio.");

        const parsed = JSON.parse(content);

        // Validate structure
        if (!parsed.projectData && !parsed.reminders && !Array.isArray(parsed)) {
          throw new Error("Formato JSON incompatível ou inválido para o Universo ADAS.");
        }

        const data = parsed.projectData || parsed;

        // Restore Reminders List
        if (Array.isArray(data.reminders)) {
          setReminders(data.reminders);
          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_REMINDERS_KEY, JSON.stringify(data.reminders));
          }
        } else if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].furnitureId) {
          // Direct array of reminders backup format
          setReminders(parsed);
          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_REMINDERS_KEY, JSON.stringify(parsed));
          }
        }

        // Restore Active Furniture & Transform
        if (data.currentFurniture) {
          const found = CATALOGUE_FURNITURE.find((m) => m.id === data.currentFurniture.id);
          if (found) {
            setSelectedFurniture(found);
          }
          if (typeof data.currentFurniture.finishIndex === "number") {
            setSelectedFinishIndex(data.currentFurniture.finishIndex);
          }
          if (data.currentFurniture.transform) {
            const t = data.currentFurniture.transform;
            if (typeof t.posX === "number") setFurniturePosX(t.posX);
            if (typeof t.posY === "number") setFurniturePosY(t.posY);
            if (typeof t.posZ === "number") setFurniturePosZ(t.posZ);
            if (typeof t.rotY === "number") setFurnitureRotY(t.rotY);
            if (typeof t.scale === "number") setFurnitureScale(t.scale);
          }
        }

        // Restore Floor Plan Settings
        if (data.floorPlanSettings) {
          const fps = data.floorPlanSettings;
          if (fps.selectedRoomEnv2D) setSelectedRoomEnv2D(fps.selectedRoomEnv2D);
          if (fps.floorTextureStyle) setFloorTextureStyle(fps.floorTextureStyle);
          if (typeof fps.showDimensionsOn2D === "boolean") setShowDimensionsOn2D(fps.showDimensionsOn2D);
          if (typeof fps.showLegendOn2D === "boolean") setShowLegendOn2D(fps.showLegendOn2D);
        }

        // Restore Dollhouse Settings
        if (data.dollhouseSettings) {
          const dhs = data.dollhouseSettings;
          if (dhs.dollhouseViewPreset) setDollhouseViewPreset(dhs.dollhouseViewPreset);
          if (dhs.dollhouseWallStyle) setDollhouseWallStyle(dhs.dollhouseWallStyle);
          if (typeof dhs.showDollhouseGrid === "boolean") setShowDollhouseGrid(dhs.showDollhouseGrid);
          if (typeof dhs.showDollhouseVolumes === "boolean") setShowDollhouseVolumes(dhs.showDollhouseVolumes);
        }

        setBackupErrorMessage(null);
        setBackupSuccessMessage(
          `Backup restaurado com sucesso! ${
            data.reminders?.length || (Array.isArray(parsed) ? parsed.length : 0)
          } móveis/lembretes e configurações foram carregados.`
        );
        setTimeout(() => setBackupSuccessMessage(null), 5000);
      } catch (err: any) {
        console.error("Erro ao importar JSON:", err);
        setBackupSuccessMessage(null);
        setBackupErrorMessage(
          err.message || "Erro ao ler o arquivo JSON. Certifique-se de selecionar um backup exportado do Universo ADAS."
        );
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.readAsText(file);
  };

  // Sync reminders to local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_REMINDERS_KEY, JSON.stringify(reminders));
    }
  }, [reminders]);

  const handleSavePlacementReminder = () => {
    const finishObj = selectedFurniture.finishes[selectedFinishIndex];
    const newReminder: ARPlacementReminder = {
      id: `rem-${Date.now()}`,
      furnitureId: selectedFurniture.id,
      furnitureName: selectedFurniture.name,
      brand: selectedFurniture.brand,
      price: selectedFurniture.price,
      dimensions: selectedFurniture.dimensions,
      environmentName: reminderEnvName.trim() || "Ambiente da Obra",
      category: reminderCategory,
      targetDate: reminderTargetDate,
      timelinePhase: reminderTimelinePhase,
      notes: reminderNotes.trim() || "Nenhuma observação registrada.",
      savedTransform: {
        posX: furniturePosX,
        posY: furniturePosY,
        posZ: furniturePosZ,
        rotY: furnitureRotY,
        scale: furnitureScale,
        finishIndex: selectedFinishIndex,
        finishName: finishObj?.name || selectedFurniture.defaultFinish,
      },
      status: "pendente",
      createdAt: new Date().toLocaleDateString("pt-BR"),
    };

    setReminders((prev) => [newReminder, ...prev]);
    setShowSaveModal(false);
    setSaveSuccessFeedback(true);
    setTimeout(() => setSaveSuccessFeedback(false), 4000);

    // Trigger achievement badge
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("unlock-construction-badge", {
          detail: { badgeId: "explorador_ra" },
        })
      );
    }
  };

  const handleStartEditReminder = (rem: ARPlacementReminder) => {
    setEditingReminderId(rem.id);
    setEditCategory(rem.category || "Compra");
    setEditTargetDate(rem.targetDate);
  };

  const handleSaveEditReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, category: editCategory, targetDate: editTargetDate }
          : r
      )
    );
    setEditingReminderId(null);
  };

  const handleLoadSavedPlacement = (rem: ARPlacementReminder) => {
    const item = CATALOGUE_FURNITURE.find((f) => f.id === rem.furnitureId);
    if (item) {
      setSelectedFurniture(item);
      setSelectedFinishIndex(rem.savedTransform.finishIndex || 0);
    }
    setFurniturePosX(rem.savedTransform.posX);
    setFurniturePosY(rem.savedTransform.posY);
    setFurniturePosZ(rem.savedTransform.posZ);
    setFurnitureRotY(rem.savedTransform.rotY);
    setFurnitureScale(rem.savedTransform.scale || 1.0);

    // Scroll to 3D canvas viewport smoothly
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const handleToggleReminderStatus = (id: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "pendente" ? "comprado" : "pendente" }
          : r
      )
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const getDaysRemaining = (targetDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Canvas & Video refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);

  // Filter catalogue
  const filteredCatalogue = CATALOGUE_FURNITURE.filter(
    (item) => activeCategory === "todos" || item.category === activeCategory
  );

  // Request Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Dispositivo não suporta streaming de câmera via navegador.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
        setUseSampleRoomBg(false);
      }
    } catch (err: any) {
      console.warn("Camera request error or permission denied:", err);
      setCameraError("Câmera indisponível ou permissão negada. Exibindo ambiente virtual 3D da sala.");
      setIsCameraActive(false);
      setUseSampleRoomBg(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    // Attempt auto camera start or graceful fallback
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Three.js AR Canvas Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene with transparent background to overlay on top of camera video
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.2);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0); // Completely transparent background

    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.2);
    sunLight.position.set(2, 4, 3);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const fillLight = new THREE.PointLight(0xfef08a, 0.6, 10);
    fillLight.position.set(-2, 2, 1);
    scene.add(fillLight);

    // Floor Grid Plane
    const gridHelper = new THREE.GridHelper(10, 20, 0xf59e0b, 0x52525b);
    gridHelper.position.y = -0.01;
    gridHelper.name = "floorGrid";
    scene.add(gridHelper);

    // Main Furniture Mesh Group
    const furnitureGroup = new THREE.Group();
    scene.add(furnitureGroup);
    meshGroupRef.current = furnitureGroup;

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  // Update Floor Grid visibility
  useEffect(() => {
    if (sceneRef.current) {
      const grid = sceneRef.current.getObjectByName("floorGrid");
      if (grid) grid.visible = showFloorGrid;
    }
  }, [showFloorGrid]);

  // Construct Procedural 3D Furniture Mesh when selection/finish changes
  useEffect(() => {
    const group = meshGroupRef.current;
    if (!group) return;

    // Clear existing meshes
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
    }

    const currentFinish =
      selectedFurniture.finishes[selectedFinishIndex] || selectedFurniture.finishes[0];
    const mainMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(currentFinish.hex),
      roughness: currentFinish.roughness,
      metalness: currentFinish.metalness,
    });

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.4,
      metalness: 0.8,
    });

    const ledGlowMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
      transmission: 0.9,
    });

    switch (selectedFurniture.modelType) {
      case "armario_cozinha": {
        // Balcão Inferior
        const baseGeo = new THREE.BoxGeometry(2.0, 0.8, 0.6);
        const baseMesh = new THREE.Mesh(baseGeo, mainMat);
        baseMesh.position.set(0, 0.4, 0);
        baseMesh.castShadow = true;
        group.add(baseMesh);

        // Tampo de pedra
        const topGeo = new THREE.BoxGeometry(2.04, 0.06, 0.64);
        const topMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2 });
        const topMesh = new THREE.Mesh(topGeo, topMat);
        topMesh.position.set(0, 0.83, 0);
        group.add(topMesh);

        // Armário Aéreo Suspenso
        const upperGeo = new THREE.BoxGeometry(2.0, 0.7, 0.35);
        const upperMesh = new THREE.Mesh(upperGeo, mainMat);
        upperMesh.position.set(0, 1.6, -0.12);
        group.add(upperMesh);

        // Fita LED
        const ledGeo = new THREE.BoxGeometry(1.95, 0.02, 0.05);
        const ledMesh = new THREE.Mesh(ledGeo, ledGlowMat);
        ledMesh.position.set(0, 1.24, -0.1);
        group.add(ledMesh);
        break;
      }

      case "painel_tv": {
        // Painel Ripado de Fundo
        const panelGeo = new THREE.BoxGeometry(2.0, 1.8, 0.08);
        const panelMesh = new THREE.Mesh(panelGeo, mainMat);
        panelMesh.position.set(0, 1.0, -0.2);
        group.add(panelMesh);

        // Ripa Details (Linhas verticais)
        for (let x = -0.9; x <= 0.9; x += 0.1) {
          const slatGeo = new THREE.BoxGeometry(0.04, 1.78, 0.02);
          const slatMesh = new THREE.Mesh(slatGeo, mainMat);
          slatMesh.position.set(x, 1.0, -0.15);
          group.add(slatMesh);
        }

        // Rack Suspenso
        const rackGeo = new THREE.BoxGeometry(1.8, 0.35, 0.4);
        const rackMesh = new THREE.Mesh(rackGeo, darkMetalMat);
        rackMesh.position.set(0, 0.25, 0);
        group.add(rackMesh);

        // Moldura da TV
        const tvGeo = new THREE.BoxGeometry(1.2, 0.7, 0.04);
        const tvMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.1 });
        const tvMesh = new THREE.Mesh(tvGeo, tvMat);
        tvMesh.position.set(0, 1.2, -0.12);
        group.add(tvMesh);
        break;
      }

      case "closet": {
        // Caixaria Principal
        const frameGeo = new THREE.BoxGeometry(2.4, 2.0, 0.55);
        const frameMesh = new THREE.Mesh(frameGeo, mainMat);
        frameMesh.position.set(0, 1.0, 0);
        group.add(frameMesh);

        // Divisórias internas pretas
        const shelf1 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.03, 0.52), darkMetalMat);
        shelf1.position.set(0, 1.4, 0);
        group.add(shelf1);

        const shelf2 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.03, 0.52), darkMetalMat);
        shelf2.position.set(0, 0.6, 0);
        group.add(shelf2);

        // Cabideiro de Inox
        const rodGeo = new THREE.CylinderGeometry(0.015, 0.015, 2.2);
        const rodMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 });
        const rodMesh = new THREE.Mesh(rodGeo, rodMat);
        rodMesh.rotation.z = Math.PI / 2;
        rodMesh.position.set(0, 1.25, 0);
        group.add(rodMesh);
        break;
      }

      case "sofa_l": {
        // Assento Principal
        const seatGeo = new THREE.BoxGeometry(2.2, 0.35, 0.9);
        const seatMesh = new THREE.Mesh(seatGeo, mainMat);
        seatMesh.position.set(0, 0.2, 0);
        group.add(seatMesh);

        // Chaise Longue L
        const chaiseGeo = new THREE.BoxGeometry(0.8, 0.35, 1.4);
        const chaiseMesh = new THREE.Mesh(chaiseGeo, mainMat);
        chaiseMesh.position.set(0.7, 0.2, 0.25);
        group.add(chaiseMesh);

        // Encosto Traseiro
        const backGeo = new THREE.BoxGeometry(2.2, 0.5, 0.25);
        const backMesh = new THREE.Mesh(backGeo, mainMat);
        backMesh.position.set(0, 0.55, -0.32);
        group.add(backMesh);

        // Almofadas
        for (let i = -0.7; i <= 0.7; i += 0.7) {
          const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.15), mainMat);
          pillow.position.set(i, 0.5, -0.22);
          group.add(pillow);
        }
        break;
      }

      case "mesa_gourmet": {
        // Tampo de Madeira Maciça
        const topGeo = new THREE.BoxGeometry(2.0, 0.08, 0.9);
        const topMesh = new THREE.Mesh(topGeo, mainMat);
        topMesh.position.set(0, 0.75, 0);
        group.add(topMesh);

        // Pés em U de Aço Preto
        const legMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8 });
        const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.71, 0.8), legMat);
        leg1.position.set(-0.85, 0.35, 0);
        group.add(leg1);

        const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.71, 0.8), legMat);
        leg2.position.set(0.85, 0.35, 0);
        group.add(leg2);

        // Banco de Acompanhamento
        const benchTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.35), mainMat);
        benchTop.position.set(0, 0.45, 0.75);
        group.add(benchTop);
        break;
      }

      case "balcao_banheiro": {
        // Gabinete
        const cabGeo = new THREE.BoxGeometry(1.2, 0.5, 0.48);
        const cabMesh = new THREE.Mesh(cabGeo, mainMat);
        cabMesh.position.set(0, 0.4, 0);
        group.add(cabMesh);

        // Cuba Esculpida de Quartzo
        const sinkGeo = new THREE.BoxGeometry(1.22, 0.12, 0.5);
        const sinkMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
        const sinkMesh = new THREE.Mesh(sinkGeo, sinkMat);
        sinkMesh.position.set(0, 0.7, 0);
        group.add(sinkMesh);

        // Espelheira
        const mirrorGeo = new THREE.BoxGeometry(1.1, 0.8, 0.03);
        const mirrorMesh = new THREE.Mesh(mirrorGeo, glassMat);
        mirrorMesh.position.set(0, 1.4, -0.2);
        group.add(mirrorMesh);
        break;
      }

      case "balcao_chopp": {
        // Balcão Base
        const cabGeo = new THREE.BoxGeometry(1.6, 1.0, 0.65);
        const cabMesh = new THREE.Mesh(cabGeo, mainMat);
        cabMesh.position.set(0, 0.5, 0);
        group.add(cabMesh);

        // Tampo Inox
        const topGeo = new THREE.BoxGeometry(1.64, 0.05, 0.68);
        const inoxMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.2 });
        const topMesh = new THREE.Mesh(topGeo, inoxMat);
        topMesh.position.set(0, 1.02, 0);
        group.add(topMesh);

        // Torneira Chopp
        const tapGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35);
        const tapMesh = new THREE.Mesh(tapGeo, inoxMat);
        tapMesh.position.set(0.3, 1.2, 0);
        group.add(tapMesh);
        break;
      }

      case "pergolado": {
        // 4 Colunas
        const postMat = mainMat;
        const postGeo = new THREE.BoxGeometry(0.15, 2.5, 0.15);

        const p1 = new THREE.Mesh(postGeo, postMat);
        p1.position.set(-1.2, 1.25, -1.0);
        group.add(p1);

        const p2 = new THREE.Mesh(postGeo, postMat);
        p2.position.set(1.2, 1.25, -1.0);
        group.add(p2);

        const p3 = new THREE.Mesh(postGeo, postMat);
        p3.position.set(-1.2, 1.25, 1.0);
        group.add(p3);

        const p4 = new THREE.Mesh(postGeo, postMat);
        p4.position.set(1.2, 1.25, 1.0);
        group.add(p4);

        // Ripas Superiores
        for (let z = -1.0; z <= 1.0; z += 0.25) {
          const slat = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 0.05), postMat);
          slat.position.set(0, 2.5, z);
          group.add(slat);
        }
        break;
      }
    }
  }, [selectedFurniture, selectedFinishIndex]);

  // Apply Transformations (Position, Rotation, Scale) to 3D Group
  useEffect(() => {
    const group = meshGroupRef.current;
    if (!group) return;

    group.position.x = furniturePosX;
    group.position.y = furniturePosY;
    group.position.z = furniturePosZ;
    group.rotation.y = (furnitureRotY * Math.PI) / 180;
    group.scale.set(furnitureScale, furnitureScale, furnitureScale);
  }, [furniturePosX, furniturePosY, furniturePosZ, furnitureRotY, furnitureScale]);

  // Capture Snapshot Photo
  const handleTakeSnapshot = () => {
    try {
      const canvas3D = rendererRef.current?.domElement;
      if (!canvas3D) return;

      const mergeCanvas = document.createElement("canvas");
      mergeCanvas.width = canvas3D.width || 1280;
      mergeCanvas.height = canvas3D.height || 720;
      const ctx = mergeCanvas.getContext("2d");
      if (!ctx) return;

      // Draw video frame or sample bg
      if (videoRef.current && isCameraActive) {
        ctx.drawImage(videoRef.current, 0, 0, mergeCanvas.width, mergeCanvas.height);
      } else {
        // Draw dark luxury room background
        ctx.fillStyle = "#18181b";
        ctx.fillRect(0, 0, mergeCanvas.width, mergeCanvas.height);

        ctx.fillStyle = "#27272a";
        ctx.fillRect(0, mergeCanvas.height * 0.6, mergeCanvas.width, mergeCanvas.height * 0.4);

        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#f59e0b";
        ctx.fillText("UNIVERSO ADAS - SIMULAÇÃO DE AMBIENTE VIRTUAL RA", 40, 50);
      }

      // Overlay 3D Canvas
      ctx.drawImage(canvas3D, 0, 0, mergeCanvas.width, mergeCanvas.height);

      // Watermark
      ctx.font = "extrabold 16px sans-serif";
      ctx.fillStyle = "#f59e0b";
      ctx.fillText(`Móvel: ${selectedFurniture.name} (${selectedFurniture.brand})`, 30, mergeCanvas.height - 40);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 30, mergeCanvas.height - 20);

      const dataUrl = mergeCanvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `RA-Movel-${selectedFurniture.name.replace(/\s+/g, "_")}.png`;
      a.click();

      setSnapshotSuccess(true);
      setTimeout(() => setSnapshotSuccess(false), 3500);
    } catch (e) {
      console.error("Error creating snapshot", e);
    }
  };

  const formatBRL = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* AR Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900 border border-amber-500/30 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-zinc-950 uppercase tracking-widest flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" /> Realidade Aumentada (RA)
              </span>
              <span className="text-xs text-emerald-400 font-extrabold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Câmera ao Vivo & 3D
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Posicionador de <span className="text-amber-400">Móveis no Seu Espaço</span>
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Projete os móveis planejados da GDM e estruturas da PAU PARA TODA OBRA diretamente no seu cômodo em tempo real através da câmera do seu celular ou computador.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
            <button
              onClick={() => setShowDollhouseModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500/25 via-amber-500/35 to-amber-600/25 hover:bg-amber-500/35 text-amber-300 font-extrabold text-xs rounded-2xl border border-amber-500/60 flex items-center gap-2 shadow-lg transition-all hover:scale-105"
            >
              <Box className="w-4 h-4 text-amber-400" />
              <span>Modelo 3D Dollhouse</span>
            </button>

            <button
              onClick={() => setShowFloorPlanModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs rounded-2xl border border-amber-500/50 flex items-center gap-2 shadow-lg transition-all hover:scale-105"
            >
              <Map className="w-4 h-4 text-amber-400" />
              <span>Planta 2D Humanizada</span>
            </button>

            <button
              onClick={() => setShowArGuideModal(true)}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-extrabold text-xs rounded-2xl border border-amber-500/40 flex items-center gap-2 shadow-lg transition-all hover:scale-105"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Guia Rápido de AR</span>
            </button>

            <button
              onClick={handleOpenQrScanner}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs rounded-2xl border border-amber-500/50 flex items-center gap-2 shadow-lg transition-all hover:scale-105"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Escanear QR Code</span>
            </button>

            <button
              onClick={() => setShowBackupModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs rounded-2xl border border-amber-500/50 flex items-center gap-2 shadow-lg transition-all hover:scale-105"
            >
              <FileJson className="w-4 h-4 text-amber-400" />
              <span>Backup Projeto (JSON)</span>
            </button>

            {/* Hidden File Input for JSON Backup Import */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportProjectJson}
              className="hidden"
            />

            <button
              onClick={() => setIsSidePanelOpen((prev) => !prev)}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold text-xs rounded-2xl border border-amber-500/40 flex items-center gap-2 shadow-lg transition-all hover:scale-105 relative"
            >
              <Bell className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Painel de Lembretes</span>
              {reminders.filter((r) => r.status === "pendente").length > 0 && (
                <span className="bg-amber-400 text-zinc-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                  {reminders.filter((r) => r.status === "pendente").length}
                </span>
              )}
            </button>

            {isCameraActive ? (
              <button
                onClick={stopCamera}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-2xl border border-zinc-700 flex items-center gap-2"
              >
                <CameraOff className="w-4 h-4 text-amber-400" />
                <span>Desativar Câmera</span>
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center gap-2 transition-all hover:scale-105"
              >
                <Camera className="w-4 h-4 stroke-[3]" />
                <span>Ativar Câmera RA</span>
              </button>
            )}
          </div>
        </div>

        {/* Main AR Workspace Grid: Camera View + Catalogue Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Camera Viewport & 3D AR Overlay (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Camera View Container */}
            <div className="relative bg-zinc-900 border-2 border-amber-500/50 rounded-3xl overflow-hidden shadow-2xl min-h-[420px] sm:min-h-[500px] flex items-center justify-center">
              {/* Background Video Feed */}
              <video
                ref={videoRef}
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  isCameraActive ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Sample Interior Room Fallback Background */}
              {!isCameraActive && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3">
                    <Box className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-1">
                    Ambiente Virtual 3D Ativo
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-md mb-4">
                    {cameraError || "Sua câmera está pausada. Você pode manipular o móvel no chão virtual abaixo ou ativar a câmera."}
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Ligar Câmera para Cômodo Real</span>
                  </button>
                </div>
              )}

              {/* Three.js 3D Canvas Overlay */}
              <div
                ref={mountRef}
                className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing"
              />

              {/* Top AR View Overlay Indicators */}
              <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-zinc-950/80 text-amber-400 border border-amber-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>{selectedFurniture.name}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 backdrop-blur-md">
                    {selectedFurniture.dimensions}
                  </span>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={() => setShowFloorGrid(!showFloorGrid)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md ${
                      showFloorGrid
                        ? "bg-amber-500 text-zinc-950 font-black shadow-md"
                        : "bg-zinc-950/80 text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Grade de Chão</span>
                  </button>
                </div>
              </div>

              {/* Inline Quick Visual Guidance Bar */}
              {showInlineGuideTip && (
                <div className="absolute top-16 left-4 right-4 z-20 bg-zinc-950/90 border border-amber-500/40 rounded-2xl p-2.5 backdrop-blur-md flex items-center justify-between gap-3 text-xs shadow-xl animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                      <Lightbulb className="w-4 h-4 animate-pulse" />
                    </span>
                    <p className="text-zinc-200 text-[11px] font-medium truncate">
                      <strong className="text-amber-400 font-black">Dica RA:</strong> Ilumine bem o ambiente e mova suavemente a câmera para fixar o plano 3D.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setShowArGuideModal(true)}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-[10px] uppercase rounded-lg transition-transform hover:scale-105"
                    >
                      Ver Guia Completo
                    </button>
                    <button
                      onClick={() => setShowInlineGuideTip(false)}
                      className="p-1 text-zinc-500 hover:text-zinc-300 rounded-lg"
                      title="Ocultar Dica"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Snapshot Toast Feedback */}
              {snapshotSuccess && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 bg-emerald-500 text-zinc-950 px-5 py-2.5 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  <span>Foto RA capturada e salva com sucesso!</span>
                </div>
              )}

              {/* Bottom Quick Snapshot & Action Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleTakeSnapshot}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-2xl flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    <span>Capturar Foto</span>
                  </button>

                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-2xl flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <Bookmark className="w-4 h-4 fill-zinc-950" />
                    <span>Salvar Lembrete de Compra</span>
                  </button>
                </div>

                <div className="bg-zinc-950/90 border border-zinc-800 px-4 py-2 rounded-2xl backdrop-blur-md flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-semibold">Valor Estimado:</span>
                  <span className="text-sm font-black text-amber-400">
                    {formatBRL(selectedFurniture.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive 3D Manipulation Controls Panel */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Move className="w-4 h-4" /> Ajuste de Posicionamento, Rotação & Escala 3D
                </h3>
                <button
                  onClick={() => {
                    setFurniturePosX(0);
                    setFurniturePosY(0);
                    setFurniturePosZ(0);
                    setFurnitureRotY(0);
                    setFurnitureScale(1.0);
                  }}
                  className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3 h-3" /> Resetar Posição
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Control 1: Posição X (Esquerda / Direita) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-zinc-300">
                    <span>Posição X (Lado):</span>
                    <span className="text-amber-400 font-mono">{furniturePosX.toFixed(2)}m</span>
                  </div>
                  <input
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.05"
                    value={furniturePosX}
                    onChange={(e) => setFurniturePosX(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Control 2: Posição Z (Profundidade / Fundo) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-zinc-300">
                    <span>Profundidade Z (Fundo):</span>
                    <span className="text-amber-400 font-mono">{furniturePosZ.toFixed(2)}m</span>
                  </div>
                  <input
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.05"
                    value={furniturePosZ}
                    onChange={(e) => setFurniturePosZ(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Control 3: Rotação 360° */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-zinc-300">
                    <span>Rotação (Girar):</span>
                    <span className="text-amber-400 font-mono">{furnitureRotY}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={furnitureRotY}
                    onChange={(e) => setFurnitureRotY(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Control 4: Elevação Y (Altura do Chão) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-zinc-300">
                    <span>Elevação Y (Altura):</span>
                    <span className="text-amber-400 font-mono">{furniturePosY.toFixed(2)}m</span>
                  </div>
                  <input
                    type="range"
                    min="-0.5"
                    max="1.5"
                    step="0.05"
                    value={furniturePosY}
                    onChange={(e) => setFurniturePosY(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Finish & Color Switcher */}
              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Palette className="w-4 h-4" /> Selecionar Acabamento & Material do Móvel:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedFurniture.finishes.map((finish, idx) => (
                    <button
                      key={finish.name}
                      onClick={() => setSelectedFinishIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                        selectedFinishIndex === idx
                          ? "bg-amber-500 text-zinc-950 border-amber-400 shadow-md scale-105"
                          : "bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: finish.hex }}
                      />
                      <span>{finish.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Studio Project State Backup Toolbar */}
              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <FileJson className="w-4 h-4" /> Estado do Projeto (projectState JSON):
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Backup Offline Local (File System / Blob)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={handleExportProjectJson}
                    className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/20 hover:bg-amber-500/35 text-amber-300 font-extrabold text-xs rounded-xl border border-amber-500/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Baixar Estado 3D (.JSON)</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-200 font-extrabold text-xs rounded-xl border border-zinc-800 hover:border-amber-500/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Carregar Backup JSON</span>
                  </button>
                </div>

                {backupSuccessMessage && (
                  <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-[11px] flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{backupSuccessMessage}</span>
                  </div>
                )}

                {backupErrorMessage && (
                  <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 font-bold text-[11px] flex items-center gap-2 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{backupErrorMessage}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Catalogue Selection List (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <Box className="w-4 h-4" /> Catálogo GDM & ADAS
                </h3>
                <span className="text-xs text-zinc-500 font-mono">
                  {filteredCatalogue.length} móveis
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pb-2 border-b border-zinc-800">
                {[
                  { label: "Todos", val: "todos" },
                  { label: "Cozinha", val: "cozinha" },
                  { label: "Sala", val: "sala" },
                  { label: "Quarto", val: "quarto" },
                  { label: "Banheiro", val: "banheiro" },
                  { label: "Gourmet", val: "gourmet" },
                ].map((c) => (
                  <button
                    key={c.val}
                    onClick={() => setActiveCategory(c.val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeCategory === c.val
                        ? "bg-amber-500 text-zinc-950 font-extrabold"
                        : "text-zinc-400 hover:text-white bg-zinc-950"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Catalogue Cards List */}
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredCatalogue.map((item) => {
                  const isSelected = selectedFurniture.id === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedFurniture(item);
                        setSelectedFinishIndex(0);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 space-y-2 ${
                        isSelected
                          ? "bg-amber-950/40 border-amber-400 shadow-lg scale-[1.02]"
                          : "bg-zinc-950 hover:bg-zinc-900 border-zinc-800"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/30">
                            {item.brand}
                          </span>
                          <h4 className="text-xs font-black text-white mt-1 leading-snug">
                            {item.name}
                          </h4>
                        </div>
                        <span className="text-xs font-black text-amber-400 shrink-0">
                          {formatBRL(item.price)}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900">
                        <span>Dimensões: <strong className="text-zinc-300">{item.dimensions}</strong></span>
                        {isSelected && (
                          <span className="text-amber-400 font-bold flex items-center gap-0.5">
                            ● Ativo no Espaço
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add to Project Quote CTA */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab("orcamento");
                  }}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-black text-xs uppercase tracking-wider rounded-2xl border border-zinc-700 flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Incluir Móvel no Orçamento Oficial</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Furniture Reminders & Purchase Timeline Section */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6 shadow-2xl mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase border border-emerald-500/30 flex items-center gap-1">
                  <Bell className="w-3 h-3 text-emerald-400 animate-bounce" /> Lembretes Visuais & Cronograma
                </span>
                <span className="text-xs text-amber-400 font-extrabold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {reminders.filter((r) => r.status === "pendente").length} Móveis a Adquirir
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>Cronograma de Compras &</span>
                <span className="text-amber-400">Posicionamentos RA</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Acompanhe os prazos de aquisição dos móveis simulados em 3D e receba alertas para não atrasar a montagem na obra.
              </p>
            </div>

            <button
              onClick={() => setShowSaveModal(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Novo Lembrete do Móvel Atual</span>
            </button>
          </div>

          {/* Overdue / Upcoming Alert Banner */}
          {reminders.some((r) => r.status === "pendente" && getDaysRemaining(r.targetDate) <= 7) && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/10 to-amber-500/20 border-2 border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-300 text-xs shadow-xl animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-black text-white text-sm">Alerta de Prazo de Entrega Próximo!</h4>
                  <p className="text-zinc-300">
                    Você possui móveis com data limite de compra estipulada para os próximos 7 dias. Adquira-os para manter o cronograma da obra em dia.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Toast feedback when reminder saved */}
          {saveSuccessFeedback && (
            <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Lembrete e posicionamento 3D salvos no cronograma de compras com sucesso!</span>
            </div>
          )}

          {/* Reminders List */}
          {reminders.length === 0 ? (
            <div className="p-8 text-center bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
              <Bookmark className="w-8 h-8 text-zinc-600 mx-auto" />
              <h4 className="text-sm font-bold text-zinc-300">Nenhum lembrete de compra salvo ainda.</h4>
              <p className="text-xs text-zinc-500">
                Posicione um móvel na câmera RA e clique em "Salvar Lembrete de Compra" para vinculá-lo a um prazo!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reminders.map((rem) => {
                const daysLeft = getDaysRemaining(rem.targetDate);
                const isOverdue = daysLeft < 0;
                const isUrgent = daysLeft >= 0 && daysLeft <= 7;
                const isPurchased = rem.status === "comprado";

                return (
                  <div
                    key={rem.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between space-y-3 ${
                      isPurchased
                        ? "bg-zinc-950/60 border-zinc-800/80 opacity-75"
                        : isOverdue
                        ? "bg-rose-950/30 border-rose-500/60 shadow-lg"
                        : isUrgent
                        ? "bg-amber-950/30 border-amber-500/60 shadow-lg"
                        : "bg-zinc-950 border-zinc-800 hover:border-amber-500/40"
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Header Badge Row */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 border ${
                              rem.category === "Compra"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : rem.category === "Instalação"
                                ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                                : "bg-purple-500/20 text-purple-300 border-purple-500/40"
                            }`}
                          >
                            {rem.category === "Compra" && <ShoppingBag className="w-3 h-3" />}
                            {rem.category === "Instalação" && <Wrench className="w-3 h-3" />}
                            {rem.category === "Montagem" && <HardHat className="w-3 h-3" />}
                            <span>{rem.category || "Compra"}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800">
                            {rem.environmentName}
                          </span>
                        </div>

                        {isPurchased ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Adquirido
                          </span>
                        ) : isOverdue ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Vencido ({Math.abs(daysLeft)} dias)
                          </span>
                        ) : isUrgent ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" /> Faltam {daysLeft} dias
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {daysLeft} dias
                          </span>
                        )}
                      </div>

                      {/* Title & Price */}
                      <div>
                        <h4 className="text-sm font-black text-white leading-snug">
                          {rem.furnitureName}
                        </h4>
                        <div className="text-xs font-black text-amber-400 mt-0.5">
                          {formatBRL(rem.price)}
                        </div>
                      </div>

                      {/* Phase & Notes */}
                      <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400 font-semibold">Fase Obra:</span>
                          <span className="text-amber-300 font-bold">{rem.timelinePhase}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400 font-semibold">Prazo Final:</span>
                          <span className="text-white font-mono font-bold">
                            {new Date(rem.targetDate + "T00:00:00").toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800 italic">
                          "{rem.notes}"
                        </div>
                      </div>

                      {/* Saved Transform Summary */}
                      <div className="text-[10px] text-zinc-500 font-mono bg-zinc-900/50 p-2 rounded-lg flex items-center justify-between">
                        <span>Acabamento: {rem.savedTransform.finishName}</span>
                        <span>Pos: ({rem.savedTransform.posX}m, {rem.savedTransform.posZ}m)</span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleLoadSavedPlacement(rem)}
                        className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-[11px] font-extrabold flex items-center gap-1 transition-all"
                        title="Reaplicar este móvel com as mesmas coordenadas no espaço 3D"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Reaplicar no Espaço 3D</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleReminderStatus(rem.id)}
                          className={`p-1.5 rounded-xl border text-xs transition-all ${
                            isPurchased
                              ? "bg-zinc-800 text-zinc-400 border-zinc-700"
                              : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30"
                          }`}
                          title={isPurchased ? "Marcar como Pendente" : "Marcar como Adquirido"}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteReminder(rem.id)}
                          className="p-1.5 bg-zinc-900 hover:bg-rose-950 text-zinc-500 hover:text-rose-400 border border-zinc-800 hover:border-rose-800 rounded-xl transition-all"
                          title="Excluir Lembrete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Save Reminder Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-zinc-950 border-2 border-amber-500/60 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowSaveModal(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full border border-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1 pr-8">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase border border-emerald-500/30 inline-flex items-center gap-1">
                  <Bookmark className="w-3 h-3 text-emerald-400" /> Vínculo ao Cronograma da Obra
                </span>
                <h3 className="text-xl font-black text-white">
                  Salvar Lembrete de Compra
                </h3>
                <p className="text-xs text-zinc-400">
                  Defina um prazo de entrega e vinculação ao cronograma para o móvel posicionado no seu ambiente RA.
                </p>
              </div>

              {/* Furniture Summary */}
              <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-black text-white">{selectedFurniture.name}</div>
                  <div className="text-[11px] text-zinc-400">
                    Marca: {selectedFurniture.brand} • Finish: {selectedFurniture.finishes[selectedFinishIndex]?.name}
                  </div>
                </div>
                <div className="text-amber-400 font-black">{formatBRL(selectedFurniture.price)}</div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">
                    Cômodo / Ambiente do Imóvel:
                  </label>
                  <input
                    type="text"
                    value={reminderEnvName}
                    onChange={(e) => setReminderEnvName(e.target.value)}
                    placeholder="Ex: Sala de Estar, Cozinha Gourmet, Suíte Master"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">
                      Categoria do Lembrete:
                    </label>
                    <select
                      value={reminderCategory}
                      onChange={(e) => setReminderCategory(e.target.value as ReminderCategory)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                    >
                      <option value="Compra">🛒 Compra</option>
                      <option value="Instalação">🛠️ Instalação</option>
                      <option value="Montagem">🔧 Montagem</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">
                      Data de Vencimento:
                    </label>
                    <input
                      type="date"
                      value={reminderTargetDate}
                      onChange={(e) => setReminderTargetDate(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">
                      Fase do Cronograma:
                    </label>
                    <select
                      value={reminderTimelinePhase}
                      onChange={(e) => setReminderTimelinePhase(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                    >
                      <option value="Antes da Alvenaria">Antes da Alvenaria</option>
                      <option value="Fase de Instalações">Fase de Instalações</option>
                      <option value="Antes da Pintura Final">Antes da Pintura Final</option>
                      <option value="Fase de Acabamento">Fase de Acabamento</option>
                      <option value="Decoração & Entrega">Decoração & Entrega</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">
                    Lembrete / Observações para Equipe de Instalação:
                  </label>
                  <textarea
                    rows={2}
                    value={reminderNotes}
                    onChange={(e) => setReminderNotes(e.target.value)}
                    placeholder="Ex: Conferir se os pontos de tomada 220V do painel estão passados..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl border border-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSavePlacementReminder}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Bookmark className="w-4 h-4 fill-zinc-950" />
                  <span>Salvar Lembrete & Alerta</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Side Drawer - Painel Lateral de Gerenciamento de Lembretes */}
        {isSidePanelOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsSidePanelOpen(false)}
            />

            {/* Side Drawer Panel */}
            <div className="relative w-full max-w-md bg-zinc-950 border-l-2 border-amber-500/50 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 overflow-hidden">
              {/* Drawer Header */}
              <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between gap-3 shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/30 flex items-center gap-1">
                      <Bell className="w-3 h-3 text-amber-400 animate-bounce" /> Painel Lateral RA
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {reminders.length} Registros
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <PanelRightOpen className="w-5 h-5 text-amber-400" />
                    <span>Gerenciador de Lembretes</span>
                  </h3>
                </div>

                <button
                  onClick={() => setIsSidePanelOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full border border-zinc-700 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter Tabs in Side Panel */}
              <div className="p-3 bg-zinc-900/50 border-b border-zinc-800 shrink-0">
                <div className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Filter className="w-3 h-3 text-amber-400" /> Categoria de Lembrete:
                  </span>
                  <span className="text-amber-400">{panelCategoryFilter.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { id: "todas", label: "Todas" },
                    { id: "Compra", label: "🛒 Compra" },
                    { id: "Instalação", label: "🛠️ Instalação" },
                    { id: "Montagem", label: "🔧 Montagem" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setPanelCategoryFilter(cat.id)}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-extrabold transition-all text-center border truncate ${
                        panelCategoryFilter === cat.id
                          ? "bg-amber-500 text-zinc-950 border-amber-400 font-black shadow"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Body List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Quick Add Button & JSON Backup Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                  >
                    <Bookmark className="w-4 h-4 fill-zinc-950" />
                    <span>Salvar Posicionamento Atual</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleExportProjectJson}
                      className="py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-extrabold text-xs rounded-xl border border-amber-500/40 flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02]"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Exportar JSON</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-extrabold text-xs rounded-xl border border-amber-500/40 flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02]"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Importar JSON</span>
                    </button>
                  </div>
                </div>

                {/* Filtered Reminders List */}
                {reminders.filter((r) => panelCategoryFilter === "todas" || r.category === panelCategoryFilter).length === 0 ? (
                  <div className="p-8 text-center bg-zinc-900/60 rounded-2xl border border-zinc-800/80 space-y-2 my-4">
                    <ListFilter className="w-8 h-8 text-zinc-600 mx-auto" />
                    <h4 className="text-sm font-bold text-zinc-300">Nenhum lembrete nesta categoria.</h4>
                    <p className="text-xs text-zinc-500">
                      Selecione outra categoria ou salve o posicionamento do móvel atual.
                    </p>
                  </div>
                ) : (
                  reminders
                    .filter((r) => panelCategoryFilter === "todas" || r.category === panelCategoryFilter)
                    .map((rem) => {
                      const daysLeft = getDaysRemaining(rem.targetDate);
                      const isOverdue = daysLeft < 0;
                      const isUrgent = daysLeft >= 0 && daysLeft <= 7;
                      const isPurchased = rem.status === "comprado";
                      const isEditing = editingReminderId === rem.id;

                      return (
                        <div
                          key={rem.id}
                          className={`p-4 rounded-2xl border transition-all duration-200 space-y-3 relative ${
                            isPurchased
                              ? "bg-zinc-950/70 border-zinc-800 opacity-80"
                              : isOverdue
                              ? "bg-rose-950/30 border-rose-500/60 shadow-lg"
                              : isUrgent
                              ? "bg-amber-950/30 border-amber-500/60 shadow-lg"
                              : "bg-zinc-900/90 border-zinc-800 hover:border-amber-500/40"
                          }`}
                        >
                          {/* Category Pill + Status */}
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1 border ${
                                rem.category === "Compra"
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                  : rem.category === "Instalação"
                                  ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                                  : "bg-purple-500/20 text-purple-300 border-purple-500/40"
                              }`}
                            >
                              {rem.category === "Compra" && <ShoppingBag className="w-3 h-3" />}
                              {rem.category === "Instalação" && <Wrench className="w-3 h-3" />}
                              {rem.category === "Montagem" && <HardHat className="w-3 h-3" />}
                              <span>{rem.category || "Compra"}</span>
                            </span>

                            <span className="text-[10px] font-mono font-bold text-zinc-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-amber-400" />
                              {new Date(rem.targetDate + "T00:00:00").toLocaleDateString("pt-BR")}
                            </span>
                          </div>

                          {/* Title & Environment */}
                          <div>
                            <h4 className="text-sm font-black text-white leading-snug">
                              {rem.furnitureName}
                            </h4>
                            <div className="text-xs text-amber-400 font-bold flex items-center justify-between mt-0.5">
                              <span>{formatBRL(rem.price)}</span>
                              <span className="text-[11px] text-zinc-400 font-normal">📍 {rem.environmentName}</span>
                            </div>
                          </div>

                          {/* Inline Category & Due Date Quick Editor */}
                          {isEditing ? (
                            <div className="p-3 bg-zinc-950 rounded-xl border border-amber-500/50 space-y-2 animate-in fade-in">
                              <div className="text-[10px] font-extrabold text-amber-400 uppercase">Editar Vencimento & Categoria</div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-zinc-400 block font-semibold mb-0.5">Categoria:</label>
                                  <select
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value as ReminderCategory)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-white"
                                  >
                                    <option value="Compra">Compra</option>
                                    <option value="Instalação">Instalação</option>
                                    <option value="Montagem">Montagem</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="text-[10px] text-zinc-400 block font-semibold mb-0.5">Data Vencimento:</label>
                                  <input
                                    type="date"
                                    value={editTargetDate}
                                    onChange={(e) => setEditTargetDate(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-white"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                  onClick={() => setEditingReminderId(null)}
                                  className="px-2.5 py-1 bg-zinc-800 text-zinc-300 text-[10px] font-bold rounded-lg"
                                >
                                  Cancelar
                                </button>
                                <button
                                  onClick={() => handleSaveEditReminder(rem.id)}
                                  className="px-3 py-1 bg-amber-500 text-zinc-950 text-[10px] font-black rounded-lg flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" /> Salvar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800/80 space-y-1 text-xs">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-zinc-400 font-semibold">Fase Obra:</span>
                                <span className="text-zinc-200 font-bold">{rem.timelinePhase}</span>
                              </div>
                              <div className="text-[11px] text-zinc-400 italic pt-1 border-t border-zinc-800">
                                "{rem.notes}"
                              </div>
                            </div>
                          )}

                          {/* Actions Footer */}
                          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
                            <button
                              onClick={() => {
                                handleLoadSavedPlacement(rem);
                                setIsSidePanelOpen(false);
                              }}
                              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-[11px] font-extrabold flex items-center gap-1 transition-all"
                            >
                              <RotateCw className="w-3 h-3" />
                              <span>Carregar no 3D</span>
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleStartEditReminder(rem)}
                                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl border border-zinc-700 transition-all"
                                title="Editar Categoria / Vencimento"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleToggleReminderStatus(rem.id)}
                                className={`p-1.5 rounded-xl border text-xs transition-all ${
                                  isPurchased
                                    ? "bg-zinc-800 text-zinc-400 border-zinc-700"
                                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30"
                                }`}
                                title={isPurchased ? "Marcar como Pendente" : "Marcar como Concluído"}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteReminder(rem.id)}
                                className="p-1.5 bg-zinc-900 hover:bg-rose-950 text-zinc-500 hover:text-rose-400 border border-zinc-800 rounded-xl transition-all"
                                title="Excluir Lembrete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 text-center text-xs text-zinc-400 shrink-0">
                <span className="font-bold text-amber-400">Dica:</span> Selecione a categoria (Compra, Instalação ou Montagem) para alinhar o cronograma da obra.
              </div>
            </div>
          </div>
        )}

        {/* QR Code Scanner Modal */}
        {showQrScannerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
              onClick={() => setShowQrScannerModal(false)}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-xl bg-zinc-950 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden z-10 space-y-0 flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <QrCode className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <span>Scanner de QR Code do Showroom</span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Escaneie etiquetas de móveis físicos nas lojas para abrir em Realidade Aumentada.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowQrScannerModal(false)}
                  className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full border border-zinc-700 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-5 flex-1">
                {/* Simulated Scanner Camera Viewfinder */}
                <div className="relative w-full h-52 sm:h-60 bg-zinc-900 rounded-2xl border-2 border-dashed border-amber-500/50 flex flex-col items-center justify-center overflow-hidden shadow-inner">
                  {/* Scanning HUD Crosshairs */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400" />

                  {/* Animated Laser Scan Line */}
                  <div className="absolute inset-x-8 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-bounce" />

                  {/* Center QR Target Graphic */}
                  <div className="p-4 rounded-2xl bg-zinc-950/80 border border-amber-500/30 flex flex-col items-center gap-2 text-center backdrop-blur-sm z-10">
                    <Scan className="w-10 h-10 text-amber-400 animate-pulse" />
                    <span className="text-xs font-bold text-amber-200">
                      {isQrScanningActive ? "Escaneando etiqueta QR..." : "Aproxime o QR Code do centro"}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Compatível com etiquetas físicas GDM & PAU PARA TODA OBRA
                    </span>
                  </div>
                </div>

                {/* Status Feedback Banner */}
                {qrFeedbackMessage && (
                  <div
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                      scannedFurnitureResult
                        ? "bg-emerald-950/70 border-emerald-500/60 text-emerald-300"
                        : "bg-amber-950/70 border-amber-500/60 text-amber-300"
                    }`}
                  >
                    {scannedFurnitureResult ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span>{qrFeedbackMessage}</span>
                  </div>
                )}

                {/* Scanned Furniture Result Card */}
                {scannedFurnitureResult && (
                  <div className="p-4 bg-zinc-900 border-2 border-emerald-500/70 rounded-2xl space-y-3 shadow-xl animate-in fade-in">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase">
                          {scannedFurnitureResult.brand} • {scannedFurnitureResult.category.toUpperCase()}
                        </span>
                        <h4 className="text-base font-black text-white mt-1">
                          {scannedFurnitureResult.name}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {scannedFurnitureResult.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-black text-amber-400">
                          {formatBRL(scannedFurnitureResult.price)}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                          {scannedFurnitureResult.dimensions}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleConfirmQrScannedItem(scannedFurnitureResult)}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                    >
                      <Box className="w-4 h-4" />
                      <span>Carregar Modelo 3D no Cômodo em RA</span>
                    </button>
                  </div>
                )}

                {/* Showroom Physical Tags Quick Selector (Simular Leitura) */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                    <span>Etiquetas de QR Code Físicas do Showroom:</span>
                    <span className="text-[10px] text-amber-400 font-normal">Clique para simular bip</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CATALOGUE_FURNITURE.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleProcessQrCodeString(item.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 group ${
                          scannedFurnitureResult?.id === item.id
                            ? "bg-amber-500/20 border-amber-400 text-amber-200"
                            : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                            {item.name}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-amber-400" />
                            <span>QR: {item.id.toUpperCase()}</span>
                          </div>
                        </div>

                        <span className="px-2 py-1 bg-zinc-950 rounded-lg text-[10px] font-black text-amber-400 border border-zinc-800 shrink-0">
                          Escanear
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual Text QR Input */}
                <div className="pt-2 border-t border-zinc-800 space-y-2">
                  <label className="text-xs font-bold text-zinc-400 block">
                    Digitar Código QR da Etiqueta Manualmente:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ex: gdm-cozinha-01, pau-mesa-05..."
                      value={manualQrInput}
                      onChange={(e) => setManualQrInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && manualQrInput.trim()) {
                          handleProcessQrCodeString(manualQrInput);
                        }
                      }}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <button
                      onClick={() => manualQrInput.trim() && handleProcessQrCodeString(manualQrInput)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-xl transition-all"
                    >
                      Processar
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 flex items-center justify-between text-xs text-zinc-400 shrink-0">
                <span className="flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Modelos 3D em escala real 1:1 homologados.
                </span>
                <button
                  onClick={() => setShowQrScannerModal(false)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-bold text-xs"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Guia Rápido de Realidade Aumentada (AR Quick Guide) */}
        {showArGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
              onClick={() => setShowArGuideModal(false)}
            />

            {/* Modal Dialog */}
            <div className="relative w-full max-w-2xl bg-zinc-950 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <HelpCircle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <span>Guia Rápido de Realidade Aumentada (RA)</span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Instruções visuais para escanear seu espaço e alinhar os móveis em escala 1:1.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowArGuideModal(false)}
                  className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full border border-zinc-700 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step Navigation Tabs */}
              <div className="p-3 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-around gap-1 shrink-0 overflow-x-auto">
                {[
                  { num: 1, title: "1. Iluminação & Piso", icon: Sun },
                  { num: 2, title: "2. Escolha & QR Code", icon: QrCode },
                  { num: 3, title: "3. Eixos & Giro 3D", icon: Move },
                  { num: 4, title: "4. Medidas & Agendamento", icon: Ruler },
                ].map((step) => {
                  const IconComp = step.icon;
                  const isActive = activeGuideStep === step.num;
                  return (
                    <button
                      key={step.num}
                      onClick={() => setActiveGuideStep(step.num)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                        isActive
                          ? "bg-amber-500 text-zinc-950 border-amber-400 font-black shadow-lg"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{step.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Step Content Display */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {activeGuideStep === 1 && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl flex items-start gap-3">
                      <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl shrink-0">
                        <Sun className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">Passo 1: Varredura do Cômodo & Iluminação</h4>
                        <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                          Antes de inserir o móvel 3D, abra as janelas ou acenda as luzes. Mova o celular suavemente em gestos de "S" apontados para o chão para o sensor rastrear o plano do piso.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                        <div className="text-amber-400 font-black text-xs flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" /> Boa Luz
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Evite penumbra total ou luz solar direta intensa refletida no chão.
                        </p>
                      </div>

                      <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                        <div className="text-amber-400 font-black text-xs flex items-center gap-1">
                          <Compass className="w-4 h-4" /> Distância Ideal
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Fique entre 1,5m e 3,0m de distância de onde o móvel planejado ficará.
                        </p>
                      </div>

                      <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                        <div className="text-amber-400 font-black text-xs flex items-center gap-1">
                          <Grid className="w-4 h-4" /> Grade de Chão
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Ative o botão "Grade de Chão" para visualizar as linhas de nível no piso.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeGuideStep === 2 && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl flex items-start gap-3">
                      <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl shrink-0">
                        <QrCode className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">Passo 2: Seleção no Catálogo ou Scanner de QR Code</h4>
                        <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                          Navegue pelo Catálogo 3D no painel à direita ou utilize o botão <strong>Escanear QR Code</strong> para ler etiquetas físicas de móveis em lojas e showrooms parceiros.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-white font-bold text-xs">
                          <Box className="w-4 h-4 text-amber-400" />
                          <span>Catálogo Virtual GDM & WVR</span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-normal">
                          Filtre por ambientes (Cozinha, Sala, Quarto, Área Gourmet) e selecione o modelo com 1 clique para projetá-lo no ambiente.
                        </p>
                      </div>

                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-white font-bold text-xs">
                          <Scan className="w-4 h-4 text-amber-400" />
                          <span>Etiquetas do Showroom</span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-normal">
                          Aponte a câmera para o QR Code da etiqueta física para puxar o projeto executivo original instantaneamente para a sua sala.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeGuideStep === 3 && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl flex items-start gap-3">
                      <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl shrink-0">
                        <Move className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">Passo 3: Movimentação nos Eixos 3D & Troca de Acabamentos</h4>
                        <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                          Ajuste o posicionamento milimétrico utilizando os controles de eixos X (lateral), Y (elevação/parede) e Z (profundidade). Gire o modelo em 360° para conferir circulação.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                        <div className="text-amber-400 font-black text-xs flex items-center gap-1">
                          <SlidersHorizontal className="w-4 h-4" /> Eixos X, Y e Z
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Desloque o móvel pela parede ou pelo piso sem perder o alinhamento.
                        </p>
                      </div>

                      <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                        <div className="text-amber-400 font-black text-xs flex items-center gap-1">
                          <RotateCw className="w-4 h-4" /> Giro de 360°
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Gire o móvel para testar a abertura de portas, gavetas e acessibilidade.
                        </p>
                      </div>

                      <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                        <div className="text-amber-400 font-black text-xs flex items-center gap-1">
                          <Palette className="w-4 h-4" /> Mostruário de Padrões
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Mude a cor do MDF (Freijó, Grafito, Louro) e veja a reflexão em tempo real.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeGuideStep === 4 && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl flex items-start gap-3">
                      <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl shrink-0">
                        <Ruler className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">Passo 4: Validação de Medidas & Painel de Lembretes</h4>
                        <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                          Verifique as dimensões em metros no banner do topo para garantir que o móvel não obstrua tomadas ou interruptores. Em seguida, salve o posicionamento para o cronograma da obra.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                          <Bell className="w-4 h-4" />
                          <span>Categorização do Lembrete</span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-normal">
                          Defina a categoria como <strong>'Compra'</strong>, <strong>'Instalação'</strong> ou <strong>'Montagem'</strong> com data limite de vencimento.
                        </p>
                      </div>

                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                          <Download className="w-4 h-4" />
                          <span>Foto do Projeto com Cotas</span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-normal">
                          Clique em <strong>Capturar Foto</strong> para salvar a imagem renderizada com o móvel no cômodo para apresentar à equipe da obra.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Checklist de Boas Práticas */}
                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
                  <h5 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Checklist de Garantia de Precisão 3D</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-zinc-300">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Escala real 1:1 rigorosa</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Rastreio de piso texturizado</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Sincronia com Cronograma</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Navigation */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setActiveGuideStep((prev) => Math.max(1, prev - 1))}
                  disabled={activeGuideStep === 1}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 font-bold text-xs rounded-xl transition-all"
                >
                  Anterior
                </button>

                <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
                  <span>Passo {activeGuideStep} de 4</span>
                </div>

                {activeGuideStep < 4 ? (
                  <button
                    onClick={() => setActiveGuideStep((prev) => Math.min(4, prev + 1))}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-xl flex items-center gap-1 transition-all"
                  >
                    <span>Próximo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowArGuideModal(false);
                      if (!isCameraActive) startCamera();
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Entendi! Iniciar no Meu Espaço</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Planta 2D Humanizada de Arquitetura */}
        {showFloorPlanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
              onClick={() => setShowFloorPlanModal(false)}
            />

            {/* Modal Dialog */}
            <div className="relative w-full max-w-5xl bg-zinc-950 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <Map className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <span>Planta 2D Humanizada de Layout</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold border border-amber-500/40">
                        RA Scale 1:20
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Representação técnica e arquitetônica dos móveis dispostos no ambiente em Realidade Aumentada.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportFloorPlanImage}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar Imagem (PNG)</span>
                  </button>

                  <button
                    onClick={() => setShowFloorPlanModal(false)}
                    className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full border border-zinc-700 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Toast Export Feedback */}
              {floorPlanExportSuccess && (
                <div className="p-3 bg-emerald-500 text-zinc-950 font-black text-xs text-center flex items-center justify-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Planta Humanizada 2D exportada com sucesso em alta resolução!</span>
                </div>
              )}

              {/* Controls Toolbar */}
              <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
                {/* Room Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 font-bold text-[11px] uppercase">Cômodo:</span>
                  <select
                    value={selectedRoomEnv2D}
                    onChange={(e) => setSelectedRoomEnv2D(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-amber-300 font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500 text-xs"
                  >
                    <option value="Geral da Obra / Todos os Cômodos">Geral da Obra / Todos os Cômodos</option>
                    <option value="Cozinha">Cozinha Integrada</option>
                    <option value="Sala de Estar">Sala de Estar / TV</option>
                    <option value="Gourmet">Área Gourmet / Externa</option>
                    <option value="Quarto">Quarto Casal</option>
                  </select>
                </div>

                {/* Floor Texture Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400 font-bold text-[11px] uppercase">Piso:</span>
                  <button
                    onClick={() => setFloorTextureStyle("piso_madeira")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                      floorTextureStyle === "piso_madeira"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800"
                    }`}
                  >
                    Madeira / Parquet
                  </button>
                  <button
                    onClick={() => setFloorTextureStyle("porcelanato")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                      floorTextureStyle === "porcelanato"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800"
                    }`}
                  >
                    Porcelanato
                  </button>
                  <button
                    onClick={() => setFloorTextureStyle("cimento")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                      floorTextureStyle === "cimento"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800"
                    }`}
                  >
                    Cimento
                  </button>
                </div>

                {/* Display Toggles */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300 font-medium">
                    <input
                      type="checkbox"
                      checked={showDimensionsOn2D}
                      onChange={(e) => setShowDimensionsOn2D(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <span>Mostrar Cotas (Medidas)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300 font-medium">
                    <input
                      type="checkbox"
                      checked={showLegendOn2D}
                      onChange={(e) => setShowLegendOn2D(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <span>Mostrar Legenda</span>
                  </label>
                </div>
              </div>

              {/* Canvas Viewport Area */}
              <div className="p-4 bg-zinc-950 flex-1 overflow-auto flex items-center justify-center min-h-[380px]">
                <div className="relative border-2 border-zinc-800 rounded-2xl overflow-hidden shadow-2xl bg-zinc-900 max-w-full">
                  <canvas
                    ref={canvas2dRef}
                    className="w-full max-w-full h-auto block object-contain"
                    style={{ maxHeight: "60vh" }}
                  />
                </div>
              </div>

              {/* Modal Footer Info Bar */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
                <div className="flex items-center gap-2 text-zinc-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Móvel ativo em destaque amarelo + {reminders.length} itens sincronizados do cronograma da obra.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={drawHumanized2DFloorPlan}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold rounded-lg border border-zinc-700 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Recalcular Layout</span>
                  </button>

                  <button
                    onClick={handleExportFloorPlanImage}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-lg flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Imagem 2D</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Modelo 3D Esquemático Dollhouse */}
        {showDollhouseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
              onClick={() => setShowDollhouseModal(false)}
            />

            {/* Modal Dialog */}
            <div className="relative w-full max-w-5xl bg-zinc-950 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <Box className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <span>Modelo 3D Esquemático ("Dollhouse")</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold border border-amber-500/40">
                        Corte 3D / Spatial Volume
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Visualização de volume tridimensional e envelope de espaço ocupado pelos móveis em RA.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTakeDollhouseSnapshot}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar Imagem 3D</span>
                  </button>

                  <button
                    onClick={() => setShowDollhouseModal(false)}
                    className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full border border-zinc-700 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Toast Export Feedback */}
              {dollhouseSnapshotSuccess && (
                <div className="p-3 bg-emerald-500 text-zinc-950 font-black text-xs text-center flex items-center justify-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Corte 3D Dollhouse exportado com sucesso em alta definição!</span>
                </div>
              )}

              {/* Controls Toolbar */}
              <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
                {/* Preset Camera Views */}
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400 font-bold text-[11px] uppercase flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-amber-400" /> Câmera:
                  </span>
                  <button
                    onClick={() => handleSetDollhousePreset("iso")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition-all ${
                      dollhouseViewPreset === "iso"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500 shadow-md"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    Isométrica 3D
                  </button>
                  <button
                    onClick={() => handleSetDollhousePreset("front")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition-all ${
                      dollhouseViewPreset === "front"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500 shadow-md"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    Vista Frontal
                  </button>
                  <button
                    onClick={() => handleSetDollhousePreset("top")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition-all ${
                      dollhouseViewPreset === "top"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500 shadow-md"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    Planta Superior
                  </button>
                  <button
                    onClick={() => handleSetDollhousePreset("side")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition-all ${
                      dollhouseViewPreset === "side"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500 shadow-md"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    Vista Lateral
                  </button>
                </div>

                {/* Wall Cutaway Style */}
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400 font-bold text-[11px] uppercase">Corte de Parede:</span>
                  <select
                    value={dollhouseWallStyle}
                    onChange={(e) => setDollhouseWallStyle(e.target.value as any)}
                    className="bg-zinc-950 border border-zinc-800 text-amber-300 font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500 text-xs"
                  >
                    <option value="translucido">Translúcido Vidro</option>
                    <option value="solido">Paredes Sólidas</option>
                    <option value="esquematico">Esquema Arquiteto (CAD)</option>
                  </select>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300 font-medium">
                    <input
                      type="checkbox"
                      checked={showDollhouseVolumes}
                      onChange={(e) => setShowDollhouseVolumes(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <span>Volume Envolvente (m³)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300 font-medium">
                    <input
                      type="checkbox"
                      checked={showDollhouseGrid}
                      onChange={(e) => setShowDollhouseGrid(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <span>Grelha de Piso</span>
                  </label>
                </div>
              </div>

              {/* 3D Viewport Canvas */}
              <div className="p-4 bg-zinc-950 flex-1 overflow-auto flex flex-col items-center justify-center relative min-h-[360px]">
                <div className="relative w-full max-w-full border-2 border-zinc-800 rounded-2xl overflow-hidden shadow-2xl bg-zinc-900 group">
                  <canvas
                    ref={dollhouseCanvasRef}
                    onMouseDown={handleDollhouseMouseDown}
                    onMouseMove={handleDollhouseMouseMove}
                    onMouseUp={handleDollhouseMouseUp}
                    onMouseLeave={handleDollhouseMouseUp}
                    onWheel={handleDollhouseWheel}
                    className="w-full h-[400px] sm:h-[460px] block cursor-grab active:cursor-grabbing select-none"
                  />

                  {/* Canvas Overlay Badge Hint */}
                  <div className="absolute bottom-3 left-3 bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 px-3 py-1.5 rounded-xl text-[11px] text-zinc-300 font-bold flex items-center gap-2 shadow-lg pointer-events-none">
                    <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>Arraste para girar 360° • Scroll/Pinch para Zoom</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-sm border border-amber-500/40 px-3 py-1.5 rounded-xl text-[11px] text-amber-300 font-black flex items-center gap-1.5 shadow-lg pointer-events-none">
                    <Box className="w-3.5 h-3.5 text-amber-400" />
                    <span>Escala Real 1:1</span>
                  </div>
                </div>
              </div>

              {/* Spatial Volume Metrics Footer Cards */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Volume do Móvel Ativo</span>
                    <span className="text-sm font-black text-amber-400">
                      {activeItemMetrics.volume.toFixed(2)} m³
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      {selectedFurniture.dimensions}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Volume Total Ocupado</span>
                    <span className="text-sm font-black text-blue-400">
                      {totalFurnitureVolumeSum.toFixed(2)} m³
                    </span>
                    <span className="text-[10px] text-zinc-400 block">
                      {occupiedPercentage.toFixed(1)}% do volume total do cômodo
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Circulação Livre</span>
                    <span className="text-sm font-black text-emerald-400">
                      {freeCirculationPercentage.toFixed(1)}% Livre
                    </span>
                    <span className="text-[10px] text-emerald-500 block font-bold">
                      Circulação ergonômica ideal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Backup e Restauração de Projeto (JSON) */}
        {showBackupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
              onClick={() => setShowBackupModal(false)}
            />

            {/* Modal Dialog */}
            <div className="relative w-full max-w-2xl bg-zinc-950 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <FileJson className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <span>Backup do Projeto em JSON</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold border border-amber-500/40">
                        Local & Offline
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Salve e restaure o estado completo do projeto (RA, móveis salvos, planta e dollhouse) via arquivo local.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowBackupModal(false)}
                  className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full border border-zinc-700 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Feedback Alerts */}
              {backupSuccessMessage && (
                <div className="p-3 bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2 animate-in fade-in px-5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{backupSuccessMessage}</span>
                </div>
              )}

              {backupErrorMessage && (
                <div className="p-3 bg-rose-500/20 border-b border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-2 animate-in fade-in px-5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{backupErrorMessage}</span>
                </div>
              )}

              {/* Modal Content */}
              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Summary Box */}
                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                    <HardDrive className="w-4 h-4" /> Resumo do Estado Atual do Projeto
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                      <span className="text-zinc-500 text-[10px] block uppercase font-bold">Móvel Ativo em RA</span>
                      <span className="text-zinc-200 font-bold truncate block">{selectedFurniture.name}</span>
                      <span className="text-amber-400 font-semibold text-[11px]">{selectedFurniture.brand}</span>
                    </div>

                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                      <span className="text-zinc-500 text-[10px] block uppercase font-bold">Lembretes & Móveis</span>
                      <span className="text-zinc-200 font-bold text-sm">{reminders.length} itens salvos</span>
                      <span className="text-emerald-400 font-semibold text-[11px] block">Prontos para exportação</span>
                    </div>

                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 col-span-2 sm:col-span-1">
                      <span className="text-zinc-500 text-[10px] block uppercase font-bold">Cômodo Atual</span>
                      <span className="text-zinc-200 font-bold truncate block">{selectedRoomEnv2D}</span>
                      <span className="text-blue-400 font-semibold text-[11px] block">Planta e Dollhouse</span>
                    </div>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Export Card */}
                  <div className="p-5 bg-gradient-to-b from-zinc-900 to-zinc-950 border border-amber-500/30 rounded-2xl flex flex-col justify-between space-y-4 shadow-lg">
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 w-fit">
                        <Download className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-black text-white">Exportar Backup (.JSON)</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Gera um arquivo JSON local contendo todas as configurações de RA, posicionamentos 3D, acabamentos escolhidos e lista de lembretes da obra.
                      </p>
                    </div>

                    <button
                      onClick={handleExportProjectJson}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Baixar JSON do Projeto</span>
                    </button>
                  </div>

                  {/* Import Card */}
                  <div className="p-5 bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-amber-500/40 rounded-2xl flex flex-col justify-between space-y-4 shadow-lg transition-all">
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 w-fit">
                        <Upload className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-black text-white">Importar Backup (.JSON)</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Carregue um arquivo JSON gerado anteriormente para restaurar o estado do seu projeto em qualquer computador ou dispositivo.
                      </p>
                    </div>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-extrabold text-xs uppercase tracking-wider rounded-xl border border-amber-500/50 shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                    >
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Selecionar Arquivo JSON</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-zinc-400 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Dica: Você pode guardar os backups baixados no seu computador ou enviá-los por e-mail/WhatsApp para clientes ou montadores da marcenaria.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
