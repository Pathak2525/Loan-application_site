import { z } from 'zod';

// ---------- Step 1: Loan type ----------
export const loanTypeSchema = z.object({
  loanType: z.enum(['personal', 'home', 'business'], {
    errorMap: () => ({ message: 'Please select a loan type to continue.' }),
  }),
});


const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const aadhaarRegex = /^\d{12}$/;

export const personalDetailsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Enter your full name as per ID proof.')
    .max(80, 'That name looks too long — check for typos.'),
  dob: z
    .string()
    .min(1, 'Date of birth is required.')
    .refine((val) => {
      const age = (Date.now() - new Date(val).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return age >= 21 && age <= 65;
    }, 'Applicant must be between 21 and 65 years old.'),
  gender: z.enum(['female', 'male', 'other'], {
    errorMap: () => ({ message: 'Please select an option.' }),
  }),
  panNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(panRegex, 'Enter a valid PAN, e.g. ABCDE1234F.'),
  aadhaarNumber: z
    .string()
    .trim()
    .regex(aadhaarRegex, 'Aadhaar number must be exactly 12 digits.'),
});

// ---------- Step 3: Contact details ----------
export const contactDetailsSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number.'),
  alternatePhone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit number.')
    .optional()
    .or(z.literal('')),
});

// ---------- Step 4: Address ----------
export const addressDetailsSchema = z.object({
  pincode: z.string().trim().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code.'),
  addressLine1: z.string().trim().min(5, 'Enter your house/flat number and street.'),
  addressLine2: z.string().trim().optional().or(z.literal('')),
  city: z.string().trim().min(2, 'City is required.'),
  state: z.string().trim().min(2, 'State is required.'),
  residenceType: z.enum(['owned', 'rented', 'family'], {
    errorMap: () => ({ message: 'Please select your residence type.' }),
  }),
});

// ---------- Step 5: Employment & income (fields shift with loan type) ----------
export const employmentDetailsSchema = z
  .object({
    loanType: z.enum(['personal', 'home', 'business']),
    employmentType: z.enum(['salaried', 'self-employed'], {
      errorMap: () => ({ message: 'Please select employment type.' }),
    }),
    employerName: z.string().trim().min(2, 'This field is required.'),
    monthlyIncome: z.coerce
      .number({ invalid_type_error: 'Enter a number.' })
      .positive('Monthly income must be greater than 0.'),
    yearsInJob: z.coerce
      .number({ invalid_type_error: 'Enter a number.' })
      .min(0, 'Cannot be negative.')
      .max(50, 'Check this value.'),
    // Business-loan-only fields
    businessName: z.string().trim().optional().or(z.literal('')),
    businessVintageYears: z.coerce.number().optional(),
    gstNumber: z.string().trim().optional().or(z.literal('')),
    annualTurnover: z.coerce.number().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.loanType === 'business') {
      if (!val.businessName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['businessName'], message: 'Business name is required for a business loan.' });
      }
      if (!val.annualTurnover || val.annualTurnover <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['annualTurnover'], message: 'Annual turnover is required.' });
      }
      if (val.gstNumber && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/.test(val.gstNumber)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['gstNumber'], message: 'Enter a valid 15-character GSTIN.' });
      }
    }
  });

