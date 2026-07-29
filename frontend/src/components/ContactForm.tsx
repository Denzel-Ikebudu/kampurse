"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${name || "a visitor"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\nReply to: ${email}`);
    window.location.href = `mailto:hello@kampurse.com?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="name">
          Your Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-surface-muted border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-kampurse-green transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="email">
          Your Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-surface-muted border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-kampurse-green transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-surface-muted border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-kampurse-green transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-kampurse-green text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-kampurse-green-dark transition-colors"
      >
        Send Message
      </button>
    </form>
  );
}