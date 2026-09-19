"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { ProductDTO, CategoryDTO } from "@/types";
import { ProductFormModal } from "@/components/admin/ProductFormModal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductDTO | null>(null);

  async function load() {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/categories"),
    ]);
    const productsData = await productsRes.json();
    const categoriesData = await categoriesRes.json();
    setProducts(productsData.products ?? []);
    setCategories(categoriesData.categories ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Could not delete product");
      return;
    }
    toast.success(data.message ?? "Product deleted");
    load();
  }

  async function toggleAvailable(product: ProductDTO) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !product.available }),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-chocolate-900 sm:text-3xl">Products</h1>
          <p className="mt-1 text-sm text-chocolate-700/60">Manage your bakery menu items.</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-full bg-chocolate-900 px-4 py-2.5 text-sm font-medium text-cream-50 hover:bg-accent-600"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-chocolate-900/5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-chocolate-900/10 text-xs uppercase tracking-wide text-chocolate-700/60">
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Available</th>
              <th className="px-5 py-3">Featured</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-chocolate-900/5 last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-chocolate-800">
                      {product.images[0] && (
                        <Image src={product.images[0]} alt="" fill sizes="40px" className="object-cover" />
                      )}
                    </div>
                    <span className="font-medium text-chocolate-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-chocolate-700/70">{product.category.name}</td>
                <td className="px-5 py-3 text-chocolate-800">{formatPrice(product.price)}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleAvailable(product)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      product.available
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-chocolate-900/10 text-chocolate-700"
                    }`}
                  >
                    {product.available ? "Available" : "Unavailable"}
                  </button>
                </td>
                <td className="px-5 py-3 text-chocolate-700/70">{product.featured ? "Yes" : "—"}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setEditing(product);
                        setModalOpen(true);
                      }}
                      className="text-chocolate-700/60 hover:text-accent-600"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-chocolate-700/40 hover:text-accent-600"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-chocolate-700/50">
                  No products yet. Add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        categories={categories}
        product={editing}
      />
    </div>
  );
}
