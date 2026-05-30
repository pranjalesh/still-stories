"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const body = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const inputClass =
    "w-full bg-surface border border-border text-white text-sm px-4 py-3 placeholder:text-muted focus:outline-none focus:border-white transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <div>
        <label className="block text-xs tracking-widest uppercase text-muted mb-2">
          Name
        </label>
        <input
          name="name"
          type="text"
          required
          placeholder="Your name"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase text-muted mb-2">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase text-muted mb-2">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell me about your project..."
          className={inputClass + " resize-none"}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="px-8 py-3 bg-white text-black text-xs tracking-widest uppercase font-bold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      {status === "success" && (
        <p className="text-sm text-white/70">
          ✓ Message sent. I&apos;ll be in touch soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400">{errorMsg}</p>
      )}
    </form>
  );
}
