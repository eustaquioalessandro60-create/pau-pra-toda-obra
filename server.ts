import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import JSZip from "jszip";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function addFilesToZip(zip: JSZip, dirPath: string, rootDir: string) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    if (
      item === "node_modules" ||
      item === "dist" ||
      item === ".git" ||
      item === ".cache" ||
      item === ".vscode"
    ) {
      continue;
    }
    const fullPath = path.join(dirPath, item);
    const relPath = path.relative(rootDir, fullPath);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addFilesToZip(zip, fullPath, rootDir);
    } else if (stat.isFile()) {
      const data = fs.readFileSync(fullPath);
      zip.file(relPath, data);
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client server-side if key exists
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      })
    : null;

  // Health check API
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      app: "Organizações Rimane - UNIVERSO ADAS",
      company: "Organizações Rimane (CNPJ 17.431.363/0001-84)",
      timestamp: new Date().toISOString(),
    });
  });

  // Leads Capture Endpoint (Máquina de Captação)
  const leadsStore: any[] = [];
  app.post("/api/leads", (req, res) => {
    try {
      const lead = req.body;
      lead.receivedAt = new Date().toISOString();
      leadsStore.unshift(lead);
      console.log("⚡ [Universo Ads] Novo Lead Registrado:", lead);
      res.json({ success: true, message: "Lead registrado na base do Universo Ads!", lead });
    } catch (e) {
      res.status(500).json({ error: "Falha ao registrar lead." });
    }
  });

  app.get("/api/leads", (_req, res) => {
    res.json({ count: leadsStore.length, leads: leadsStore });
  });

  // AlphaTudo Obra Sync with Bank Invest Endpoint
  app.post("/api/alphatudo-obra/sync-bank-invest", (req, res) => {
    try {
      const syncData = req.body;
      console.log("💰 [Bank Invest Sync] Dados de Obra Recebidos:", syncData);
      res.json({
        success: true,
        message: "Dados do projeto AlphaTudo Obra vinculados com sucesso ao Bank Invest!",
        syncedAt: new Date().toISOString(),
      });
    } catch (e) {
      res.status(500).json({ error: "Falha ao sincronizar com Bank Invest." });
    }
  });

  // Download Project Source ZIP
  app.get("/api/download-project-zip", async (_req, res) => {
    try {
      const zip = new JSZip();
      const projectRoot = __dirname;
      addFilesToZip(zip, projectRoot, projectRoot);

      const buffer = await zip.generateAsync({ type: "nodebuffer" });
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="universo-adas-codigo-fonte.zip"'
      );
      res.send(buffer);
    } catch (error: any) {
      console.error("Erro ao gerar ZIP:", error);
      res.status(500).json({ error: "Falha ao gerar arquivo ZIP." });
    }
  });

  // Voice Command Parsing Endpoint using Gemini AI
  app.post("/api/ai/parse-voice-command", async (req, res) => {
    try {
      const { command } = req.body;
      if (!command || typeof command !== "string") {
        return res.status(400).json({ error: "Comando inválido." });
      }

      if (!ai) {
        return res.json({
          parsed: null,
          fallbackMessage: "IA offline ou chave não configurada. Usando interpretação local por palavras-chave.",
        });
      }

      const prompt = `Você é o assistente de arquitetura 3D da WVR Construções e GDM Móveis Planejados (UNIVERSO ADAS).
O usuário disse o seguinte comando em português do Brasil:
"${command}"

Interprete a solicitação e retorne um objeto JSON estrito com os ajustes para o projeto 3D.
Campos suportados no JSON:
- actionMessage: string (mensagem amigável resumindo o que foi alterado)
- width: number (largura do terreno em metros, se mencionado)
- length: number (comprimento do terreno em metros, se mencionado)
- terrainType: "grama" | "piso" | "terra" | "areia"
- step: "terreno" | "fundacao" | "paredes" | "esquadrias" | "telhado" | "decoracao"
- hasFoundation: boolean
- wallColor: string (código hex ex #3b82f6 para azul, #22c55e para verde, #eab308 para amarelo, #f5f5dc para bege, #ffffff para branco, #18181b para preto/grafite, #ef4444 para vermelho)
- wallMaterial: "concreto" | "tijolo" | "pintura_branca" | "pintura_areia" | "madeira" | "pedra"
- roofType: "flat" | "colonial" | "moderno" | "sem"
- hasPool: boolean
- poolType: "retangular" | "borda_infinita" | "l_shape"
- hasGourmet: boolean
- gourmetItems: string[] (ex: ["churrasqueira", "mesa_sinuca", "pergolado", "balcao"])
- furniture: object: { cozinha: boolean, quartoCasal: boolean, quartoSolteiro: boolean, banheiro: boolean, salaTV: boolean, homeOffice: boolean, mesaJantar: boolean, sofaPoltrona: boolean, poltronaOffset: number }
- landscaping: object com booleans: { grass: boolean, trees: boolean, flowers: boolean, deck: boolean }
- locksmith: object com booleans: { metalGate: boolean, railing: boolean, structure: boolean }
- lighting: "dia" | "por_do_sol" | "noite_spots" | "festa_gourmet"

Retorne EXCLUSIVAMENTE o JSON sem markdown nem explicações.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      let parsed = {};
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        console.error("Erro ao parsear JSON do Gemini:", err);
      }

      res.json({ parsed });
    } catch (error: any) {
      console.error("Erro no Gemini Voice Parse:", error);
      res.status(500).json({ error: "Falha ao processar comando com IA", details: error.message });
    }
  });

  // Project Cost Estimation Endpoint using Gemini AI
  app.post("/api/ai/estimate-project", async (req, res) => {
    try {
      const { projectData } = req.body;
      if (!ai) {
        return res.json({
          aiAdvice: "WVR Construções & GDM Móveis Planejados entregam a sua obra sem surpresas! Entre em contato diretamente via WhatsApp para detalhes personalizados.",
        });
      }

      const prompt = `Atue como o Engenheiro Chefe e Projetista de Interiores do UNIVERSO ADAS (WVR Construções / GDM Móveis Planejados).
Analise os seguintes dados do projeto 3D do cliente:
${JSON.stringify(projectData, null, 2)}

Elabore um parecer técnico e comercial entusiasmado, destacando:
1. Ponto forte da escolha do projeto (espaço, valorização, iluminação e lazer).
2. Dica de otimização de custos para reforma/construção e móveis planejados GDM.
3. Sugestão de modalidade de Financiamento Caixa Econômica apropriada.
4. Mensagem reforçando os diferenciais: entregamos o prometido, sem surpresas, tecnologia 3D exclusiva.

Responda em tom profissional e acolhedor em português.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ aiAdvice: response.text });
    } catch (error: any) {
      console.error("Erro na estimativa IA:", error);
      res.status(500).json({ error: "Falha na estimativa inteligente" });
    }
  });

  // Chatbot Endpoint using Gemini AI
  app.post("/api/ai/chatbot", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Mensagem inválida." });
      }

      if (!ai) {
        return res.json({
          reply: "Olá! Sou o assistente virtual do 'PAU PARA TODA OBRA' (WVR Construções & GDM Móveis Planejados). No momento estou em modo offline, mas posso te ajudar! Entre em contato diretamente pelo WhatsApp (24) 99872-9266 para orçamentos e dúvidas.",
        });
      }

      const systemInstruction = `Você é o Assistente Virtual Oficial do 'PAU PARA TODA OBRA' (WVR Construções & GDM Móveis Planejados).
Sua missão é atender clientes e tirar dúvidas detalhadas sobre nossos serviços:

1. CONSTRUÇÃO & REFORMAS (WVR Construções):
   - Construção civil do terreno à chave na mão (fundação, estrutura, acabamento, entrega pronta).
   - Reformas residenciais e comerciais (pintura, gesso, elétrica, hidráulica, telhado, pequenos reparos).

2. MÓVEIS PLANEJADOS (GDM Móveis Planejados):
   - Cozinhas, dormitórios, closet, banheiros, painéis de TV, escritórios e área gourmet (100% MDF naval).

3. 🏦 ASSESSORIA PARA FINANCIAMENTO CAIXA:
   - Apoio completo para construir ou reformar financiado pela Caixa Econômica Federal.
   - Elaboração de orçamento oficial no padrão PCI (Proposta de Empreendimento Caixa), seguindo tabelas SINAPI/Caixa, organização de documentos e orientação sobre todas as regras para evitar erros e atrasos.
   - ESCLARECIMENTO IMPORTANTE: Somos consultoria de apoio e orientação técnica, NÃO somos a Caixa Econômica Federal.
   - TABELA FIXA DE VALORES:
     • Elaboração de PCI / Orçamento Oficial: R$ 390,00
     • Assessoria Completa: R$ 790,00 ou 1,5% do valor financiado (o que for maior)
     • DESCONTO ESPECIAL (se contratar a obra ou móveis com a gente): PCI cai para R$ 190,00 / Assessoria Completa cai para R$ 390,00.

4. 🔨 ASSESSORIA EM LEILÕES (Imóveis e Bens):
   - Ajuda para encontrar boas oportunidades e participar com total segurança.
   - Abrangência: Leilões da Caixa, Judiciais, PRF, Detran, Receita Federal e outros órgãos públicos.
   - Serviços: Análise de riscos jurídicos, verificação da situação do bem e débitos, avaliação do valor de mercado, definição de estratégia de lances e acompanhamento no dia da disputa.
   - REGRA DE SEGURANÇA CRÍTICA: Deixar SEMPRE bem claro que NÃO USAMOS NEM INDICAMOS robôs ou lances automáticos, pois são estritamente proibidos nas plataformas oficiais e trazem riscos graves de perda de dinheiro e bloqueio de conta. Trabalhamos apenas com estratégia humana inteligente e 100% legal.
   - TABELA FIXA DE VALORES:
     • Análise de oportunidade e estratégia: R$ 190,00
     • Acompanhamento no dia do leilão: R$ 290,00
     • Pacote Completo: R$ 390,00
     • DESCONTO ESPECIAL: 50% de desconto no pacote completo (R$ 195,00) se contratar a obra/reforma do imóvel arrematado depois conosco.

5. ORIENTAÇÕES GERAIS DA IA:
   - Mantenha os valores base fixos indicados acima. Você pode calcular estimativas, explicar regras e ajudar a estruturar rascunhos iniciais, mas nunca altere a tabela de preços oficial.
   - Atendimento prioritário para Volta Redonda e Região Sul Fluminense (WhatsApp direto: 24 99872-9266).
   - Responda em português do Brasil de forma clara, profissional, objetiva e atenciosa. Use bullet points curtos se necessário.`;

      let formattedPrompt = systemInstruction + "\n\n";
      if (Array.isArray(history) && history.length > 0) {
        formattedPrompt += "Histórico recente da conversa:\n";
        for (const item of history.slice(-6)) {
          const sender = item.role === "user" ? "Cliente" : "Assistente";
          formattedPrompt += `${sender}: ${item.text}\n`;
        }
      }
      formattedPrompt += `\nCliente: ${message}\nAssistente:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: formattedPrompt,
      });

      const reply =
        response.text ||
        "Como posso ajudar com seu projeto de construção, reforma ou móveis planejados?";
      res.json({ reply });
    } catch (error: any) {
      console.error("Erro no Chatbot Gemini:", error);
      res.status(500).json({
        reply:
          "Ocorreu uma pequena oscilação no atendimento com IA. Você pode solicitar seu orçamento direto com nossa equipe no WhatsApp (24) 99872-9266!",
      });
    }
  });

  // Vite Middleware in Dev vs Static Files in Prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`⚡ UNIVERSO ADAS Server rodando na porta ${PORT}`);
  });
}

startServer();
