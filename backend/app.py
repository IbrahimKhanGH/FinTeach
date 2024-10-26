# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.accounts_balance_get_request import AccountsBalanceGetRequest
import time
from plaid.model.account_base import AccountBase
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.transactions_get_request_options import TransactionsGetRequestOptions
from datetime import datetime, timedelta
from plaid.model.investments_holdings_get_request import InvestmentsHoldingsGetRequest
from plaid.model.investments_transactions_get_request import InvestmentsTransactionsGetRequest
from plaid.model.investment_transaction_type import InvestmentTransactionType
from plaid.exceptions import ApiException

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Plaid configuration
PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET')
PLAID_ENV = os.getenv('PLAID_ENV', 'sandbox')

if PLAID_ENV == 'sandbox':
    host = plaid.Environment.Sandbox
elif PLAID_ENV == 'development':
    host = plaid.Environment.Development
elif PLAID_ENV == 'production':
    host = plaid.Environment.Production
else:
    host = plaid.Environment.Sandbox

configuration = plaid.Configuration(
    host=host,
    api_key={
        'clientId': PLAID_CLIENT_ID,
        'secret': PLAID_SECRET,
    }
)
api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

# Store access tokens (in-memory for this example; use a database in production)
user_access_tokens = {}

@app.route('/create_link_token', methods=['GET'])
def create_link_token():
    print("Create link token route hit")
    try:
        request = LinkTokenCreateRequest(
            products=[
                Products('auth'),
                Products('transactions'),
                Products('assets'),
                Products('investments'),
                Products('liabilities'),
                Products('identity')
            ],
            client_name="Plaid Test App",
            country_codes=[CountryCode('US')],
            language='en',
            user=LinkTokenCreateRequestUser(
                client_user_id=str(time.time())
            )
        )
        
        print("Sending request to Plaid API:", request.to_dict())
        response = client.link_token_create(request)
        print("Link token created successfully:", response.to_dict())
        return jsonify(response.to_dict())
    except plaid.ApiException as e:
        print(f"Plaid API error: {e}")
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/exchange_public_token', methods=['POST'])
def exchange_public_token():
    print("Exchange public token route hit")
    public_token = request.json.get('public_token')
    if not public_token:
        return jsonify({'error': 'public_token is required'}), 400
    try:
        exchange_request = ItemPublicTokenExchangeRequest(public_token=public_token)
        exchange_response = client.item_public_token_exchange(exchange_request)
        access_token = exchange_response.access_token

        # Store the access token associated with the user
        user_id = 'unique_user_id'  # In a real app, use the authenticated user's ID
        user_access_tokens[user_id] = access_token

        return jsonify({'access_token': access_token, 'message': 'Access token saved'})
    except plaid.ApiException as e:
        error_response = format_error(e)
        return jsonify(error_response), 500

@app.route('/get_accounts', methods=['GET'])
def get_accounts():
    print("Get accounts route hit")
    user_id = 'unique_user_id'  # In a real app, use the authenticated user's ID
    access_token = user_access_tokens.get(user_id)
    if not access_token:
        return jsonify({'error': 'Access token not found'}), 400
    try:
        balance_request = AccountsBalanceGetRequest(access_token=access_token)
        balance_response = client.accounts_balance_get(balance_request)
        accounts = balance_response.accounts
        accounts_data = []
        for account in accounts:
            account_info = {
                'account_id': account.account_id,
                'name': account.name,
                'type': account.type.value if account.type else None,
                'subtype': account.subtype.value if account.subtype else None,
                'mask': account.mask,
                'balances': {
                    'available': float(account.balances.available) if account.balances.available is not None else None,
                    'current': float(account.balances.current) if account.balances.current is not None else None,
                    'limit': float(account.balances.limit) if account.balances.limit is not None else None,
                }
            }
            accounts_data.append(account_info)
        return jsonify({'accounts': accounts_data})
    except plaid.ApiException as e:
        print(f"Plaid API error: {e}")
        error_response = format_error(e)
        return jsonify(error_response), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/get_financial_data', methods=['GET'])
