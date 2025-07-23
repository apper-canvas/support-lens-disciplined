import appsData from "@/services/mockData/apps.json";

export const appsService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...appsData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const app = appsData.find(app => app.Id === parseInt(id));
    if (!app) {
      throw new Error("App not found");
    }
    return { ...app };
  },

  async create(appData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newApp = {
      ...appData,
      Id: Math.max(...appsData.map(app => app.Id)) + 1
    };
    appsData.push(newApp);
    return { ...newApp };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = appsData.findIndex(app => app.Id === parseInt(id));
    if (index === -1) {
      throw new Error("App not found");
    }
    appsData[index] = { ...appsData[index], ...updates };
    return { ...appsData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = appsData.findIndex(app => app.Id === parseInt(id));
    if (index === -1) {
      throw new Error("App not found");
    }
    appsData.splice(index, 1);
    return { success: true };
  }
};