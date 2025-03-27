/**
 * Climate Pulse - Main Application
 * JavaScript functionality for interactive climate data visualization
 */

// Global variables
let climateData = null;
let temperatureChart = null;
let decadalChart = null;
let distributionChart = null;
let yearRange = { ...CONFIG.defaultYearRange };

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load climate data
    loadClimateData();
});

/**
 * Load climate data from JSON file
 */
async function loadClimateData() {
    try {
        const response = await fetch(CONFIG.dataUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        climateData = await response.json();
        
        // Initialize the application with the loaded data
        initializeApp();
    } catch (error) {
        console.error('Error loading climate data:', error);
        document.body.innerHTML = `
            <div class="container mt-5 text-center">
                <div class="alert alert-danger">
                    <h4>Error Loading Data</h4>
                    <p>${error.message}</p>
                    <p>Please try refreshing the page.</p>
                </div>
            </div>
        `;
    }
}

/**
 * Initialize the application with loaded data
 */
function initializeApp() {
    // Update statistics
    updateStatistics();
    
    // Initialize year range slider
    initializeYearRangeSlider();
    
    // Initialize year dropdowns
    initializeYearDropdowns();
    
    // Create charts
    createTemperatureChart();
    createDecadalChart();
    createDistributionChart();
}

/**
 * Update statistics display
 */
function updateStatistics() {
    const stats = climateData.statistics;
    
    // Update header badge
    document.getElementById('warming-rate').textContent = 
        `${stats.warming_rate_per_decade}°C warming per decade`;
    
    // Update statistics cards
    document.getElementById('data-range').textContent = 
        `${stats.start_year} to ${stats.end_year} (${stats.total_years} years)`;
    
    document.getElementById('warming-rate-card').textContent = 
        `${stats.warming_rate_per_decade}°C per decade`;
    
    document.getElementById('warmest-year').textContent = 
        `${stats.warmest_year.year} (${stats.warmest_year.anomaly}°C)`;
    
    document.getElementById('coldest-year').textContent = 
        `${stats.coldest_year.year} (${stats.coldest_year.anomaly}°C)`;
}

/**
 * Initialize the year range slider
 */
function initializeYearRangeSlider() {
    const slider = document.getElementById('year-range');
    const selectedRange = document.getElementById('selected-range');
    const stats = climateData.statistics;
    const totalYears = stats.end_year - stats.start_year;
    
    // Set slider attributes
    slider.min = 0;
    slider.max = 100;
    slider.value = 100; // Start with full range
    
    // Update selected range text
    selectedRange.textContent = `${stats.start_year}-${stats.end_year}`;
    
    // Add event listener for slider changes
    slider.addEventListener('input', (e) => {
        const percentage = e.target.value;
        const minYear = stats.start_year;
        const range = Math.floor((percentage / 100) * totalYears);
        const maxYear = minYear + range;
        
        // Update display
        selectedRange.textContent = `${minYear}-${maxYear}`;
        
        // Update year range
        yearRange.min = minYear;
        yearRange.max = maxYear;
        
        // Update charts with new range
        updateChartsWithYearRange();
    });
}

/**
 * Initialize year dropdowns for custom range selection
 */
function initializeYearDropdowns() {
    const startYearSelect = document.getElementById('start-year');
    const endYearSelect = document.getElementById('end-year');
    const stats = climateData.statistics;
    
    // Populate year options
    for (let year = stats.start_year; year <= stats.end_year; year++) {
        const startOption = document.createElement('option');
        startOption.value = year;
        startOption.textContent = year;
        
        const endOption = document.createElement('option');
        endOption.value = year;
        endOption.textContent = year;
        
        startYearSelect.appendChild(startOption);
        endYearSelect.appendChild(endOption);
    }
    
    // Set default values
    startYearSelect.value = stats.start_year;
    endYearSelect.value = stats.end_year;
    
    // Add event listeners
    startYearSelect.addEventListener('change', updateDistributionChart);
    endYearSelect.addEventListener('change', updateDistributionChart);
}

/**
 * Create the main temperature chart
 */
function createTemperatureChart() {
    const ctx = document.getElementById('temperature-chart').getContext('2d');
    
    // Filter data based on year range
    const filteredData = filterDataByYearRange(climateData.annual_data);
    
    // Prepare chart data
    const labels = filteredData.map(d => d.year);
    const anomalyData = filteredData.map(d => d.anomaly);
    const movingAvgData = filteredData.map(d => d.moving_avg_5yr);
    
    // Calculate trend line
    const trendData = calculateTrendLine(filteredData);
    
    // Create chart
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Annual Temperature Anomaly',
                    data: anomalyData,
                    borderColor: CONFIG.colors.temperature,
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    pointRadius: 2,
                    pointHoverRadius: 5
                },
                {
                    label: '5-Year Moving Average',
                    data: movingAvgData,
                    borderColor: CONFIG.colors.average,
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    pointRadius: 0,
                    pointHoverRadius: 0
                },
                {
                    label: `Trend: ${climateData.statistics.warming_rate_per_decade}°C/decade`,
                    data: trendData,
                    borderColor: CONFIG.colors.trend,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    pointRadius: 0,
                    pointHoverRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: CONFIG.animationDuration
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    },
                    ticks: {
                        maxTicksLimit: 20
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature Anomaly (°C)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

/**
 * Create the decadal averages chart
 */
function createDecadalChart() {
    const ctx = document.getElementById('decadal-chart').getContext('2d');
    
    // Get decadal data
    const decades = climateData.decadal_averages.decades;
    const values = climateData.decadal_averages.values;
    
    // Create gradient colors based on temperature values
    const colors = values.map(value => {
        // Red for warm, blue for cool
        return value >= 0 
            ? `rgba(220, 53, 69, ${0.5 + value * 0.5})`
            : `rgba(13, 110, 253, ${0.5 + Math.abs(value) * 0.5})`;
    });
    
    // Create chart
    decadalChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: decades,
            datasets: [{
                label: 'Decadal Average Temperature Anomaly',
                data: values,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace(/[\d\.]+\)$/, '1)')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: CONFIG.animationDuration
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Temperature Anomaly (°C)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(3)}°C`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create the temperature distribution chart
 */
function createDistributionChart() {
    const ctx = document.getElementById('distribution-chart').getContext('2d');
    
    // Update the chart with current dropdown selections
    updateDistributionChart();
}

/**
 * Update the distribution chart based on selected years
 */
function updateDistributionChart() {
    const startYearSelect = document.getElementById('start-year');
    const endYearSelect = document.getElementById('end-year');
    
    const startYear = parseInt(startYearSelect.value);
    const endYear = parseInt(endYearSelect.value);
    
    // Validate range
    if (startYear > endYear) {
        alert('Start year must be less than or equal to end year');
        startYearSelect.value = endYear;
        return;
    }
    
    // Filter data for selected range
    const filteredData = climateData.annual_data.filter(
        d => d.year >= startYear && d.year <= endYear
    );
    
    // Calculate average for the period
    const avgTemp = filteredData.reduce((sum, d) => sum + d.anomaly, 0) / filteredData.length;
    
    // Prepare data for chart
    const years = filteredData.map(d => d.year);
    const anomalies = filteredData.map(d => d.anomaly);
    
    // Create or update chart
    if (distributionChart) {
        distributionChart.data.labels = years;
        distributionChart.data.datasets[0].data = anomalies;
        distributionChart.options.plugins.annotation.annotations.line.value = avgTemp;
        distributionChart.update();
    } else {
        distributionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'Temperature Anomaly',
                    data: anomalies,
                    backgroundColor: anomalies.map(val => 
                        val >= 0 ? CONFIG.colors.temperature : CONFIG.colors.average
                    )
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: CONFIG.animationDuration
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Temperature Anomaly (°C)'
                        }
                    },
                    x: {
                        ticks: {
                            maxTicksLimit: 10,
                            callback: function(val, index) {
                                const year = this.getLabelForValue(val);
                                return index % Math.ceil(years.length / 10) === 0 ? year : '';
                            }
                        }
                    }
                },
                plugins: {
                    annotation: {
                        annotations: {
                            line: {
                                type: 'line',
                                yMin: avgTemp,
                                yMax: avgTemp,
                                borderColor: 'rgba(0, 0, 0, 0.5)',
                                borderWidth: 2,
                                borderDash: [6, 4],
                                label: {
                                    content: `Average: ${avgTemp.toFixed(3)}°C`,
                                    enabled: true,
                                    position: 'end'
                                }
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return `Year: ${context[0].label}`;
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Filter data by year range
 */
function filterDataByYearRange(data) {
    return data.filter(d => d.year >= yearRange.min && d.year <= yearRange.max);
}

/**
 * Calculate trend line data points
 */
function calculateTrendLine(data) {
    // Simple linear regression
    const n = data.length;
    const years = data.map(d => d.year);
    const temps = data.map(d => d.anomaly);
    
    // Calculate means
    const meanYear = years.reduce((sum, y) => sum + y, 0) / n;
    const meanTemp = temps.reduce((sum, t) => sum + t, 0) / n;
    
    // Calculate slope and intercept
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
        numerator += (years[i] - meanYear) * (temps[i] - meanTemp);
        denominator += Math.pow(years[i] - meanYear, 2);
    }
    
    const slope = numerator / denominator;
    const intercept = meanTemp - slope * meanYear;
    
    // Generate trend line points
    return years.map(year => slope * year + intercept);
}

/**
 * Update charts with new year range
 */
function updateChartsWithYearRange() {
    if (!temperatureChart) return;
    
    // Filter data based on year range
    const filteredData = filterDataByYearRange(climateData.annual_data);
    
    // Update temperature chart
    temperatureChart.data.labels = filteredData.map(d => d.year);
    temperatureChart.data.datasets[0].data = filteredData.map(d => d.anomaly);
    temperatureChart.data.datasets[1].data = filteredData.map(d => d.moving_avg_5yr);
    temperatureChart.data.datasets[2].data = calculateTrendLine(filteredData);
    
    temperatureChart.update();
}
