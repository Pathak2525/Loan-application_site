import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { RotateCcw } from 'lucide-react';

export default function SignaturePad({ value, onChange, error }) {
  const padRef = useRef(null);

  function handleEnd() {
    if (padRef.current?.isEmpty()) {
      onChange('');
      return;
    }
    const dataUrl = padRef.current.getTrimmedCanvas().toDataURL('image/png');
    onChange(dataUrl);
  }

  function handleClear() {
    padRef.current?.clear();
    onChange('');
  }

  return (
    <div>
      <p className="field-label">Sign in the box below</p>
      <div className={`rounded-xl border bg-white ${error ? 'border-danger-600' : 'border-ink-100'}`}>
        <SignatureCanvas
          ref={padRef}
          penColor="#16324F"
          canvasProps={{ className: 'w-full h-40 rounded-xl' }}
          onEnd={handleEnd}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="field-hint">Use your mouse, trackpad, or finger on a touchscreen.</p>
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-1 text-xs font-medium text-ink-500 hover:text-ink-700"
        >
          <RotateCcw size={13} /> Clear
        </button>
      </div>
      {error && <p className="field-error">{error.message}</p>}
      {value && (
        <div className="mt-3 rounded-lg border border-ink-100 bg-sand-50 p-2">
          <p className="mb-1 text-xs text-ink-500">Preview</p>
          <img src={value} alt="Signature preview" className="h-16" />
        </div>
      )}
    </div>
  );
}
