/* Anonymous, cookieless Umami tracking for Gimnasio Nuevo Estilo. */
(() => {
  "use strict";

  const PERSONAL_HOST = "https://analytics.187.124.55.36.sslip.io";
  const WEBSITE_ID_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;
  let ready = null;

  const installTracker = (config) => {
    const existingTracker = document.querySelector(
      'script[data-umami-tracker="true"]',
    );
    if (existingTracker) return existingTracker;
    if (!config || config.hostUrl !== PERSONAL_HOST) return null;

    const websiteId =
      typeof config.websiteId === "string" ? config.websiteId.trim() : "";
    if (!WEBSITE_ID_PATTERN.test(websiteId)) return null;

    const tracker = document.createElement("script");
    tracker.defer = true;
    tracker.dataset.domains =
      "gimnasionuevoestilo.com,www.gimnasionuevoestilo.com";
    tracker.dataset.hostUrl = PERSONAL_HOST;
    tracker.dataset.umamiTracker = "true";
    tracker.dataset.websiteId = websiteId;
    tracker.src = `${PERSONAL_HOST}/script.js`;
    document.head.appendChild(tracker);
    return tracker;
  };

  const init = () => {
    if (ready) return ready;
    if (typeof fetch !== "function") return Promise.resolve(null);

    ready = fetch("/umami-config.json", {
      cache: "no-store",
      credentials: "same-origin",
    })
      .then((response) => (response?.ok ? response.json() : null))
      .then(installTracker)
      .catch(() => null);

    return ready;
  };

  window.NuevoEstiloUmami = { init };
  window.NuevoEstiloUmami.ready = init();
})();
