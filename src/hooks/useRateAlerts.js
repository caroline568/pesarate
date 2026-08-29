import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { alertsApi } from "../api-client";
import { useLocalCollection } from "./useLocalCollection";

/** Rate alerts, backed by the Flask API when signed in, localStorage otherwise. */
export function useRateAlerts() {
  const { status: authStatus } = useAuth();
  const local = useLocalCollection("pesarate-alerts");
  const [remoteItems, setRemoteItems] = useState(null);
  const [error, setError] = useState(false);

  const refetch = useCallback(() => {
    if (authStatus !== "signed-in") return;
    alertsApi
      .list()
      .then((d) => setRemoteItems(d.alerts))
      .catch(() => setError(true));
  }, [authStatus]);

  useEffect(() => {
    if (authStatus === "signed-in") refetch();
  }, [authStatus, refetch]);

  if (authStatus !== "signed-in") {
    return { ...local, mode: "local" };
  }

  const status = error ? "error" : remoteItems ? "ready" : "loading";

  const add = async ({ pair, target }) => {
    const [from_currency, to_currency] = pair.split("/");
    await alertsApi.create({ from_currency, to_currency, target_rate: target });
    refetch();
  };

  const remove = async (id) => {
    await alertsApi.remove(id);
    refetch();
  };

  const items = (remoteItems || []).map((a) => ({
    id: a.id,
    pair: `${a.from_currency}/${a.to_currency}`,
    target: a.target_rate,
  }));

  return { items, add, remove, status, mode: "remote" };
}

export default useRateAlerts;
