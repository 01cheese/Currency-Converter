// Listen for changes on the currency or amount inputs
document.getElementById('from-amount').addEventListener('input', calculateConversion);
document.getElementById('from-currency').addEventListener('change', calculateConversion);
document.getElementById('to-currency').addEventListener('change', calculateConversion);

function calculateConversion() {
    const fromAmount = document.getElementById('from-amount').value;
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;

    // Make AJAX call to the Flask API for conversion
    fetch(`/convert?from=${fromCurrency}&to=${toCurrency}&amount=${fromAmount}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                // Update the converted amount
                document.getElementById('to-amount').value = data.result.toFixed(2);
                document.getElementById('conversion-rate').innerText = data.rate.toFixed(2);

                // Update the graph with new data
                updateChart(fromCurrency, toCurrency, data.historical_data);
            }
        });
}
function swapCurrencies() {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');

    // Swap the values
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    // Trigger recalculation
    calculateConversion();
}

// Initial load of the chart
calculateConversion();
