import { useEffect, useState } from "react";
import { fetchSanityMenu, sanityConfigured, toDealItem, toPizzaItem, toSimpleItem, type SanityMenuDocument } from "@/lib/sanityMenu";
import { burgers, rolls, broast, pizzas, deals, bbq, platters, pastaItems, sandwiches, type DealItem, type PizzaItem, type SimpleItem } from "@/data/menu";

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
    burgers, rolls, broast, bbq, platters, pastaItems, sandwiches, pizzas, deals,
    loading: sanityConfigured, connected: false,
  });

  useEffect(() => {
    let cancelled = false;
    if (!sanityConfigured) return;
    fetchSanityMenu().then((docs: SanityMenuDocument[]) => {
      if (cancelled) return;
      const simple = docs.map(toSimpleItem).filter(Boolean) as SimpleItem[];
      const pizza = docs.map(toPizzaItem).filter(Boolean) as PizzaItem[];
      const deal = docs.map(toDealItem).filter(Boolean) as DealItem[];
      const byCategory = (category: SimpleItem["category"]) => simple.filter((item) => item.category === category);
      setState({
        burgers: mergeById(burgers, byCategory("Burgers")),
        rolls: mergeById(rolls, byCategory("Rolls")),
        broast: mergeById(broast, byCategory("Broast")),
        bbq: mergeById(bbq, byCategory("BBQ")),
        platters: mergeById(platters, byCategory("Platters")),
        pastaItems: mergeById(pastaItems, byCategory("Pasta")),
        sandwiches: mergeById(sandwiches, byCategory("Sandwiches")),
        pizzas: mergeById(pizzas, pizza),
        deals: mergeById(deals, deal),
        loading: false, connected: true,
      });
    }).catch((error) => {
      console.error("[Sanity] Falling back to local menu:", error);
      if (!cancelled) setState((current) => ({ ...current, loading: false, connected: false }));
    });
    return () => { cancelled = true; };
  }, []);

  return state;
}
