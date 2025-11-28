import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import { cn } from '@/utils/cn';
import * as linkService from '@/services/api/linkService';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';

/**
 * Links Manager - Complete CRUD interface for links management
 * Integrates with ApperClient for database operations
 */
const LinksManager = () => {
  // State management
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    url_c: '',
    description_c: '',
    status_c: 'Active',
    expiration_date_c: '',
    clicks_c: 0,
    notes_c: '',
    Tags: ''
  });

  // Load links on component mount
  useEffect(() => {
    loadLinks();
  }, []);

  /**
   * Load all links from database
   */
  const loadLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await linkService.getAll();
      setLinks(data);
    } catch (err) {
      setError('Failed to load links');
      console.error('Error loading links:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle search functionality
   */
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      loadLinks();
      return;
    }
    
    setLoading(true);
    try {
      const results = await linkService.search(query);
      setLinks(results);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle status filter
   */
  const handleStatusFilter = async (status) => {
    setStatusFilter(status);
    if (status === 'all') {
      loadLinks();
      return;
    }

    setLoading(true);
    try {
      const results = await linkService.getByStatus(status);
      setLinks(results);
    } catch (err) {
      console.error('Filter error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.Name.trim() || !formData.url_c.trim()) {
      toast.error('Name and URL are required');
      return;
    }

    try {
      if (editingLink) {
        const updated = await linkService.update(editingLink.Id, formData);
        if (updated) {
          setLinks(prev => prev.map(link => 
            link.Id === editingLink.Id ? { ...link, ...updated } : link
          ));
        }
      } else {
        const created = await linkService.create(formData);
        if (created) {
          setLinks(prev => [created, ...prev]);
        }
      }
      
      resetForm();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  /**
   * Handle edit action
   */
  const handleEdit = (link) => {
    setEditingLink(link);
    setFormData({
      Name: link.Name || '',
      url_c: link.url_c || '',
      description_c: link.description_c || '',
      status_c: link.status_c || 'Active',
      expiration_date_c: link.expiration_date_c || '',
      clicks_c: link.clicks_c || 0,
      notes_c: link.notes_c || '',
      Tags: link.Tags || ''
    });
    setShowForm(true);
  };

  /**
   * Handle delete action
   */
  const handleDelete = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this link?')) {
      return;
    }

    const success = await linkService.deleteLink(linkId);
    if (success) {
      setLinks(prev => prev.filter(link => link.Id !== linkId));
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setShowForm(false);
    setEditingLink(null);
    setFormData({
      Name: '',
      url_c: '',
      description_c: '',
      status_c: 'Active',
      expiration_date_c: '',
      clicks_c: 0,
      notes_c: '',
      Tags: ''
    });
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Get status badge variant
   */
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Pending': return 'outline';
      default: return 'secondary';
    }
  };

  /**
   * Open URL in new tab
   */
  const openUrl = (url) => {
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading && links.length === 0) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-400 text-center">{error}</div>
        <div className="text-center mt-4">
          <Button onClick={loadLinks} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Links Manager</h1>
          <p className="text-slate-400">Manage your links and track their performance</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="mt-4 md:mt-0"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Link
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <ApperIcon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Search links by name or URL..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </Select>
      </div>

      {/* Links Grid */}
      {links.length === 0 ? (
        <Empty 
          message="No links found"
          action={
            <Button onClick={() => setShowForm(true)} variant="outline">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create First Link
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {links.map((link) => (
              <motion.div
                key={link.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-200"
              >
                {/* Link Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-100 truncate">
                      {link.Name}
                    </h3>
                    <p className="text-sm text-blue-400 truncate cursor-pointer hover:underline mt-1"
                       onClick={() => openUrl(link.url_c)}>
                      {link.url_c}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(link.status_c)}>
                    {link.status_c}
                  </Badge>
                </div>

                {/* Description */}
                {link.description_c && (
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {link.description_c}
                  </p>
                )}

                {/* Metrics */}
                <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="MousePointer" size={14} />
                    <span>{link.clicks_c || 0} clicks</span>
                  </div>
                  {link.CreatedOn && (
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Clock" size={14} />
                      <span>{formatDistanceToNow(new Date(link.CreatedOn), { addSuffix: true })}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {link.Tags && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {link.Tags.split(',').slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                    {link.Tags.split(',').length > 3 && (
                      <span className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded">
                        +{link.Tags.split(',').length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openUrl(link.url_c)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <ApperIcon name="ExternalLink" size={14} />
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(link)}
                      className="text-slate-400 hover:text-slate-300"
                    >
                      <ApperIcon name="Edit2" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(link.Id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-100">
                  {editingLink ? 'Edit Link' : 'Create New Link'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className="text-slate-400 hover:text-slate-300"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Name *
                    </label>
                    <Input
                      value={formData.Name}
                      onChange={(e) => handleInputChange('Name', e.target.value)}
                      placeholder="Enter link name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Status
                    </label>
                    <Select
                      value={formData.status_c}
                      onChange={(e) => handleInputChange('status_c', e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    URL *
                  </label>
                  <Input
                    type="url"
                    value={formData.url_c}
                    onChange={(e) => handleInputChange('url_c', e.target.value)}
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={formData.description_c}
                    onChange={(e) => handleInputChange('description_c', e.target.value)}
                    placeholder="Brief description of the link"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tags
                    </label>
                    <Input
                      value={formData.Tags}
                      onChange={(e) => handleInputChange('Tags', e.target.value)}
                      placeholder="tag1,tag2,tag3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Expiration Date
                    </label>
                    <Input
                      type="date"
                      value={formData.expiration_date_c}
                      onChange={(e) => handleInputChange('expiration_date_c', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Notes
                  </label>
                  <Textarea
                    value={formData.notes_c}
                    onChange={(e) => handleInputChange('notes_c', e.target.value)}
                    placeholder="Additional notes or comments"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingLink ? 'Update Link' : 'Create Link'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LinksManager;