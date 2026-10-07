import { useEffect, useState } from "react";
import { fetchSanityMenu, sanityConfigured, toDealItem, toPizzaItem, toSimpleItem, type SanityMenuDocument } from "@/lib/sanityMenu";
import type { DealItem, PizzaItem, SimpleItem } from "@/data/menu";
import { bbq as localBBQ, BBQ_IMAGE_BY_NAME } from "@/data/menu";

export type SanityMenuState = {
  burgers: SimpleItem[]; rolls: SimpleItem[]; broast: SimpleItem[]; bbq: SimpleItem[];
  platters: SimpleItem[]; pastaItems: SimpleItem[]; sandwiches: SimpleItem[];
  pizzas: PizzaItem[]; deals: DealItem[]; loading: boolean; connected: boolean;
};

function mergeById<T extends { id: string }>(local: T[], remote: T[]) {
  const remoteIds = new Set(remote.map((item) => item.id));
  return [...remote, ...local.filter((item) => !remoteIds.has(item.id))];
}

export function useSanityMenu(): SanityMenuState {
  const [state, setState] = useState<SanityMenuState>({
    burgers: [], rolls: [], broast: [], bbq: [], platters: [], pastaItems: [], sandwiches: [], pizzas: [], deals: [],
    loading: sanityConfigured, connected: false,
  });

  useEffect(() => {
    let cancelled = false;
    if (!sanityConfigured) return;
    fetchSanityMenu().then((docs: SanityMenuDocument[]) => {
      if (cancelled) return;
      const simple = docs.map(toSimpleItem).filter(Boolean) as SimpleItem[];
      const pizza = docs.map(toPizzaItem).filter(Boolean) as PizzaItem[];
      const remoteDeals = docs.map(toDealItem).filter(Boolean) as DealItem[];
      const byCategory = (category: SimpleItem["category"]) => simple.filter((item) => item.category === category);

      // Customer website currently shows only the core Deals.
      // Specials 01–21 and event deals remain hidden until intentionally re-enabled.
      // Deal 19 was removed as a duplicate, so exclude it explicitly.
      const remoteBbq = byCategory("BBQ").map((item) => ({
        ...item,
        image: BBQ_IMAGE_BY_NAME[item.name] ?? item.image,
      }));

      // Always render the verified customer-facing Deal 1–19 set.
      // Sanity can update matching items, while local data guarantees all 19 remain visible.
      const remoteById = new Map(remoteDeals.map((item) => [item.id, item]));
      const deal = deals.slice(0, 19).map((local) => {
        const remote = remoteById.get(local.id);
        return remote
          ? { ...local, ...remote, name: local.name }
          : local;
      });

      setState({
        burgers: byCategory("Burgers"),
        rolls: byCategory("Rolls"),
        broast: byCategory("Broast"),
        bbq: mergeById(localBBQ, remoteBbq),
        platters: [],
        pastaItems: byCategory("Pasta"),
        sandwiches: byCategory("Sandwiches"),
        pizzas: pizza,
        deals: deal,
        loading: false, connected: true,
      });
    }).catch((error) => {
      console.error("[Sanity] Menu request failed:", error);
      if (!cancelled) setState((current) => ({ ...current, loading: false, connected: false }));
    });
    return () => { cancelled = true; };
  }, []);

  return state;
}
