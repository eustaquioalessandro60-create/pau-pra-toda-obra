import React, { useState, useEffect, lazy, Suspense } from "react";
import { Header } from "./components/Header";
import { HeroHeader } from "./components/HeroHeader";
import { ServicesSection } from "./components/ServicesSection";
import { Footer } from "./components/OtherBrandsFooter";
import {
  MainTab,
  Project3DState,
  ServiceDetail,
} from "./types";
import { INITIAL_PROJECT_3D } from "./data/initialData";
import { registerServiceWorker, subscribeOnlineStatus } from "./registerSW";
import { useFirestoreProjectSync } from "./hooks/useFirestoreProjectSync";

// Lazy-loaded heavy modules for instant initial load on 3G/4G networks
const ThreeDStudio = lazy(() =>
  import("./components/ThreeDStudio").then((m) => ({ default: m.ThreeDStudio }))
);
const MeasurementTools = lazy(() =>
  import("./components/MeasurementTools").then((m) => ({ default: m.MeasurementTools }))
);
const QuoteGenerator = lazy(() =>
  import("./components/QuoteGenerator").then((m) => ({ default: m.QuoteGenerator }))
);
const FinancingSimulator = lazy(() =>
  import("./components/FinancingSimulator").then((m) => ({ default: m.FinancingSimulator }))
);
const NetworkMarketplace = lazy(() =>
  import("./components/NetworkMarketplace").then((m) => ({ default: m.NetworkMarketplace }))
);
const OtherBrandsFooter = lazy(() =>
  import("./components/OtherBrandsFooter").then((m) => ({ default: m.OtherBrandsFooter }))
);
const FloatingChatbot = lazy(() =>
  import("./components/FloatingChatbot").then((m) => ({ default: m.FloatingChatbot }))
);
const NotificationManager = lazy(() =>
  import("./components/NotificationManager").then((m) => ({ default: m.NotificationManager }))
);
const ActiveProjectsDashboard = lazy(() =>
  import("./components/ActiveProjectsDashboard").then((m) => ({ default: m.ActiveProjectsDashboard }))
);
const ConstructionAchievements = lazy(() =>
  import("./components/ConstructionAchievements").then((m) => ({ default: m.ConstructionAchievements }))
);
const ARFurniturePlacement = lazy(() =>
  import("./components/ARFurniturePlacement").then((m) => ({ default: m.ARFurniturePlacement }))
);
const LeadCaptureFunnel = lazy(() =>
  import("./components/LeadCaptureFunnel").then((m) => ({ default: m.LeadCaptureFunnel }))
);
const AlphaTudoObra = lazy(() =>
  import("./components/AlphaTudoObra").then((m) => ({ default: m.AlphaTudoObra }))
);
const PartnersAndProfessionals = lazy(() =>
  import("./components/PartnersAndProfessionals").then((m) => ({ default: m.PartnersAndProfessionals }))
);
const AlphaTudoMercado = lazy(() =>
  import("./components/AlphaTudoMercado").then((m) => ({ default: m.AlphaTudoMercado }))
);
const FlowBusinessMigrationSection = lazy(() =>
  import("./components/FlowBusinessMigrationSection").then((m) => ({ default: m.FlowBusinessMigrationSection }))
);

