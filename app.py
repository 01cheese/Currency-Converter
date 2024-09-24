from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)


# Route to render the main page
@app.route('/')
def index():
    return render_template('index.html')


# API route for currency conversion and updating graph
@app.route('/convert', methods=['GET'])
def convert_currency():
    from_currency = request.args.get('from')
    to_currency = request.args.get('to')
    amount = request.args.get('amount')

    if amount is None:
        return jsonify({'error': 'Amount parameter is missing'}), 400

    try:
        amount = float(amount)
    except ValueError:
        return jsonify({'error': 'Amount must be a number'}), 400

    # Replace with your own API key for real conversion rates
    api_key = 'bec71f42f34eba067cc235aa'
    response = requests.get(f'https://v6.exchangerate-api.com/v6/{api_key}/latest/{from_currency}')

    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch exchange rates'}), 500

    data = response.json()

    if 'conversion_rates' not in data:
        return jsonify({'error': 'Invalid data format from exchange rate API'}), 500

    rate = data['conversion_rates'].get(to_currency)

    if rate is None:
        return jsonify({'error': f'Currency {to_currency} not supported'}), 400

    converted_amount = amount * rate

    # Mock historical data for graph purposes, should be API-based for real implementation
    historical_data = [rate - 0.02, rate - 0.01, rate, rate + 0.01, rate + 0.02]

    return jsonify({'result': converted_amount, 'rate': rate, 'historical_data': historical_data})


@app.route('/currencies', methods=['GET'])
def get_currencies():
    api_key = 'bec71f42f34eba067cc235aa'
    response = requests.get(f'https://v6.exchangerate-api.com/v6/{api_key}/codes')

    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch currency codes'}), 500

    data = response.json()

    if 'supported_codes' not in data:
        return jsonify({'error': 'Invalid data format from exchange rate API'}), 500

    supported_codes = data['supported_codes']
    return jsonify({'currencies': supported_codes})




if __name__ == '__main__':
    app.run(debug=True)
