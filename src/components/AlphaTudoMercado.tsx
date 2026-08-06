import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Tag,
  Plus,
  MapPin,
  Phone,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  ShieldCheck,
  Share2,
  Package,
  Layers,
  Building2,
  Eye,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { INITIAL_MARKETPLACE_PRODUCTS, OFFICIAL_COMPANY_DATA } from "../data/initialData";
import { MarketplaceProduct } from "../types";

interface AlphaTudoMercadoProps {
  onNavigateTab?: (tab: string) => void;
}

export const AlphaTudoMercado: React.FC<AlphaTudoMercadoProps> = ({ onNavigateTab }) => {
  const [products, setProducts] = useState<MarketplaceProduct[]>(() => {
    const saved = localStorage.getItem("alphatudo_mercado_products");
    return saved ? JSON.parse(saved) : INITIAL_MARKETPLACE_PRODUCTS;
  });

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [selectedCity, setSelectedCity] = useState<string>("Todas");
  const [selectedCondition, setSelectedCondition] = useState<string>("Todas");
  const [maxPrice, setMaxPrice] = useState<number>(150000);

  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<MarketplaceProduct | null>(null);

  // Listing Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Materiais de Construção" as MarketplaceProduct["category"],
    price: "",
    city: "Barra Mansa - RJ",
    condition: "Novo" as MarketplaceProduct["condition"],
    description: "",
    sellerName: "",
    sellerPhone: "",
    sellerWhatsapp: "",
    imageUrl: "",
  });

  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem("alphatudo_mercado_products", JSON.stringify(products));
  }, [products]);

  const categoriesList = [
    "Todas",
    "Materiais de Construção",
    "Móveis & Decoração",
    "Ferramentas & Equipamentos",
    "Eletro & Iluminação",
    "Imóveis & Terrenos",
    "Outros",
  ];

  const citiesList = [
    "Todas",
    "Barra Mansa - RJ",
    "Volta Redonda - RJ",
    "Resende - RJ",
    "Barra do Piraí - RJ",
    "Porto Real - RJ",
    "Itatiaia - RJ",
  ];

  const conditionsList = ["Todas", "Novo", "Seminovo", "Usado", "Sob Medida"];

  // Filter logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "Todas" || p.category === selectedCategory;
    const matchesCity = selectedCity === "Todas" || p.city === selectedCity;
    const matchesCondition = selectedCondition === "Todas" || p.condition === selectedCondition;
    const matchesPrice = p.price <= maxPrice;

    // Public view hides unapproved products unless admin mode is active
    const matchesApproval = isAdminMode ? true : p.approvedByAdmin;

    return matchesSearch && matchesCategory && matchesCity && matchesCondition && matchesPrice && matchesApproval;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.sellerPhone) return;

    const newProd: MarketplaceProduct = {
      id: `prod-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      price: Number(formData.price) || 0,
      city: formData.city,
      condition: formData.condition,
      description: formData.description,
      sellerName: formData.sellerName || "Vendedor do Portal",
      sellerPhone: formData.sellerPhone,
      sellerWhatsapp: formData.sellerWhatsapp || formData.sellerPhone.replace(/\D/g, ""),
      imageUrl:
        formData.imageUrl ||
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      approvedByAdmin: false, // Starts pending
      isFreeMember: true,
      boostedByUniversoAds: false,
      createdAt: new Date().toLocaleDateString("pt-BR"),
    };

    setProducts([newProd, ...products]);
    setPublishSuccess(true);
  };

  const handleApproveProduct = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, approvedByAdmin: true } : p))
    );
  };

  const handleToggleBoost = (id: string) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, boostedByUniversoAds: !p.boostedByUniversoAds } : p
      )
    );
  };

  return (
    <section id="alphatudo-mercado" className="py-10 bg-zinc-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* TOP HERO BANNER - FACEBOOK MARKETPLACE STYLE */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/40 p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/40 shadow-2xl space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>O Maior Marketplace do Grupo Organizações Rimane</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex flex-wrap items-center gap-3">
                <span>🛒 ALPHATUDO MERCADO</span>
                <span className="text-xs bg-amber-400 text-zinc-950 px-3 py-1 rounded-full font-black">
                  ANÚNCIOS GRÁTIS
                </span>
              </h1>

              <p className="text-zinc-300 text-sm max-w-3xl">
                Anuncie e compre qualquer tipo de produto, material de construção, ferramenta, imóvel, móveis e itens com negociação direta via WhatsApp e garantia de verificação do grupo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => {
                  setPublishSuccess(false);
                  setIsNewListingModalOpen(true);
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-400 to-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>ANUNCIAR PRODUTO GRÁTIS</span>
              </button>

              <button
                onClick={() => onNavigateTab?.("flowbusiness")}
                className="px-5 py-3.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>📲 MIGRAR ANÚNCIOS PARA FLOWBUSINESS</span>
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
                <span>{isAdminMode ? "Modo Admin" : "Gestor Admin"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* MARKETPLACE LAYOUT: SIDEBAR CATEGORIES & PRODUCT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filters (Facebook Marketplace Style) */}
          <div className="lg:col-span-3 bg-zinc-900 p-5 rounded-3xl border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-black text-white text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <span>Categorias & Filtros</span>
              </h3>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Todas");
                  setSelectedCity("Todas");
                  setSelectedCondition("Todas");
                  setMaxPrice(150000);
                }}
                className="text-[10px] font-bold text-emerald-400 underline hover:text-emerald-300"
              >
                Resetar
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300">
                O que você está procurando?
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Ex: porcelanato, cozinha, betoneira, lote..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-400 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300">
                Categoria de Produto:
              </label>
              <div className="space-y-1">
                {categoriesList.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      selectedCategory === cat
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300">
                Região / Cidade:
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-400 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none"
              >
                {citiesList.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300">
                Estado do Produto:
              </label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-400 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none"
              >
                {conditionsList.map((cond, idx) => (
                  <option key={idx} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Max Slider */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-zinc-300">Preço Máximo:</span>
                <span className="text-emerald-400 font-mono">
                  R$ {maxPrice.toLocaleString("pt-BR")}
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={200000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-bold">
              <span>{filteredProducts.length} anúncios ativos no AlphaTudo Mercado</span>
              {isAdminMode && (
                <span className="text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 font-black">
                  Exibindo anúncios pendentes de moderação
                </span>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`bg-zinc-900 rounded-3xl border transition-all duration-300 hover:border-emerald-500/60 shadow-xl overflow-hidden flex flex-col justify-between group ${
                    !product.approvedByAdmin ? "border-amber-500/50 bg-amber-950/10" : "border-zinc-800"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Image Container with Badges */}
                    <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Price Badge Overlay */}
                      <div className="absolute bottom-3 left-3 bg-zinc-950/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-emerald-500/50 text-emerald-400 font-mono font-black text-sm shadow-xl">
                        R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>

                      {/* Condition Badge Overlay */}
                      <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-zinc-700 text-zinc-300 font-black text-[10px] uppercase">
                        {product.condition}
                      </div>

                      {product.boostedByUniversoAds && (
                        <div className="absolute top-3 left-3 bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-lg font-black text-[10px] flex items-center gap-1 shadow-lg">
                          <Zap className="w-3 h-3 fill-zinc-950" /> Destaque
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">
                        {product.category}
                      </div>

                      <h3 className="font-extrabold text-white text-sm line-clamp-2 leading-snug">
                        {product.title}
                      </h3>

                      <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          {product.city}
                        </span>
                        <span className="font-medium">{product.sellerName}</span>
                      </div>

                      {!product.approvedByAdmin && (
                        <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-xl text-[10px] text-amber-300 font-bold flex items-center justify-between">
                          <span>Pendente de Aprovação</span>
                          {isAdminMode && (
                            <button
                              onClick={() => handleApproveProduct(product.id)}
                              className="px-2 py-0.5 bg-emerald-500 text-zinc-950 text-[10px] font-black rounded hover:scale-105"
                            >
                              APROVAR
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center gap-2">
                    <a
                      href={`https://wa.me/${product.sellerWhatsapp}?text=Olá%20${encodeURIComponent(product.sellerName)},%20tenho%20interesse%20no%20anúncio%20"${encodeURIComponent(product.title)}"%20no%20AlphaTudo%20Mercado.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Phone className="w-3.5 h-3.5 fill-current" />
                      <span>FALAR NO WHATSAPP</span>
                    </a>

                    <button
                      onClick={() => setSelectedProductDetail(product)}
                      className="px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl border border-zinc-700"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {isAdminMode && (
                      <button
                        onClick={() => handleToggleBoost(product.id)}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-bold ${
                          product.boostedByUniversoAds
                            ? "bg-amber-400 text-zinc-950 border-amber-400"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}
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

      {/* MODAL: NEW LISTING FORM */}
      {isNewListingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>Anunciar Produto Grátis no AlphaTudo Mercado</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Preencha os dados do seu produto ou material para publicação direta.
                </p>
              </div>

              <button
                onClick={() => setIsNewListingModalOpen(false)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {!publishSuccess ? (
              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-300 font-extrabold mb-1">
                    Título do Anúncio *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Porcelanato Retificado 84x84cm ou Betoneira 400L"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-400 text-white rounded-xl px-3 py-2.5"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-extrabold mb-1">
                      Categoria *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as MarketplaceProduct["category"],
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-400 text-white rounded-xl px-3 py-2.5"
                    >
                      {categoriesList.filter((c) => c !== "Todas").map((cat, i) => (
                        <option key={i} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-extrabold mb-1">
                      Preço (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="89.90"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-400 text-white rounded-xl px-3 py-2.5 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-extrabold mb-1">
                      Condição *
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          condition: e.target.value as MarketplaceProduct["condition"],
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-400 text-white rounded-xl px-3 py-2.5"
                    >
                      {conditionsList.filter((c) => c !== "Todas").map((cond, i) => (
                        <option key={i} value={cond}>
                          {cond}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-extrabold mb-1">
                      Cidade *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-400 text-white rounded-xl px-3 py-2.5"
                    >
                      {citiesList.filter((c) => c !== "Todas").map((city, i) => (
                        <option key={i} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-extrabold mb-1">
                      Seu Nome ou Nome da Loja *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Revestir Vale"
                      value={formData.sellerName}
                      onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-400 text-white rounded-xl px-3 py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-extrabold mb-1">
                    Telefone / WhatsApp para Negociação *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(24) 99999-8888"
                    value={formData.sellerPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sellerPhone: e.target.value,
                        sellerWhatsapp: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-400 text-white rounded-xl px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-extrabold mb-1">
                    Descrição Detalhada do Produto *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Descreva quantidade, marcas, medidas, frete ou entrega na região."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-400 text-white rounded-xl px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-extrabold mb-1">
                    URL da Imagem do Produto (Opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://exemplo.com/foto.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-400 text-white rounded-xl px-3 py-2.5"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewListingModalOpen(false)}
                    className="w-1/3 py-3 bg-zinc-800 text-zinc-300 font-bold rounded-xl"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="w-2/3 py-3 bg-gradient-to-r from-emerald-400 to-amber-400 text-zinc-950 font-black rounded-xl shadow-lg hover:scale-105 transition-all"
                  >
                    PUBLICAR ANÚNCIO GRÁTIS
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
                <h4 className="text-xl font-black text-white">Anúncio Cadastrado com Sucesso!</h4>
                <p className="text-xs text-zinc-300 max-w-md mx-auto">
                  Seu produto passará por rápida moderação do administrador Alessandro Eustaquio e estará visível para todos os compradores da região!
                </p>
                <button
                  onClick={() => setIsNewListingModalOpen(false)}
                  className="px-6 py-3 bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg"
                >
                  CONCLUÍDO
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-emerald-500/50 rounded-3xl p-6 max-w-lg w-full space-y-4">
            <div className="relative h-56 rounded-2xl overflow-hidden bg-zinc-950">
              <img
                src={selectedProductDetail.imageUrl}
                alt={selectedProductDetail.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="absolute top-3 right-3 bg-zinc-950/80 text-white w-8 h-8 rounded-full font-black text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <span className="text-[10px] text-amber-400 font-black uppercase">
                {selectedProductDetail.category}
              </span>
              <h3 className="font-extrabold text-white text-lg">{selectedProductDetail.title}</h3>
              <p className="text-xl font-mono font-black text-emerald-400 mt-1">
                R$ {selectedProductDetail.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">{selectedProductDetail.description}</p>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">Vendedor:</span>
                <span className="font-bold text-white">{selectedProductDetail.sellerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Cidade:</span>
                <span className="font-bold text-white">{selectedProductDetail.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Estado:</span>
                <span className="font-bold text-emerald-400">{selectedProductDetail.condition}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${selectedProductDetail.sellerWhatsapp}?text=Olá!%20Gostaria%20de%20comprar%20"${encodeURIComponent(selectedProductDetail.title)}".`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>NEGOCIAR PELO WHATSAPP</span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
};
