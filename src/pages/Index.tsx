import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WaitlistWrapper, MeshGradient } from "@/components/waitlist";
import Icon from "@/components/ui/icon";

const DEFAULT_TARIFFS = {
  loading: 350,
  unloading: 350,
  storage: 120,
  delivery: 45,
};

function getStoredTariffs() {
  try {
    const raw = localStorage.getItem("cargo_tariffs");
    if (raw) return { ...DEFAULT_TARIFFS, ...JSON.parse(raw) };
  } catch (_e) {
    return DEFAULT_TARIFFS;
  }
  return DEFAULT_TARIFFS;
}

export default function Index() {
  const navigate = useNavigate();
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");
  const [distance, setDistance] = useState("");
  const [noWarehouse, setNoWarehouse] = useState(false);
  const [result, setResult] = useState<{
    delivery: number;
    loading: number;
    unloading: number;
    storage: number;
    total: number;
  } | null>(null);

  const handleCalculate = () => {
    const w = parseFloat(weight) || 0;
    const v = parseFloat(volume) || 0;
    const km = parseFloat(distance) || 0;
    const t = getStoredTariffs();

    const deliveryCost = Math.round(km * t.delivery);
    const loadingCost = noWarehouse ? 0 : Math.round(w * t.loading);
    const unloadingCost = noWarehouse ? 0 : Math.round(w * t.unloading);
    const storageCost = noWarehouse ? 0 : Math.round(v * t.storage);
    const total = deliveryCost + loadingCost + unloadingCost + storageCost;

    setResult({
      delivery: deliveryCost,
      loading: loadingCost,
      unloading: unloadingCost,
      storage: storageCost,
      total,
    });
  };

  const handleReset = () => setResult(null);

  const inputClass =
    "w-full h-11 px-4 text-sm bg-gray-11/5 border border-gray-11/10 rounded-xl text-slate-12 placeholder:text-slate-9 focus:outline-none focus:ring-2 focus:ring-gray-12/20";

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="antialiased max-w-screen min-h-svh bg-slate-1 text-slate-12">
        <MeshGradient
          colors={["#0a2463", "#1e6b8c", "#0d6e5c", "#1a4a8a"]}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 0, width: "100%", height: "100%" }}
        />
        <div className="max-w-screen-sm mx-auto w-full relative z-[1] flex flex-col min-h-screen items-center justify-center py-10">
          <div className="px-5 w-full">
            <main className="flex justify-center">
              <WaitlistWrapper
                logo={{ src: "/logo.svg", alt: "Cargo" }}
                copyright="Сервис доставки"
                copyrightLink={{ text: "коммерческих грузов", href: "#" }}
                showThemeSwitcher={true}
              >
                {!result ? (
                  <>
                    <div className="space-y-1">
                      <h1 className="text-2xl sm:text-3xl font-medium text-slate-12 text-pretty">
                        Расчёт стоимости доставки
                      </h1>
                      <p className="text-slate-10 tracking-tight text-pretty">
                        Введите параметры груза для расчёта
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 w-full text-left">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-10 uppercase tracking-wider px-1">
                          Вес, тонн
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="например, 2.5"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-10 uppercase tracking-wider px-1">
                          Объём, м²
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="например, 10"
                          value={volume}
                          onChange={(e) => setVolume(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-10 uppercase tracking-wider px-1">
                          Расстояние, км
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="например, 150"
                          value={distance}
                          onChange={(e) => setDistance(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <button
                        onClick={() => setNoWarehouse(!noWarehouse)}
                        className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all border ${
                          noWarehouse
                            ? "bg-gray-12 text-gray-1 border-gray-12"
                            : "bg-gray-11/5 text-slate-11 border-gray-11/10 hover:border-gray-11/30"
                        }`}
                      >
                        <Icon name={noWarehouse ? "CheckSquare" : "Square"} size={16} />
                        Без склада — от поставщика к клиенту
                      </button>

                      <button
                        onClick={handleCalculate}
                        disabled={!weight && !volume && !distance}
                        className="w-full py-3 bg-gray-12 text-gray-1 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Icon name="Calculator" size={16} />
                        Рассчитать стоимость
                      </button>

                      <button
                        onClick={() => navigate("/tariffs")}
                        className="w-full py-2 text-slate-10 text-xs hover:text-slate-12 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Icon name="Settings" size={13} />
                        Настроить тарифы
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <h1 className="text-2xl sm:text-3xl font-medium text-slate-12">
                        Расчёт готов
                      </h1>
                      <p className="text-slate-10 tracking-tight">Предварительная стоимость</p>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                      <div className="bg-gray-11/5 border border-gray-11/10 rounded-2xl p-6 text-center">
                        <p className="text-slate-10 text-sm mb-1">Итого</p>
                        <p className="text-4xl font-bold text-slate-12">
                          {result.total.toLocaleString("ru-RU")} ₽
                        </p>
                      </div>

                      <div className="flex flex-col text-sm">
                        <div className="flex justify-between py-2.5 border-b border-gray-11/10">
                          <span className="text-slate-10">Доставка</span>
                          <span className="font-medium">{result.delivery.toLocaleString("ru-RU")} ₽</span>
                        </div>
                        {!noWarehouse && (
                          <>
                            <div className="flex justify-between py-2.5 border-b border-gray-11/10">
                              <span className="text-slate-10">Погрузка</span>
                              <span className="font-medium">{result.loading.toLocaleString("ru-RU")} ₽</span>
                            </div>
                            <div className="flex justify-between py-2.5 border-b border-gray-11/10">
                              <span className="text-slate-10">Выгрузка</span>
                              <span className="font-medium">{result.unloading.toLocaleString("ru-RU")} ₽</span>
                            </div>
                            <div className="flex justify-between py-2.5 border-b border-gray-11/10">
                              <span className="text-slate-10">Размещение на складе</span>
                              <span className="font-medium">{result.storage.toLocaleString("ru-RU")} ₽</span>
                            </div>
                          </>
                        )}
                        {noWarehouse && (
                          <div className="flex justify-between py-2.5 border-b border-gray-11/10">
                            <span className="text-slate-10">Режим</span>
                            <span className="font-medium text-slate-12">Без склада</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-10 text-center">
                        Точная стоимость уточняется у менеджера
                      </p>

                      <button
                        onClick={handleReset}
                        className="w-full py-3 bg-gray-12 text-gray-1 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        <Icon name="RefreshCw" size={16} />
                        Рассчитать заново
                      </button>
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