"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  value?: string;
  publicId?: string;
  folderType: "coaches" | "gallery";
  getToken: () => Promise<string | null>;
  onChange: (imageUrl: string, publicId: string) => void;
  label?: string;
}

export function ImageUploader({
  value,
  folderType,
  getToken,
  onChange,
  label = "Upload Image (JPG, PNG, WebP up to 5MB)",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only JPG, PNG, and WebP are allowed.");
      return;
    }

    // Validate size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File exceeds 5 MB limit. Please optimize or choose a smaller image.");
      return;
    }

    setUploading(true);
    setProgress(5);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("You must be authenticated to upload assets.");
      }

      // Step 1: Request signed signature from server
      const signRes = await fetch("/api/admin/cloudinary-sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ folderType }),
      });

      const signJson = await signRes.json();
      if (!signRes.ok || !signJson.success) {
        throw new Error(signJson.error || "Failed to generate signed upload signature");
      }

      const { signature, timestamp, apiKey, cloudName, folder } = signJson.data;

      // Step 2: Upload directly to Cloudinary using FormData + XHR for progress
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            const pct = Math.round((ev.loaded / ev.total) * 90);
            setProgress(10 + pct);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              setProgress(100);
              onChange(res.secure_url, res.public_id);
              resolve();
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during Cloudinary upload"));
        xhr.send(formData);
      });
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("", "");
  };

  return (
    <div className="space-y-2">
      <div className="text-xs font-mono uppercase text-secondary">{label}</div>

      {error && (
        <div className="p-2 rounded bg-[var(--chess-error)]/10 border border-[var(--chess-error)] text-[var(--chess-error)] text-xs font-mono">
          {error}
        </div>
      )}

      {value ? (
        <div className="relative w-full max-w-sm rounded-lg border border-outline-subtle bg-surface-low overflow-hidden p-3 flex items-center gap-4">
          <div className="relative w-20 h-20 bg-surface-container rounded overflow-hidden shrink-0">
            <Image
              src={value}
              alt="Uploaded preview"
              fill
              className="object-contain"
              sizes="80px"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="text-xs font-mono text-on-surface truncate">
              {value.split("/").pop()}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded bg-surface-high border border-outline-subtle text-primary hover:border-primary text-xs font-mono uppercase font-bold cursor-pointer"
              >
                Replace
              </button>
              <button
                type="button"
                disabled={uploading}
                onClick={handleRemove}
                className="px-2.5 py-1 rounded bg-surface-high border border-outline-subtle text-[var(--chess-error)] hover:border-[var(--chess-error)] text-xs font-mono uppercase font-bold cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="border-2 border-dashed border-outline-subtle hover:border-primary/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-surface-low/50"
        >
          <span className="material-symbols-outlined text-3xl text-primary mb-1">
            cloud_upload
          </span>
          <div className="text-xs font-mono text-on-surface">
            {uploading ? "Uploading to Cloudinary..." : "Click to select image file"}
          </div>
          <div className="text-[11px] font-mono text-on-surface-variant mt-1">
            Max file size: 5 MB (JPG, PNG, WebP)
          </div>
        </div>
      )}

      {uploading && (
        <div className="w-full bg-surface-high rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
