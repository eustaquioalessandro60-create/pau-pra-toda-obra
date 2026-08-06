import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Star,
  Phone,
  ShieldCheck,
  Plus,
  Sparkles,
  Award,
  Zap,
  Lock,
  Unlock,
  MapPin,
  Briefcase,
  Share2,
  ExternalLink,
  Tag,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  UserCheck,
  Building2,
} from "lucide-react";
import { INITIAL_PARTNERS, OFFICIAL_COMPANY_DATA, DEFAULT_ADMIN_RULES } from "../data/initialData";
import { PartnerProfessional, SystemAdminRules } from "../types";

interface PartnersAndProfessionalsProps {
  onNavigateTab?: (tab: string) => void;
}

export const PartnersAndProfessionals: React.FC<PartnersAndProfessionalsProps> = ({
  onNavigateTab,
}) => {
  const [partners, setPartners] = useState<PartnerProfessional[]>(() => {
    const saved = localStorage.getItem("alphatudo_partners");
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  });

  const [adminRules, setAdminRules] = useState<SystemAdminRules>(() => {
    const saved = localStorage.getItem("alphatudo_admin_rules");
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN_RULES;
  });

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Todas");
  const [selectedProfession, setSelectedProfession] = useState("Todas");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedPartnerDetail, setSelectedPartnerDetail] = useState<PartnerProfessional | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    profession: "Pedreiro Especializado",
    city: "Barra Mansa - RJ",
    phone: "",
    whatsapp: "",
    email: "",
    experienceYears: 5,
    description: "",
    keywords: "construcao, reforma, porcelanato",
    photoUrl: "",
  });

  const [registerSuccess, setRegisterSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem("alphatudo_partners", JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem("alphatudo_admin_rules", JSON.stringify(adminRules));
  }, [adminRules]);

  const citiesList = [
    "Todas",
    "Barra Mansa - RJ",
    "Volta Redonda - RJ",
    "Resende - RJ",
    "Barra do Piraí - RJ",
    "Porto Real - RJ",
    "Itatiaia - RJ",
  ];

  const professionsList = [
    "Todas",
    "Pedreiro / Mestre de Obras",
    "Marceneiro / Móveis Planejados",
    "Eletricista Residencial / Industrial",
    "Pintor / Acabamentos / Gesso 3D",
    "Encanador / Hidráulico",
    "Engenheiro Civil / Arquiteto",
    "Serralheiro / Estruturas Metálicas",
    "Gesseiro / Drywall",
    "Azulejista / Porcelanato",
    "Empreiteira & Construtora",
  ];

  // Filter partners
  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCity = selectedCity === "Todas" || p.city === selectedCity;
    const matchesProfession =
      selectedProfession === "Todas" || p.profession.toLowerCase().includes(selectedProfession.toLowerCase());

    // Public view only shows approved partners unless in admin mode
    const matchesApproval = isAdminMode ? true : p.approvedByAdmin;

    return matchesSearch && matchesCity && matchesProfession && matchesApproval;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const newPartner: PartnerProfessional = {
      id: `part-${Date.now()}`,
      name: formData.name,
      profession: formData.profession,
      city: formData.city,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone.replace(/\D/g, ""),
      email: formData.email,
      experienceYears: Number(formData.experienceYears) || 1,
      description: formData.description,
      keywords: formData.keywords.split(",").map((k) => k.trim()),
      rating: 5.0,
      reviewCount: 1,
      approvedByAdmin: false, // Subject to admin approval!
      isFreeMember: true,
      boostedByUniversoAds: false,
      photoUrl:
        formData.photoUrl ||
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80",
      portfolioImages: [],
      createdAt: new Date().toLocaleDateString("pt-BR"),
    };

    setPartners([newPartner, ...partners]);
    setRegisterSuccess(true);
  };

  const handleApprovePartner = (id: string) => {
    setPartners(
      partners.map((p) => (p.id === id ? { ...p, approvedByAdmin: true } : p))
    );
  };

  const handleToggleBoost = (id: string) => {
    setPartners(
      partners.map((p) =>
        p.id === id ? { ...p, boostedByUniversoAds: !p.boostedByUniversoAds } : p
      )
    );
  };

  return (
    <section id="parceiros-profissionais" className="py-10 bg-zinc-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* HEADER BAR WITH FACEBOOK MARKETPLACE INSPIRED BANNER */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 shadow-2xl space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>Diretório Oficial de Profissionais & Serviços • Organizações Rimane</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex flex-wrap items-center gap-3">
                <span>🤝 PARCEIROS & PROFISSIONAIS</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-extrabold">
                  CADASTRO 100% GRÁTIS
                </span>
              </h1>

              <p className="text-zinc-300 text-sm max-w-3xl">
                Encontre os melhores pedreiros, marceneiros, eletricistas, engenheiros e prestadores do Sul Fluminense com selo de verificação e aprovação prévia das <strong>Organizações Rimane</strong>.
              </p>
            </div>

            {/* Action Buttons: Register & Flowbusiness Migration */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => {
                  setRegisterSuccess(false);
                  setIsRegisterModalOpen(true);
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>CADASTRAR MEU SERVIÇO GRÁTIS</span>
              </button>

              <button
                onClick={() => onNavigateTab?.("flowbusiness")}
                className="px-5 py-3.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>📲 MIGRAR PARA FLOWBUSINESS</span>
              </button>

              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`px-4 py-3.5 rounded-2xl border text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  isAdminMode
                    ? "bg-amber-400 text-zinc-950 border-amber-400 shadow-lg"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                }`}
              >
                {isAdminMode ? <Unlock className="w-4 h-4 text-zinc-950" /> : <Lock className="w-4 h-4 text-amber-400" />}
                <span>{isAdminMode ? "Modo Admin Ativo" : "Painel Gestor"}</span>
              </button>
            </div>
          </div>

          {/* ADMIN MANAGEMENT CONTROL PANEL */}
          {isAdminMode && (
            <div className="mt-6 p-5 bg-zinc-950/90 rounded-2xl border-2 border-amber-500/60 space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Painel de Controle de Regras • Alessandro Eustaquio (Admin)</span>
                </div>
                <span className="text-[11px] text-zinc-400">
                  Gerenciar aprovações de parceiros e prioridade de oportunidades WVR/GDM
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Priority Toggle Rule */}
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center font-bold text-white">
                    <span>Prioridade Oportunidades WVR/GDM</span>
                    <button
                      onClick={() =>
                        setAdminRules({
                          ...adminRules,
                          wvrGdmPriorityActive: !adminRules.wvrGdmPriorityActive,
                        })
                      }
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                        adminRules.wvrGdmPriorityActive
                          ? "bg-emerald-500 text-zinc-950"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {adminRules.wvrGdmPriorityActive ? "ATIVO" : "INATIVO"}
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Regra Principal: WVR Construções & GDM Móveis Planejados recebem todos os orçamentos e serviços PRIMEIRO.
                  </p>
                </div>

                {/* Auto Lead Release */}
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center font-bold text-white">
                    <span>Liberação Manual / Automática</span>
                    <span className="text-amber-400 font-mono font-black">24 Horas</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Você decide quando liberar o acesso de um lead não absorvido pela WVR para a lista de parceiros cadastrados.
                  </p>
                </div>

                {/* Impulsionamento Universo Ads */}
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center font-bold text-white">
                    <span>Impulsionamento Universo Ads</span>
                    <span className="text-emerald-400 font-bold">Incluso</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Serviços e anúncios aprovados são automaticamente impulsionados nas redes sociais do grupo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEARCH & MARKETPLACE FILTER SIDEBAR + GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filters (Facebook Marketplace Style - 3 Cols) */}
          <div className="lg:col-span-3 bg-zinc-900 p-5 rounded-3xl border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-black text-white text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Filtros de Busca</span>
              </h3>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCity("Todas");
                  setSelectedProfession("Todas");
                }}
                className="text-[10px] font-bold text-amber-400 underline hover:text-amber-300"
              >
                Limpar
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300">
                Pesquisar por Serviço / Palavra-chave:
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Ex: pedreiro, mdf, gesso, elétrica..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none"
                />
              </div>
            </div>

            {/* City Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300">
                Filtrar por Cidade / Região:
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none"
              >
                {citiesList.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Profession Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300">
                Categoria de Profissional:
              </label>
              <select
                value={selectedProfession}
                onChange={(e) => setSelectedProfession(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none"
              >
                {professionsList.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Guarantee Box */}
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2 text-xs">
              <div className="font-extrabold text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Aprovação Prévia Rimane</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Todos os profissionais parceiros passam por validação de portfólio e referências pela administração das Organizações Rimane.
              </p>
            </div>
          </div>

          {/* Right Main Grid (9 Cols) */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-bold">
              <span>Mostrando {filteredPartners.length} profissionais e parceiros cadastrados</span>
              {isAdminMode && (
                <span className="text-amber-400 font-extrabold bg-amber-500/20 px-2.5 py-1 rounded-full">
                  Exibindo também cadastros pendentes de aprovação
                </span>
              )}
            </div>

            {/* Grid of Partners */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className={`bg-zinc-900 rounded-3xl border transition-all duration-300 hover:border-amber-500/60 shadow-xl overflow-hidden flex flex-col justify-between ${
                    !partner.approvedByAdmin ? "border-amber-500/50 bg-amber-950/10" : "border-zinc-800"
                  }`}
                >
                  <div className="p-5 space-y-4">
                    {/* Top Image + Badge Header */}
                    <div className="flex items-start gap-3">
                      <img
                        src={partner.photoUrl}
                        alt={partner.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-amber-500/40 shrink-0"
                      />

                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-1">
                          <h3 className="font-extrabold text-white text-base truncate">{partner.name}</h3>
                          {partner.approvedByAdmin && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 fill-emerald-400/20" />
                          )}
                        </div>

                        <p className="text-xs font-bold text-amber-400">{partner.profession}</p>

                        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                          <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                            <Star className="w-3 h-3 fill-amber-400" /> {partner.rating}
                          </span>
                          <span>• {partner.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pending Admin Alert */}
                    {!partner.approvedByAdmin && (
                      <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-[11px] text-amber-300 font-bold flex items-center justify-between">
                        <span>Aguardando Aprovação do Admin</span>
                        {isAdminMode && (
                          <button
                            onClick={() => handleApprovePartner(partner.id)}
                            className="px-2.5 py-1 bg-emerald-500 text-zinc-950 text-[10px] font-black rounded-lg hover:scale-105 transition-all"
                          >
                            APROVAR AGORA
                          </button>
                        )}
                      </div>
                    )}

                    {/* Experience & Boost Badge */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/80">
                      <span className="text-zinc-400 font-medium">
                        Experiência: <strong className="text-white">{partner.experienceYears} Anos</strong>
                      </span>

                      {partner.boostedByUniversoAds && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                          <Zap className="w-3 h-3 fill-amber-400" /> Universo Ads
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                      {partner.description}
                    </p>

                    {/* Keywords Tag Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {partner.keywords.map((kw, i) => (
                        <span key={i} className="text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md font-medium">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center gap-2">
                    <a
                      href={`https://wa.me/${partner.whatsapp}?text=Olá%20${encodeURIComponent(partner.name)},%20encontrei%20seu%20perfil%20no%20portal%20Organizações%20Rimane!%20Gostaria%20de%20solicitar%20um%20orçamento.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Phone className="w-3.5 h-3.5 fill-current" />
                      <span>FALAR NO WHATSAPP</span>
                    </a>

                    <button
                      onClick={() => setSelectedPartnerDetail(partner)}
                      className="px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl border border-zinc-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {isAdminMode && (
                      <button
                        onClick={() => handleToggleBoost(partner.id)}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          partner.boostedByUniversoAds
                            ? "bg-amber-400 text-zinc-950 border-amber-400"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}
                        title="Alternar Impulsionamento Universo Ads"
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: REGISTRATION FOR NEW PARTNERS (GRÁTIS) */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Cadastro de Parceiro & Profissional (100% Grátis)</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Divulgue seus serviços no ecossistema Organizações Rimane e Universo Ads.
                </p>
              </div>

              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-zinc-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {!registerSuccess ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-extrabold mb-1">
                      Nome / Razão Social *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João Mestre de Obras"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-white rounded-xl px-3 py-2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-extrabold mb-1">
                      Profissão / Ramo *
                    </label>
                    <select
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-white rounded-xl px-3 py-2.5"
                    >
                      {professionsList.filter((p) => p !== "Todas").map((p, idx) => (
                        <option key={idx} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-extrabold mb-1">
                      Cidade Atendida *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-white rounded-xl px-3 py-2.5"
                    >
                      {citiesList.filter((c) => c !== "Todas").map((c, idx) => (
                        <option key={idx} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-extrabold mb-1">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(24) 99999-8888"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-white rounded-xl px-3 py-2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-extrabold mb-1">
                      Anos de Experiência
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-white rounded-xl px-3 py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-extrabold mb-1">
                    Descrição Completa dos Serviços Oferecidos *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Descreva sua especialidade, tipos de obras entregues e garantias fornecidas ao cliente."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-white rounded-xl px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-extrabold mb-1">
                    Palavras-chave separadas por vírgula (Fácil busca)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: pedreiro, porcelanato, gesso, alvenaria, cobertura"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-white rounded-xl px-3 py-2.5"
                  />
                </div>

                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                  <div className="font-extrabold text-amber-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Regra de Publicação:</span>
                  </div>
                  <p>
                    Seu cadastro é <strong>100% gratuito</strong>. Após o envio, os dados passam por verificação prévia do Administrador Alessandro Eustaquio antes de ficar visível publicamente no portal.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="w-1/3 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="w-2/3 py-3 bg-gradient-to-r from-amber-400 to-emerald-400 text-zinc-950 font-black rounded-xl shadow-lg hover:scale-105 transition-all"
                  >
                    ENVIAR CADASTRAR PARA APROVAÇÃO
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
                <h4 className="text-xl font-black text-white">Cadastro Enviado com Sucesso!</h4>
                <p className="text-xs text-zinc-300 max-w-md mx-auto">
                  Seu perfil foi registrado e encaminhado para validação técnica da equipe das <strong>Organizações Rimane</strong>. Em breve estará publicado no portal e integrado ao <strong>Flowbusiness</strong>!
                </p>
                <button
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-6 py-3 bg-amber-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg"
                >
                  ENTENDIDO E FECHAR
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DETAIL VIEW MODAL */}
      {selectedPartnerDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-amber-500/50 rounded-3xl p-6 max-w-xl w-full space-y-4">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPartnerDetail.photoUrl}
                  alt={selectedPartnerDetail.name}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-500"
                />
                <div>
                  <h3 className="font-extrabold text-white">{selectedPartnerDetail.name}</h3>
                  <p className="text-xs text-amber-400 font-bold">{selectedPartnerDetail.profession}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPartnerDetail(null)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">{selectedPartnerDetail.description}</p>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">Cidade de Atuação:</span>
                <span className="font-bold text-white">{selectedPartnerDetail.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Experiência Comprovada:</span>
                <span className="font-bold text-white">{selectedPartnerDetail.experienceYears} Anos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Classificação dos Clientes:</span>
                <span className="font-bold text-amber-400">⭐ {selectedPartnerDetail.rating} / 5.0</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${selectedPartnerDetail.whatsapp}?text=Olá!%20Encontrei%20seu%20perfil%20no%20portal%20Organizações%20Rimane.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>CHAMAR NO WHATSAPP AGORA</span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
};
