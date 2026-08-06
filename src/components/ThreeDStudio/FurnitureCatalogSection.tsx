import React from "react";
import {
  ShoppingBag,
  Plus,
  CheckCircle2,
  Tag,
  Boxes,
  Sparkles,
  Info,
  DollarSign
} from "lucide-react";
import { FURNITURE_CATALOG, CatalogFurnitureItem } from "./furnitureCatalogData";
import { FurnitureCartItem, Project3DState } from "../../types";

interface FurnitureCatalogSectionProps {
  projectState: Project3DState;
  onUpdateState: React.Dispatch<React.SetStateAction<Project3DState>>;
  cartItems: FurnitureCartItem[];
  onAddToCart: (item: CatalogFurnitureItem) => void;
  onOpenCartDrawer: () => void;
}

export const FurnitureCatalogSection: React.FC<FurnitureCatalogSectionProps> = ({
  projectState,
  onUpdateState,
  cartItems,
  onAddToCart,
  onOpenCartDrawer,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("Todos");

  const categories = ["Todos", "Cozinha", "Dormitórios", "Estar & TV", "Área Gourmet", "Banheiros", "Lazer & Decor"];

  const filteredItems = FURNITURE_CATALOG.filter((item) =>
    selectedCategory === "Todos" ? true : item.category === selectedCategory
  );

  const isItemInCart = (id: string) => cartItems.some((c) => c.id === id);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
              Catálogo de Mobília & Lazer 3D
            </span>
            <h4 className="text-base font-black text-white">
              Móveis Planejados & Decoração
            </h4>
          </div>
        </div>

        <button
          onClick={onOpenCartDrawer}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg hover:scale-105 shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Ver Carrinho ({cartItems.reduce((a, b) => a + (b.quantity || 1), 0)})</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 border ${
              selectedCategory === cat
                ? "bg-amber-500 text-zinc-950 border-amber-400 shadow"
                : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Furniture Grid */}
      <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredItems.map((item) => {
          const inCart = isItemInCart(item.id);

          return (
            <div
              key={item.id}
              className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 hover:border-amber-500/50 transition-all space-y-3 relative group shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      ID: #{item.id}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase text-zinc-400">
                      • {item.category}
                    </span>
                  </div>
                  <h5 className="text-sm font-black text-white leading-snug">
                    {item.name}
                  </h5>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-zinc-500 uppercase block font-bold">Valor Est.</span>
                  <span className="text-sm font-mono font-black text-amber-400">
                    R$ {item.price.toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/80">
                <span className="font-mono text-zinc-500">{item.dimensions}</span>

                <button
                  onClick={() => onAddToCart(item)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md hover:scale-105 ${
                    inCart
                      ? "bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 hover:bg-emerald-900"
                      : "bg-amber-500 hover:bg-amber-400 text-zinc-950"
                  }`}
                >
                  {inCart ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Adicionado (+1)</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar ao Carrinho</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
