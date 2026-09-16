import { useRef, useState } from 'react';
import { UploadCloud, FileText, X, Loader2 } from 'lucide-react';
import { compressIfImage, fileToDataUrl, formatBytes } from '../utils/compression.js';

export default function FileUpload({ label, hint, error, value, onChange }) {
  const inputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  async function handleFiles(fileList) {
    const file = fileList?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const processed = await compressIfImage(file);
      const previewUrl = processed.type.startsWith('image/') ? await fileToDataUrl(processed) : null;
      onChange({
        name: processed.name,
        size: processed.size,
        type: processed.type,
        previewUrl,
      });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div>
      <p className="field-label">{label}</p>
      {!value ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={[
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition',
            dragActive ? 'border-teal-500 bg-teal-100/40' : 'border-ink-100 bg-sand-50 hover:bg-sand-100',
            error && 'border-danger-600',
          ].join(' ')}
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin text-teal-600" size={28} />
              <p className="text-sm text-ink-500">Optimising file…</p>
            </>
          ) : (
            <>
              <UploadCloud className="text-ink-500" size={28} />
              <p className="text-sm text-ink-700">
                <span className="font-medium text-teal-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-ink-500">JPG, PNG or PDF, up to 10MB</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-3">
          {value.previewUrl ? (
            <img src={value.previewUrl} alt={value.name} className="h-14 w-14 rounded-lg object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-sand-100">
              <FileText className="text-ink-500" size={22} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink-900">{value.name}</p>
            <p className="text-xs text-ink-500">{formatBytes(value.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-full p-1.5 text-ink-500 hover:bg-sand-100"
            aria-label={`Remove ${label}`}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && <p className="field-error">{error.message}</p>}
    </div>
  );
}
