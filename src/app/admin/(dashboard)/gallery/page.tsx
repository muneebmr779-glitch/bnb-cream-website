"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Loader2, Trash2, Upload } from "lucide-react";

type GalleryImage = {
  id: string;
  url: string;
  caption: string | null;
  category: string;
};

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();
    setImages(data.images ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error);

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: uploadData.url, category: "General", order: images.length }),
      });
      if (!res.ok) throw new Error("Could not save image");
      toast.success("Image added to gallery");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this image from the gallery?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    toast.success("Image removed");
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-chocolate-900 sm:text-3xl">Gallery</h1>
          <p className="mt-1 text-sm text-chocolate-700/60">Manage photos shown on the gallery page.</p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-full bg-chocolate-900 px-4 py-2.5 text-sm font-medium text-cream-50 hover:bg-accent-600 disabled:opacity-60"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          Upload Image
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="group relative aspect-square overflow-hidden rounded-xl">
            <Image src={image.url} alt={image.caption ?? ""} fill className="object-cover" sizes="25vw" />
            <button
              onClick={() => handleDelete(image.id)}
              className="absolute right-2 top-2 rounded-full bg-chocolate-900/70 p-1.5 text-cream-50 opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Delete image"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {images.length === 0 && (
          <p className="col-span-full py-6 text-center text-chocolate-700/50">
            No gallery images yet.
          </p>
        )}
      </div>
    </div>
  );
}
