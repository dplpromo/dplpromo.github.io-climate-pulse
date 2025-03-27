# Climate Pulse

A static, interactive web application for visualizing global temperature trends from 1880 to 2022 using the NOAA Global Surface Temperature dataset.

![Climate Pulse Screenshot](data/temperature_plot.png)

## Features

- **Interactive Temperature Visualization**: Explore global temperature anomalies with an interactive Chart.js line chart
- **Year Range Filtering**: Use a slider to dynamically filter the data by year range
- **Decadal Averages**: View temperature trends by decade with color-coded bar charts
- **Custom Year Range Analysis**: Select specific start and end years to analyze temperature distribution
- **Key Statistics**: See warming rate, warmest/coldest years, and data range at a glance
- **Responsive Design**: Works on desktop and mobile devices with Bootstrap styling

## Data Source

This application uses the [NOAA Global Surface Temperature Dataset](https://www.ncei.noaa.gov/products/land-based-station/noaa-global-temp), which provides global temperature anomalies relative to the 1971-2000 baseline period. The data spans from 1880 to 2022 and shows a clear warming trend of approximately 0.0725°C per decade.

## Project Structure

```
climate_pulse/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Custom CSS styles
├── js/
│   ├── app.js              # Main application logic
│   └── config.js           # Configuration settings
├── data/
│   ├── climate_data.json   # Processed climate data in JSON format
│   └── global_temp_data.asc # Raw NOAA temperature data
└── README.md               # This documentation
```

## Deployment to GitHub Pages

To deploy this project to GitHub Pages:

1. **Create a GitHub repository**:
   - Sign in to GitHub and create a new repository
   - Choose a repository name (e.g., "climate-pulse")

2. **Initialize Git and push the code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/climate-pulse.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click on "Settings" > "Pages"
   - Under "Source", select "main" branch
   - Click "Save"
   - GitHub will provide a URL where your site is published (typically https://yourusername.github.io/climate-pulse/)

4. **Verify deployment**:
   - Wait a few minutes for GitHub to build and deploy your site
   - Visit the provided URL to ensure everything works correctly

## Local Development

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/climate-pulse.git
   cd climate-pulse
   ```

2. Serve the files using a local web server:
   - Using Python:
     ```bash
     python -m http.server
     ```
   - Using Node.js:
     ```bash
     npx serve
     ```

3. Open your browser and navigate to `http://localhost:8000` (or the port provided by your server)

## Browser Compatibility

Climate Pulse works in all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Customization

To use your own climate dataset:
1. Replace `data/climate_data.json` with your own data
2. Ensure your JSON structure matches the expected format or update the JavaScript code accordingly

## License

This project is available under the MIT License.

## Acknowledgments

- Data provided by the National Oceanic and Atmospheric Administration (NOAA)
- Built with [Bootstrap](https://getbootstrap.com/) and [Chart.js](https://www.chartjs.org/)