const ComponentLoader = ({ label = "Carregando módulo de alta performance..." }: { label?: string }) => (
  <div className="w-full min-h-[250px] flex flex-col items-center justify-center p-8 bg-zinc-900/60 rounded-3xl border border-zinc-800 text-center animate-pulse my-6 shadow-xl">
    <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
    <p className="text-zinc-300 text-xs font-semibold tracking-wide uppercase">{label}</p>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>("inicio");
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // 3D Project State initialized from localStorage or defaults
  const [projectState, setProjectState] = useState<Project3DState>(() => {
    try {
      const saved = localStorage.getItem("universo_adas_project_3d");
      return saved ? JSON.parse(saved) : INITIAL_PROJECT_3D;
    } catch {
      return INITIAL_PROJECT_3D;
    }
  });

  // Selected Services for Quote
  const [selectedServices, setSelectedServices] = useState<ServiceDetail[]>([]);

  // Register PWA Service Worker & Online Listener
  useEffect(() => {
    registerServiceWorker();
    const unsubscribe = subscribeOnlineStatus((status) => setIsOnline(status));
    return () => unsubscribe();
  }, []);

  // Save project state to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem("universo_adas_project_3d", JSON.stringify(projectState));
    } catch (e) {
      console.error("Falha ao salvar no localStorage:", e);
    }
  }, [projectState]);

  // Hook de sincronização em tempo real do projectState com Firestore
  const { syncStatus, lastSavedAt } = useFirestoreProjectSync(projectState);

  const handleSelectServiceForQuote = (service: ServiceDetail) => {
    if (!selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-zinc-900 font-sans flex flex-col justify-between selection:bg-amber-400 selection:text-zinc-950">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOnline={isOnline}
      />

      {/* Main Content Sections according to active Tab */}
      <main className="flex-1">
        <Suspense fallback={<ComponentLoader label="Carregando visualização..." />}>
          {activeTab === "inicio" && (
            <>
              {/* 🌟 Required Hero Header */}
              <HeroHeader setActiveTab={setActiveTab} />

              {/* 🎯 Máquina de Captação de Serviços (Formulário & Lead Magnet) */}
              <LeadCaptureFunnel onSuccessNavigate={(t) => setActiveTab(t as MainTab)} />

              {/* 📊 AlphaTudo Obra (Módulo Unificado de Obra & Financeiro) */}
              <AlphaTudoObra />

              {/* Featured Services */}
              <ServicesSection
                setActiveTab={setActiveTab}
                onSelectServiceForQuote={handleSelectServiceForQuote}
              />

              {/* Interactive 3D Studio Preview */}
              <ThreeDStudio
                projectState={projectState}
                setProjectState={setProjectState}
                setActiveTab={setActiveTab}
                isOnline={isOnline}
              />

              {/* Financing Simulator Preview */}
              <FinancingSimulator setActiveTab={setActiveTab} />
            </>
          )}

          {activeTab === "alphatudo_obra" && <AlphaTudoObra />}

          {activeTab === "parceiros_profissionais" && (
            <PartnersAndProfessionals onNavigateTab={(t) => setActiveTab(t as MainTab)} />
          )}

          {activeTab === "alphatudo_mercado" && (
            <AlphaTudoMercado onNavigateTab={(t) => setActiveTab(t as MainTab)} />
          )}

          {activeTab === "flowbusiness" && (
            <FlowBusinessMigrationSection onNavigateTab={(t) => setActiveTab(t as MainTab)} />
          )}

          {activeTab === "servicos" && (
            <ServicesSection
              setActiveTab={setActiveTab}
              onSelectServiceForQuote={handleSelectServiceForQuote}
            />
          )}

          {activeTab === "ferramenta3d" && (
            <ThreeDStudio
              projectState={projectState}
              setProjectState={setProjectState}
              setActiveTab={setActiveTab}
              isOnline={isOnline}
            />
          )}

          {activeTab === "realidade_aumentada" && (
            <ARFurniturePlacement setActiveTab={setActiveTab} />
          )}

          {activeTab === "medicao" && (
            <MeasurementTools
              projectState={projectState}
              setProjectState={setProjectState}
            />
          )}

          {activeTab === "orcamento" && (
            <QuoteGenerator
              projectState={projectState}
              selectedServices={selectedServices}
            />
          )}

          {activeTab === "financiamento" && (
            <FinancingSimulator setActiveTab={setActiveTab} />
          )}

          {activeTab === "rede_profissionais" && <NetworkMarketplace />}

          {activeTab === "dashboard_obras" && (
            <ActiveProjectsDashboard
              setActiveTab={setActiveTab}
              projectState={projectState}
              setProjectState={setProjectState}
            />
          )}

          {activeTab === "conquistas" && <ConstructionAchievements />}

          {(activeTab === "rimane" || activeTab === "licitmaster") && (
            <OtherBrandsFooter activeTab={activeTab} setActiveTab={setActiveTab} />
          )}
        </Suspense>
      </main>

      {/* Footer Bar */}
      <Footer setActiveTab={setActiveTab} />

      {/* Floating AI Chatbot Assistant & Notification Manager */}
      <Suspense fallback={null}>
        <FloatingChatbot />
        <NotificationManager />
      </Suspense>
    </div>
  );
}
