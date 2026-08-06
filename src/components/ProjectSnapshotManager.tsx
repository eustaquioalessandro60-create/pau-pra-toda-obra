import React, { useState, useEffect } from "react";
import {
  History,
  Save,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  Clock,
  CheckCircle2,
  X,
  Layers,
  Sparkles,
  Search,
  FileText,
  Building,
  Plus,
  Eye,
  AlertCircle,
  Flame,
  Cloud
} from "lucide-react";
import { Project3DState, ProjectStateSnapshot } from "../types";
import { FirestoreSyncModal } from "./FirestoreSyncModal";

interface ProjectSnapshotManagerProps {
  projectState: Project3DState;
  setProjectState: React.Dispatch<React.SetStateAction<Project3DState>>;
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = "universo_adas_project_snapshots";

// Initial Demo Snapshots if user opens version control for the first time
const INITIAL_DEMO_SNAPSHOTS: ProjectStateSnapshot[] = [
  {
    id: "snap-demo-1",
    name: "V0.1 - Terreno Nivelado & Fundação",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    note: "Marcação inicial do esquadro do terreno (10x20m) com sapata corrida para fundação.",
    state: {
      id: "demo-proj-1",
      title: "Casa de Campo Moderna",
      clientName: "Cliente Universo ADAS",
      terrain: { width: 10, length: 20, angleCorner: 90, soilType: "plano" },
      step: "fundacao",
      hasFoundation: true,
      wallHeight: 3.0,
      wallMaterial: "concreto",
      wallColor: "#e2e8f0",
      roofType: "sem",
      roofColor: "#334155",
      doorsCount: 2,
      windowsCount: 4,
      furniture: {
        cozinha: false,
        quartoCasal: false,
        quartoSolteiro: false,
        banheiro: false,
        salaTV: false,
        homeOffice: false,
        areaGourmet: false,
      },
      gourmet: {
        hasGourmet: false,
        churrasqueira: false,
        mesaSinuca: false,
        pergolado: false,
        balcaoChopp: false,
      },
      pool: {
        hasPool: false,
        type: "retangular",
        width: 3,
        length: 6,
        depth: 1.4,
        deckWood: false,
      },
      landscaping: {
        grass: false,
        trees: false,
        flowerBeds: false,
        pergoladoWood: false,
        stonePaths: false,
      },
      locksmith: {
        gateAutomatic: false,
        glassRailings: false,
        metalCanopy: false,
        terraces: false,
      },
      carpentry: {
        exposedRoofBeams: false,
        deckPatio: false,
        woodenStairs: false,
        customDoors: false,
      },
      security: { camsHD: 0, alarmSensors: 0, electricFenceMeters: 0, intercomVideo: false },
      lighting: { preset: "dia", spotCount: 4, pendantLamps: 0, ledStrips: false },
      notes: "Snapshot base da fase de fundação.",
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  },
  {
    id: "snap-demo-2",
    name: "V0.2 - Paredes Tijolo Rústico + Área Gourmet",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    note: "Inclusão de paredes com textura de tijolo aparente, churrasqueira e pergolado em madeira.",
    state: {
      id: "demo-proj-2",
      title: "Casa de Campo Moderna",
      clientName: "Cliente Universo ADAS",
      terrain: { width: 12, length: 25, angleCorner: 90, soilType: "plano" },
      step: "paredes",
      hasFoundation: true,
      wallHeight: 3.2,
      wallMaterial: "tijolo",
      wallColor: "#b91c1c",
      roofType: "colonial",
      roofColor: "#9a3412",
      doorsCount: 4,
      windowsCount: 6,
      furniture: {
        cozinha: true,
        quartoCasal: false,
        quartoSolteiro: false,
        banheiro: true,
        salaTV: false,
        homeOffice: false,
        areaGourmet: true,
      },
      gourmet: {
        hasGourmet: true,
        churrasqueira: true,
        mesaSinuca: true,
        pergolado: true,
        balcaoChopp: false,
      },
      pool: {
        hasPool: true,
        type: "retangular",
        width: 4,
        length: 8,
        depth: 1.5,
        deckWood: true,
      },
      landscaping: {
        grass: true,
        trees: true,
        flowerBeds: true,
        pergoladoWood: true,
        stonePaths: true,
      },
      locksmith: {
        gateAutomatic: true,
        glassRailings: true,
        metalCanopy: false,
        terraces: true,
      },
      carpentry: {
        exposedRoofBeams: true,
        deckPatio: true,
        woodenStairs: true,
        customDoors: true,
      },
      security: { camsHD: 4, alarmSensors: 2, electricFenceMeters: 20, intercomVideo: true },
      lighting: { preset: "por_do_sol", spotCount: 12, pendantLamps: 3, ledStrips: true },
      notes: "Versão com área de lazer completa.",
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
  },
];

export const ProjectSnapshotManager: React.FC<ProjectSnapshotManagerProps> = ({
  projectState,
  setProjectState,
  isOpen,
  onClose,
}) => {
  const [snapshots, setSnapshots] = useState<ProjectStateSnapshot[]>([]);
  const [snapshotName, setSnapshotName] = useState("");
  const [snapshotNote, setSnapshotNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSnapshot, setSelectedSnapshot] = useState<ProjectStateSnapshot | null>(null);
  const [restoredNotification, setRestoredNotification] = useState<string | null>(null);
  const [isFirestoreModalOpen, setIsFirestoreModalOpen] = useState<boolean>(false);

  // Load snapshots from localStorage or populate defaults
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSnapshots(parsed);
          return;
        }
      }
      // Fallback to initial demo snapshots
      setSnapshots(INITIAL_DEMO_SNAPSHOTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_SNAPSHOTS));
    } catch (e) {
      console.error("Erro ao carregar snapshots do localStorage:", e);
      setSnapshots(INITIAL_DEMO_SNAPSHOTS);
    }
  }, []);

  // Save snapshots array to localStorage
  const saveSnapshotsToStorage = (updatedList: ProjectStateSnapshot[]) => {
    setSnapshots(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error("Erro ao salvar snapshots no localStorage:", e);
    }
  };

  // Create a new Snapshot from current projectState
  const handleCreateSnapshot = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const name = snapshotName.trim() || `Snapshot ${new Date().toLocaleDateString("pt-BR")} ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    const newSnap: ProjectStateSnapshot = {
      id: `snap-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      note: snapshotNote.trim() || `Estado salvo na etapa: ${projectState.step}`,
      state: JSON.parse(JSON.stringify(projectState)),
    };

    const updated = [newSnap, ...snapshots];
    saveSnapshotsToStorage(updated);

    setSnapshotName("");
    setSnapshotNote("");
    setRestoredNotification(`Ponto de restauração "${name}" salvo com sucesso!`);
    setTimeout(() => setRestoredNotification(null), 4000);
  };

  // Restore snapshot to projectState
  const handleRestoreSnapshot = (snap: ProjectStateSnapshot) => {
    if (
      window.confirm(
        `Deseja restaurar o projeto para a versão "${snap.name}"?\nIsso substituirá as configurações 3D atuais.`
      )
    ) {
      // Clone state
      const restoredState: Project3DState = JSON.parse(JSON.stringify(snap.state));
      restoredState.updatedAt = new Date().toISOString();
      
      setProjectState(restoredState);
      setRestoredNotification(`Estado do projeto restaurado para "${snap.name}"!`);
      setTimeout(() => setRestoredNotification(null), 5000);
    }
  };

  // Delete snapshot
  const handleDeleteSnapshot = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o snapshot "${name}"?`)) {
      const updated = snapshots.filter((s) => s.id !== id);
      saveSnapshotsToStorage(updated);
      if (selectedSnapshot?.id === id) {
        setSelectedSnapshot(null);
      }
    }
  };

  // Export snapshots to JSON file
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snapshots, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `snapshots_universo_adas_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import snapshots from JSON file
  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          if (Array.isArray(imported)) {
            const merged = [...imported, ...snapshots];
            saveSnapshotsToStorage(merged);
            alert(`${imported.length} versão(ões) importada(s) com sucesso!`);
          } else {
            alert("Formato de arquivo inválido. Deve conter uma lista de snapshots.");
          }
        } catch (err) {
          alert("Erro ao ler o arquivo JSON. Verifique a estrutura do arquivo.");
        }
      };
    }
  };

  const filteredSnapshots = snapshots.filter((s) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      !query ||
      s.name.toLowerCase().includes(query) ||
      s.note?.toLowerCase().includes(query) ||
      s.state.step.toLowerCase().includes(query)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-amber-500/40 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              Controle de Versões & Restauração Local
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Histórico de Snapshots do Projeto 3D
            </h3>
            <p className="text-xs text-zinc-400">
              Salve pontos de restauração antes de modificar o terreno, paredes, móveis ou piscina e restaure quando desejar.
            </p>
          </div>
        </div>

        {/* Success Toast Banner */}
        {restoredNotification && (
          <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{restoredNotification}</span>
          </div>
        )}

        {/* SECTION 1: Create New Snapshot Form */}
        <form onSubmit={handleCreateSnapshot} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Criar Novo Ponto de Restauração (Snapshot Atual)
            </h4>
            <span className="text-[10px] font-mono text-zinc-400">
              Estado Atual: <strong className="text-white uppercase">{projectState.step}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">
                Nome do Snapshot / Versão
              </label>
              <input
                type="text"
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                placeholder="Ex: Estudo 1 - Fachada Moderna com Piscina"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">
                Nota do Arquiteto / Descrição
              </label>
              <input
                type="text"
                value={snapshotNote}
                onChange={(e) => setSnapshotNote(e.target.value)}
                placeholder="Ex: Aumentado pé-direito para 3.5m e trocada a cor para branco"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-[10px] text-zinc-500 font-mono">
              Salva: Dimensões terreno ({projectState.terrain.width}x{projectState.terrain.length}m), Paredes ({projectState.wallMaterial}), Piscina, Móveis e Luz.
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Snapshot Agora</span>
            </button>
          </div>
        </form>

        {/* SECTION 2: Filter & Import/Export Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome de versão ou etapa..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsFirestoreModalOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs rounded-xl border border-amber-500/50 flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
              title="Sincronizar o projeto com a nuvem Firestore para uso em múltiplos dispositivos"
            >
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Sincronizar Firestore</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold text-xs rounded-xl border border-zinc-700 flex items-center gap-1.5 transition-all"
              title="Exportar todos os snapshots para arquivo JSON"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Exportar JSON</span>
            </button>

            <label className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold text-xs rounded-xl border border-zinc-700 flex items-center gap-1.5 transition-all cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Importar JSON</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>
        </div>

        {/* SECTION 3: Snapshots List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" /> Versões Armazenadas ({filteredSnapshots.length})
            </h4>
            <span className="text-[10px] text-zinc-400 font-mono">
              Clique em "Restaurar" para carregar qualquer versão no projeto
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
            {filteredSnapshots.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
                <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs font-bold text-zinc-400">Nenhum snapshot encontrado.</p>
                <p className="text-[11px] text-zinc-500">Crie seu primeiro ponto de restauração acima para começar.</p>
              </div>
            ) : (
              filteredSnapshots.map((snap) => {
                const dateStr = new Date(snap.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const isCurrentStateMatch =
                  JSON.stringify(snap.state.terrain) === JSON.stringify(projectState.terrain) &&
                  snap.state.step === projectState.step &&
                  snap.state.wallMaterial === projectState.wallMaterial;

                return (
                  <div
                    key={snap.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      isCurrentStateMatch
                        ? "bg-amber-950/20 border-amber-500/60 shadow-lg"
                        : "bg-zinc-950 border-zinc-800 hover:border-amber-500/30"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Etapa: {snap.state.step}
                            </span>
                            {isCurrentStateMatch && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Estado Ativo
                              </span>
                            )}
                          </div>
                          <h5 className="text-sm font-black text-white mt-1 leading-snug">{snap.name}</h5>
                        </div>

                        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3 text-zinc-400" /> {dateStr}
                        </span>
                      </div>

                      {snap.note && (
                        <p className="text-xs text-zinc-400 bg-zinc-900/80 p-2 rounded-xl border border-zinc-800/80 leading-relaxed italic">
                          "{snap.note}"
                        </p>
                      )}

                      {/* State Metrics Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                        <span className="bg-zinc-900 px-2 py-1 rounded-lg text-zinc-300 border border-zinc-800">
                          📐 {snap.state.terrain.width}x{snap.state.terrain.length}m ({snap.state.terrain.width * snap.state.terrain.length}m²)
                        </span>
                        <span className="bg-zinc-900 px-2 py-1 rounded-lg text-zinc-300 border border-zinc-800 capitalize">
                          🧱 {snap.state.wallMaterial} ({snap.state.wallHeight}m)
                        </span>
                        {snap.state.pool.hasPool && (
                          <span className="bg-blue-950/60 px-2 py-1 rounded-lg text-blue-300 border border-blue-800">
                            🏊 Piscina {snap.state.pool.type.replace("_", " ")}
                          </span>
                        )}
                        {snap.state.gourmet.hasGourmet && (
                          <span className="bg-amber-950/60 px-2 py-1 rounded-lg text-amber-300 border border-amber-800">
                            🍖 Área Gourmet
                          </span>
                        )}
                        {snap.state.furniture.cozinha && (
                          <span className="bg-emerald-950/60 px-2 py-1 rounded-lg text-emerald-300 border border-emerald-800">
                            🛋️ Planejados GDM
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-900">
                      <button
                        onClick={() => setSelectedSnapshot(snap)}
                        className="text-xs text-zinc-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Detalhes</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteSnapshot(snap.id, snap.name)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30 transition-all"
                          title="Excluir este snapshot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleRestoreSnapshot(snap)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 hover:scale-105"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restaurar Esta Versão</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail Modal / Inspector for selected snapshot */}
        {selectedSnapshot && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-amber-500/50 rounded-3xl max-w-lg w-full p-6 space-y-4 relative shadow-2xl">
              <button
                onClick={() => setSelectedSnapshot(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <h4 className="text-lg font-black text-white">Inspeção da Versão</h4>
              </div>

              <div className="space-y-2 text-xs text-zinc-300 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 font-mono overflow-x-auto max-h-60">
                <div><strong className="text-amber-400">Nome:</strong> {selectedSnapshot.name}</div>
                <div><strong className="text-amber-400">ID:</strong> {selectedSnapshot.id}</div>
                <div><strong className="text-amber-400">Criado em:</strong> {selectedSnapshot.createdAt}</div>
                <div><strong className="text-amber-400">Etapa:</strong> {selectedSnapshot.state.step}</div>
                <div><strong className="text-amber-400">Terreno:</strong> {selectedSnapshot.state.terrain.width}m x {selectedSnapshot.state.terrain.length}m</div>
                <div><strong className="text-amber-400">Material Paredes:</strong> {selectedSnapshot.state.wallMaterial}</div>
                <div><strong className="text-amber-400">Piscina:</strong> {selectedSnapshot.state.pool.hasPool ? selectedSnapshot.state.pool.type : "Não"}</div>
                <div><strong className="text-amber-400">Área Gourmet:</strong> {selectedSnapshot.state.gourmet.hasGourmet ? "Sim" : "Não"}</div>
                <div><strong className="text-amber-400">Iluminação:</strong> {selectedSnapshot.state.lighting.preset}</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedSnapshot(null)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    handleRestoreSnapshot(selectedSnapshot);
                    setSelectedSnapshot(null);
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Agora</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Firestore Sync Modal */}
        <FirestoreSyncModal
          projectState={projectState}
          setProjectState={setProjectState}
          isOpen={isFirestoreModalOpen}
          onClose={() => setIsFirestoreModalOpen(false)}
        />
      </div>
    </div>
  );
};
