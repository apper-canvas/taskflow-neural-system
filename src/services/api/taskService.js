import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'tasks_c';

// Helper function to prepare task data for API (only updateable fields)
const prepareTaskForApi = (taskData) => {
  const apiData = {};
  
  // Map form fields to database fields (only updateable ones)
  if (taskData.title_c !== undefined) apiData.title_c = taskData.title_c;
  if (taskData.description_c !== undefined) apiData.description_c = taskData.description_c;
  if (taskData.priority_c !== undefined) apiData.priority_c = taskData.priority_c;
  if (taskData.due_date_c !== undefined) apiData.due_date_c = taskData.due_date_c;
  if (taskData.completed_c !== undefined) apiData.completed_c = taskData.completed_c;
  if (taskData.completed_at_c !== undefined) apiData.completed_at_c = taskData.completed_at_c;
  if (taskData.attachments_c !== undefined) apiData.attachments_c = taskData.attachments_c;
  if (taskData.Tags !== undefined) apiData.Tags = taskData.Tags;
  
  return apiData;
};

export const taskService = {
  // Get all tasks
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "attachments_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "Owner"}}
        ],
        orderBy: [{
          "fieldName": "CreatedOn",
          "sorttype": "DESC"
        }]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error('Failed to fetch tasks:', response.message);
        toast.error(response.message);
        return [];
      }

      // Handle empty or non-existent data
      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error?.message || error);
      return [];
    }
  },

  // Get task by ID
  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "attachments_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "Owner"}}
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch task ${id}:`, response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.message || error);
      return null;
    }
  },

  // Create new task
  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const preparedData = prepareTaskForApi(taskData);
      
      const params = {
        records: [preparedData]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error('Failed to create task:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Task created successfully!');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating task:', error?.message || error);
      toast.error('Failed to create task');
      return null;
    }
  },

  // Update existing task
  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const preparedData = prepareTaskForApi(taskData);
      preparedData.Id = parseInt(id);
      
      const params = {
        records: [preparedData]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error('Failed to update task:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Task updated successfully!');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating task:', error?.message || error);
      toast.error('Failed to update task');
      return null;
    }
  },

  // Delete task
  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error('Failed to delete task:', response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Task deleted successfully!');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting task:', error?.message || error);
      toast.error('Failed to delete task');
      return false;
    }
  }
};