"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

export default function ShopifySyncButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<string>("");

  async function handleSync() {
    setStatus("loading");
    setResult("");
    try {
      const res = await fetch("/api/shopify/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      setResult(`Synced ${data.synced} products (${data.created} new, ${data.updated} updated)`);
      setStatus("success");
    } catch (err: any) {
      setResult(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSync}
        disabled={status === "loading"}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        <RefreshCw className={`w-4 h-4 ${status === "loading" ? "animate-spin" : ""}`} />
        {status === "loading" ? "Syncing..." : "Sync Shopify Products"}
      </button>
      {status === "success" && (
        <span className="flex items-center gap-1 text-sm text-green-600">
          <CheckCircle className="w-4 h-4" /> {result}
        </span>
      )}
      {status === "error" && (
        <span className="flex items-center gap-1 text-sm text-red-500">
          <AlertCircle className="w-4 h-4" /> {result}
        </span>
      )}
    </div>
  );
}