def get_financial_data():
    print("Get financial data route hit")
    user_id = 'unique_user_id'  # In a real app, use the authenticated user's ID
    access_token = user_access_tokens.get(user_id)
    if not access_token:
        return jsonify({'error': 'Access token not found'}), 400

    try:
        # Get accounts
        accounts_request = AccountsGetRequest(access_token=access_token)
        accounts_response = client.accounts_get(accounts_request)
        accounts = accounts_response['accounts']

        # Get transactions for the last 30 days
        start_date = (datetime.now() - timedelta(days=30)).date()
        end_date = datetime.now().date()
        transactions_request = TransactionsGetRequest(
            access_token=access_token,
            start_date=start_date,
            end_date=end_date,
            options=TransactionsGetRequestOptions(count=500, offset=0)
        )
        transactions_response = client.transactions_get(transactions_request)
        transactions = transactions_response['transactions']

        # Get investments holdings
        investments_request = InvestmentsHoldingsGetRequest(access_token=access_token)
        investments_response = client.investments_holdings_get(investments_request)
        holdings = investments_response['holdings']
        securities = investments_response['securities']

        # Get investment transactions
        inv_transactions_request = InvestmentsTransactionsGetRequest(
            access_token=access_token,
            start_date=start_date,
            end_date=end_date
        )
        inv_transactions_response = client.investments_transactions_get(inv_transactions_request)
        investment_transactions = inv_transactions_response['investment_transactions']

        # Process the financial data and ensure serialization compatibility
        financial_data = {
            'accounts': [
                {
                    'account_id': account['account_id'],
                    'name': account['name'],
                    'type': str(account['type']),
                    'subtype': str(account['subtype']),
                    'balances': {
                        'available': float(account['balances']['available']) if account['balances']['available'] is not None else None,
                        'current': float(account['balances']['current']) if account['balances']['current'] is not None else None,
                        'limit': float(account['balances']['limit']) if account['balances']['limit'] is not None else None,
                    }
                } for account in accounts
            ],
            'transactions': [
                {
                    'transaction_id': transaction['transaction_id'],
                    'amount': float(transaction['amount']),
                    'date': str(transaction['date']),
                    'name': transaction['name'],
                    'category': transaction['category']
                } for transaction in transactions
            ],
            'investments': {
                'holdings': [
                    {
                        'account_id': holding['account_id'],
                        'security_id': holding['security_id'],
                        'quantity': float(holding['quantity']),
                        'institution_value': float(holding['institution_value']) if holding['institution_value'] is not None else None,
                        'cost_basis': float(holding['cost_basis']) if holding['cost_basis'] is not None else None,
                    } for holding in holdings
                ],
                'securities': [
                    {
                        'security_id': security['security_id'],
                        'name': security['name'],
                        'ticker_symbol': security.get('ticker_symbol'),
                        'type': str(security['type']),
                        'close_price': float(security['close_price']) if security['close_price'] is not None else None,
                    } for security in securities
                ],
                'transactions': [
                    {
                        'investment_transaction_id': tx['investment_transaction_id'],
                        'account_id': tx['account_id'],
                        'security_id': tx['security_id'],
                        'date': str(tx['date']),
                        'name': tx['name'],
                        'quantity': float(tx['quantity']),
                        'amount': float(tx['amount']),
                        'type': str(tx['type']),
                    } for tx in investment_transactions
                ]
            },
        }

        return jsonify(financial_data)
    except ApiException as e:
        print(f"Plaid API error: {e}")
        error_response = format_error(e)
        return jsonify(error_response), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Test successful"}), 200

def format_error(e):
    response = e.body
    return {'error': response}

if __name__ == '__main__':
    app.run(port=5000)
