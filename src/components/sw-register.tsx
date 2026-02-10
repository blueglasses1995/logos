"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          // Update on page load
          registration.update();

          // Check for updates periodically
          const interval = setInterval(
            () => {
              registration.update();
            },
            60 * 60 * 1000
          ); // Check every hour

          return () => clearInterval(interval);
        })
        .catch(() => {
          // Service worker registration failed, but don't show error to user
        });
    }
  }, []);

  return null;
}
