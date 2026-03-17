import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WaitlistWrapper, MeshGradient } from "@/components/waitlist";
import Icon from "@/components/ui/icon";

const DEFAULT_TARIFFS = {
  loading: 350,
  unloading: 350,
  storage: 120,
  delivery: 45,
};

export default function Tariffs() {
  const navigate = useNavigate();
  const [values, setValues] = useState(DEFAULT_TARIFFS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cargo_tariffs");
      if (raw) setValues({ ...DEFAULT_TARIFFS, ...JSON.parse(raw) });
    } catch (_e) {
      // ignore
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("cargo_tariffs", JSON.stringify(values));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass =
    "w-full h-11 px-4 text-sm bg-gray-11/5 border border-gray-11/10 rounded-xl text-slate-12 placeholder:text-slate-9 focus:outline-none focus:ring-2 focus:ring-gray-12/20";

  const fields: { key: keyof typeof DEFAULT_TARIFFS; label: string; unit: string; hint: string }[] = [
    { key: "loading", label: "Погрузка", unit: "руб./т", hint: "Стоимость погрузки за тонну" },
    { key: "unloading", label: "Выгрузка", unit: "руб./т", hint: "Стоимость выгрузки за тонну" },
    { key: "storage", label: "Размещение на складе", unit: "руб./м²", hint: "Стоимость хранения за квадратный метр" },
    { key: "delivery", label: "Доставка", unit: "руб./км", hint: "Стоимость доставки за километр" },
  ];

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
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-medium text-slate-12 text-pretty">
                    Настройка тарифов
                  </h1>
                  <p className="text-slate-10 tracking-tight text-pretty">
                    Укажите актуальные ставки — они используются при расчёте
                  </p>
                </div>

                <div className="flex flex-col gap-4 w-full text-left">
                  {fields.map(({ key, label, unit, hint }) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-xs font-medium text-slate-10 uppercase tracking-wider">
                          {label}
                        </label>
                        <span className="text-xs text-slate-9">{unit}</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder={hint}
                        value={values[key]}
                        onChange={(e) =>
                          setValues((prev) => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))
                        }
                        className={inputClass}
                      />
                    </div>
                  ))}

                  <button
                    onClick={handleSave}
                    className={`w-full py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                      saved
                        ? "bg-green-600 text-white"
                        : "bg-gray-12 text-gray-1 hover:opacity-90"
                    }`}
                  >
                    <Icon name={saved ? "Check" : "Save"} size={16} />
                    {saved ? "Сохранено!" : "Сохранить тарифы"}
                  </button>

                  <button
                    onClick={() => navigate("/")}
                    className="w-full py-2 text-slate-10 text-xs hover:text-slate-12 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Icon name="ArrowLeft" size={13} />
                    Вернуться к калькулятору
                  </button>
                </div>
              </WaitlistWrapper>
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
