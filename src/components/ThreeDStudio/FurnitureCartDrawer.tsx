import React from "react";
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  DollarSign,
  Share2,
  Sparkles,
  Download,
  ShieldAlert,
  ArrowRight,
  Package,
  Layers
} from "lucide-react";
import { FurnitureCartItem, Project3DState } from "../../types";

interface FurnitureCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: FurnitureCartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  projectState: Project3DState;
  onSyncCartTo3D: () => void;
}

export const FurnitureCartDrawer: React.FC<FurnitureCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  projectState,
  onSyncCartTo3D,
}) => {
  if (!isOpen) return null;

  const totalCost = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const maxBudget = projectState.maxBudget || 200000;
  const isOverBudget = totalCost > maxBudget;
  const diff = totalCost - maxBudget;

  const handleExportCartToWhatsApp = () => {
    const textLines = [
      "🛒 *LISTA DE COMPRAS DE MOBÍLIA E DECORAÇÃO - UNIVERSO ADAS 3D*",
      "===========================================",
      ...cartItems.map(
        (it) =>
          `• [ID: ${it.id}] ${it.name} (${it.quantity}x) - R$ ${(
            it.price * it.quantity
          ).toLocaleString("pt-BR")}`
      ),
      "===========================================",
      `💰 *CUSTO TOTAL:* R$ ${totalCost.toLocaleString("pt-BR")}`,
      `📌 *PROJETO:* ${projectState.terrain.width}x${projectState.terrain.length}m - Etapa: ${projectState.step.toUpperCase()}`,
      `📞 Orçamento gerado via Universo ADAS 3D Studio.`
    ];

    const encoded = encodeURIComponent(textLines.join("\n"));
    window.open(`https://wa.me/5524998729266?text=${encoded}`, "_blank");
  };

  const handleDownloadJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            totalCost,
            maxBudget,
            itemsCount: cartItems.length,
            items: cartItems,
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `lista_compras_mobilia_3d_${Date.now()}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-950 border-l border-amber-500/40 h-full flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                Lista Global de Compras
              </div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>Carrinho de Mobília 3D</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                  {cartItems.reduce((a, b) => a + (b.quantity || 1), 0)} itens
                </span>
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Budget Summary Banner */}
        <div className="px-5 py-3 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-medium">Teto do Projeto:</span>
          <span className="font-mono font-bold text-white">
            R$ {maxBudget.toLocaleString("pt-BR")}
          </span>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-3">
              <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-600">
                <Package className="w-10 h-10" />
              </div>
              <p className="text-sm font-bold text-zinc-400">
                Seu carrinho está vazio
              </p>
              <p className="text-xs text-zinc-500 max-w-xs">
                Navegue pela aba de Planejados & Lazer no estúdio 3D e clique em{" "}
                <strong className="text-amber-400">Adicionar ao Carrinho</strong> para incluir móveis e equipamentos.
              </p>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemSubtotal = item.price * (item.quantity || 1);
              return (
                <div
                  key={item.id}
                  className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 hover:border-amber-500/40 transition-all space-y-2.5 relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block mb-1">
                        ID: #{item.id}
                      </span>
                      <h4 className="text-xs font-black text-white leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {item.category} {item.dimensions ? `• ${item.dimensions}` : ""}
                      </p>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors shrink-0"
                      title="Remover item do carrinho"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Pricing and Quantity */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                    <div className="flex items-center gap-2 bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="text-zinc-400 hover:text-white p-0.5 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono font-black text-white px-1">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="text-zinc-400 hover:text-white p-0.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">Subtotal</span>
                      <span className="text-xs font-mono font-black text-amber-300">
                        R$ {itemSubtotal.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Totals & Actions */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-zinc-800 bg-zinc-900 space-y-4">
            {/* Budget status check */}
            {isOverBudget ? (
              <div className="p-3 bg-red-950/80 border border-red-500/60 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  Carrinho excede o teto máximo em <strong>R$ {diff.toLocaleString("pt-BR")}</strong>.
                </span>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Total dentro do limite orçamentário planejado.</span>
              </div>
            )}

            {/* Total Row */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-zinc-400 block">
                  Custo Total da Lista
                </span>
                <span className="text-xl font-black font-mono text-amber-400">
                  R$ {totalCost.toLocaleString("pt-BR")}
                </span>
              </div>

              <button
                onClick={onClearCart}
                className="text-xs text-zinc-400 hover:text-red-400 font-bold underline transition-colors"
              >
                Limpar Carrinho
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportCartToWhatsApp}
                className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleDownloadJSON}
                className="px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 border border-zinc-700 hover:scale-[1.02]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar JSON</span>
              </button>
            </div>

            <button
              onClick={() => {
                onSyncCartTo3D();
                onClose();
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Sincronizar Itens no Cenário 3D</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
