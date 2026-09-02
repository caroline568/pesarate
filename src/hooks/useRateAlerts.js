import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { alertsApi } from "../api-client";

export function useRateAlerts() {
  const { status: authStatus } = useAuth();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const refetch = useCallback(async () => {
    if (authStatus !== "signed-in") return;
    setStatus("loading"); setError("");
    try { const d = await alertsApi.list(); setItems(d.alerts || []); setStatus("ready"); }
    catch (e) { setError(e.message); setStatus("error"); }
  }, [authStatus]);
  useEffect(() => {
    if (authStatus === "authenticated") {
      refetch();
    }
  }, [authStatus, refetch]);
  const add = async (payload) => { await alertsApi.create(payload); await refetch(); };
  const update = async (id, payload) => { await alertsApi.update(id, payload); await refetch(); };
  const remove = async (id) => { await alertsApi.remove(id); await refetch(); };
  return { items, add, update, remove, refetch, status, error };
}
