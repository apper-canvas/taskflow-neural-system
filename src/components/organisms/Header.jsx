import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ taskCount = { total: 0, active: 0, completed: 0 } }) => {
  const completionRate = taskCount.total > 0 
    ? Math.round((taskCount.completed / taskCount.total) * 100) 
    : 0;

  return (
<motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-xl shadow-xl p-6 mb-6"
    >
      <div className="text-center">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Task Overview
          </h2>
          <p className="text-white/90">
            Track your productivity and progress
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-8"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {taskCount.active}
            </div>
            <div className="text-white/80 text-sm">Active</div>
          </div>
          
          <div className="w-px h-12 bg-white/20" />
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {taskCount.completed}
            </div>
            <div className="text-white/80 text-sm">Completed</div>
          </div>
          
          <div className="w-px h-12 bg-white/20" />
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {completionRate}%
            </div>
            <div className="text-white/80 text-sm">Progress</div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        {taskCount.total > 0 && (
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-4 w-full max-w-xs mx-auto"
          >
            <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-white/80 to-white rounded-full shadow-glow-success"
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Header;