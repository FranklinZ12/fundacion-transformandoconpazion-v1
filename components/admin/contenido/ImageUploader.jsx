"use client";

import { useRef, useState } from "react";
import { uploadContentImage } from "@/app/admin/contenido/upload-action";

export default function ImageUploader({ name, defaultValue, label = "Imagen" }) {
  const imgRef = useRef(null);
  const [storedUrl, setStoredUrl] = useState(defaultValue ?? "");
  const [hasImage, setHasImage] = useState(!!defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPending(false);

    // Manipulación directa del DOM — garantiza que el preview cambia sin depender de React
    const objectUrl = URL.createObjectURL(file);
    if (imgRef.current) {
      imgRef.current.src = objectUrl;
    }
    setHasImage(true);
    setIsUploading(true);

    const fd = new FormData();
    fd.append("file", file);
    if (storedUrl) fd.append("oldUrl", storedUrl);

    uploadContentImage(fd)
      .then(({ url }) => {
        setStoredUrl(url);
        setPending(true);
        URL.revokeObjectURL(objectUrl);
      })
      .catch((err) => {
        setError(err.message ?? "No se pudo subir la imagen. Intenta de nuevo.");
        // Revert preview to original
        if (imgRef.current) {
          imgRef.current.src = defaultValue ?? "";
        }
        setHasImage(!!defaultValue);
        setStoredUrl(defaultValue ?? "");
        URL.revokeObjectURL(objectUrl);
      })
      .finally(() => {
        setIsUploading(false);
        e.target.value = "";
      });
  }

  const inputId = `img-upload-${name}`;

  return (
    <div className="space-y-2">
      <span className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
        {label}
      </span>

      <input type="hidden" name={name} value={storedUrl} />

      <div className="flex items-start gap-4">
        <label
          htmlFor={inputId}
          className="relative flex-shrink-0 w-32 h-32 rounded-xl border-2 border-dashed border-gray-200
            bg-gray-50 overflow-hidden flex items-center justify-center cursor-pointer
            hover:border-[#872075] transition-colors group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={defaultValue || null}
            alt="Vista previa"
            className={`w-full h-full object-cover ${hasImage ? "block" : "hidden"}`}
            onError={() => setHasImage(false)}
          />
          {!hasImage && (
            <i className="fa-solid fa-image text-3xl text-gray-300 group-hover:text-[#872075] transition-colors" aria-hidden="true" />
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
              <i className="fa-solid fa-circle-notch fa-spin text-white text-xl" aria-hidden="true" />
              <span className="text-white text-[10px] font-semibold">Subiendo…</span>
            </div>
          )}
          {!isUploading && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <i className="fa-solid fa-camera text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </div>
          )}
        </label>

        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        <div className="space-y-2 pt-2">
          <p className="text-xs text-gray-500">Haz clic en la imagen para cambiarla</p>
          <p className="text-[11px] text-gray-400">JPG, PNG, WebP o GIF · máx. 5 MB</p>
          {error && (
            <p className="text-[11px] text-red-500 flex items-center gap-1">
              <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
              {error}
            </p>
          )}
          {pending && !isUploading && (
            <p className="text-[11px] text-amber-600 flex items-center gap-1">
              <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
              Presiona <strong>Guardar cambios</strong> para aplicar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
