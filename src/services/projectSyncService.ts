import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Project3DState } from "../types";

const COLLECTION_NAME = "project_states";

/**
 * Saves current Project3DState to Firestore under document ID `syncCode`.
 */
export async function saveProjectStateToFirestore(
  syncCode: string,
  projectState: Project3DState
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!syncCode || !syncCode.trim()) {
      return { success: false, error: "Código de sincronização inválido." };
    }

    const cleanedCode = syncCode.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const docRef = doc(db, COLLECTION_NAME, cleanedCode);

    const payload = {
      syncCode: cleanedCode,
      title: projectState.title || "Projeto Obra ADAS",
      clientName: projectState.clientName || "Cliente",
      projectState,
      updatedAt: new Date().toISOString(),
      deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : "Web Device",
    };

    await setDoc(docRef, payload, { merge: true });
    return { success: true };
  } catch (err: any) {
    console.error("Erro ao salvar projectState no Firestore:", err);
    return {
      success: false,
      error: err?.message || "Falha ao conectar com o banco de dados Firestore.",
    };
  }
}

/**
 * Fetches Project3DState from Firestore for a given `syncCode`.
 */
export async function fetchProjectStateFromFirestore(
  syncCode: string
): Promise<{ success: boolean; data?: Project3DState; updatedAt?: string; error?: string }> {
  try {
    if (!syncCode || !syncCode.trim()) {
      return { success: false, error: "Informe o código de sincronização do projeto." };
    }

    const cleanedCode = syncCode.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const docRef = doc(db, COLLECTION_NAME, cleanedCode);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.projectState) {
        return {
          success: true,
          data: data.projectState as Project3DState,
          updatedAt: data.updatedAt,
        };
      }
    }

    return {
      success: false,
      error: `Nenhum projeto encontrado para o código de sincronização "${cleanedCode}".`,
    };
  } catch (err: any) {
    console.error("Erro ao recuperar projectState do Firestore:", err);
    return {
      success: false,
      error: err?.message || "Erro ao conectar com o Firestore.",
    };
  }
}

/**
 * Listens in real-time to changes on document `syncCode` in Firestore.
 */
export function subscribeProjectStateFirestore(
  syncCode: string,
  onUpdate: (state: Project3DState, updatedAt: string) => void,
  onError?: (errMessage: string) => void
) {
  if (!syncCode || !syncCode.trim()) return () => {};

  const cleanedCode = syncCode.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  const docRef = doc(db, COLLECTION_NAME, cleanedCode);

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && data.projectState) {
          onUpdate(data.projectState as Project3DState, data.updatedAt || new Date().toISOString());
        }
      }
    },
    (err) => {
      console.error("Erro no listener do Firestore:", err);
      if (onError) onError(err.message);
    }
  );
}
