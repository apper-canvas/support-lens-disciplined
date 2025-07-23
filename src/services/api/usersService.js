import usersData from "@/services/mockData/users.json";

export const usersService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...usersData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = usersData.find(user => user.Id === parseInt(id));
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  },

  async create(userData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newUser = {
      ...userData,
      Id: Math.max(...usersData.map(user => user.Id)) + 1
    };
    usersData.push(newUser);
    return { ...newUser };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = usersData.findIndex(user => user.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    usersData[index] = { ...usersData[index], ...updates };
    return { ...usersData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = usersData.findIndex(user => user.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    usersData.splice(index, 1);
    return { success: true };
  }
};