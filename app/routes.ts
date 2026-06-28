import {
  HomePage,
  AboutPage,
  GreetPage,
  CounterPage,
  SearchPage,
  BigPage,
  WidgetsPage,
  StressPage,
  ProductsPage,
  ShopServerPage,
} from "./pages.ts";

export const routes = {
  "/": { title: "Home", view: HomePage },
  "/shop": { title: "Shop", view: ProductsPage },
  "/shop-server": { title: "Shop (server)", view: ShopServerPage },
  "/about": { title: "About", view: AboutPage },
  "/greet/:name": { title: "Greet", view: GreetPage },
  "/counter": { title: "Counter", view: CounterPage },
  "/search": { title: "Search", view: SearchPage },
  "/big": { title: "Big", view: BigPage },
  "/widgets": { title: "Widgets", view: WidgetsPage },
  "/stress": { title: "Stress", view: StressPage },
};
