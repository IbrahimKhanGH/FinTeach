# app.py

from flask import Flask, request, jsonify, session
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
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SECRET_KEY'] = 'your-secret-key'

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

# Load teachers from JSON file
with open('teachers.json', 'r') as f:
    teachers = json.load(f)

# Mapping of Plaid user_ids to teacher ids
plaid_user_to_teacher = {
    "custom_early": 0,  # Index for early career
    "custom_middle": 1,  # Index for middle career
    "custom_late": 2  # Index for late career
}

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
    user_id = session.get('user_id')  # Get the user_id from the session
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401
    
    teacher_index = plaid_user_to_teacher.get(user_id)
    if teacher_index is None:
        return jsonify({'error': 'Invalid user ID'}), 400
    
    # Return the financial data for the logged-in user
    return jsonify(teachers[teacher_index])  # Return the entire teacher data

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Test successful"}), 200

@app.route('/login', methods=['POST'])
def login():
    plaid_user_id = request.json.get('plaid_user_id')
    
    if plaid_user_id not in plaid_user_to_teacher:
        return jsonify({"error": "Invalid Plaid user ID"}), 401
    
    teacher_index = plaid_user_to_teacher[plaid_user_id]
    session['user_id'] = plaid_user_id
    
    return jsonify({
        "message": "Login successful",
        "teacher": teachers[teacher_index]  # Return the corresponding teacher data
    })

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logout successful"})

def format_error(e):
    response = e.body
    return {'error': response}

if __name__ == '__main__':
    app.run(debug=True)
