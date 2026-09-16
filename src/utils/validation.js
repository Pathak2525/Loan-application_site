
function fakeLatency(min = 900, max = 1800) {
  const ms = Math.floor(Math.random() * (max - min)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function verifyPAN(panNumber, fullName) {
  await fakeLatency();
  const isValidFormat = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber);
  if (!isValidFormat) {
    return { verified: false, message: 'PAN format looks incorrect.' };
  }
 
  if (panNumber.startsWith('AAAAA')) {
    return { verified: false, message: 'PAN could not be verified. Please check the number and try again.' };
  }
  return {
    verified: true,
    message: 'PAN verified successfully.',
    matchedName: fullName || 'Name on record',
  };
}

export async function verifyAadhaar(aadhaarNumber) {
  await fakeLatency(1000, 2000);
  const isValidFormat = /^\d{12}$/.test(aadhaarNumber);
  if (!isValidFormat) {
    return { verified: false, message: 'Aadhaar number must be 12 digits.' };
  }
  if (aadhaarNumber.startsWith('000000')) {
    return { verified: false, message: 'Aadhaar could not be verified. Please re-check the number.' };
  }
  return { verified: true, message: 'Aadhaar verified successfully.' };
}

const PIN_DIRECTORY = {
  '110001': { city: 'New Delhi', state: 'Delhi' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '560001': { city: 'Bengaluru', state: 'Karnataka' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat' },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '500001': { city: 'Hyderabad', state: 'Telangana' },
  '411001': { city: 'Pune', state: 'Maharashtra' },
  '302001': { city: 'Jaipur', state: 'Rajasthan' },
};

export async function lookupPincode(pincode) {
  await fakeLatency(300, 700);
  if (!/^\d{6}$/.test(pincode)) return null;
  return PIN_DIRECTORY[pincode] || null;
}
