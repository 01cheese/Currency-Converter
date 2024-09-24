const ctx = document.getElementById('exchangeRateChart').getContext('2d');
let exchangeRateChart;
let timeRange = '1m';  // Default to 1 month
const labels = {
    "48h": ["2 days ago", "1 day ago", "Today"],
    "1w": ["6 days ago", "5 days ago", "4 days ago", "3 days ago", "2 days ago", "1 day ago", "Today"],
    "1m": ["30 days ago", "25 days ago", "20 days ago", "15 days ago", "10 days ago", "5 days ago", "Yesterday", "Today"],
    "6m": ["6 months ago", "5 months ago", "4 months ago", "3 months ago", "2 months ago", "1 month ago", "Today"],
    "1y": ["12 months ago", "9 months ago", "6 months ago", "3 months ago", "Today"]
};



// Function to update the chart with selected currency pair data and time range
// Function to update the chart with selected currency pair data and time range
function updateChart(fromCurrency, toCurrency, historicalData) {
    const timeLabels = labels[timeRange];

    if (exchangeRateChart) {
        exchangeRateChart.destroy(); // Destroy the previous chart before creating a new one
    }

    if (!historicalData || historicalData.length === 0) {
        alert('No historical data available for this currency pair.');
        return;
    }

    exchangeRateChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: `1 ${fromCurrency} to ${toCurrency}`,
                data: historicalData,  // Now uses real historical data
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
    calculateConversion(); // Re-trigger conversion and update with the new time range
}

// Event listeners for currency change
document.getElementById('from-currency').addEventListener('change', calculateConversion);
document.getElementById('to-currency').addEventListener('change', calculateConversion);

// Function to fetch historical data for the chart
function fetchHistoricalData(fromCurrency, toCurrency) {
    // Ideally, this would make an AJAX call to a backend or API to fetch real data
    // For now, we simulate it with mock data
    return fetch(`/convert?from=${fromCurrency}&to=${toCurrency}&amount=1`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return [];
            }
            return data.historical_data;
        });
}

// Call this function when swapping currencies
function calculateConversion() {
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;

    fetchHistoricalData(fromCurrency, toCurrency)
        .then(historicalData => {
            updateChart(fromCurrency, toCurrency, historicalData);
        });
}

// Initial load of the chart
calculateConversion();
