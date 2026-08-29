import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { conversionsApi } from "../api-client";
import { useLocalCollection } from "./useLocalCollection";

/**
 * Saved conversions, backed by the Flask API when signed in and by
 * localStorage otherwise — so the converter is still useful signed out,
 * but syncs across devices once a user has an account.
 */
export function useSavedConversions() {
  const { status: authStatus } = useAuth();
  const local = useLocalCollection("pesarate-saved", { limit: 10 });
  const [remoteItems, setRemoteItems] = useState(null);
  const [error, setError] = useState(false);

  const refetch = useCallback(() => {
    if (authStatus !== "signed-in") return;
    conversionsApi
      .list()
      .then((d) => setRemoteItems(d.conversions))
      .catch(() => setError(true));
  }, [authStatus]);

  useEffect(() => {
    if (authStatus === "signed-in") refetch();
  }, [authStatus, refetch]);

  if (authStatus !== "signed-in") {
    return { ...local, mode: "local" };
  }

  const status = error ? "error" : remoteItems ? "ready" : "loading";

  const add = async (item) => {
    const payload = {
      from_currency: item.from,
      to_currency: item.to,
      amount: item.amount,
      rate: item.rate,
      converted_value: item.value,
    };
    await conversionsApi.create(payload);
    refetch();
  };

  const remove = async (id) => {
    await conversionsApi.remove(id);
    refetch();
  };

  const items = (remoteItems || []).map((c) => ({
    id: c.id,
    amount: c.amount,
    from: c.from_currency,
    to: c.to_currency,
    rate: c.rate,
    value: c.converted_value,
  }));

  return { items, add, remove, status, mode: "remote" };
}

export default useSavedConversions;