// ---------- Step 6: Loan details (fields + limits shift with loan type) ----------
export const loanDetailsSchema = z
  .object({
    loanType: z.enum(['personal', 'home', 'business']),
    loanAmount: z.coerce
      .number({ invalid_type_error: 'Enter a number.' })
      .positive('Loan amount must be greater than 0.'),
    tenureMonths: z.coerce
      .number({ invalid_type_error: 'Enter a number.' })
      .int('Tenure must be a whole number of months.')
      .min(6, 'Minimum tenure is 6 months.')
      .max(360, 'Maximum tenure is 360 months.'),
    purpose: z.string().trim().min(3, 'Tell us what the loan is for.'),
    // Home-loan-only
    propertyValue: z.coerce.number().optional(),
    downPayment: z.coerce.number().optional(),
    propertyCity: z.string().trim().optional().or(z.literal('')),
  })
  .superRefine((val, ctx) => {
    if (val.loanType === 'personal' && val.loanAmount > 2500000) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['loanAmount'], message: 'Personal loans are capped at ₹25,00,000.' });
    }
    if (val.loanType === 'business' && val.loanAmount > 20000000) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['loanAmount'], message: 'Business loans are capped at ₹2,00,00,000.' });
    }
    if (val.loanType === 'home') {
      if (!val.propertyValue || val.propertyValue <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['propertyValue'], message: 'Property value is required for a home loan.' });
      }
      if (val.propertyValue && val.loanAmount > val.propertyValue * 0.9) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['loanAmount'],
          message: 'Loan amount cannot exceed 90% of the property value (LTV limit).',
        });
      }
      if (val.downPayment && val.propertyValue && val.downPayment >= val.propertyValue) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['downPayment'], message: 'Down payment must be less than the property value.' });
      }
    }
  });

// ---------- Step 7: Documents ----------
export const documentsSchema = z.object({
  idProof: z.any().refine((f) => !!f, 'ID proof is required.'),
  addressProof: z.any().refine((f) => !!f, 'Address proof is required.'),
  incomeProof: z.any().refine((f) => !!f, 'Income proof is required.'),
});

// ---------- Step 8: Verification ----------
export const verificationSchema = z.object({
  panVerified: z.literal(true, { errorMap: () => ({ message: 'Please verify your PAN before continuing.' }) }),
  aadhaarVerified: z.literal(true, { errorMap: () => ({ message: 'Please verify your Aadhaar before continuing.' }) }),
});

// ---------- Step 9: Signature ----------
export const signatureSchema = z.object({
  signatureDataUrl: z.string().min(1, 'Please sign in the box before continuing.'),
  consent: z.literal(true, { errorMap: () => ({ message: 'You must accept the declaration to submit.' }) }),
});


export function crossStepValidate(fullData) {
  const errors = [];
  const income = Number(fullData.employmentDetails?.monthlyIncome || 0);
  const amount = Number(fullData.loanDetails?.loanAmount || 0);
  const tenure = Number(fullData.loanDetails?.tenureMonths || 0);
  const rate = rateForLoanType(fullData.loanType?.loanType);

  if (income > 0 && amount > 0 && tenure > 0) {
    const emi = calculateEMI(amount, rate, tenure);
    if (emi > income * 0.5) {
      errors.push(
        `Estimated EMI (₹${Math.round(emi).toLocaleString('en-IN')}) exceeds 50% of your declared monthly income. Consider a longer tenure or a smaller amount.`
      );
    }
  }

  if (
    fullData.loanType?.loanType === 'home' &&
    fullData.loanDetails?.propertyValue &&
    fullData.loanDetails?.loanAmount > fullData.loanDetails.propertyValue * 0.9
  ) {
    errors.push('Loan amount exceeds the 90% LTV limit for the declared property value.');
  }

  const age = fullData.personalDetails?.dob
    ? (Date.now() - new Date(fullData.personalDetails.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    : null;
  if (age !== null && tenure > 0) {
    const ageAtMaturity = age + tenure / 12;
    if (ageAtMaturity > 65) {
      errors.push('Your age at loan maturity exceeds 65 years — please reduce the tenure.');
    }
  }

  return errors;
}

export function rateForLoanType(loanType) {
  switch (loanType) {
    case 'home':
      return 8.5;
    case 'business':
      return 13.5;
    case 'personal':
    default:
      return 11.5;
  }
}

export function calculateEMI(principal, annualRatePercent, tenureMonths) {
  const r = annualRatePercent / 12 / 100;
  if (r === 0) return principal / tenureMonths;
  const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
  return emi;
}
