const CDN_ID = "tailwind-cdn-script";
const CONFIG_ID = "tailwind-config-script";

export function loadTailwind(config = {}) {
  if (typeof window === "undefined") return Promise.resolve();

  if (window.tailwind?.__loaded) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const ensureConfigScript = () => {
      if (document.getElementById(CONFIG_ID)) return;

      const configScript = document.createElement("script");
      configScript.id = CONFIG_ID;
      configScript.type = "text/javascript";
      configScript.innerHTML = `window.tailwind = window.tailwind || {}; window.tailwind.config = ${JSON.stringify(
        config
      )};`;
      document.head.appendChild(configScript);
    };

    const appendCdnScript = () => {
      const existingScript = document.getElementById(CDN_ID);
      if (existingScript) {
        if (window.tailwind?.__loaded) {
          resolve();
          return;
        }
        existingScript.addEventListener("load", () => {
          window.tailwind.__loaded = true;
          resolve();
        });
        existingScript.addEventListener("error", reject);
        return;
      }

      const script = document.createElement("script");
      script.id = CDN_ID;
      script.src = "https://cdn.tailwindcss.com";
      script.async = true;
      script.onload = () => {
        window.tailwind = window.tailwind || {};
        window.tailwind.__loaded = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    };

    ensureConfigScript();
    appendCdnScript();
  });
}

