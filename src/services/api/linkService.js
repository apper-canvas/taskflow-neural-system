import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

/**
 * Link Service - ApperClient integration for links_c table
 * Handles CRUD operations with proper field visibility and data formatting
 */

const TABLE_NAME = 'links_c';

// Field definitions with visibility handling
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags', 
  'url_c',
  'description_c',
  'status_c',
  'expiration_date_c',
  'clicks_c',
  'notes_c'
];

const ALL_FIELDS = [
  ...UPDATEABLE_FIELDS,
  'Owner',
  'CreatedOn', 
  'CreatedBy',
  'ModifiedOn',
  'ModifiedBy'
];

/**
 * Prepare link data for API submission
 * Only includes updateable fields with non-empty values
 */
function prepareLinkForApi(linkData) {
  const prepared = {};
  
  UPDATEABLE_FIELDS.forEach(field => {
    const value = linkData[field];
    if (value !== undefined && value !== null && value !== '') {
      // Format data based on field type
      switch (field) {
        case 'clicks_c':
          prepared[field] = parseInt(value) || 0;
          break;
        case 'expiration_date_c':
          // Ensure proper date format
          if (value) {
            prepared[field] = value.includes('T') ? value.split('T')[0] : value;
          }
          break;
        default:
          prepared[field] = value;
      }
    }
  });
  
  return prepared;
}

/**
 * Get all links with pagination and filtering
 */
export const getAll = async (params = {}) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      throw new Error('ApperClient not initialized');
    }

    const requestParams = {
      fields: ALL_FIELDS.map(field => ({ field: { Name: field } })),
      orderBy: [{ fieldName: 'ModifiedOn', sorttype: 'DESC' }],
      pagingInfo: { limit: 50, offset: 0 },
      ...params
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, requestParams);

    if (!response.success) {
      console.error('Links fetch failed:', response.message);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching links:', error?.response?.data?.message || error);
    toast.error('Failed to load links');
    return [];
  }
};

/**
 * Get link by ID
 */
export const getById = async (id) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      throw new Error('ApperClient not initialized');
    }

    const params = {
      fields: ALL_FIELDS.map(field => ({ field: { Name: field } }))
    };

    const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);

    if (!response.success) {
      console.error('Link fetch failed:', response.message);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching link ${id}:`, error?.response?.data?.message || error);
    toast.error('Failed to load link details');
    return null;
  }
};

/**
 * Create new link
 */
export const create = async (linkData) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      throw new Error('ApperClient not initialized');
    }

    const preparedData = prepareLinkForApi(linkData);
    const params = {
      records: [preparedData]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);

    if (!response.success) {
      console.error('Link creation failed:', response.message);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} links:`, failed);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        toast.success('Link created successfully');
        return successful[0].data;
      }
    }

    return null;
  } catch (error) {
    console.error('Error creating link:', error?.response?.data?.message || error);
    toast.error('Failed to create link');
    return null;
  }
};

/**
 * Update existing link
 */
export const update = async (id, linkData) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      throw new Error('ApperClient not initialized');
    }

    const preparedData = prepareLinkForApi(linkData);
    preparedData.Id = parseInt(id);

    const params = {
      records: [preparedData]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);

    if (!response.success) {
      console.error('Link update failed:', response.message);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} links:`, failed);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        toast.success('Link updated successfully');
        return successful[0].data;
      }
    }

    return null;
  } catch (error) {
    console.error('Error updating link:', error?.response?.data?.message || error);
    toast.error('Failed to update link');
    return null;
  }
};

/**
 * Delete link
 */
export const deleteLink = async (id) => {
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
      console.error('Link deletion failed:', response.message);
      toast.error(response.message);
      return false;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} links:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        toast.success('Link deleted successfully');
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error deleting link:', error?.response?.data?.message || error);
    toast.error('Failed to delete link');
    return false;
  }
};

/**
 * Get links by status filter
 */
export const getByStatus = async (status) => {
  try {
    const params = {
      where: [{
        FieldName: 'status_c',
        Operator: 'EqualTo',
        Values: [status]
      }]
    };

    return await getAll(params);
  } catch (error) {
    console.error('Error fetching links by status:', error);
    return [];
  }
};

/**
 * Search links by name or URL
 */
export const search = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return await getAll();
    }

    const params = {
      whereGroups: [{
        operator: "OR",
        subGroups: [{
          conditions: [
            {
              fieldName: "Name",
              operator: "Contains",
              values: [query.trim()]
            },
            {
              fieldName: "url_c", 
              operator: "Contains",
              values: [query.trim()]
            }
          ],
          operator: "OR"
        }]
      }]
    };

    return await getAll(params);
  } catch (error) {
    console.error('Error searching links:', error);
    return [];
  }
};