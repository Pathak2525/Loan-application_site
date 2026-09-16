import { useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { lookupPincode } from '../utils/validation.js';

/**
 * Pairs with a `pincode` field: on blur, looks up city/state and calls
 * `onResolved({ city, state })` so the parent form can auto-fill those fields.
 */
export default function AddressAutocomplete({ pincode, onResolved }) {
  const [status, setStatus] = useState('idle'); // idle | loading | found | notfound

  async function handleLookup() {
    if (!/^\d{6}$/.test(pincode || '')) return;
    setStatus('loading');
    const result = await lookupPincode(pincode);
    if (result) {
      onResolved(result);
      setStatus('found');
    } else {
      setStatus('notfound');
    }
  }

  return (
    <div className="mt-1.5 flex items-center gap-2 text-xs">
      <button
        type="button"
        onClick={handleLookup}
        className="inline-flex items-center gap-1 font-medium text-teal-600 hover:text-teal-700"
      >
        {status === 'loading' ? <Loader2 size={13} className="animate-spin" /> : <MapPin size={13} />}
        Auto-fill city &amp; state from PIN code
      </button>
      {status === 'found' && <span className="text-teal-600">Address found</span>}
      {status === 'notfound' && <span className="text-danger-600">PIN code not recognised — enter manually</span>}
    </div>
  );
}
