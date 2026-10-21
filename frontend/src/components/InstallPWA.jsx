
import { useEffect, useState } from "react";

export default function InstallPWA() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkInstalled = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    setInstalled(checkInstalled());

    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setMessage("App installed successfully!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      setMessage(
        "Open your browser menu and select Install app or Add to Home screen."
      );
      return;
    }

    try {
      setLoading(true);
      await installPrompt.prompt();

      const result = await installPrompt.userChoice;

      setMessage(
        result.outcome === "accepted"
          ? "Installation accepted!"
          : "Installation cancelled. Try again anytime."
      );

      setInstallPrompt(null);
    } catch (error) {
      console.error("PWA installation error:", error);
      setMessage("Please try installing from your browser menu.");
    } finally {
      setLoading(false);
    }
  };

  if (installed) return null;

  return (
    <>
      {/* Responsive install button */}
      <div className="relative z-40 flex w-full justify-end px-3 py-2 sm:px-5">
        <button
          type="button"
          onClick={handleInstall}
          disabled={loading}
          aria-label="Install Marketplace app"
          className="
            group inline-flex items-center justify-center gap-1.5
            rounded-full border border-slate-700/40
            bg-slate-900 px-3 py-2
            text-xs font-semibold text-white
            shadow-md shadow-slate-900/20
            transition-all duration-300 ease-out
            hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg
            active:scale-90
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-blue-500 focus-visible:ring-offset-2
            disabled:cursor-wait disabled:opacity-70
            sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm
            motion-safe:animate-install-float
          "
        >
          {loading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Installing...
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-4 sm:w-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15V3m0 0L7 8m5-5 5 5M5 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"
                />
              </svg>
              Install App
            </>
          )}
        </button>
      </div>

      {/* Installation feedback */}
      {message && (
        <div
          role="status"
          className="
            fixed bottom-4 left-1/2 z-[100]
            flex w-[calc(100%-2rem)] max-w-sm
            -translate-x-1/2 items-start gap-3
            rounded-xl border border-slate-200
            bg-white p-4 text-sm text-slate-800 shadow-xl
          "
        >
          <p className="flex-1 leading-5">{message}</p>

          <button
            type="button"
            onClick={() => setMessage("")}
            aria-label="Close notification"
            className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
