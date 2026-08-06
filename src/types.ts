export type MainTab =
  | "inicio"
  | "servicos"
  | "alphatudo_obra"
  | "parceiros_profissionais"
  | "alphatudo_mercado"
  | "flowbusiness"
  | "ferramenta3d"
  | "realidade_aumentada"
  | "medicao"
  | "orcamento"
  | "financiamento"
  | "rede_profissionais"
  | "dashboard_obras"
  | "conquistas"
  | "rimane"
  | "licitmaster"
  | "bank_invest";

export interface OfficialCompanyInfo {
  razaoSocial: string;
  cnpj: string;
  responsavel: string;
  situacao: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  email: string;
}

export interface ServiceLead {
  id: string;
  nome: string;
  telefone: string;
  tipoServico: string;
  cidade: string;
  dataCriacao: string;
  status: "Novo" | "Em Contato" | "Visita Agendada" | "Orçamento Enviado" | "Fechado";
  origem: "Universo Ads - Formulário Curto";
  wvrPriorityClaimed?: boolean;
  releasedToPartners?: boolean;
}

export interface PartnerProfessional {
  id: string;
  name: string;
  profession: string; // e.g. Pedreiro, Marceneiro, Eletricista, Encanador, Pintor, Engenheiro, Arquiteto
  city: string; // Barra Mansa, Volta Redonda, Resende, etc.
  phone: string;
  whatsapp: string;
  email?: string;
  experienceYears: number;
  description: string;
  keywords: string[]; // e.g. ["alvenaria", "porcelanato", "mdf", "pintura"]
  rating: number; // e.g. 4.9
  reviewCount: number;
  approvedByAdmin: boolean;
  isFreeMember: boolean;
  boostedByUniversoAds?: boolean;
  photoUrl: string;
  portfolioImages: string[];
  createdAt: string;
}

export interface MarketplaceProduct {
  id: string;
  title: string;
  category: "Materiais de Construção" | "Móveis & Decoração" | "Ferramentas & Equipamentos" | "Eletro & Iluminação" | "Imóveis & Terrenos" | "Outros";
  price: number;
  city: string; // Barra Mansa, Volta Redonda, Resende, etc.
  condition: "Novo" | "Seminovo" | "Usado" | "Sob Medida";
  description: string;
  sellerName: string;
  sellerPhone: string;
  sellerWhatsapp: string;
  imageUrl: string;
  approvedByAdmin: boolean;
  isFreeMember: boolean;
  boostedByUniversoAds?: boolean;
  createdAt: string;
}

export interface SystemAdminRules {
  wvrGdmPriorityActive: boolean; // True = WVR/GDM receives leads first
  autoReleaseLeadHours: number; // e.g. 24 hours
  universoAdsBoostEnabled: boolean;
  registrationIsFree: boolean;
}

export interface CompanyBrand {
  id: string;
  name: string;
  fullName: string;
  badge: string;
  color: string;
  icon: string;
  description: string;
}

export interface ServiceDetail {
  id: string;
  brand: "WVR" | "GDM" | "UNIVERSO_ADAS" | "PAU PARA TODA OBRA" | "RIMANE" | "LICITMASTER" | string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  unit: string; // e.g. "m²", "projeto", "unidade"
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  iconName: string;
  featured?: boolean;
}

export interface TerrainConfig {
  width: number; // metros
  length: number; // metros
  angleCorner: number; // graus do esquadro (default 90)
  soilType: "plano" | "aclive" | "declive" | "rochoso";
}

export type ConstructionStep =
  | "terreno"
  | "fundacao"
  | "paredes"
  | "esquadrias"
  | "telhado"
  | "decoracao"
  | "orcamento";

export interface PlannedFurnitureSelection {
  cozinha: boolean;
  quartoCasal: boolean;
  quartoSolteiro: boolean;
  banheiro: boolean;
  salaTV: boolean;
  homeOffice: boolean;
  areaGourmet: boolean;
  sofaPoltrona?: boolean;
  mesaJantar?: boolean;
  poltronaPosicao?: { x: number; y: number; z: number };
  poltronaOffset?: number;
}

