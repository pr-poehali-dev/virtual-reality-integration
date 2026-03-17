import { ThemeProvider } from "next-themes";
import { useState } from "react";
import {
  WaitlistWrapper,
  MeshGradient,
} from "@/components/waitlist";
import Icon from "@/components/ui/icon";

type RouteType = "city" | "region" | "inter";
type WeightType = "light" | "medium" | "heavy" | "extra";

const ROUTE_LABELS: Record<RouteType, string> = {
  city: "По городу",
  region: "По региону",
  inter: "Межрегиональная",
};

const WEIGHT_LABELS: Record<WeightType, string> = {
  light: "до 100 кг",
  medium: "100–500 кг",
  heavy: "500–2000 кг",
  extra: "свыше 2000 кг",
};

const BASE_PRICE: Record<RouteType, number> = {
  city: 2500,
  region: 7000,
  inter: 15000,
};

const WEIGHT_MULT: Record<WeightType, number> = {
  light: 1,
  medium: 1.8,
  heavy: 3.2,
  extra: 5.5,
};

export default function Index() {
  const [route, setRoute] = useState<RouteType>("city");
  const [weight, setWeight] = useState<WeightType>("light");
  const [fragile, setFragile] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    let price = BASE_PRICE[route] * WEIGHT_MULT[weight];
    if (fragile) price *= 1.15;
    if (urgent) price *= 1.3;
    setResult(Math.round(price / 100) * 100);
    setCalculated(true);
  };

  const handleReset = () => {
    setCalculated(false);
    setResult(null);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="antialiased max-w-screen min-h-svh bg-slate-1 text-slate-12">
        <MeshGradient
          colors={["#0a2463", "#1e6b8c", "#0d6e5c", "#1a4a8a"]}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <div className="max-w-screen-sm mx-auto w-full relative z-[1] flex flex-col min-h-screen items-center justify-center">
          <div className="px-5 gap-8 flex flex-col w-full">
            <main className="flex justify-center">
              <WaitlistWrapper
                logo={{
                  src: "/logo.svg",
                  alt: "Cargo",
                }}
                copyright="Сервис доставки"
                copyrightLink={{ text: "коммерческих грузов", href: "#" }}
                showThemeSwitcher={true}
              >
                {!calculated ? (
                  <>
                    <div className="space-y-1">
                      <h1 className="text-2xl sm:text-3xl font-medium text-slate-12 whitespace-pre-wrap text-pretty">
                        Расчёт стоимости доставки
                      </h1>
                      <p className="text-slate-10 tracking-tight text-pretty">
                        Быстро узнайте примерную стоимость доставки вашего груза
                      </p>
                    </div>

                    <div className="flex flex-col gap-5 w-full text-left">
                      {/* Маршрут */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-slate-10 uppercase tracking-wider px-1">
                          Маршрут
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(Object.keys(ROUTE_LABELS) as RouteType[]).map((r) => (
                            <button
                              key={r}
                              onClick={() => setRoute(r)}
                              className={`py-2 px-2 rounded-xl text-sm font-medium transition-all border ${
                                route === r
                                  ? "bg-gray-12 text-gray-1 border-gray-12"
                                  : "bg-gray-11/5 text-slate-11 border-gray-11/10 hover:border-gray-11/30"
                              }`}
                            >
                              {ROUTE_LABELS[r]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Вес */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-slate-10 uppercase tracking-wider px-1">
                          Вес груза
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(Object.keys(WEIGHT_LABELS) as WeightType[]).map((w) => (
                            <button
                              key={w}
                              onClick={() => setWeight(w)}
                              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all border ${
                                weight === w
                                  ? "bg-gray-12 text-gray-1 border-gray-12"
                                  : "bg-gray-11/5 text-slate-11 border-gray-11/10 hover:border-gray-11/30"
                              }`}
                            >
                              {WEIGHT_LABELS[w]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Доп. опции */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-slate-10 uppercase tracking-wider px-1">
                          Дополнительно
                        </label>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => setFragile(!fragile)}
                            className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all border ${
                              fragile
                                ? "bg-gray-12 text-gray-1 border-gray-12"
                                : "bg-gray-11/5 text-slate-11 border-gray-11/10 hover:border-gray-11/30"
                            }`}
                          >
                            <Icon name={fragile ? "CheckSquare" : "Square"} size={16} />
                            Хрупкий груз (+15%)
                          </button>
                          <button
                            onClick={() => setUrgent(!urgent)}
                            className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all border ${
                              urgent
                                ? "bg-gray-12 text-gray-1 border-gray-12"
                                : "bg-gray-11/5 text-slate-11 border-gray-11/10 hover:border-gray-11/30"
                            }`}
                          >
                            <Icon name={urgent ? "CheckSquare" : "Square"} size={16} />
                            Срочная доставка (+30%)
                          </button>
                        </div>
                      </div>

                      {/* Кнопка расчёта */}
                      <button
                        onClick={handleCalculate}
                        className="w-full py-3 bg-gray-12 text-gray-1 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        <Icon name="Calculator" size={16} />
                        Рассчитать стоимость
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <h1 className="text-2xl sm:text-3xl font-medium text-slate-12">
                        Ваш расчёт готов
                      </h1>
                      <p className="text-slate-10 tracking-tight">
                        Примерная стоимость доставки
                      </p>
                    </div>

                    <div className="flex flex-col gap-5 w-full">
                      {/* Итог */}
                      <div className="bg-gray-11/5 border border-gray-11/10 rounded-2xl p-6 text-center">
                        <p className="text-slate-10 text-sm mb-1">Стоимость от</p>
                        <p className="text-4xl font-bold text-slate-12">
                          {result?.toLocaleString("ru-RU")} ₽
                        </p>
                      </div>

                      {/* Параметры */}
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between py-2 border-b border-gray-11/10">
                          <span className="text-slate-10">Маршрут</span>
                          <span className="text-slate-12 font-medium">{ROUTE_LABELS[route]}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-11/10">
                          <span className="text-slate-10">Вес груза</span>
                          <span className="text-slate-12 font-medium">{WEIGHT_LABELS[weight]}</span>
                        </div>
                        {fragile && (
                          <div className="flex justify-between py-2 border-b border-gray-11/10">
                            <span className="text-slate-10">Хрупкий груз</span>
                            <span className="text-slate-12 font-medium">+15%</span>
                          </div>
                        )}
                        {urgent && (
                          <div className="flex justify-between py-2 border-b border-gray-11/10">
                            <span className="text-slate-10">Срочная доставка</span>
                            <span className="text-slate-12 font-medium">+30%</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-10 text-center">
                        Точная стоимость уточняется у менеджера
                      </p>

                      <div className="flex flex-col gap-2">
                        <button className="w-full py-3 bg-gray-12 text-gray-1 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                          <Icon name="Phone" size={16} />
                          Оформить заявку
                        </button>
                        <button
                          onClick={handleReset}
                          className="w-full py-2.5 text-slate-10 text-sm hover:text-slate-12 transition-colors"
                        >
                          Рассчитать заново
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </WaitlistWrapper>
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
