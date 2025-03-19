const db = require("../model/db");
const AppError = require("../utils/appError");
const EmployeeService = require("./employee-service");
const {
  calculateTax,
  calculateTotalIncome,
  calculateTotalPension,
  calculateEmployerContribution,
  calculateEmployeeContribution,
  calculateCostSharing,
} = require("../utils/calculat-Tax");

const tax = db.tax_monthly;
const get_branch = db.branches;
const gas_price = db.gas_prices;

class TaxService {
  constructor() {
    this.employeeService = new EmployeeService();
  }

  async findSubmittedBranches(month) {
    try {
      const branchIds = await tax.findAll({
        attributes: ["branch"],
        where: { month: month, status: "Submitted" },
        group: ["branch"],
      });

      const branchData = await Promise.all(
        branchIds.map(async (branchId) => {
          const branch = await this.getBranchDataById(branchId.branch);
          return {
            branchId: branchId.branch,
            branchName: branch ? branch.name : null,
          };
        })
      );

      return branchData;
    } catch (error) {
      throw new AppError(
        "Error occurred while fetching submitted branches.",
        500
      );
    }
  }

  async getBranchDataById(id) {
    try {
      return await get_branch.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
    } catch (error) {
      throw new AppError("Error occurred while fetching branch data.", 500);
    }
  }

  async getTaxInfoPermonth(month) {
    try {
      const taxPay = await tax.findAll({
        where: { month: month, status: "Submitted" },
      });

      return taxPay.map((taxRecord) => this.calculateTaxDetails(taxRecord));
    } catch (error) {
      throw new AppError("Error occurred while fetching tax information.", 500);
    }
  }

  async getTaxInfoByBranchPermonth(month, branch = null) {
    try {
      const whereCondition = { month: month, status: "Submitted" };
      if (branch) whereCondition.branch = branch;

      const taxPay = await tax.findAll({ where: whereCondition });

      return taxPay.map((taxRecord) => this.calculateTaxDetails(taxRecord));
    } catch (error) {
      throw new AppError("Error occurred while fetching tax information.", 500);
    }
  }

  calculateTaxDetails(taxRecord) {
    const totalSum = calculateTotalIncome(
      taxRecord.salary,
      taxRecord.house,
      taxRecord.transport,
      taxRecord.benefit
    );
    const totalTax = calculateTax(totalSum);
    const netPay = totalSum - totalTax;
    const employeeContribution = calculateEmployeeContribution(
      taxRecord.salary
    );
    const employerContribution = calculateEmployerContribution(
      taxRecord.salary
    );
    const totalPension = calculateTotalPension(taxRecord.salary);
    const costSharing = calculateCostSharing(
      taxRecord.salary,
      taxRecord.cost_sharing
    );

    return {
      ...taxRecord.toJSON(),
      totalSum,
      totalTax,
      netPay,
      employeeContribution,
      employerContribution,
      totalPension,
      costSharing,
    };
  }

  async gasPrice() {
    try {
      const data = await gas_price.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { status: true },
        order: [["createdAt", "DESC"]],
      });
      return data ? data.price : 0;
    } catch (error) {
      return 0;
    }
  }
}

module.exports = TaxService;
