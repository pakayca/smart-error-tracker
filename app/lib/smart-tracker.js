const SmartTracker = {
  init: (apiUrl) => {
    console.log("🚀 Smart Tracker aktifleşti...");

    // 1. Tarayıcı (Frontend) Hatalarını Yakala
    if (typeof window !== "undefined") {
      window.onerror = (message, source, lineno, colno, error) => {
        SmartTracker.report({
          message: message,
          stack: error?.stack || `Line: ${lineno}, Col: ${colno}`,
          metadata: { url: window.location.href, agent: navigator.userAgent }
        }, apiUrl);
      };
    }

    // 2. Node.js (Backend) Hatalarını Yakala
    if (typeof process !== "undefined") {
      process.on('uncaughtException', (err) => {
        SmartTracker.report({
          message: err.message,
          stack: err.stack,
          metadata: { platform: process.platform, nodeVersion: process.version }
        }, apiUrl);
      });
    }
  },

  report: async (errorData, apiUrl) => {
    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
      });
    } catch (e) {
      console.error("Hata raporlanamadı:", e);
    }
  }
};

export default SmartTracker;