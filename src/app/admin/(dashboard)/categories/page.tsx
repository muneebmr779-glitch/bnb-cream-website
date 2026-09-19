"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { slugify } from "@/lib/format";

type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
  _count?: { products: number };
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug: slugify(name), order: categories.length }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Category added");
      setName("");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add category");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Could not delete category");
      return;
    }
    toast.success("Category deleted");
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-chocolate-900 sm:text-3xl">Categories</h1>
      <p className="mt-1 text-sm text-chocolate-700/60">Organize your menu into categories.</p>

      <form onSubmit={handleCreate} className="mt-6 flex max-w-md gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="input"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg bg-chocolate-900 px-4 py-2 text-sm font-medium text-cream-50 hover:bg-accent-600 disabled:opacity-60"
        >
          <Plus size={16} />
          Add
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-chocolate-900/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-chocolate-900/10 text-xs uppercase tracking-wide text-chocolate-700/60">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Products</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-chocolate-900/5 last:border-0">
                <td className="px-5 py-3 font-medium text-chocolate-900">{cat.name}</td>
                <td className="px-5 py-3 text-chocolate-700/70">{cat.slug}</td>
                <td className="px-5 py-3 text-chocolate-700/70">{cat._count?.products ?? 0}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-chocolate-700/40 hover:text-accent-600"
                    aria-label={`Delete ${cat.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-chocolate-700/50">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
