/**
 * Attention Economy Navigator
 * Storage Manager
 * 
 * Handles local storage operations for saving and retrieving analysis data
 */

const StorageManager = (function() {
    // Constants
    const STORAGE_KEY = 'attention-economy-navigator-data';
    
    /**
     * Initialize the Storage Manager
     */
    function init() {
        console.log('Storage Manager initialized');
        
        // Check if local storage is available
        if (!isLocalStorageAvailable()) {
            console.error('Local storage is not available. Data saving will not work.');
        }
    }
    
    /**
     * Check if local storage is available
     * @returns {boolean} Whether local storage is available
     */
    function isLocalStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Save analysis data to local storage
     * @param {Object} analysisData - Analysis data to save
     */
    function saveAnalysis(analysisData) {
        if (!isLocalStorageAvailable()) {
            console.error('Cannot save analysis: Local storage is not available');
            return false;
        }
        
        // Get existing saved analyses
        const savedAnalyses = getSavedAnalyses();
        
        // Add new analysis
        savedAnalyses.push(analysisData);
        
        // Save back to local storage
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAnalyses));
            return true;
        } catch (e) {
            console.error('Error saving analysis data:', e);
            return false;
        }
    }
    
    /**
     * Get all saved analyses from local storage
     * @returns {Array} Array of saved analyses
     */
    function getSavedAnalyses() {
        if (!isLocalStorageAvailable()) {
            console.error('Cannot retrieve analyses: Local storage is not available');
            return [];
        }
        
        // Get saved data
        const savedData = localStorage.getItem(STORAGE_KEY);
        
        // Parse and return saved analyses
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (e) {
                console.error('Error parsing saved analyses:', e);
                return [];
            }
        }
        
        return [];
    }
    
    /**
     * Delete a saved analysis from local storage
     * @param {number} index - Index of the analysis to delete
     * @returns {boolean} Whether the deletion was successful
     */
    function deleteAnalysis(index) {
        if (!isLocalStorageAvailable()) {
            console.error('Cannot delete analysis: Local storage is not available');
            return false;
        }
        
        // Get existing saved analyses
        const savedAnalyses = getSavedAnalyses();
        
        // Check if index is valid
        if (index < 0 || index >= savedAnalyses.length) {
            console.error('Invalid index for deletion:', index);
            return false;
        }
        
        // Remove analysis at the specified index
        savedAnalyses.splice(index, 1);
        
        // Save back to local storage
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAnalyses));
            return true;
        } catch (e) {
            console.error('Error saving after deletion:', e);
            return false;
        }
    }
    
    /**
     * Clear all saved analyses from local storage
     * @returns {boolean} Whether the clearing was successful
     */
    function clearAllAnalyses() {
        if (!isLocalStorageAvailable()) {
            console.error('Cannot clear analyses: Local storage is not available');
            return false;
        }
        
        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (e) {
            console.error('Error clearing analyses:', e);
            return false;
        }
    }
    
    /**
     * Export all saved analyses to a downloadable file
     */
    function exportAllAnalyses() {
        const savedAnalyses = getSavedAnalyses();
        
        if (savedAnalyses.length === 0) {
            console.error('No analyses to export');
            return false;
        }
        
        // Create JSON string from analyses
        const dataStr = JSON.stringify(savedAnalyses, null, 2);
        
        // Create downloadable file
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attention-economy-analyses.json';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        return true;
    }
    
    /**
     * Import analyses from a JSON file
     * @param {File} file - JSON file containing analyses data
     * @returns {Promise} Promise that resolves with the number of imported analyses
     */
    function importAnalyses(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject('No file provided');
                return;
            }
            
            if (file.type !== 'application/json') {
                reject('Invalid file type. Please select a JSON file.');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(event) {
                try {
                    const importedData = JSON.parse(event.target.result);
                    
                    // Validate imported data
                    if (!Array.isArray(importedData)) {
                        reject('Invalid data format. Expected an array of analyses.');
                        return;
                    }
                    
                    // Get existing analyses
                    const existingAnalyses = getSavedAnalyses();
                    
                    // Combine existing and imported analyses
                    const combinedAnalyses = [...existingAnalyses, ...importedData];
                    
                    // Save combined analyses
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(combinedAnalyses));
                    
                    resolve(importedData.length);
                } catch (e) {
                    reject('Error parsing import file: ' + e.message);
                }
            };
            
            reader.onerror = function() {
                reject('Error reading file');
            };
            
            reader.readAsText(file);
        });
    }
    
    // Public API
    return {
        init,
        saveAnalysis,
        getSavedAnalyses,
        deleteAnalysis,
        clearAllAnalyses,
        exportAllAnalyses,
        importAnalyses
    };
})();