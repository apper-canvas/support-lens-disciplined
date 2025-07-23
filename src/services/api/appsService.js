import appsData from "@/services/mockData/apps.json";

// In-memory storage for sales comments
let salesComments = [];
let nextCommentId = 1;

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
  },

  async addSalesComment(appId, content) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const comment = {
      Id: nextCommentId++,
      appId: parseInt(appId),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    salesComments.push(comment);
    return { ...comment };
  },

  async getSalesComments(appId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return salesComments
      .filter(comment => comment.appId === parseInt(appId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(comment => ({ ...comment }));
  },

  async updateSalesComment(commentId, updates) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = salesComments.findIndex(comment => comment.Id === parseInt(commentId));
    if (index === -1) {
      throw new Error("Comment not found");
    }
    
    salesComments[index] = {
      ...salesComments[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...salesComments[index] };
  },

  async deleteSalesComment(commentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = salesComments.findIndex(comment => comment.Id === parseInt(commentId));
    if (index === -1) {
      throw new Error("Comment not found");
    }
    salesComments.splice(index, 1);
    return { success: true };
  }
};