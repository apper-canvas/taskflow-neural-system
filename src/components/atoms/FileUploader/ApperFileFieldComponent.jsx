import React, { useEffect, useRef, useState, useMemo } from 'react';

const ApperFileFieldComponent = ({ elementId, config }) => {
  // State management
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Refs for lifecycle tracking
  const mountedRef = useRef(false);
  const elementIdRef = useRef(elementId);
  const existingFilesRef = useRef([]);

  // Update elementId ref when elementId changes
  useEffect(() => {
    elementIdRef.current = elementId;
  }, [elementId]);

  // Memoize existing files to detect actual changes
  const memoizedExistingFiles = useMemo(() => {
    if (!config?.existingFiles || !Array.isArray(config.existingFiles)) {
      return [];
    }

    // Compare with previous files to detect changes
    const currentFiles = config.existingFiles;
    const prevFiles = existingFilesRef.current;

    // Check if files have actually changed (by length and first file's ID/id)
    if (
      currentFiles.length !== prevFiles.length ||
      (currentFiles.length > 0 && prevFiles.length > 0 &&
       (currentFiles[0].Id !== prevFiles[0].Id && currentFiles[0].id !== prevFiles[0].id))
    ) {
      return currentFiles;
    }

    return prevFiles;
  }, [config?.existingFiles]);

  // Initial mount effect
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50;
    const checkInterval = 100;

    const initializeSdk = async () => {
      try {
        // Wait for ApperSDK to be available
        while (!window.ApperSDK && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, checkInterval));
          attempts++;
        }

        if (!window.ApperSDK) {
          throw new Error('ApperSDK not loaded. Please ensure the SDK script is included.');
        }

        const { ApperFileUploader } = window.ApperSDK;
        elementIdRef.current = `file-uploader-${elementId}`;

        // Mount the file field
        await ApperFileUploader.FileField.mount(elementIdRef.current, {
          ...config,
          existingFiles: memoizedExistingFiles
        });

        mountedRef.current = true;
        setIsReady(true);
        setError(null);

      } catch (error) {
        console.error('Failed to mount ApperFileFieldComponent:', error);
        setError(error.message);
        setIsReady(false);
      }
    };

    initializeSdk();

    // Cleanup function
    return () => {
      try {
        if (mountedRef.current && window.ApperSDK) {
          const { ApperFileUploader } = window.ApperSDK;
          ApperFileUploader.FileField.unmount(elementIdRef.current);
        }
        mountedRef.current = false;
        setIsReady(false);
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    };
  }, [elementId, config.fieldKey, config.tableName]);

  // File update effect
  useEffect(() => {
    if (!isReady || !window.ApperSDK || !config.fieldKey) return;

    const updateFiles = async () => {
      try {
        const { ApperFileUploader } = window.ApperSDK;
        
        // Check if files have actually changed
        const currentFiles = memoizedExistingFiles;
        const prevFiles = existingFilesRef.current;
        
        if (JSON.stringify(currentFiles) === JSON.stringify(prevFiles)) {
          return; // No changes
        }

        // Detect format (API format has .Id, UI format has .id)
        let filesToUpdate = currentFiles;
        if (currentFiles.length > 0 && currentFiles[0].Id) {
          // Convert from API format to UI format
          filesToUpdate = ApperFileUploader.toUIFormat(currentFiles);
        }

        // Update or clear files
        if (filesToUpdate.length > 0) {
          await ApperFileUploader.FileField.updateFiles(config.fieldKey, filesToUpdate);
        } else {
          await ApperFileUploader.FileField.clearField(config.fieldKey);
        }

        existingFilesRef.current = [...currentFiles];

      } catch (error) {
        console.error('Error updating files:', error);
        setError(error.message);
      }
    };

    updateFiles();
  }, [memoizedExistingFiles, isReady, config.fieldKey]);

  // Error UI
  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-md bg-red-50">
        <p className="text-red-600 text-sm">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!isReady && (
        <div className="p-4 text-center">
          <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
          <span className="ml-2 text-sm text-gray-600">Loading file uploader...</span>
        </div>
      )}
      <div id={`file-uploader-${elementId}`} className="w-full min-h-[120px]"></div>
    </div>
  );
};

export default ApperFileFieldComponent;