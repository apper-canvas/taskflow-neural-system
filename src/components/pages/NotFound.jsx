import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name="Search" className="w-12 h-12 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
          <p className="text-slate-600">
            Looks like this page got completed and archived! Let's get you back to your tasks.
          </p>
        </div>
        <Link to="/">
          <Button className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3">
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Tasks
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;