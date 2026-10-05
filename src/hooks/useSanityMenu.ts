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
      // Deal 19 was removed as a duplicate, so exclude it explicitly.
      const deal = remoteDeals
        .filter((item) => !/^Deal\s*0*19$/i.test(item.name))
        .slice(0, 19)
        .map((item) => {
          const number = Number(item.name.match(/Deal\s*0*(\d+)/i)?.[1] || 0);
          return {
            ...item,
            name: number > 0 ? `Deal ${String(number).padStart(2, "0")}` : item.name,
          };
        });

      setState({
        burgers: byCategory("Burgers"),
        rolls: byCategory("Rolls"),
        broast: byCategory("Broast"),
        bbq: mergeById(bbq, byCategory("BBQ")),
        platters: [],
        pastaItems: byCategory("Pasta"),
        sandwiches: byCategory("Sandwiches"),
        pizzas: pizza,
        deals: deal.filter((item) => /^Deal\s*0*(?:[1-9]|1[0-8])$/i.test(item.name)).sort((a, b) => {
          const an = Number(a.name.match(/Deal\s*0*(\d+)/i)?.[1] || 0);
          const bn = Number(b.name.match(/Deal\s*0*(\d+)/i)?.[1] || 0);
          return an - bn;
        }).map((item) => ({
          ...item,
          name: `Deal ${String(Number(item.name.match(/Deal\s*0*(\d+)/i)?.[1] || 0)).padStart(2, "0")}`,
        })),
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
