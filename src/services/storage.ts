import { Child, TimeEntry } from "../types";
import { api } from "./api";

export const StorageService = {
  // Password Management
  async setPassword(password: string): Promise<void> {
    await api.auth.setup(password);
  },

  async verifyPassword(password: string): Promise<boolean> {
    try {
      await api.auth.login(password);
      return true;
    } catch (error) {
      return false;
    }
  },

  async hasPassword(): Promise<boolean> {
    try {
      const response = await api.auth.hasPassword();
      return response.hasPassword;
    } catch (error) {
      console.error("Error checking password:", error);
      return false;
    }
  },

  async checkAuth(): Promise<boolean> {
    try {
      const response = await api.auth.check();
      return response.isAuthenticated;
    } catch (error) {
      console.error("Error checking auth:", error);
      return false;
    }
  },

  // Children Management
  async getChildren(): Promise<Child[]> {
    try {
      return await api.children.getAll();
    } catch (error) {
      console.error("Error getting children:", error);
      return [];
    }
  },

  async addChild(child: Child): Promise<void> {
    await api.children.create(child);
  },

  async updateChild(updatedChild: Child): Promise<void> {
    await api.children.update(updatedChild.id, updatedChild);
  },

  async deleteChild(childId: string): Promise<void> {
    await api.children.delete(childId);
  },

  // Time Entries Management
  async getTimeEntries(): Promise<TimeEntry[]> {
    // Get all entries - we'll use a large date range
    const startDate = "2020-01-01";
    const endDate = "2099-12-31";
    try {
      return await api.entries.getByDateRange(startDate, endDate);
    } catch (error) {
      console.error("Error getting entries:", error);
      return [];
    }
  },

  async getTimeEntry(
    childId: string,
    date: string,
  ): Promise<TimeEntry | undefined> {
    try {
      return await api.entries.getByChildAndDate(childId, date);
    } catch (error) {
      // 404 is expected if entry doesn't exist
      return undefined;
    }
  },

  async saveTimeEntry(entry: TimeEntry): Promise<void> {
    await api.entries.save(entry);
  },

  async getEntriesForDateRange(
    startDate: string,
    endDate: string,
  ): Promise<TimeEntry[]> {
    try {
      return await api.entries.getByDateRange(startDate, endDate);
    } catch (error) {
      console.error("Error getting entries for date range:", error);
      return [];
    }
  },
};
