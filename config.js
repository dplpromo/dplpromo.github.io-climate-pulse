/**
 * Climate Pulse - Configuration
 * Global configuration settings for the application
 */

// API endpoint for climate data
const CONFIG = {
    // Path to the climate data JSON file
    dataUrl: 'climate_data.json',
    
    // Chart colors
    colors: {
        temperature: 'rgba(220, 53, 69, 0.8)',   // Red for temperature line
        average: 'rgba(13, 110, 253, 0.9)',      // Blue for moving average
        trend: 'rgba(40, 167, 69, 0.7)',         // Green for trend line
        decadal: 'rgba(255, 193, 7, 0.8)',       // Yellow for decadal bars
        distribution: 'rgba(111, 66, 193, 0.7)'  // Purple for distribution
    },
    
    // Default year range
    defaultYearRange: {
        min: 1880,
        max: 2022
    },
    
    // Chart animation duration in milliseconds
    animationDuration: 800
};
