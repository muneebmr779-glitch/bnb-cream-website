"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Mail, MailOpen, Trash2 } from "lucide-react";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  async function load() {
    const res = await fetch("/api/admin/messages");
    const data = await res.json();
    setMessages(data.messages ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRead(id: string, read: boolean) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-chocolate-900 sm:text-3xl">Messages</h1>
      <p className="mt-1 text-sm text-chocolate-700/60">Messages submitted via the contact form.</p>

      <div className="mt-6 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-2xl p-5 shadow-sm ring-1 ring-chocolate-900/5 ${
              message.read ? "bg-white" : "bg-caramel-400/10"
            }`}
          >
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <p className="font-medium text-chocolate-900">{message.name}</p>
                <p className="text-xs text-chocolate-700/60">
                  {message.email} {message.phone && `· ${message.phone}`}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => toggleRead(message.id, !message.read)}
                  className="rounded-full p-2 text-chocolate-700/60 hover:bg-chocolate-900/5"
                  aria-label={message.read ? "Mark as unread" : "Mark as read"}
                >
                  {message.read ? <Mail size={16} /> : <MailOpen size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(message.id)}
                  className="rounded-full p-2 text-chocolate-700/40 hover:text-accent-600"
                  aria-label="Delete message"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-chocolate-800">{message.message}</p>
            <p className="mt-2 text-xs text-chocolate-700/50">
              {format(new Date(message.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="py-6 text-center text-chocolate-700/50">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