export interface GourmetConfig {
  hasGourmet: boolean;
  churrasqueira: boolean;
  mesaSinuca: boolean;
  pergolado: boolean;
  balcaoChopp: boolean;
}

export interface PoolConfig {
  hasPool: boolean;
  type: "retangular" | "borda_infinita" | "l_shape" | "hidro";
  width: number;
  length: number;
  depth: number;
  deckWood: boolean;
}

export interface LandscapingConfig {
  grass: boolean;
  trees: boolean;
  flowerBeds: boolean;
  pergoladoWood: boolean;
  stonePaths: boolean;
}

export interface LocksmithConfig {
  gateAutomatic: boolean;
  glassRailings: boolean;
  metalCanopy: boolean;
  terraces: boolean;
}

export interface CarpentryConfig {
  exposedRoofBeams: boolean;
  deckPatio: boolean;
  woodenStairs: boolean;
  customDoors: boolean;
}

export interface SecurityConfig {
  camsHD: number;
  alarmSensors: number;
  electricFenceMeters: number;
  intercomVideo: boolean;
}

export interface LightingConfig {
  preset: "dia" | "por_do_sol" | "noite_spots" | "festa_gourmet";
  spotCount: number;
  pendantLamps: number;
  ledStrips: boolean;
}

export interface Project3DState {
  id: string;
  title: string;
  clientName: string;
  terrain: TerrainConfig;
  step: ConstructionStep;
  hasFoundation: boolean;
  wallHeight: number; // metros
  wallMaterial: "concreto" | "tijolo" | "pintura_branca" | "pintura_areia" | "madeira" | "pedra";
  wallColor: string;
  roofType: "colonial" | "flat" | "moderno" | "sem";
  roofColor: string;
  doorsCount: number;
  windowsCount: number;
  furniture: PlannedFurnitureSelection;
  gourmet: GourmetConfig;
  pool: PoolConfig;
  landscaping: LandscapingConfig;
  locksmith: LocksmithConfig;
  carpentry: CarpentryConfig;
  security: SecurityConfig;
  lighting: LightingConfig;
  maxBudget?: number;
  notes: string;
  updatedAt: string;
}

export interface ProjectStateSnapshot {
  id: string;
  name: string;
  createdAt: string;
  note?: string;
  state: Project3DState;
}

export interface FurnitureCartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  dimensions?: string;
  quantity: number;
  is3dPositioned?: boolean;
  addedAt?: string;
}

export interface MeasurementRecord {
  id: string;
  label: string;
  type: "distancia" | "area" | "nivel_prumo";
  value: number; // metros ou m² ou graus
  unit: string;
  date: string;
  photoSnapshot?: string;
}

export interface QuoteItem {
  id: string;
  category: string;
  title: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ClientData {
  name: string;
  phone: string;
  email: string;
  city: string;
  neighborhood: string;
  serviceType: string;
  preferredContactMethod: "whatsapp" | "ligacao";
  notes: string;
}

export interface FinancingSim {
  propertyValue: number;
  downPayment: number;
  loanAmount: number;
  termMonths: number;
  interestRateYear: number;
  estimatedMonthlyPayment: number;
  modality: "construcao_terreno_proprio" | "aquisicao_terreno_construcao" | "reforma_ampliacao" | "minha_casa_minha_vida";
}

export interface ProfessionalProfile {
  id: string;
  name: string;
  role: string; // Ex: Pedreiro, Carpinteiro, Serralheiro, Arquiteto, Engenheiro, Montador de Móveis
  phone: string;
  cityRegion: string;
  rating: number;
  completedJobs: number;
  verifiedBadge: boolean;
  hourlyRate: number;
  bio: string;
  specialties: string[];
  portfolioImages: string[];
}

export interface ClientJobPosting {
  id: string;
  clientName: string;
  city: string;
  title: string;
  category: string;
  description: string;
  estimatedBudget: number;
  urgency: "urgente" | "30_dias" | "planejando";
  proposalsCount: number;
  createdAt: string;
}
