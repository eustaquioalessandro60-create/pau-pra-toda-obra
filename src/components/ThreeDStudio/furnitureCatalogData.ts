export interface CatalogFurnitureItem {
  id: string;
  name: string;
  category: "Cozinha" | "Dormitórios" | "Estar & TV" | "Área Gourmet" | "Banheiros" | "Lazer & Decor";
  price: number;
  dimensions: string;
  material: string;
  description: string;
  projectStateKey?: {
    group: "furniture" | "gourmet" | "pool";
    field: string;
  };
}

export class CatalogFurnitureData {
  // Empty class or placeholder if needed
}

export const FURNITURE_CATALOG: CatalogFurnitureItem[] = [
  {
    id: "mob-cozinha-01",
    name: "Cozinha Planejada Modulada (100% MDF High-Gloss)",
    category: "Cozinha",
    price: 16500,
    dimensions: "3.40m x 2.20m x 0.85m",
    material: "MDF 18mm Lacado e Puxadores Cava",
    description: "Armários suspensos, balcão cooktop e torre quente integrada para forno e micro-ondas.",
    projectStateKey: { group: "furniture", field: "cozinha" },
  },
  {
    id: "mob-closet-02",
    name: "Guarda-Roupa / Closet Casal com Espelhos",
    category: "Dormitórios",
    price: 14000,
    dimensions: "2.80m x 2.60m x 0.65m",
    material: "MDF Amadeirado & Vidro Reflecta",
    description: "Closet completo com iluminação LED interna, gaveteiros organizadores e sapateira extraível.",
    projectStateKey: { group: "furniture", field: "quartoCasal" },
  },
  {
    id: "mob-solteiro-03",
    name: "Suíte Solteiro Planejada com Estudo",
    category: "Dormitórios",
    price: 9500,
    dimensions: "2.20m x 2.00m x 0.55m",
    material: "MDF Branco Supremo & Nogueira",
    description: "Armário de duas portas de correr com escrivaninha de estudos e nichos decorativos.",
    projectStateKey: { group: "furniture", field: "quartoSolteiro" },
  },
  {
    id: "mob-home-04",
    name: "Painel Home Theater com Fita LED Integrada",
    category: "Estar & TV",
    price: 8200,
    dimensions: "2.50m x 1.80m x 0.40m",
    material: "MDF Ripado & Laca Fosca",
    description: "Painel ripado para TVs até 75\", rack suspenso com gavetas invisíveis e fita LED embutida.",
    projectStateKey: { group: "furniture", field: "salaTV" },
  },
  {
    id: "mob-banheiro-05",
    name: "Gabinete Banheiro em Quartzo & Espelheira",
    category: "Banheiros",
    price: 4800,
    dimensions: "1.20m x 0.85m x 0.50m",
    material: "MDF Naval Ultra & Tampo Quartzo",
    description: "Móvel suspenso resistente a umidade com cuba esculpida e espelheira com desembaçador.",
    projectStateKey: { group: "furniture", field: "banheiro" },
  },
  {
    id: "mob-sinuca-06",
    name: "Mesa de Sinuca Profissional com Tampo Jantar",
    category: "Área Gourmet",
    price: 5500,
    dimensions: "2.20m x 1.20m x 0.80m",
    material: "Madeira Maciça & Pedra Ardósia",
    description: "Mesa 2 em 1: jogo de bilhar profissional com tampo de madeira para refeições em família.",
    projectStateKey: { group: "gourmet", field: "mesaSinuca" },
  },
  {
    id: "mob-churrasqueira-07",
    name: "Churrasqueira Gourmet em Inox & Tijolo Refratário",
    category: "Área Gourmet",
    price: 4500,
    dimensions: "1.00m x 0.70m x 2.20m",
    material: "Aço Inox 304 & Vidro Temperado",
    description: "Grelha elevatória com motor elétrico, exaustor silencioso e iluminação interna.",
    projectStateKey: { group: "gourmet", field: "churrasqueira" },
  },
  {
    id: "mob-sofa-08",
    name: "Sofá Retrátil & Reclinável 3 Lugares Suede",
    category: "Estar & TV",
    price: 4200,
    dimensions: "2.40m x 1.10m / 1.70m (aberto)",
    material: "Espuma D33 Soft & Molas Ensacadas",
    description: "Estrutura em eucalipto imunizado, tecido suede de alta resistência e encosto com 5 posições.",
  },
  {
    id: "mob-jantar-09",
    name: "Conjunto Mesa de Jantar 8 Lugares Madeira Nobre",
    category: "Cozinha",
    price: 6800,
    dimensions: "2.20m x 1.00m x 0.78m",
    material: "Madeira Cumaru & Cadeiras Estofadas",
    description: "Mesa em madeira nobre com vidro serigrafado e 8 cadeiras ergonômicas estofadas.",
  },
  {
    id: "mob-piscina-10",
    name: "Conjunto Espreguiçadeiras + Ombrelone Alumínio",
    category: "Lazer & Decor",
    price: 3800,
    dimensions: "3.00m x 2.50m x 2.20m",
    material: "Alumínio Anodizado & Tela Sling",
    description: "Duas espreguiçadeiras reclináveis resistentes a intempéries com ombrelone lateral articulado.",
  },
  {
    id: "mob-lustre-11",
    name: "Lustre Pendente Cristal Contemporâneo LED",
    category: "Lazer & Decor",
    price: 2900,
    dimensions: "0.80m x 0.80m x 1.20m (Ajustável)",
    material: "Cristal K9 & Estrutura Dourada",
    description: "Lustre imponente para pé-direito duplo com ajuste de temperatura de cor via controle.",
  }
];
