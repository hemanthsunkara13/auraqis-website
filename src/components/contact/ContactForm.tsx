"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";

/**
 * Contact form without a backend: composes an email to info@auraqis.com in the visitor’s mail client.
 * Swap `onSubmit` for an API route / form service when one is available.
 */
export function ContactForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [error, setError] = useState<string | null>(null);
  const field = cn(
    "w-full border-b bg-transparent py-3 text-base outline-none transition-colors placeholder:opacity-50",
    tone === "dark" ? "border-ivory/25 focus:border-ivory" : "border-charcoal/25 focus:border-charcoal",
  );

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const name = String(f.get("name") ?? "").trim().slice(0, 120);
        const email = String(f.get("email") ?? "").trim().slice(0, 160);
        const phone = String(f.get("phone") ?? "").trim().slice(0, 40);
        const interest = String(f.get("interest") ?? "").slice(0, 120);
        const message = String(f.get("message") ?? "").trim().slice(0, 2000);
        if (!name || !message) return setError("Please add your name and a short message.");
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please check your email address.");
        setError(null);
        const subject = `Enquiry${interest ? ` — ${interest}` : ""} — ${name}`;
        const body = [message, "", `Name: ${name}`, email && `Email: ${email}`, phone && `Phone: ${phone}`, interest && `Interested in: ${interest}`]
          .filter(Boolean)
          .join("\n");
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }}
      className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
    >
      <label className="block">
        <span className="label opacity-70">Name *</span>
        <input name="name" required maxLength={120} autoComplete="name" className={field} />
      </label>
      <label className="block">
        <span className="label opacity-70">Email</span>
        <input name="email" type="email" maxLength={160} autoComplete="email" className={field} />
      </label>
      <label className="block">
        <span className="label opacity-70">Phone</span>
        <input name="phone" type="tel" maxLength={40} autoComplete="tel" className={field} />
      </label>
      <label className="block">
        <span className="label opacity-70">Interested in</span>
        <select name="interest" className={cn(field, "appearance-none")} defaultValue="">
          <option value="" className="text-charcoal">Select a service</option>
          {services.map((s) => (
            <option key={s.slug} value={s.title} className="text-charcoal">
              {s.title}
            </option>
          ))}
        </select>
      </label>
      <label className="block md:col-span-2">
        <span className="label opacity-70">Tell us about your space *</span>
        <textarea name="message" required rows={4} maxLength={2000} className={cn(field, "resize-none")} />
      </label>
      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p role="alert" aria-live="assertive" className="text-sm text-[#e0a58a]">
          {error}
        </p>
        <button
          type="submit"
          className={cn(
            "group inline-flex items-center gap-4 px-7 py-4 text-[0.75rem] font-semibold tracking-[0.16em] uppercase transition-colors",
            tone === "dark" ? "bg-ivory text-charcoal hover:bg-sage hover:text-ivory" : "bg-charcoal text-ivory hover:bg-forest",
          )}
        >
          Start a Conversation
          <span aria-hidden className="block h-px w-6 bg-current" />
        </button>
      </div>
      <p className="text-xs opacity-55 md:col-span-2">Submitting opens your email app with the message addressed to {site.email}.</p>
    </form>
  );
}
