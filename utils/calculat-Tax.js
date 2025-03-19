// calculate-Tax.js

/**
 * Calculate the tax amount based on income brackets.
 * @param {number} income - The total income for which tax is to be calculated.
 * @returns {string} - The calculated tax amount formatted to two decimal places.
 */
const calculateTax = (income) => {
  let taxAmount;

  // Calculate tax based on income brackets
  switch (true) {
    case income <= 600:
      taxAmount = 0;
      break;
    case income <= 1650:
      taxAmount = income * 0.1 - 60;
      break;
    case income <= 3200:
      taxAmount = income * 0.15 - 142.5;
      break;
    case income <= 5250:
      taxAmount = income * 0.2 - 302.5;
      break;
    case income <= 7800:
      taxAmount = income * 0.25 - 565;
      break;
    case income <= 10900:
      taxAmount = income * 0.3 - 955;
      break;
    default:
      taxAmount = income * 0.35 - 1500;
  }

  // Ensure taxAmount is a positive number and format to two decimal places
  return Math.max(taxAmount, 0).toFixed(2);
};

/**
 * Calculate the total income including salary, house, transport, and benefits.
 * Adjust transport if it exceeds a specified threshold.
 * @param {number} salary - The basic salary.
 * @param {number} house - The house allowance.
 * @param {number} transport - The transport allowance.
 * @param {number} benefit - Other benefits.
 * @returns {number} - The calculated total income.
 */
const calculateTotalIncome = (salary, house, transport, benefit) => {
  let adjustedTransport = transport > 600 ? transport - 600 : 0;

  const total = adjustedTransport + salary + house + benefit;
  return Math.max(total, 0);
};
const calculateEmployeeContribution = (salary) => {
  return (salary * 0.07).toFixed(2);
};

// Calculate Employer Contribution (11% of salary)
const calculateEmployerContribution = (salary) => {
  return (salary * 0.11).toFixed(2);
};

// Calculate Total Pension Contribution (Employee + Employer)
const calculateTotalPension = (salary) => {
  const employeeContribution = parseFloat(
    calculateEmployeeContribution(salary)
  );
  const employerContribution = parseFloat(
    calculateEmployerContribution(salary)
  );
  return (employeeContribution + employerContribution).toFixed(2);
};
const calculateCostSharing = (salary, cost_sharing) => {
  if (cost_sharing !== "yes") {
    return null; // Returning null to exclude it from display
  }
  return (salary * 0.1).toFixed(2);
};
module.exports = {
  calculateTax,
  calculateTotalIncome,
  calculateTotalPension,
  calculateEmployerContribution,
  calculateEmployeeContribution,
  calculateCostSharing,
};
