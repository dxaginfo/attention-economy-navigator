/**
 * Attention Economy Navigator
 * UI Controller
 * 
 * Handles all UI interactions and displays
 */

const UIController = (function() {
    // Private variables
    let platformCount = 2; // Start with 2 platforms
    let loadingTimeout = null;
    
    // Platform colors for consistent styling
    const platformColors = [
        { bg: 'bg-primary', text: 'text-white' },
        { bg: 'bg-info', text: 'text-white' },
        { bg: 'bg-success', text: 'text-white' },
        { bg: 'bg-warning', text: 'text-dark' },
        { bg: 'bg-danger', text: 'text-white' },
        { bg: 'bg-secondary', text: 'text-white' }
    ];
    
    // Chart instances
    let coherenceChart = null;
    let audienceChart = null;
    let consistencyChart = null;
    
    /**
     * Initialize the UI Controller
     */
    function init() {
        console.log('UI Controller initialized');
        
        // Add notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'position-fixed top-0 end-0 p-3';
            container.style.zIndex = '1050';
            document.body.appendChild(container);
        }
    }
    
    /**
     * Add a new platform input section
     */
    function addNewPlatform() {
        platformCount++;
        
        // Determine color for new platform (cycle through available colors)
        const colorIndex = (platformCount - 1) % platformColors.length;
        const color = platformColors[colorIndex];
        
        // Create new platform card
        const platformCard = document.createElement('div');
        platformCard.className = 'card mb-4 platform-card';
        platformCard.innerHTML = `
            <div class="card-header ${color.bg} ${color.text}">
                <h5 class="mb-0">Platform ${platformCount}: New Platform</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="platform${platformCount}-name" class="form-label">Platform Name</label>
                    <input type="text" class="form-control" id="platform${platformCount}-name" value="New Platform">
                </div>
                <div class="mb-3">
                    <label for="platform${platformCount}-content" class="form-label">Content Sample</label>
                    <textarea class="form-control" id="platform${platformCount}-content" rows="4" placeholder="Paste content from this platform..."></textarea>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="platform${platformCount}-tone" class="form-label">Content Tone</label>
                        <select class="form-select" id="platform${platformCount}-tone">
                            <option value="">Select a tone...</option>
                            <option value="formal">Formal</option>
                            <option value="casual">Casual</option>
                            <option value="professional">Professional</option>
                            <option value="conversational">Conversational</option>
                            <option value="technical">Technical</option>
                            <option value="inspirational">Inspirational</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="platform${platformCount}-format" class="form-label">Content Format</label>
                        <select class="form-select" id="platform${platformCount}-format">
                            <option value="">Select a format...</option>
                            <option value="article">Article/Blog</option>
                            <option value="social-post">Social Media Post</option>
                            <option value="email">Email</option>
                            <option value="landing-page">Landing Page</option>
                            <option value="ad">Advertisement</option>
                        </select>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="platform${platformCount}-keywords" class="form-label">Key Message/Keywords</label>
                    <input type="text" class="form-control" id="platform${platformCount}-keywords" placeholder="Enter comma-separated keywords">
                </div>
                <button class="btn btn-sm btn-outline-danger remove-platform" data-platform="${platformCount}">
                    <i class="fas fa-trash"></i> Remove Platform
                </button>
            </div>
        `;
        
        // Add the new platform card to the container
        document.getElementById('platform-inputs').appendChild(platformCard);
        
        // Create corresponding audience card
        const audienceCard = document.createElement('div');
        audienceCard.className = 'card mb-4 audience-card';
        audienceCard.setAttribute('data-platform', platformCount);
        audienceCard.innerHTML = `
            <div class="card-header ${color.bg} ${color.text}">
                <h5 class="mb-0">New Platform Audience</h5>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="platform${platformCount}-audience-size" class="form-label">Audience Size</label>
                        <input type="number" class="form-control" id="platform${platformCount}-audience-size" placeholder="e.g., 10000">
                    </div>
                    <div class="col-md-6">
                        <label for="platform${platformCount}-engagement-rate" class="form-label">Engagement Rate (%)</label>
                        <input type="number" step="0.01" class="form-control" id="platform${platformCount}-engagement-rate" placeholder="e.g., 2.5">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Primary Age Demographics</label>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="input-group mb-2">
                                <span class="input-group-text">18-24</span>
                                <input type="number" class="form-control age-demo" id="platform${platformCount}-age-18-24" placeholder="%">
                                <span class="input-group-text">%</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="input-group mb-2">
                                <span class="input-group-text">25-34</span>
                                <input type="number" class="form-control age-demo" id="platform${platformCount}-age-25-34" placeholder="%">
                                <span class="input-group-text">%</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="input-group mb-2">
                                <span class="input-group-text">35-44</span>
                                <input type="number" class="form-control age-demo" id="platform${platformCount}-age-35-44" placeholder="%">
                                <span class="input-group-text">%</span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="input-group mb-2">
                                <span class="input-group-text">45-54</span>
                                <input type="number" class="form-control age-demo" id="platform${platformCount}-age-45-54" placeholder="%">
                                <span class="input-group-text">%</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="input-group mb-2">
                                <span class="input-group-text">55-64</span>
                                <input type="number" class="form-control age-demo" id="platform${platformCount}-age-55-64" placeholder="%">
                                <span class="input-group-text">%</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="input-group mb-2">
                                <span class="input-group-text">65+</span>
                                <input type="number" class="form-control age-demo" id="platform${platformCount}-age-65plus" placeholder="%">
                                <span class="input-group-text">%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Gender Distribution</label>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="input-group mb-2">
                                <span class="input-group-text">Male</span>
                                <input type="number" class="form-control gender-demo" id="platform${platformCount}-gender-male" placeholder="%">
                                <span class="input-group-text">%</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="input-group mb-2">
                                <span class="input-group-text">Female</span>
                                <input type="number" class="form-control gender-demo" id="platform${platformCount}-gender-female" placeholder="%">
                                <span class="input-group-text">%</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="input-group mb-2">
                                <span class="input-group-text">Other</span>
                                <input type="number" class="form-control gender-demo" id="platform${platformCount}-gender-other" placeholder="%">
                                <span class="input-group-text">%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="platform${platformCount}-audience-interests" class="form-label">Primary Audience Interests</label>
                    <input type="text" class="form-control" id="platform${platformCount}-audience-interests" placeholder="e.g., Technology, Fashion, Sports">
                </div>
            </div>
        `;
        
        // Add the audience card to the container
        document.getElementById('audience-inputs').appendChild(audienceCard);
        
        // Add event listener for remove button
        const removeButton = platformCard.querySelector('.remove-platform');
        removeButton.addEventListener('click', function() {
            const platformNumber = this.getAttribute('data-platform');
            removePlatform(platformNumber);
        });
        
        // Update audience card headers to match platform names
        updateAudienceCardHeaders();
        
        // Add event listener to platform name input to update audience card header
        document.getElementById(`platform${platformCount}-name`).addEventListener('input', updateAudienceCardHeaders);
    }
    
    /**
     * Remove a platform and its corresponding audience card
     * @param {string} platformNumber - The platform number to remove
     */
    function removePlatform(platformNumber) {
        // Find platform card
        const platformCard = document.querySelector(`.platform-card:nth-child(${platformNumber})`);
        
        // Find audience card
        const audienceCard = document.querySelector(`.audience-card[data-platform="${platformNumber}"]`);
        
        // Remove both cards
        if (platformCard) platformCard.remove();
        if (audienceCard) audienceCard.remove();
    }
    
    /**
     * Update audience card headers to match platform names
     */
    function updateAudienceCardHeaders() {
        // Get all platform name inputs
        const platformNameInputs = document.querySelectorAll('[id^="platform"][id$="-name"]');
        
        // Update each audience card header
        platformNameInputs.forEach(input => {
            const platformId = input.id.match(/platform(\d+)-name/)[1];
            const audienceCard = document.querySelector(`.audience-card[data-platform="${platformId}"]`);
            
            if (audienceCard) {
                const headerElement = audienceCard.querySelector('.card-header h5');
                headerElement.textContent = `${input.value} Audience`;
            }
        });
    }
    
    /**
     * Get all platform data from the UI
     * @returns {Object} Platform data object
     */
    function getAllPlatformData() {
        const platformData = {};
        
        // Get all platform inputs
        const platformNameInputs = document.querySelectorAll('[id^="platform"][id$="-name"]');
        
        platformNameInputs.forEach(input => {
            const platformId = input.id.match(/platform(\d+)-name/)[1];
            
            platformData[platformId] = {
                name: document.getElementById(`platform${platformId}-name`).value,
                content: document.getElementById(`platform${platformId}-content`).value,
                tone: document.getElementById(`platform${platformId}-tone`).value,
                format: document.getElementById(`platform${platformId}-format`).value,
                keywords: document.getElementById(`platform${platformId}-keywords`).value
            };
        });
        
        return platformData;
    }
    
    /**
     * Get all audience data from the UI
     * @returns {Object} Audience data object
     */
    function getAllAudienceData() {
        const audienceData = {};
        
        // Get all audience cards
        const audienceCards = document.querySelectorAll('.audience-card');
        
        audienceCards.forEach(card => {
            const platformId = card.getAttribute('data-platform');
            
            const ageData = {
                '18-24': getInputValueAsNumber(`platform${platformId}-age-18-24`),
                '25-34': getInputValueAsNumber(`platform${platformId}-age-25-34`),
                '35-44': getInputValueAsNumber(`platform${platformId}-age-35-44`),
                '45-54': getInputValueAsNumber(`platform${platformId}-age-45-54`),
                '55-64': getInputValueAsNumber(`platform${platformId}-age-55-64`),
                '65plus': getInputValueAsNumber(`platform${platformId}-age-65plus`)
            };
            
            const genderDistribution = {
                male: getInputValueAsNumber(`platform${platformId}-gender-male`),
                female: getInputValueAsNumber(`platform${platformId}-gender-female`),
                other: getInputValueAsNumber(`platform${platformId}-gender-other`)
            };
            
            audienceData[platformId] = {
                audienceSize: getInputValueAsNumber(`platform${platformId}-audience-size`),
                engagementRate: getInputValueAsNumber(`platform${platformId}-engagement-rate`),
                ageDistribution: ageData,
                genderDistribution: genderDistribution,
                interests: document.getElementById(`platform${platformId}-audience-interests`).value
            };
        });
        
        return audienceData;
    }
    
    /**
     * Get input value as number, return 0 if not a valid number
     * @param {string} inputId - The ID of the input element
     * @returns {number} The input value as a number
     */
    function getInputValueAsNumber(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return 0;
        
        const value = parseFloat(input.value);
        return isNaN(value) ? 0 : value;
    }
    
    /**
     * Display analysis results
     * @param {Object} results - Analysis results from the AnalysisEngine
     */
    function displayAnalysisResults(results) {
        // Display coherence results
        displayCoherenceChart(results.coherence);
        
        // Display audience fragmentation results
        displayAudienceChart(results.audience);
        
        // Display consistency results
        displayConsistencyChart(results.consistency);
        
        // Display key findings
        displayKeyFindings(results.keyFindings);
        
        // Update summary texts
        document.getElementById('coherence-summary').innerHTML = generateCoherenceSummary(results.coherence);
        document.getElementById('audience-summary').innerHTML = generateAudienceSummary(results.audience);
        document.getElementById('consistency-summary').innerHTML = generateConsistencySummary(results.consistency);
    }
    
    /**
     * Display recommendations based on analysis results
     * @param {Object} results - Analysis results containing recommendations
     */
    function displayRecommendations(results) {
        const recommendations = results.recommendations;
        
        // Display strategy recommendations
        const strategyList = document.getElementById('strategy-recommendations');
        strategyList.innerHTML = '';
        
        recommendations.strategyRecommendations.forEach(recommendation => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerHTML = recommendation;
            strategyList.appendChild(listItem);
        });
        
        // Display platform-specific recommendations
        const platformRecommendationsContainer = document.getElementById('platform-recommendations');
        platformRecommendationsContainer.innerHTML = '';
        
        const platformData = getAllPlatformData();
        
        for (const platformId in recommendations.platformRecommendations) {
            const platformRec = recommendations.platformRecommendations[platformId];
            const platformName = platformData[platformId].name;
            
            // Determine color for platform
            const colorIndex = (parseInt(platformId) - 1) % platformColors.length;
            const color = platformColors[colorIndex];
            
            const platformCard = document.createElement('div');
            platformCard.className = 'card mb-4 platform-recommendation';
            platformCard.innerHTML = `
                <div class="card-header ${color.bg} ${color.text}">
                    <h5 class="mb-0">${platformRec.title}</h5>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        ${platformRec.recommendations.map(rec => `<li class="list-group-item">${rec}</li>`).join('')}
                    </ul>
                </div>
            `;
            
            platformRecommendationsContainer.appendChild(platformCard);
        }
        
        // Display next steps
        const nextStepsList = document.getElementById('next-steps-list');
        nextStepsList.innerHTML = '';
        
        recommendations.nextSteps.forEach(step => {
            const listItem = document.createElement('li');
            listItem.innerHTML = step;
            nextStepsList.appendChild(listItem);
        });
    }
    
    /**
     * Display coherence chart
     * @param {Object} coherenceData - Coherence analysis data
     */
    function displayCoherenceChart(coherenceData) {
        const ctx = document.getElementById('coherence-chart').getContext('2d');
        
        // Destroy previous chart if it exists
        if (coherenceChart) {
            coherenceChart.destroy();
        }
        
        // Prepare data for chart
        const platformData = getAllPlatformData();
        const labels = [];
        const scores = [];
        const backgroundColors = [];
        
        for (const platformId in coherenceData.platformScores) {
            labels.push(platformData[platformId].name);
            scores.push(coherenceData.platformScores[platformId].score);
            
            // Set color based on platform index
            const colorIndex = (parseInt(platformId) - 1) % platformColors.length;
            const color = platformColors[colorIndex].bg.replace('bg-', '');
            
            // Map Bootstrap color names to RGBA
            let rgba = 'rgba(0, 123, 255, 0.7)'; // Default to primary blue
            
            if (color === 'primary') rgba = 'rgba(0, 123, 255, 0.7)';
            else if (color === 'info') rgba = 'rgba(23, 162, 184, 0.7)';
            else if (color === 'success') rgba = 'rgba(40, 167, 69, 0.7)';
            else if (color === 'warning') rgba = 'rgba(255, 193, 7, 0.7)';
            else if (color === 'danger') rgba = 'rgba(220, 53, 69, 0.7)';
            else if (color === 'secondary') rgba = 'rgba(108, 117, 125, 0.7)';
            
            backgroundColors.push(rgba);
        }
        
        // Add overall score
        labels.push('Overall');
        scores.push(coherenceData.overallScore);
        backgroundColors.push('rgba(108, 117, 125, 0.7)'); // Grey for overall
        
        // Create the chart
        coherenceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Content Coherence Score',
                    data: scores,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Score (0-100)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const index = context.dataIndex;
                                const label = context.label;
                                
                                if (label === 'Overall') {
                                    return `Rating: ${coherenceData.benchmarkComparison.rating}`;
                                }
                                
                                // Find the platform ID for this label
                                let platformId = null;
                                for (const id in platformData) {
                                    if (platformData[id].name === label) {
                                        platformId = id;
                                        break;
                                    }
                                }
                                
                                if (platformId && coherenceData.platformScores[platformId]) {
                                    const strengths = coherenceData.platformScores[platformId].strengths.join(', ');
                                    const weaknesses = coherenceData.platformScores[platformId].weaknesses.join(', ');
                                    
                                    return [
                                        `Strengths: ${strengths}`,
                                        `Areas for improvement: ${weaknesses}`
                                    ];
                                }
                                
                                return '';
                            }
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Display audience fragmentation chart
     * @param {Object} audienceData - Audience fragmentation data
     */
    function displayAudienceChart(audienceData) {
        const ctx = document.getElementById('audience-chart').getContext('2d');
        
        // Destroy previous chart if it exists
        if (audienceChart) {
            audienceChart.destroy();
        }
        
        // Prepare data for chart
        const platformData = getAllPlatformData();
        const labels = [];
        const audienceSize = [];
        const engagementRate = [];
        
        for (const platformId in audienceData.platformReach) {
            labels.push(platformData[platformId].name);
            audienceSize.push(audienceData.platformReach[platformId].size / 1000); // Convert to thousands
            engagementRate.push(audienceData.platformReach[platformId].engagement);
        }
        
        // Create the chart
        audienceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Audience Size (thousands)',
                        data: audienceSize,
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Engagement Rate (%)',
                        data: engagementRate,
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Audience Size (thousands)'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Engagement Rate (%)'
                        },
                        max: Math.max(...engagementRate) * 1.5
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const index = context.dataIndex;
                                const label = context.label;
                                
                                // Find the platform ID for this label
                                let platformId = null;
                                for (const id in platformData) {
                                    if (platformData[id].name === label) {
                                        platformId = id;
                                        break;
                                    }
                                }
                                
                                if (platformId && audienceData.platformReach[platformId]) {
                                    const primaryAgeGroup = audienceData.platformReach[platformId].primaryAgeGroup;
                                    
                                    return [
                                        `Primary Age Group: ${primaryAgeGroup}`
                                    ];
                                }
                                
                                return '';
                            }
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Display consistency chart
     * @param {Object} consistencyData - Message consistency data
     */
    function displayConsistencyChart(consistencyData) {
        const ctx = document.getElementById('consistency-chart').getContext('2d');
        
        // Destroy previous chart if it exists
        if (consistencyChart) {
            consistencyChart.destroy();
        }
        
        // Prepare data for radar chart
        const platformData = getAllPlatformData();
        const datasets = [];
        
        // Create a dataset for each platform
        for (const platformId in consistencyData.platformScores) {
            // Set color based on platform index
            const colorIndex = (parseInt(platformId) - 1) % platformColors.length;
            const color = platformColors[colorIndex].bg.replace('bg-', '');
            
            // Map Bootstrap color names to RGBA
            let rgba = 'rgba(0, 123, 255, 0.7)'; // Default to primary blue
            
            if (color === 'primary') rgba = 'rgba(0, 123, 255, 0.7)';
            else if (color === 'info') rgba = 'rgba(23, 162, 184, 0.7)';
            else if (color === 'success') rgba = 'rgba(40, 167, 69, 0.7)';
            else if (color === 'warning') rgba = 'rgba(255, 193, 7, 0.7)';
            else if (color === 'danger') rgba = 'rgba(220, 53, 69, 0.7)';
            else if (color === 'secondary') rgba = 'rgba(108, 117, 125, 0.7)';
            
            datasets.push({
                label: platformData[platformId].name,
                data: [
                    consistencyData.platformScores[platformId].score,
                    consistencyData.platformScores[platformId].keyMessagePresence,
                    consistencyData.platformScores[platformId].toneConsistency,
                    consistencyData.platformScores[platformId].valueAlignment
                ],
                backgroundColor: rgba,
                borderColor: rgba.replace('0.7', '1'),
                borderWidth: 1
            });
        }
        
        // Create the chart
        consistencyChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Overall Consistency',
                    'Key Message Presence',
                    'Tone Consistency',
                    'Value Alignment'
                ],
                datasets: datasets
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Display key findings from analysis
     * @param {Array} findings - List of key findings
     */
    function displayKeyFindings(findings) {
        const findingsList = document.getElementById('key-findings-list');
        findingsList.innerHTML = '';
        
        findings.forEach(finding => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerHTML = finding;
            findingsList.appendChild(listItem);
        });
    }
    
    /**
     * Generate HTML summary for coherence results
     * @param {Object} coherenceData - Coherence analysis data
     * @returns {string} HTML summary content
     */
    function generateCoherenceSummary(coherenceData) {
        const benchmark = coherenceData.benchmarkComparison;
        
        return `
            <div class="alert alert-${getRatingClass(benchmark.rating)} mb-3">
                <strong>Overall Content Coherence: ${coherenceData.overallScore}/100</strong> 
                (${benchmark.rating}, ${benchmark.percentile}th percentile)
            </div>
            <p>Your content coherence is ${benchmark.score > benchmark.industryAverage ? 'above' : 'below'} 
            the industry average of ${benchmark.industryAverage}.</p>
            <p>Key areas of strong coherence include:</p>
            <ul>
                ${generateRandomStrengths(3).map(strength => `<li>${strength}</li>`).join('')}
            </ul>
        `;
    }
    
    /**
     * Generate HTML summary for audience fragmentation results
     * @param {Object} audienceData - Audience fragmentation data
     * @returns {string} HTML summary content
     */
    function generateAudienceSummary(audienceData) {
        return `
            <div class="alert alert-${getFragmentationClass(audienceData.fragmentationScore)} mb-3">
                <strong>Audience Fragmentation Score: ${audienceData.fragmentationScore}/100</strong>
                (${audienceData.fragmentationScore > 50 ? 'High' : 'Moderate'} fragmentation)
            </div>
            <p>Your audience shows ${audienceData.fragmentationScore > 70 ? 'significant' : 
                audienceData.fragmentationScore > 50 ? 'moderate' : 'minimal'} fragmentation across platforms.</p>
            <p>Key audience insights:</p>
            <ul>
                ${audienceData.audienceGaps.slice(0, 2).map(gap => `<li>${gap}</li>`).join('')}
            </ul>
        `;
    }
    
    /**
     * Generate HTML summary for consistency results
     * @param {Object} consistencyData - Message consistency data
     * @returns {string} HTML summary content
     */
    function generateConsistencySummary(consistencyData) {
        const benchmark = consistencyData.benchmarkComparison;
        
        return `
            <div class="alert alert-${getRatingClass(benchmark.rating)} mb-3">
                <strong>Message Consistency Score: ${consistencyData.overallScore}/100</strong>
                (${benchmark.rating}, ${benchmark.percentile}th percentile)
            </div>
            <p>Your message consistency is ${benchmark.score > benchmark.industryAverage ? 'above' : 'below'} 
            the industry average of ${benchmark.industryAverage}.</p>
            <p>Focus on improving consistency in:</p>
            <ul>
                ${generateRandomWeaknesses(2).map(weakness => `<li>${weakness}</li>`).join('')}
            </ul>
        `;
    }
    
    /**
     * Get Bootstrap alert class based on rating
     * @param {string} rating - Rating value
     * @returns {string} Bootstrap alert class
     */
    function getRatingClass(rating) {
        switch (rating) {
            case 'excellent': return 'success';
            case 'good': return 'info';
            case 'average': return 'warning';
            case 'below average': return 'warning';
            case 'poor': return 'danger';
            default: return 'secondary';
        }
    }
    
    /**
     * Get Bootstrap alert class based on fragmentation score
     * @param {number} score - Fragmentation score
     * @returns {string} Bootstrap alert class
     */
    function getFragmentationClass(score) {
        if (score < 40) return 'success';
        if (score < 60) return 'info';
        if (score < 80) return 'warning';
        return 'danger';
    }
    
    /**
     * Generate random strengths for demo purposes
     * @param {number} count - Number of strengths to generate
     * @returns {Array} Array of strength statements
     */
    function generateRandomStrengths(count) {
        const strengths = [
            "Consistent brand voice across major platforms",
            "Key messaging alignment between website and social media",
            "Visual identity elements maintained across channels",
            "Value proposition clearly communicated on all platforms",
            "Product/service descriptions maintain consistency",
            "Target audience addressed consistently",
            "Call-to-action uniformity"
        ];
        
        return strengths.sort(() => 0.5 - Math.random()).slice(0, count);
    }
    
    /**
     * Generate random weaknesses for demo purposes
     * @param {number} count - Number of weaknesses to generate
     * @returns {Array} Array of weakness statements
     */
    function generateRandomWeaknesses(count) {
        const weaknesses = [
            "Tone variations between formal and casual channels",
            "Inconsistent terminology for key features",
            "Value proposition emphasis differs across platforms",
            "Messaging priority inconsistencies",
            "Visual brand elements not consistently applied",
            "Varying levels of technical detail",
            "Inconsistent call-to-action strategies"
        ];
        
        return weaknesses.sort(() => 0.5 - Math.random()).slice(0, count);
    }
    
    /**
     * Show loading indicator with message
     * @param {string} message - Loading message to display
     */
    function showLoading(message) {
        // Create loading overlay if it doesn't exist
        if (!document.getElementById('loading-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '9999';
            overlay.style.display = 'none';
            
            overlay.innerHTML = `
                <div class="bg-white p-4 rounded shadow-lg text-center">
                    <div class="loading-spinner mb-3"></div>
                    <div id="loading-message">Loading...</div>
                </div>
            `;
            
            document.body.appendChild(overlay);
        }
        
        // Update message and show overlay
        document.getElementById('loading-message').textContent = message || 'Loading...';
        document.getElementById('loading-overlay').style.display = 'flex';
        
        // Set timeout to hide loading if it's shown for too long
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
        }
        
        loadingTimeout = setTimeout(hideLoading, 10000); // Hide after 10 seconds
    }
    
    /**
     * Hide loading indicator
     */
    function hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            loadingTimeout = null;
        }
    }
    
    /**
     * Show notification message
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, info, warning, danger)
     */
    function showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        
        const notification = document.createElement('div');
        notification.className = `toast align-items-center text-white bg-${type} border-0`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        notification.setAttribute('aria-atomic', 'true');
        
        notification.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        container.appendChild(notification);
        
        const toast = new bootstrap.Toast(notification, {
            autohide: true,
            delay: 5000
        });
        
        toast.show();
        
        // Remove notification from DOM after it's hidden
        notification.addEventListener('hidden.bs.toast', function() {
            notification.remove();
        });
    }
    
    /**
     * Load analysis data into the UI
     * @param {Object} analysisData - Saved analysis data
     */
    function loadAnalysisData(analysisData) {
        const platformData = analysisData.platformData;
        const audienceData = analysisData.audienceData;
        
        // Clear existing platform and audience cards
        document.getElementById('platform-inputs').innerHTML = '';
        document.getElementById('audience-inputs').innerHTML = '';
        
        // Reset platform count
        platformCount = 0;
        
        // Add platforms based on loaded data
        for (const platformId in platformData) {
            platformCount = Math.max(platformCount, parseInt(platformId));
            
            // Add platform card
            const platform = platformData[platformId];
            const colorIndex = (parseInt(platformId) - 1) % platformColors.length;
            const color = platformColors[colorIndex];
            
            const platformCard = document.createElement('div');
            platformCard.className = 'card mb-4 platform-card';
            platformCard.innerHTML = `
                <div class="card-header ${color.bg} ${color.text}">
                    <h5 class="mb-0">Platform ${platformId}: ${platform.name}</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label for="platform${platformId}-name" class="form-label">Platform Name</label>
                        <input type="text" class="form-control" id="platform${platformId}-name" value="${platform.name}">
                    </div>
                    <div class="mb-3">
                        <label for="platform${platformId}-content" class="form-label">Content Sample</label>
                        <textarea class="form-control" id="platform${platformId}-content" rows="4">${platform.content}</textarea>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="platform${platformId}-tone" class="form-label">Content Tone</label>
                            <select class="form-select" id="platform${platformId}-tone">
                                <option value="">Select a tone...</option>
                                <option value="formal" ${platform.tone === 'formal' ? 'selected' : ''}>Formal</option>
                                <option value="casual" ${platform.tone === 'casual' ? 'selected' : ''}>Casual</option>
                                <option value="professional" ${platform.tone === 'professional' ? 'selected' : ''}>Professional</option>
                                <option value="conversational" ${platform.tone === 'conversational' ? 'selected' : ''}>Conversational</option>
                                <option value="technical" ${platform.tone === 'technical' ? 'selected' : ''}>Technical</option>
                                <option value="inspirational" ${platform.tone === 'inspirational' ? 'selected' : ''}>Inspirational</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="platform${platformId}-format" class="form-label">Content Format</label>
                            <select class="form-select" id="platform${platformId}-format">
                                <option value="">Select a format...</option>
                                <option value="article" ${platform.format === 'article' ? 'selected' : ''}>Article/Blog</option>
                                <option value="social-post" ${platform.format === 'social-post' ? 'selected' : ''}>Social Media Post</option>
                                <option value="email" ${platform.format === 'email' ? 'selected' : ''}>Email</option>
                                <option value="landing-page" ${platform.format === 'landing-page' ? 'selected' : ''}>Landing Page</option>
                                <option value="ad" ${platform.format === 'ad' ? 'selected' : ''}>Advertisement</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="platform${platformId}-keywords" class="form-label">Key Message/Keywords</label>
                        <input type="text" class="form-control" id="platform${platformId}-keywords" value="${platform.keywords}">
                    </div>
                    ${parseInt(platformId) > 2 ? `
                    <button class="btn btn-sm btn-outline-danger remove-platform" data-platform="${platformId}">
                        <i class="fas fa-trash"></i> Remove Platform
                    </button>
                    ` : ''}
                </div>
            `;
            
            document.getElementById('platform-inputs').appendChild(platformCard);
            
            // Add audience card
            if (audienceData[platformId]) {
                const audience = audienceData[platformId];
                
                const audienceCard = document.createElement('div');
                audienceCard.className = 'card mb-4 audience-card';
                audienceCard.setAttribute('data-platform', platformId);
                audienceCard.innerHTML = `
                    <div class="card-header ${color.bg} ${color.text}">
                        <h5 class="mb-0">${platform.name} Audience</h5>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="platform${platformId}-audience-size" class="form-label">Audience Size</label>
                                <input type="number" class="form-control" id="platform${platformId}-audience-size" value="${audience.audienceSize || ''}">
                            </div>
                            <div class="col-md-6">
                                <label for="platform${platformId}-engagement-rate" class="form-label">Engagement Rate (%)</label>
                                <input type="number" step="0.01" class="form-control" id="platform${platformId}-engagement-rate" value="${audience.engagementRate || ''}">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Primary Age Demographics</label>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="input-group mb-2">
                                        <span class="input-group-text">18-24</span>
                                        <input type="number" class="form-control age-demo" id="platform${platformId}-age-18-24" value="${audience.ageDistribution && audience.ageDistribution['18-24'] || ''}">
                                        <span class="input-group-text">%</span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="input-group mb-2">
                                        <span class="input-group-text">25-34</span>
                                        <input type="number" class="form-control age-demo" id="platform${platformId}-age-25-34" value="${audience.ageDistribution && audience.ageDistribution['25-34'] || ''}">
                                        <span class="input-group-text">%</span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="input-group mb-2">
                                        <span class="input-group-text">35-44</span>
                                        <input type="number" class="form-control age-demo" id="platform${platformId}-age-35-44" value="${audience.ageDistribution && audience.ageDistribution['35-44'] || ''}">
                                        <span class="input-group-text">%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="input-group mb-2">
                                        <span class="input-group-text">45-54</span>
                                        <input type="number" class="form-control age-demo" id="platform${platformId}-age-45-54" value="${audience.ageDistribution && audience.ageDistribution['45-54'] || ''}">
                                        <span class="input-group-text">%</span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="input-group mb-2">
                                        <span class="input-group-text">55-64</span>
                                        <input type="number" class="form-control age-demo" id="platform${platformId}-age-55-64" value="${audience.ageDistribution && audience.ageDistribution['55-64'] || ''}">
                                        <span class="input-group-text">%</span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="input-group mb-2">
                                        <span class="input-group-text">65+</span>
                                        <input type="number" class="form-control age-demo" id="platform${platformId}-age-65plus" value="${audience.ageDistribution && audience.ageDistribution['65plus'] || ''}">
                                        <span class="input-group-text">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Gender Distribution</label>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="input-group mb-2">
                                        <span class="input-group-text">Male</span>
                                        <input type="number" class="form-control gender-demo" id="platform${platformId}-gender-male" value="${audience.genderDistribution && audience.genderDistribution.male || ''}">
                                        <span class="input-group-text">%</span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="input-group mb-2">
                                        <span class="input-group-text">Female</span>
                                        <input type="number" class="form-control gender-demo" id="platform${platformId}-gender-female" value="${audience.genderDistribution && audience.genderDistribution.female || ''}">
                                        <span class="input-group-text">%</span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="input-group mb-2">
                                        <span class="input-group-text">Other</span>
                                        <input type="number" class="form-control gender-demo" id="platform${platformId}-gender-other" value="${audience.genderDistribution && audience.genderDistribution.other || ''}">
                                        <span class="input-group-text">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="platform${platformId}-audience-interests" class="form-label">Primary Audience Interests</label>
                            <input type="text" class="form-control" id="platform${platformId}-audience-interests" value="${audience.interests || ''}">
                        </div>
                    </div>
                `;
                
                document.getElementById('audience-inputs').appendChild(audienceCard);
            }
        }
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-platform').forEach(button => {
            button.addEventListener('click', function() {
                const platformNumber = this.getAttribute('data-platform');
                removePlatform(platformNumber);
            });
        });
        
        // Add event listeners to platform name inputs
        document.querySelectorAll('[id^="platform"][id$="-name"]').forEach(input => {
            input.addEventListener('input', updateAudienceCardHeaders);
        });
    }
    
    /**
     * Export recommendations to a downloadable file
     */
    function exportRecommendations() {
        // Get analysis results
        const results = AnalysisEngine.getResults();
        
        if (!results || !results.recommendations) {
            showNotification('No recommendations available to export', 'warning');
            return;
        }
        
        // Create formatted content
        let content = '# Attention Economy Navigator: Recommendations\n\n';
        content += `## Analysis Date: ${new Date().toLocaleDateString()}\n\n`;
        
        // Add overall scores
        content += '## Overall Scores\n\n';
        content += `* Content Coherence: ${results.coherence.overallScore}/100 (${results.coherence.benchmarkComparison.rating})\n`;
        content += `* Message Consistency: ${results.consistency.overallScore}/100 (${results.consistency.benchmarkComparison.rating})\n`;
        content += `* Audience Fragmentation: ${results.audience.fragmentationScore}/100 (${results.audience.fragmentationScore > 50 ? 'High' : 'Moderate'} fragmentation)\n\n`;
        
        // Add key findings
        content += '## Key Findings\n\n';
        results.keyFindings.forEach(finding => {
            content += `* ${finding}\n`;
        });
        content += '\n';
        
        // Add strategy recommendations
        content += '## Overall Strategy Recommendations\n\n';
        results.recommendations.strategyRecommendations.forEach(rec => {
            content += `* ${rec}\n`;
        });
        content += '\n';
        
        // Add platform-specific recommendations
        content += '## Platform-Specific Recommendations\n\n';
        const platformData = getAllPlatformData();
        
        for (const platformId in results.recommendations.platformRecommendations) {
            const platformRec = results.recommendations.platformRecommendations[platformId];
            const platformName = platformData[platformId].name;
            
            content += `### ${platformRec.title}\n\n`;
            
            platformRec.recommendations.forEach(rec => {
                content += `* ${rec}\n`;
            });
            
            content += '\n';
        }
        
        // Add next steps
        content += '## Next Steps\n\n';
        results.recommendations.nextSteps.forEach((step, index) => {
            content += `${index + 1}. ${step}\n`;
        });
        
        // Create downloadable file
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attention-economy-recommendations.md';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }
    
    // Public API
    return {
        init,
        addNewPlatform,
        getAllPlatformData,
        getAllAudienceData,
        displayAnalysisResults,
        displayRecommendations,
        showLoading,
        hideLoading,
        showNotification,
        loadAnalysisData,
        exportRecommendations
    };
})();