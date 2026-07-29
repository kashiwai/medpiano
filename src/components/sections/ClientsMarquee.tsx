"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import clientsData from "@/data/clients.json";
import type { Client } from "@/lib/types";

export function ClientsMarquee() {
  const t = useTranslations("HomePage.clients");
  const clients = (clientsData as Client[]).filter((client) => client.displayInMarquee);
  const looped = [...clients, ...clients];

  return (
    <section className="py-24 md:py-32 overflow-hidden bg-black text-cream">
      <div className="text-center mb-12 px-6">
        <h2 className="font-anton text-h1 uppercase">{t("title")}</h2>
        <p className="mt-4 font-zen font-black text-xl text-cream">{t("subtitle")}</p>
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex gap-16 pr-16 whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {looped.map((client, idx) => (
            <span key={`${client.id}-${idx}`} className="font-archivo text-4xl md:text-6xl">
              {client.name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
