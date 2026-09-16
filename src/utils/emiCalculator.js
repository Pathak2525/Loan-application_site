import { calculateEMI, rateForLoanType } from '../validation/schemas.js';

export { calculateEMI, rateForLoanType };

export function amortizationSummary(principal, annualRatePercent, tenureMonths) {
  const emi = calculateEMI(principal, annualRatePercent, tenureMonths);
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;
  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
  };
}

export function evaluatePreApproval({ loanType, monthlyIncome, loanAmount, tenureMonths, employmentType, yearsInJob }) {
  const rate = rateForLoanType(loanType);
  const { emi } = amortizationSummary(loanAmount, rate, tenureMonths);
  const emiToIncomeRatio = monthlyIncome > 0 ? emi / monthlyIncome : 1;

  let score = 100;
  if (emiToIncomeRatio > 0.5) score -= 45;
  else if (emiToIncomeRatio > 0.4) score -= 20;
  else if (emiToIncomeRatio > 0.3) score -= 5;

  if (employmentType === 'self-employed') score -= 5;
  if ((yearsInJob || 0) < 1) score -= 15;
  else if ((yearsInJob || 0) < 2) score -= 5;

  score = Math.max(0, Math.min(100, score));

  let status = 'approved';
  if (score < 45) status = 'declined';
  else if (score < 65) status = 'review';

  const maxEligibleEMI = monthlyIncome * 0.5;
  const maxEligibleAmount = estimateMaxPrincipal(maxEligibleEMI, rate, tenureMonths);

  return {
    status, 
    interestRate: rate,
    emi,
    emiToIncomeRatio,
    maxEligibleAmount: Math.round(maxEligibleAmount),
  };
}

function estimateMaxPrincipal(maxEmi, annualRatePercent, tenureMonths) {
  const r = annualRatePercent / 12 / 100;
  if (r === 0) return maxEmi * tenureMonths;
  return (maxEmi * (Math.pow(1 + r, tenureMonths) - 1)) / (r * Math.pow(1 + r, tenureMonths));
}
