"use client";

import { useEffect } from "react";

export default function BootstrapClients() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap')
      .then(() => {
        console.log("B JS loaded successfully.");
      })
      .catch((err) => {
        console.error("Error loading B JS:", err);
      });
  }, []);

  return null; // No need to render anything
}
