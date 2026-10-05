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
    burgers, rolls, broast, bbq, platters, pastaItems, sandwiches, pizzas, deals: deals.slice(0, 19),
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
      const coreDeals = remoteDeals.slice(0, 19);

      // Deal 19 was a duplicate and has been removed from Sanity.
      // Keep the original bundled artwork for the core deals for now.
      const deal = coreDeals.map((item, index) => {
        const localIndex = index === 18 ? 19 : index;
        return { ...item, image: deals[localIndex]?.image };
      });

      setState({
        burgers: byCategory("Burgers"),
        rolls: byCategory("Rolls"),
        broast: byCategory("Broast"),
        bbq: mergeById(bbq, byCategory("BBQ")),
        platters: mergeById(platters, byCategory("Platters")),
        pastaItems: byCategory("Pasta"),
        sandwiches: byCategory("Sandwiches"),
        pizzas: pizza,
        deals: deal.map((item, index) => {
          if (index < 19) return { ...item, name: "Deal " + String(index + 1).padStart(2, "0") };
          if (index < 40) return { ...item, name: "Special " + String(index - 18).padStart(2, "0") };
          return { ...item, name: item.name };
        }),
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
