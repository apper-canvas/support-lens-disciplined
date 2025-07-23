import reportsData from "@/services/mockData/reports.json";

export const reportsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...reportsData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const report = reportsData.find(report => report.Id === parseInt(id));
    if (!report) {
      throw new Error("Report not found");
    }
    return { ...report };
  },

  async create(reportData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newReport = {
      ...reportData,
      Id: Math.max(...reportsData.map(report => report.Id)) + 1
    };
    reportsData.push(newReport);
    return { ...newReport };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = reportsData.findIndex(report => report.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Report not found");
    }
    reportsData[index] = { ...reportsData[index], ...updates };
    return { ...reportsData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = reportsData.findIndex(report => report.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Report not found");
    }
    reportsData.splice(index, 1);
    return { success: true };
  },

  async runReport(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = reportsData.findIndex(report => report.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Report not found");
    }
    
    // Simulate report running
    reportsData[index].status = "running";
    reportsData[index].lastRun = new Date().toISOString();
    
    // Simulate completion after delay
    setTimeout(() => {
      reportsData[index].status = "completed";
    }, 3000);
    
    return { ...reportsData[index] };
  }
};