import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Briefcase,
  Star,
  MapPin,
  PhoneCall,
  Search,
  Filter,
  CheckCircle2,
  Plus,
  Send,
  ShieldCheck,
  Building2,
  MessageSquare,
} from "lucide-react";
import { INITIAL_PROFESSIONALS, INITIAL_CLIENT_JOBS } from "../data/initialData";
import { ProfessionalProfile, ClientJobPosting } from "../types";

export const NetworkMarketplace: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"profissionais" | "pedidos" | "cadastrar_prof">("profissionais");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas");

  const [professionals, setProfessionals] = useState<ProfessionalProfile[]>(INITIAL_PROFESSIONALS);
  const [jobPostings, setJobPostings] = useState<ClientJobPosting[]>(INITIAL_CLIENT_JOBS);

  // New Professional Registration State
  const [newProf, setNewProf] = useState({
    name: "",
    role: "Pedreiro Especialista",
    phone: "",
    cityRegion: "Volta Redonda e Região",
    hourlyRate: "80",
    bio: "",
    specialties: "",
  });

  // New Client Job Posting State
  const [newJob, setNewJob] = useState({
    clientName: "",
    city: "Volta Redonda - RJ",
    title: "",
    category: "Reforma",
    description: "",
    estimatedBudget: "15000",
    urgency: "30_dias" as const,
  });

  const phoneWhatsApp = "5524998729266";

  const handleRegisterProfessional = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProf.name || !newProf.phone) {
      alert("Por favor, preencha o nome e o telefone do profissional.");
      return;
    }

    const created: ProfessionalProfile = {
      id: "prof-" + Date.now(),
      name: newProf.name,
      role: newProf.role,
      phone: newProf.phone,
      cityRegion: newProf.cityRegion,
      rating: 5.0,
      completedJobs: 1,
      verifiedBadge: true,
      hourlyRate: Number(newProf.hourlyRate),
      bio: newProf.bio || "Profissional parceiro credenciado do UNIVERSO ADAS.",
      specialties: newProf.specialties.split(",").map((s) => s.trim()),
      portfolioImages: [],
    };

    setProfessionals([created, ...professionals]);
    alert("Profissional cadastrado com sucesso na rede!");
    setActiveSubTab("profissionais");
  };

  const handlePostClientJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.clientName || !newJob.title) {
      alert("Por favor, preencha o nome e o título do pedido.");
      return;
    }

    const created: ClientJobPosting = {
      id: "job-" + Date.now(),
      clientName: newJob.clientName,
      city: newJob.city,
      title: newJob.title,
      category: newJob.category,
      description: newJob.description,
      estimatedBudget: Number(newJob.estimatedBudget),
      urgency: newJob.urgency,
      proposalsCount: 0,
      createdAt: "Hoje",
    };

    setJobPostings([created, ...jobPostings]);
    alert("Pedido de serviço publicado com sucesso!");
    setActiveSubTab("pedidos");
  };

  const filteredProfessionals = professionals.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedSpecialty === "Todas" || p.specialties.includes(selectedSpecialty);

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-12 bg-slate-50 text-zinc-900 border-b border-zinc-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase mb-3">
            <Users className="w-4 h-4 text-amber-600" />
            <span>Rede GetNinjas UNIVERSO ADAS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            CONEXÃO CLIENTE & <span className="text-amber-600">PROFISSIONAL</span>
          </h2>
          <p className="text-zinc-600 font-medium text-base mt-1">
            Encontre profissionais qualificados para sua obra ou publique seu pedido de serviço para receber orçamentos direto no WhatsApp.
          </p>
        </div>

        {/* Subtabs Navigation */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveSubTab("profissionais")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === "profissionais"
                ? "bg-zinc-950 text-amber-400 shadow-md scale-105"
                : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
            }`}
          >
            <Briefcase className="w-4 h-4 text-amber-500" />
            <span>Buscar Profissionais ({professionals.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("pedidos")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === "pedidos"
                ? "bg-zinc-950 text-amber-400 shadow-md scale-105"
                : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>Mural de Pedidos dos Clientes ({jobPostings.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("cadastrar_prof")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === "cadastrar_prof"
                ? "bg-zinc-950 text-amber-400 shadow-md scale-105"
                : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
            }`}
          >
            <UserPlus className="w-4 h-4 text-amber-500" />
            <span>Cadastrar como Profissional</span>
          </button>
        </div>

        {/* TAB 1: BUSCAR PROFISSIONAIS */}
        {activeSubTab === "profissionais" && (
          <div className="space-y-6">
            {/* Search Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por especialidade, pedreiro, marcenaria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-zinc-300 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                {["Todas", "Fundações", "Cozinhas Planejadas", "Aprovação de Projetos", "Portões Automáticos"].map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                      selectedSpecialty === spec
                        ? "bg-amber-400 text-zinc-950"
                        : "bg-slate-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Professionals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredProfessionals.map((prof) => (
                <div
                  key={prof.id}
                  className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-zinc-950">{prof.name}</h3>
                          {prof.verifiedBadge && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Credenciado
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-extrabold text-amber-600 mt-0.5">{prof.role}</p>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{prof.cityRegion}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{prof.rating}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400">{prof.completedJobs} obras concluídas</div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed font-medium">{prof.bio}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {prof.specialties.map((spec, i) => (
                        <span key={i} className="bg-slate-100 text-zinc-700 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                    <div className="text-xs font-bold text-zinc-500">
                      Taxa / Hora: <span className="text-emerald-700 font-black">R$ {prof.hourlyRate}/h</span>
                    </div>

                    <a
                      href={`https://wa.me/55${prof.phone}?text=Olá%20${encodeURIComponent(
                        prof.name
                      )},%20encontrei%20seu%20perfil%20na%20Rede%20UNIVERSO%20ADAS%20e%20gostaria%20de%20solicitar%20um%20orçamento!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Solicitar Orçamento</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MURAL DE PEDIDOS DOS CLIENTES */}
        {activeSubTab === "pedidos" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-zinc-950 uppercase border-b pb-3">
                SOLICITAR ORÇAMENTO NO 'PAU PARA TODA OBRA'
              </h3>

              <form onSubmit={handlePostClientJob} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                <div>
                  <label className="block text-zinc-700 mb-1">Seu Nome:</label>
                  <input
                    type="text"
                    placeholder="Ex: Roberto F."
                    value={newJob.clientName}
                    onChange={(e) => setNewJob({ ...newJob, clientName: e.target.value })}
                    className="w-full bg-slate-50 border border-zinc-300 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 mb-1">Título do Pedido:</label>
                  <input
                    type="text"
                    placeholder="Ex: Reforma de Cozinha com Móveis Planejados"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full bg-slate-50 border border-zinc-300 rounded-xl p-2.5"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-zinc-700 mb-1">Descrição Detalhada da Obra / Serviço:</label>
                  <textarea
                    rows={2}
                    placeholder="Descreva o que precisa ser feito, metragens, prazos..."
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    className="w-full bg-slate-50 border border-zinc-300 rounded-xl p-2.5"
                  />
                </div>

                <button
                  type="submit"
                  className="md:col-span-2 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>PUBLICAR PEDIDO NO MURAL DE OBRAS</span>
                </button>
              </form>
            </div>

            {/* List of Posted Jobs */}
            <div className="space-y-4">
              {jobPostings.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                        {job.category}
                      </span>
                      <span className="text-xs text-zinc-400">• {job.city}</span>
                    </div>

                    <h3 className="text-base font-black text-zinc-950 mt-1">{job.title}</h3>
                    <p className="text-xs text-zinc-600 mt-1 font-medium">{job.description}</p>
                  </div>

                  <div className="text-right shrink-0 space-y-2">
                    <div className="text-xs font-bold text-zinc-500">
                      Orçamento Previsto: <span className="text-emerald-700 font-black text-sm">R$ {job.estimatedBudget.toLocaleString("pt-BR")}</span>
                    </div>

                    <a
                      href={`https://wa.me/${phoneWhatsApp}?text=Olá,%20tenho%20interesse%20em%20enviar%20uma%20proposta%20para%20o%20pedido:%20${encodeURIComponent(job.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold text-xs items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Proposta</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CADASTRAR COMO PROFISSIONAL */}
        {activeSubTab === "cadastrar_prof" && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-zinc-200 shadow-lg space-y-6">
            <h3 className="text-xl font-black text-zinc-950 uppercase border-b pb-3">
              CREDENCIAMENTO DE PROFISSIONAIS NO 'PAU PARA TODA OBRA'
            </h3>

            <form onSubmit={handleRegisterProfessional} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-zinc-700 mb-1">Seu Nome / Razão Social:</label>
                <input
                  type="text"
                  placeholder="Ex: Carlos Mestre de Obras"
                  value={newProf.name}
                  onChange={(e) => setNewProf({ ...newProf, name: e.target.value })}
                  className="w-full bg-slate-50 border border-zinc-300 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 mb-1">Especialidade Principal:</label>
                  <select
                    value={newProf.role}
                    onChange={(e) => setNewProf({ ...newProf, role: e.target.value })}
                    className="w-full bg-slate-50 border border-zinc-300 rounded-xl p-2.5"
                  >
                    <option value="Pedreiro Especialista">Pedreiro / Mestre de Obras</option>
                    <option value="Montador de Móveis GDM">Montador de Móveis Planejados</option>
                    <option value="Engenheiro Civil">Engenheiro Civil (ART)</option>
                    <option value="Serralheiro de Estruturas">Serralheiro</option>
                    <option value="Carpinteiro">Carpinteiro</option>
                    <option value="Eletricista / Segurança">Eletricista / CFTV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-700 mb-1">WhatsApp para Contato:</label>
                  <input
                    type="text"
                    placeholder="24999999999"
                    value={newProf.phone}
                    onChange={(e) => setNewProf({ ...newProf, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-zinc-300 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 mb-1">Especialidades (separadas por vírgula):</label>
                <input
                  type="text"
                  placeholder="Ex: Fundações, Porcelanato, Gesso, Reformas Expressas"
                  value={newProf.specialties}
                  onChange={(e) => setNewProf({ ...newProf, specialties: e.target.value })}
                  className="w-full bg-slate-50 border border-zinc-300 rounded-xl p-2.5"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-sm rounded-xl shadow-md"
              >
                CADASTRAR NO UNIVERSO ADAS
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
