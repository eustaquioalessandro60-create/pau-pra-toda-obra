import { useEffect, useRef, useState } from "react";
import { Project3DState } from "../types";
import { saveProjectStateToFirestore } from "../services/projectSyncService";

export function useFirestoreProjectSync(projectState: Project3DState) {
  const [syncCode, setSyncCode] = useState<string>(() => {
    try {
      return localStorage.getItem("universo_adas_firestore_sync_code") || "obra-demo";
    } catch {
      return "obra-demo";
    }
  });

  const [syncStatus, setSyncStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip auto-saving on initial render unless projectState changes
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      if (!syncCode || !syncCode.trim()) return;

      setSyncStatus("saving");
      const result = await saveProjectStateToFirestore(syncCode, projectState);

      if (result.success) {
        setSyncStatus("saved");
        setLastSavedAt(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      } else {
        setSyncStatus("error");
        console.error("Auto-sync Firestore error:", result.error);
      }
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timer);
  }, [projectState, syncCode]);

  return { syncCode, setSyncCode, syncStatus, lastSavedAt };
}
