/**
 * Attention Economy Navigator
 * Main Application Script
 */

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Attention Economy Navigator initialized');
    
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize UI Controller
    UIController.init();
    
    // Initialize Storage Manager
    StorageManager.init();
    
    // Event Listeners
    setupEventListeners();
});

/**
 * Set up all event listeners for the application
 */
function setupEventListeners() {
    // Tab navigation buttons
    document.querySelectorAll('.next-tab, .prev-tab').forEach(button => {
        button.addEventListener('click', function() {
            const targetTabId = this.getAttribute('data-target');
            const targetTab = document.getElementById(targetTabId);
            const tabInstance = new bootstrap.Tab(targetTab);
            tabInstance.show();
        });
    });
    
    // Start analysis button
    document.getElementById('start-analysis').addEventListener('click', function() {
        const inputTab = document.getElementById('input-tab');
        const tabInstance = new bootstrap.Tab(inputTab);
        tabInstance.show();
    });
    
    // Add platform button
    document.getElementById('add-platform').addEventListener('click', function() {
        UIController.addNewPlatform();
    });
    
    // Run analysis button
    document.getElementById('run-analysis').addEventListener('click', function() {
        runAnalysis();
    });
    
    // Save analysis button
    document.getElementById('save-analysis').addEventListener('click', function() {
        const saveModal = new bootstrap.Modal(document.getElementById('saveAnalysisModal'));
        saveModal.show();
    });
    
    // Confirm save button in modal
    document.getElementById('confirm-save').addEventListener('click', function() {
        const analysisName = document.getElementById('analysis-name').value;
        const analysisNotes = document.getElementById('analysis-notes').value;
        
        if (!analysisName) {
            alert('Please enter a name for your analysis');
            return;
        }
        
        const analysisData = {
            name: analysisName,
            notes: analysisNotes,
            date: new Date().toISOString(),
            platformData: UIController.getAllPlatformData(),
            audienceData: UIController.getAllAudienceData(),
            analysisResults: AnalysisEngine.getResults()
        };
        
        StorageManager.saveAnalysis(analysisData);
        
        const saveModal = bootstrap.Modal.getInstance(document.getElementById('saveAnalysisModal'));
        saveModal.hide();
        
        // Show success message
        UIController.showNotification('Analysis saved successfully', 'success');
    });
    
    // Load analysis button
    document.getElementById('load-analysis').addEventListener('click', function() {
        // Populate the list of saved analyses
        const analysesList = document.getElementById('analyses-list');
        analysesList.innerHTML = '';
        
        const savedAnalyses = StorageManager.getSavedAnalyses();
        
        if (savedAnalyses.length === 0) {
            document.getElementById('no-saved-analyses').style.display = 'block';
        } else {
            document.getElementById('no-saved-analyses').style.display = 'none';
            
            savedAnalyses.forEach((analysis, index) => {
                const date = new Date(analysis.date);
                const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item analysis-item';
                listItem.setAttribute('data-index', index);
                listItem.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0">${analysis.name}</h6>
                            <small class="text-muted">${formattedDate}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger delete-analysis" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    ${analysis.notes ? `<div class="mt-2 small text-muted">${analysis.notes}</div>` : ''}
                `;
                
                analysesList.appendChild(listItem);
            });
            
            // Add event listeners to analysis items
            document.querySelectorAll('.analysis-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    // Ignore clicks on the delete button
                    if (e.target.closest('.delete-analysis')) {
                        return;
                    }
                    
                    // Remove selected class from all items
                    document.querySelectorAll('.analysis-item').forEach(i => {
                        i.classList.remove('selected');
                    });
                    
                    // Add selected class to clicked item
                    this.classList.add('selected');
                    
                    // Enable the load button
                    document.getElementById('confirm-load').removeAttribute('disabled');
                });
            });
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-analysis').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const index = this.getAttribute('data-index');
                    
                    if (confirm('Are you sure you want to delete this analysis?')) {
                        StorageManager.deleteAnalysis(index);
                        const listItem = this.closest('.analysis-item');
                        listItem.remove();
                        
                        // If no analyses left, show the message
                        if (document.querySelectorAll('.analysis-item').length === 0) {
                            document.getElementById('no-saved-analyses').style.display = 'block';
                        }
                    }
                });
            });
        }
        
        const loadModal = new bootstrap.Modal(document.getElementById('loadAnalysisModal'));
        loadModal.show();
    });
    
    // Confirm load button in modal
    document.getElementById('confirm-load').addEventListener('click', function() {
        const selectedItem = document.querySelector('.analysis-item.selected');
        
        if (!selectedItem) {
            alert('Please select an analysis to load');
            return;
        }
        
        const index = selectedItem.getAttribute('data-index');
        const analysisData = StorageManager.getSavedAnalyses()[index];
        
        // Load the analysis data into the UI
        UIController.loadAnalysisData(analysisData);
        
        // Run the analysis again with the loaded data
        AnalysisEngine.setResults(analysisData.analysisResults);
        UIController.displayAnalysisResults(analysisData.analysisResults);
        
        const loadModal = bootstrap.Modal.getInstance(document.getElementById('loadAnalysisModal'));
        loadModal.hide();
        
        // Show success message
        UIController.showNotification('Analysis loaded successfully', 'success');
        
        // Navigate to the analysis tab
        const analysisTab = document.getElementById('analysis-tab');
        const tabInstance = new bootstrap.Tab(analysisTab);
        tabInstance.show();
    });
    
    // Export recommendations button
    document.getElementById('export-recommendations').addEventListener('click', function() {
        UIController.exportRecommendations();
    });
    
    // Complete analysis button
    document.getElementById('finish-analysis').addEventListener('click', function() {
        UIController.showNotification('Analysis completed! You can save your results or start a new analysis.', 'success');
        
        // Go back to welcome tab
        const welcomeTab = document.getElementById('welcome-tab');
        const tabInstance = new bootstrap.Tab(welcomeTab);
        tabInstance.show();
    });
}

/**
 * Run the analysis with the current data
 */
function runAnalysis() {
    // Show loading indicator
    UIController.showLoading('Running analysis...');
    
    // Get platform data from UI
    const platformData = UIController.getAllPlatformData();
    
    // Get audience data from UI
    const audienceData = UIController.getAllAudienceData();
    
    // Validate data
    if (!validateAnalysisData(platformData, audienceData)) {
        UIController.hideLoading();
        return;
    }
    
    // Simulate processing time (would be actual analysis in a real app)
    setTimeout(() => {
        // Run the analysis
        const results = AnalysisEngine.analyze(platformData, audienceData);
        
        // Display results
        UIController.displayAnalysisResults(results);
        
        // Generate recommendations based on results
        UIController.displayRecommendations(results);
        
        // Hide loading indicator
        UIController.hideLoading();
        
        // Show the results
        document.getElementById('analysis-results').style.display = 'block';
        document.getElementById('analysis-prompt').style.display = 'none';
        document.getElementById('recommendations-results').style.display = 'block';
        document.getElementById('recommendations-prompt').style.display = 'none';
        
        // Navigate to the next tab automatically
        document.getElementById('analysis-tab').click();
    }, 2000);
}

/**
 * Validate analysis data before running
 * @param {Object} platformData - Platform content data
 * @param {Object} audienceData - Audience data
 * @returns {boolean} - Whether the data is valid
 */
function validateAnalysisData(platformData, audienceData) {
    let isValid = true;
    let errorMessage = '';
    
    // Check if we have at least 2 platforms
    if (Object.keys(platformData).length < 2) {
        isValid = false;
        errorMessage = 'Please input data for at least 2 platforms';
    }
    
    // Check if each platform has content
    for (const platform in platformData) {
        if (!platformData[platform].content || platformData[platform].content.trim() === '') {
            isValid = false;
            errorMessage = 'Please provide content for all platforms';
            break;
        }
    }
    
    // Check if we have audience data for each platform
    for (const platform in platformData) {
        if (!audienceData[platform]) {
            isValid = false;
            errorMessage = 'Please provide audience data for all platforms';
            break;
        }
    }
    
    if (!isValid) {
        UIController.showNotification(errorMessage, 'danger');
    }
    
    return isValid;
}