import aiLogsData from "@/services/mockData/aiLogs.json";

export const aiLogsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [...aiLogsData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const log = aiLogsData.find(log => log.Id === parseInt(id));
    if (!log) {
      throw new Error("AI log not found");
    }
    return { ...log };
  },

  async getByAppId(appId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return aiLogsData.filter(log => log.appId === appId).map(log => ({ ...log }));
  },

  async create(logData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newLog = {
      ...logData,
      Id: Math.max(...aiLogsData.map(log => log.Id)) + 1
    };
    aiLogsData.push(newLog);
    return { ...newLog };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = aiLogsData.findIndex(log => log.Id === parseInt(id));
    if (index === -1) {
      throw new Error("AI log not found");
    }
    aiLogsData[index] = { ...aiLogsData[index], ...updates };
    return { ...aiLogsData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = aiLogsData.findIndex(log => log.Id === parseInt(id));
    if (index === -1) {
      throw new Error("AI log not found");
    }
    aiLogsData.splice(index, 1);
    return { success: true };
  }
};