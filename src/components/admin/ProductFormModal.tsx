"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/shared/Modal";
import { ImageUploader } from "./ImageUploader";
import { slugify } from "@/lib/format";
import { ProductDTO, CategoryDTO } from "@/types";

type Variant = { name: string; priceModifier: number };

export function ProductFormModal({
  open,
  onClose,
  onSaved,
  categories,
  product,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  categories: CategoryDTO[];
  product: ProductDTO | null;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [available, setAvailable] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (product) {
      setName(product.name);
      setSlug(product.slug);
      setSlugTouched(true);
      setDescription(product.description);
      setPrice(String(product.price));
      setCategoryId(product.categoryId);
      setImage(product.images[0] ?? null);
      setAvailable(product.available);
      setFeatured(product.featured);
      setVariants(product.variants);
    } else {
      setName("");
      setSlug("");
      setSlugTouched(false);
      setDescription("");
      setPrice("");
      setCategoryId(categories[0]?.id ?? "");
      setImage(null);
      setAvailable(true);
      setFeatured(false);
      setVariants([]);
    }
  }, [open, product, categories]);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function addVariant() {
    setVariants((v) => [...v, { name: "", priceModifier: 0 }]);
  }

  function updateVariant(i: number, patch: Partial<Variant>) {
    setVariants((v) => v.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  function removeVariant(i: number) {
    setVariants((v) => v.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name,
        slug,
        description,
        price: parseFloat(price),
        categoryId,
        images: image ? [image] : [],
        available,
        featured,
        variants: variants.filter((v) => v.name.trim()),
      };
      const res = await fetch(
        product ? `/api/admin/products/${product.id}` : "/api/admin/products",
        {
          method: product ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save product");
      toast.success(product ? "Product updated" : "Product created");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="product-form-title" maxWidthClass="max-w-2xl">
      <form onSubmit={handleSubmit} className="p-6">
        <h2 id="product-form-title" className="font-display text-2xl text-chocolate-900">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <ImageUploader value={image} onChange={setImage} label="Product Image" />
          </div>

          <FormField label="Name" required>
            <input required value={name} onChange={(e) => handleNameChange(e.target.value)} className="input" />
          </FormField>
          <FormField label="Slug" required>
            <input
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className="input"
            />
          </FormField>

          <FormField label="Category" required>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Base Price (Rs)" required>
            <input
              required
              type="number"
              min={0}
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input"
            />
          </FormField>

          <FormField label="Description" required className="sm:col-span-2">
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input resize-none"
            />
          </FormField>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-chocolate-700">
                Variants (e.g. sizes)
              </span>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1 text-xs font-medium text-accent-600 hover:underline"
              >
                <Plus size={14} /> Add Variant
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {variants.map((variant, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    placeholder="Variant name (e.g. 8-inch)"
                    value={variant.name}
                    onChange={(e) => updateVariant(i, { name: e.target.value })}
                    className="input"
                  />
                  <input
                    type="number"
                    placeholder="+/- price"
                    value={variant.priceModifier}
                    onChange={(e) => updateVariant(i, { priceModifier: parseFloat(e.target.value) || 0 })}
                    className="input w-32"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="shrink-0 text-chocolate-700/40 hover:text-accent-600"
                    aria-label="Remove variant"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-chocolate-800">
            <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
            Available for order
          </label>
          <label className="flex items-center gap-2 text-sm text-chocolate-800">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured on homepage
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 w-full rounded-full bg-chocolate-900 py-3 text-sm font-semibold text-cream-50 hover:bg-accent-600 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Product"}
        </button>
      </form>
    </Modal>
  );
}

function FormField({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-chocolate-700">
        {label} {required && <span className="text-accent-600">*</span>}
      </span>
      {children}
    </label>
  );
}
