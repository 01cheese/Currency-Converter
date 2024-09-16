const ctx = document.getElementById('exchangeRateChart').getContext('2d');
let exchangeRateChart;
let timeRange = '1m';  // Default to 1 month

// Mock historical data for different time ranges (can be replaced with real API data)
const exchangeRates = {
    "USD_UAH_48h": [41.05, 41.00, 41.10],
    "USD_UAH_1w": [40.90, 41.00, 41.05, 41.08, 41.10, 41.00, 41.15],
    "USD_UAH_1m": [40.80, 40.85, 40.90, 41.00, 41.05, 41.10, 41.00, 41.10],
    // Extend with more currency pairs and ranges...
};

const labels = {
    "48h": ["2 days ago", "1 day ago", "Today"],
    "1w": ["6 days ago", "5 days ago", "4 days ago", "3 days ago", "2 days ago", "1 day ago", "Today"],
    "1m": ["30 days ago", "25 days ago", "20 days ago", "15 days ago", "10 days ago", "5 days ago", "Yesterday", "Today"],
    // More labels for other periods...
};

// Function to update the chart with selected currency pair data and time range
function updateChart(fromCurrency, toCurrency) {
    const currencyPair = `${fromCurrency}_${toCurrency}_${timeRange}`;
    const data = exchangeRates[currencyPair] || [];
    const timeLabels = labels[timeRange];

    if (exchangeRateChart) {
        exchangeRateChart.destroy(); // Destroy the previous chart before creating a new one
    }

    exchangeRateChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: `1 ${fromCurrency} to ${toCurrency}`,
                data: data,
                borderColor: 'green',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: `${fromCurrency} to ${toCurrency} Exchange Rate`
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

// Handle time range selection
function updateTimeframe(range) {
    timeRange = range;
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    updateChart(fromCurrency, toCurrency);
}

// Event listeners for currency change
document.getElementById('from-currency').addEventListener('change', function () {
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    updateChart(fromCurrency, toCurrency);
});

document.getElementById('to-currency').addEventListener('change', function () {
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    updateChart(fromCurrency, toCurrency);
});

// Default load
updateChart('USD', 'UAH');  // Load initial chart with default USD to UAH
