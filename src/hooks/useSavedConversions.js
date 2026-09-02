import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { conversionsApi } from "../api-client";

export function useSavedConversions() {
  const { status: authStatus } = useAuth();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    if (authStatus !== "signed-in") return;
    setStatus("loading"); setError("");
    try { const d = await conversionsApi.list(); setItems(d.conversions || []); setStatus("ready"); }
    catch (e) { setError(e.message); setStatus("error"); }
  }, [authStatus]);
  useEffect(() => {
    if (authStatus === "signed-in") {
      refetch();
    }
  }, [authStatus, refetch]);

  const add = async (item) => { await conversionsApi.create({ from_currency: item.from, to_currency: item.to, amount: item.amount, rate: item.rate, converted_value: item.value, channel: item.channel }); await refetch(); };
  const update = async (id, item) => { await conversionsApi.update(id, { from_currency: item.from, to_currency: item.to, amount: item.amount, rate: item.rate, converted_value: item.value, channel: item.channel }); await refetch(); };
  const remove = async (id) => { await conversionsApi.remove(id); await refetch(); };
  return { items, add, update, remove, refetch, status, error };
}
