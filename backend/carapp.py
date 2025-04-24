from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import stripe
import os
from dotenv import load_dotenv
import re
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # Allow frontend requests

# Load environment variables
load_dotenv()
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', '***REMOVED***')

# MySQL connection function
def get_db_connection():
    try:
        return mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='tripglide'
        )
    except mysql.connector.Error as e:
        logger.error(f"DB_CONNECTION_ERROR: Failed to connect to MySQL - Code: {e.errno}, Message: {e.msg}")
        return None

# Fetch data helper function
def fetch_data(query, params=None):
    connection = get_db_connection()
    if connection is None:
        return None, {"error_code": "DB_CONNECTION_FAILED", "error_message": "Database connection failed", "details": "Unable to establish MySQL connection"}
    cursor = connection.cursor(dictionary=True)
    try:
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        data = cursor.fetchall()
        return data, None
    except mysql.connector.Error as e:
        logger.error(f"DB_QUERY_ERROR: Query failed - Query: {query}, Params: {params}, Code: {e.errno}, Message: {e.msg}")
        return None, {"error_code": "DB_QUERY_ERROR", "error_message": str(e), "details": f"Query: {query}, Params: {params}"}
    finally:
        cursor.close()
        connection.close()

# Initialize database tables
def initialize_database():
    connection = get_db_connection()
    if connection is None:
        logger.error("DB_INIT_ERROR: Cannot initialize database - No connection")
        return
    cursor = None
    try:
        cursor = connection.cursor()
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE,
                phone VARCHAR(15) UNIQUE,
                password VARCHAR(255),
                username VARCHAR(100),
                phone_verified BOOLEAN DEFAULT FALSE
            )
        """)
        # Create cab_booking table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cab_booking (
                booking_id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                car_make VARCHAR(50) NOT NULL,
                car_model VARCHAR(50) NOT NULL,
                car_type VARCHAR(50) NOT NULL,
                car_passengers INT NOT NULL DEFAULT 0,
                car_transmission VARCHAR(20) NOT NULL,
                car_ac BOOLEAN NOT NULL DEFAULT FALSE,
                selectedDeal_agency VARCHAR(50) NOT NULL,
                selectedDeal_pricePerDay DECIMAL(10, 2) NOT NULL,
                selectedDeal_fuelPolicy VARCHAR(50) NOT NULL,
                selectedDeal_id INT NOT NULL,
                pickupLocation VARCHAR(100) NOT NULL,
                pickupDate DATE NOT NULL,
                pickupTime TIME NOT NULL,
                dropoffDate DATE NOT NULL,
                dropoffTime TIME NOT NULL,
                dropoffLocation VARCHAR(100) NOT NULL,
                extras_additionalDriver BOOLEAN NOT NULL DEFAULT FALSE,
                extras_extra continui luggage BOOLEAN NOT NULL DEFAULT FALSE,
                extras_childSeat BOOLEAN NOT NULL DEFAULT FALSE,
                totalPrice DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status ENUM('Upcoming', 'Ongoing', 'Cancelled') DEFAULT 'Upcoming',
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            )
        """)
        # Create locations table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS locations (
                LocationID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(100),
                Address VARCHAR(255),
                City VARCHAR(100),
                Country VARCHAR(100)
            )
        """)
        connection.commit()
        logger.info("Database tables initialized successfully")
    except mysql.connector.Error as e:
        logger.error(f"DB_INIT_ERROR: Failed to initialize database tables - Code: {e.errno}, Message: {e.msg}")
        if connection:
            connection.rollback()
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# Validation Functions
def is_email(input_str):
    return bool(re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', input_str))

def is_phone(input_str):
    return bool(re.match(r'^\d{10}$', input_str))

def validate_password(password):
    return len(password) >= 6

# Initialize database
initialize_database()

# Routes
@app.route('/locations', methods=['GET'])
def get_locations():
    query = "SELECT DISTINCT City FROM locations ORDER BY City ASC"
    location_data, error = fetch_data(query)
    if error:
        logger.error(f"LOCATIONS_FETCH_ERROR: {error['error_message']} - Details: {error['details']}")
        return jsonify(error), 500
    locations = [row['City'] for row in location_data if row.get('City')]
    logger.info(f"Fetched locations: {locations}")
    return jsonify({"locations": locations})

@app.route('/locations/terminals', methods=['GET'])
def get_terminals():
    query = "SELECT DISTINCT Name FROM locations ORDER BY Name ASC"
    terminal_data, error = fetch_data(query)
    if error:
        logger.error(f"TERMINALS_FETCH_ERROR: {error['error_message']} - Details: {error['details']}")
        return jsonify(error), 500
    terminals = [row['Name'] for row in terminal_data if row.get('Name')]
    logger.info(f"Fetched terminals: {terminals}")
    return jsonify({"terminals": terminals})

@app.route('/', methods=['GET'])
def get_data():
    try:
        location = request.args.get('location')
        no_of_passengers = request.args.get('no_of_passenger')
        car_type = request.args.get('cartype')
        transmission = request.args.get('transmission')
        fuel_policy = request.args.get('fuel_policy')
        make = request.args.get('make')
        model = request.args.get('model')
        price = request.args.get('price')
        agency = request.args.get('agency')
        ratings = request.args.get('ratings')

        query_conditions = []
        query_params = []

        if location:
            query_conditions.append("City = %s")
            query_params.append(location)
        if no_of_passengers:
            query_conditions.append("Seats >= %s")
            query_params.append(no_of_passengers)
        if car_type:
            query_conditions.append("CarType = %s")
            query_params.append(car_type)
        if make:
            query_conditions.append("Make = %s")
            query_params.append(make)
        if model:
            query_conditions.append("Model = %s")
            query_params.append(model)
        if fuel_policy:
            query_conditions.append("Fuel_Policy = %s")
            query_params.append(fuel_policy)
        if transmission:
            query_conditions.append("Transmission = %s")
            query_params.append(transmission)
        if price:
            query_conditions.append("Price_Per_Hour_INR = %s")
            query_params.append(price)
        if agency:
            query_conditions.append("Agency = %s")
            query_params.append(agency)
        if ratings:
            query_conditions.append("Ratings >= %s")
            query_params.append(ratings)

        base_query = "SELECT * FROM cars"
        if query_conditions:
            base_query += " WHERE " + " AND ".join(query_conditions)

        logger.debug(f"Executing query: {base_query} with params: {query_params}")
        car_data, error = fetch_data(base_query, tuple(query_params) if query_params else None)
        if error:
            logger.error(f"CARS_FETCH_ERROR: {error['error_message']} - Details: {error['details']}")
            return jsonify(error), 500

        formatted_response = []
        if car_data:
            for row in car_data:
                formatted_response.append({
                    "id": row.get("CarID", "N/A"),
                    "location": row.get("City", "N/A"),
                    "passengers": row.get("Seats", 0),
                    "type": row.get("CarType", "N/A"),
                    "make": row.get("Make", "N/A"),
                    "model": row.get("Model", "N/A"),
                    "fuel_policy": row.get("Fuel_Policy", "Not specified"),
                    "transmission": row.get("Transmission", "N/A"),
                    "price": row.get("Price_Per_Hour_INR", 0),
                    "agency": row.get("Agency", "N/A"),
                    "ratings": row.get("Ratings", 0),
                    "ac": row.get("AC", "No"),
                    "image": row.get("Image", "https://via.placeholder.com/300x200")
                })
        logger.info(f"Returning {len(formatted_response)} cars")
        return jsonify(formatted_response)
    except Exception as e:
        logger.error(f"CARS_FETCH_GENERAL_ERROR: {str(e)}")
        return jsonify({"error_code": "CARS_FETCH_GENERAL_ERROR", "error_message": str(e), "details": "Unexpected error in get_data endpoint"}), 500

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        data = request.get_json()
        if not data:
            logger.error("CHECKOUT_INVALID_REQUEST: No data provided")
            return jsonify({"error_code": "CHECKOUT_INVALID_REQUEST", "error_message": "No data provided", "details": "Request body is empty"}), 400

        pickup_location = data.get('pickupLocation')
        pickup_date = data.get('pickupDate')
        pickup_time = data.get('pickupTime')
        dropoff_date = data.get('dropoffDate')
        dropoff_time = data.get('dropoffTime')
        dropoff_location = data.get('dropoffLocation')
        car_id = data.get('carId')
        car_make = data.get('carMake')
        car_model = data.get('carModel')
        total_price = data.get('amount')
        agency = data.get('agency')
        extras = data.get('extras', {})

        if not total_price or total_price <= 0:
            logger.error("CHECKOUT_INVALID_PRICE: Invalid total price")
            return jsonify({"error_code": "CHECKOUT_INVALID_PRICE", "error_message": "Invalid total price", "details": f"Total price: {total_price}"}), 400

        amount_in_paise = int(total_price)  # Convert INR to paise

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'inr',
                    'product_data': {
                        'name': f'Car Rental: {car_make} {car_model}',
                        'description': f'Pickup: {pickup_location} on {pickup_date} {pickup_time}, Dropoff: {dropoff_location} on {dropoff_date} {dropoff_time}',
                    },
                    'unit_amount': amount_in_paise,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:5173/cab-booking-confirmation',
            cancel_url='http://localhost:5173/cancel',
            metadata={
                'car_id': str(car_id),
                'pickup_location': pickup_location,
                'pickup_date': pickup_date,
                'dropoff_date': dropoff_date,
                'dropoff_location': dropoff_location,
                'agency': agency,
                'extras': str(extras)
            }
        )

        logger.info(f"Created Stripe session: {session.id}")
        return jsonify({'id': session.id})
    except stripe.error.StripeError as e:
        logger.error(f"CHECKOUT_STRIPE_ERROR: {str(e)} - Code: {e.code}, HTTP Status: {e.http_status}")
        return jsonify({"error_code": "CHECKOUT_STRIPE_ERROR", "error_message": str(e), "details": f"Stripe error code: {e.code}"}), 400
    except Exception as e:
        logger.error(f"CHECKOUT_GENERAL_ERROR: {str(e)}")
        return jsonify({"error_code": "CHECKOUT_GENERAL_ERROR", "error_message": str(e), "details": "Unexpected error in create_checkout_session endpoint"}), 500

@app.route('/api/save-booking', methods=['POST'])
def save_booking():
    try:
        data = request.get_json()
        if not data:
            logger.error("BOOKING_INVALID_REQUEST: No data provided")
            return jsonify({"error_code": "BOOKING_INVALID_REQUEST", "error_message": "No data provided", "details": "Request body is empty"}), 400

        connection = get_db_connection()
        if connection is None:
            logger.error("BOOKING_DB_CONNECTION: Database connection failed")
            return jsonify({"error_code": "BOOKING_DB_CONNECTION", "error_message": "Database connection failed", "details": "Unable to establish MySQL connection"}), 500

        cursor = connection.cursor()

        # Check for existing booking
        check_query = """
            SELECT COUNT(*) as count FROM cab_booking 
            WHERE user_id = %s 
            AND pickupDate = %s 
            AND pickupTime = %s 
            AND car_make = %s 
            AND car_model = %s
        """
        check_values = (
            data.get('user_id', 0),
            data['pickupDate'],
            data['pickupTime'],
            data['car_make'],
            data['car_model']
        )
        cursor.execute(check_query, check_values)
        result = cursor.fetchone()
        if result[0] > 0:
            cursor.close()
            connection.close()
            logger.info(f"BOOKING_DUPLICATE: Duplicate booking detected - UserID: {data.get('user_id', 0)}, Pickup: {data['pickupDate']} {data['pickupTime']}")
            return jsonify({"message": "Booking already exists"}), 200

        # Insert new booking
        query = """
            INSERT INTO cab_booking (
                user_id, car_make, car_model, car_type, car_passengers, car_transmission, car_ac,
                selectedDeal_agency, selectedDeal_pricePerDay, selectedDeal_fuelPolicy, selectedDeal_id,
                pickupLocation, pickupDate, pickupTime, dropoffDate, dropoffTime, dropoffLocation,
                extras_additionalDriver, extras_extraLuggage, extras_childSeat, totalPrice, created_at, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data.get('user_id', 0),
            data['car_make'],
            data['car_model'],
            data['car_type'],
            data['car_passengers'],
            data['car_transmission'],
            data['car_ac'],
            data['selectedDeal_agency'],
            float(data['selectedDeal_pricePerDay']),
            data['selectedDeal_fuelPolicy'],
            data['selectedDeal_id'],
            data['pickupLocation'],
            data['pickupDate'],
            data['pickupTime'],
            data['dropoffDate'],
            data['dropoffTime'],
            data['dropoffLocation'],
            data.get('extras_additionalDriver', False),
            data.get('extras_extraLuggage', False),
            data.get('extras_childSeat', False),
            float(data['totalPrice']),
            datetime.now(),
            'Upcoming'
        )

        cursor.execute(query, values)
        connection.commit()
        cursor.close()
        connection.close()
        logger.info("BOOKING_SAVED: Booking saved successfully")
        return jsonify({"message": "Booking saved successfully"}), 200
    except mysql.connector.Error as e:
        logger.error(f"BOOKING_DB_ERROR: Database error - Code: {e.errno}, Message: {e.msg}")
        return jsonify({"error_code": "BOOKING_DB_ERROR", "error_message": str(e), "details": f"Database error code: {e.errno}"}), 500
    except Exception as e:
        logger.error(f"BOOKING_GENERAL_ERROR: {str(e)}")
        return jsonify({"error_code": "BOOKING_GENERAL_ERROR", "error_message": str(e), "details": "Unexpected error in save_booking endpoint"}), 500

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            logger.error("BOOKINGS_INVALID_REQUEST: user_id is required")
            return jsonify({"error_code": "BOOKINGS_INVALID_REQUEST", "error_message": "user_id is required", "details": "Query parameter user_id missing"}), 400

        query = """
            SELECT * FROM cab_booking WHERE user_id = %s ORDER BY booking_id DESC
        """
        bookings, error = fetch_data(query, (user_id,))
        if error:
            logger.error(f"BOOKINGS_FETCH_ERROR: {error['error_message']} - Details: {error['details']}")
            return jsonify({"success": False, "error": error}), 500

        formatted_bookings = []
        for booking in bookings:
            formatted_bookings.append({
                "booking_id": booking["booking_id"],
                "user_id": booking["user_id"],
                "car_make": booking["car_make"],
                "car_model": booking["car_model"],
                "car_type": booking["car_type"],
                "car_passengers": booking["car_passengers"],
                "car_transmission": booking["car_transmission"],
                "car_ac": booking["car_ac"],
                "agency": booking["selectedDeal_agency"],
                "price_per_day": float(booking["selectedDeal_pricePerDay"]),
                "fuel_policy": booking["selectedDeal_fuelPolicy"],
                "deal_id": booking["selectedDeal_id"],
                "pickup_location": booking["pickupLocation"],
                "pickup_date": booking["pickupDate"].strftime("%Y-%m-%d") if booking["pickupDate"] else None,
                "pickup_time": str(booking["pickupTime"]) if booking["pickupTime"] else None,
                "dropoff_date": booking["dropoffDate"].strftime("%Y-%m-%d") if booking["dropoffDate"] else None,
                "dropoff_time": str(booking["dropoffTime"]) if booking["dropoffTime"] else None,
                "dropoff_location": booking["dropoffLocation"],
                "extras": {
                    "additional_driver": booking["extras_additionalDriver"],
                    "extra_luggage": booking["extras_extraLuggage"],
                    "child_seat": booking["extras_childSeat"]
                },
                "total_price": float(booking["totalPrice"]),
                "created_at": booking["created_at"].strftime("%Y-%m-%d %H:%M:%S") if booking["created_at"] else None,
                "status": booking["status"]
            })

        logger.info(f"Fetched {len(formatted_bookings)} bookings for user_id: {user_id}")
        return jsonify({"success": True, "bookings": formatted_bookings}), 200
    except Exception as e:
        logger.error(f"BOOKINGS_GENERAL_ERROR: {str(e)}")
        return jsonify({"error_code": "BOOKINGS_GENERAL_ERROR", "error_message": str(e), "details": "Unexpected error in get_bookings endpoint"}), 500

@app.route('/api/bookings/<int:booking_id>/cancel', methods=['POST'])
def cancel_booking(booking_id):
    try:
        connection = get_db_connection()
        if connection is None:
            logger.error("CANCEL_BOOKING_DB_CONNECTION: Database connection failed")
            return jsonify({"error_code": "CANCEL_BOOKING_DB_CONNECTION", "error_message": "Database connection failed", "details": "Unable to establish MySQL connection"}), 500

        cursor = connection.cursor()
        query = """
            UPDATE cab_booking 
            SET status = 'Cancelled' 
            WHERE booking_id = %s AND status = 'Upcoming'
        """
        cursor.execute(query, (booking_id,))
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            logger.error(f"CANCEL_BOOKING_NOT_FOUND: Booking not found or already cancelled - BookingID: {booking_id}")
            return jsonify({"error_code": "CANCEL_BOOKING_NOT_FOUND", "error_message": "Booking not found or already cancelled", "details": f"BookingID: {booking_id}"}), 404

        connection.commit()
        cursor.close()
        connection.close()
        logger.info(f"CANCEL_BOOKING_SUCCESS: Booking {booking_id} cancelled successfully")
        return jsonify({"success": True, "message": "Booking cancelled successfully"}), 200
    except mysql.connector.Error as e:
        logger.error(f"CANCEL_BOOKING_DB_ERROR: Database error - Code: {e.errno}, Message: {e.msg}")
        return jsonify({"error_code": "CANCEL_BOOKING_DB_ERROR", "error_message": str(e), "details": f"Database error code: {e.errno}"}), 500
    except Exception as e:
        logger.error(f"CANCEL_BOOKING_GENERAL_ERROR: {str(e)}")
        return jsonify({"error_code": "CANCEL_BOOKING_GENERAL_ERROR", "error_message": str(e), "details": "Unexpected error in cancel_booking endpoint"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    connection = get_db_connection()
    if connection is None:
        logger.error("LOGIN_DB_CONNECTION: Database unavailable")
        return jsonify({"error_code": "LOGIN_DB_CONNECTION", "error_message": "Database unavailable", "details": "Unable to establish MySQL connection"}), 500
    cursor = None
    try:
        data = request.get_json()
        if not data:
            logger.error("LOGIN_INVALID_REQUEST: No data provided")
            return jsonify({"error_code": "LOGIN_INVALID_REQUEST", "error_message": "No data provided", "details": "Request body is empty"}), 400

        identifier = data.get("identifier")
        password = data.get("password")
        logger.debug(f"Login attempt: identifier={identifier}")

        if not identifier or not password:
            logger.error("LOGIN_MISSING_FIELDS: Identifier and password required")
            return jsonify({"error_code": "LOGIN_MISSING_FIELDS", "error_message": "Identifier and password required", "details": "Both identifier and password must be provided"}), 400
        if not (is_email(identifier) or is_phone(identifier)):
            logger.error("LOGIN_INVALID_IDENTIFIER: Invalid email/phone")
            return jsonify({"error_code": "LOGIN_INVALID_IDENTIFIER", "error_message": "Invalid email/phone", "details": f"Identifier: {identifier}"}), 400

        cursor = connection.cursor(dictionary=True)
        field = "email" if is_email(identifier) else "phone"
        query = f"SELECT * FROM users WHERE {field} = %s AND password = %s"
        cursor.execute(query, (identifier, password))
        user = cursor.fetchone()
        cursor.fetchall()  # Consume any remaining results
        logger.debug(f"Query: {query}, Result: {user}")

        if not user:
            logger.error("LOGIN_INVALID_CREDENTIALS: Invalid credentials")
            return jsonify({"error_code": "LOGIN_INVALID_CREDENTIALS", "error_message": "Invalid credentials", "details": f"Identifier: {identifier}"}), 401

        identifiers_to_verify = [{"identifier": identifier, "type": "email" if is_email(identifier) else "sms"}]
        user_data = {k: v for k, v in user.items() if k != "password"}
        logger.info(f"LOGIN_PENDING_OTP: {field}={identifier}, sent to {identifiers_to_verify}")
        return jsonify({
            "success": False,
            "requires_verification": True,
            "identifiers": identifiers_to_verify,
            "user": user_data
        }), 200
    except mysql.connector.Error as e:
        logger.error(f"LOGIN_DB_ERROR: Database error - Code: {e.errno}, Message: {e.msg}")
        return jsonify({"error_code": "LOGIN_DB_ERROR", "error_message": f"Database error: {str(e)}", "details": f"Database error code: {e.errno}"}), 500
    except Exception as e:
        logger.error(f"LOGIN_GENERAL_ERROR: {str(e)}")
        return jsonify({"error_code": "LOGIN_GENERAL_ERROR", "error_message": f"Server error: {str(e)}", "details": "Unexpected error in login endpoint"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/verify_code', methods=['POST'])
def verify_code_route():
    connection = get_db_connection()
    if connection is None:
        logger.error("VERIFY_CODE_DB_CONNECTION: Database unavailable")
        return jsonify({"error_code": "VERIFY_CODE_DB_CONNECTION", "error_message": "Database unavailable", "details": "Unable to establish MySQL connection"}), 500
    cursor = None
    try:
        data = request.get_json()
        if not data:
            logger.error("VERIFY_CODE_INVALID_REQUEST: No data provided")
            return jsonify({"error_code": "VERIFY_CODE_INVALID_REQUEST", "error_message": "No data provided", "details": "Request body is empty"}), 400

        identifier = data.get("identifier")
        code = data.get("code")

        if not identifier or not code:
            logger.error("VERIFY_CODE_MISSING_FIELDS: Identifier and code required")
            return jsonify({"error_code": "VERIFY_CODE_MISSING_FIELDS", "error_message": "Identifier and code required", "details": "Both identifier and code must be provided"}), 400
        if not (is_email(identifier) or is_phone(identifier)):
            logger.error("VERIFY_CODE_INVALID_IDENTIFIER: Invalid email/phone")
            return jsonify({"error_code": "VERIFY_CODE_INVALID_IDENTIFIER", "error_message": "Invalid email/phone", "details": f"Identifier: {identifier}"}), 400

        if code == "123456":  # Placeholder for OTP verification
            cursor = connection.cursor(dictionary=True)
            field = "email" if is_email(identifier) else "phone"
            if field == "phone":
                cursor.execute(f"UPDATE users SET phone_verified = TRUE WHERE {field} = %s", (identifier,))
                connection.commit()
            cursor.execute(f"SELECT * FROM users WHERE {field} = %s", (identifier,))
            user = cursor.fetchone()
            cursor.fetchall()  # Consume any remaining results
            if not user:
                logger.error("VERIFY_CODE_USER_NOT_FOUND: User not found")
                return jsonify({"error_code": "VERIFY_CODE_USER_NOT_FOUND", "error_message": "User not found", "details": f"Identifier: {identifier}"}), 404
            logger.info(f"VERIFY_CODE_SUCCESS: {field} verified for {identifier}")
            return jsonify({
                "success": True,
                "message": "Verification successful",
                "user": {k: v for k, v in user.items() if k != "password"}
            }), 200
        logger.error("VERIFY_CODE_INVALID_CODE: Invalid verification code")
        return jsonify({"error_code": "VERIFY_CODE_INVALID_CODE", "error_message": "Invalid code", "details": f"Code: {code}"}), 400
    except mysql.connector.Error as e:
        logger.error(f"VERIFY_CODE_DB_ERROR: Database error - Code: {e.errno}, Message: {e.msg}")
        if connection:
            connection.rollback()
        return jsonify({"error_code": "VERIFY_CODE_DB_ERROR", "error_message": f"Database error: {str(e)}", "details": f"Database error code: {e.errno}"}), 500
    except Exception as e:
        logger.error(f"VERIFY_CODE_GENERAL_ERROR: {str(e)}")
        return jsonify({"error_code": "VERIFY_CODE_GENERAL_ERROR", "error_message": f"Server error: {str(e)}", "details": "Unexpected error in verify_code_route endpoint"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/signup', methods=['POST'])
def signup():
    connection = get_db_connection()
    if connection is None:
        logger.error("SIGNUP_DB_CONNECTION: Database unavailable")
        return jsonify({"error_code": "SIGNUP_DB_CONNECTION", "error_message": "Database unavailable", "details": "Unable to establish MySQL connection"}), 500
    cursor = None
    try:
        data = request.get_json()
        if not data:
            logger.error("SIGNUP_INVALID_REQUEST: No data provided")
            return jsonify({"error_code": "SIGNUP_INVALID_REQUEST", "error_message": "No data provided", "details": "Request body is empty"}), 400

        identifier = data.get("identifier")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        if not all([identifier, password, confirm_password]):
            logger.error("SIGNUP_MISSING_FIELDS: All fields are required")
            return jsonify({"error_code": "SIGNUP_MISSING_FIELDS", "error_message": "All fields are required", "details": "Identifier, password, and confirm_password must be provided"}), 400
        if password != confirm_password:
            logger.error("SIGNUP_PASSWORD_MISMATCH: Passwords do not match")
            return jsonify({"error_code": "SIGNUP_PASSWORD_MISMATCH", "error_message": "Passwords do not match", "details": "Password and confirm_password must be identical"}), 400
        if not validate_password(password):
            logger.error("SIGNUP_INVALID_PASSWORD: Password must be at least 6 characters")
            return jsonify({"error_code": "SIGNUP_INVALID_PASSWORD", "error_message": "Password must be at least 6 characters", "details": f"Password length: {len(password)}"}), 400
        if not (is_email(identifier) or is_phone(identifier)):
            logger.error("SIGNUP_INVALID_IDENTIFIER: Invalid email or 10-digit phone number")
            return jsonify({"error_code": "SIGNUP_INVALID_IDENTIFIER", "error_message": "Invalid email or 10-digit phone number", "details": f"Identifier: {identifier}"}), 400

        cursor = connection.cursor(dictionary=True)
        field = "email" if is_email(identifier) else "phone"
        cursor.execute(f"SELECT user_id FROM users WHERE {field} = %s", (identifier,))
        if cursor.fetchone():
            logger.error("SIGNUP_USER_EXISTS: User already exists with this identifier")
            return jsonify({"error_code": "SIGNUP_USER_EXISTS", "error_message": "User already exists with this identifier", "details": f"Identifier: {identifier}"}), 409

        cursor.execute(
            f"INSERT INTO users ({field}, password, username) VALUES (%s, %s, %s)",
            (identifier, password, "NewUser")
        )
        connection.commit()
        logger.info(f"SIGNUP_SUCCESS: User signed up - {field}={identifier}")
        return jsonify({"success": True, "message": "Signup successful"}), 201
    except mysql.connector.Error as e:
        logger.error(f"SIGNUP_DB_ERROR: Database error - Code: {e.errno}, Message: {e.msg}")
        if connection:
            connection.rollback()
        return jsonify({"error_code": "SIGNUP_DB_ERROR", "error_message": f"Database error: {str(e)}", "details": f"Database error code: {e.errno}"}), 500
    except Exception as e:
        logger.error(f"SIGNUP_GENERAL_ERROR: {str(e)}")
        if connection:
            connection.rollback()
        return jsonify({"error_code": "SIGNUP_GENERAL_ERROR", "error_message": f"Server error: {str(e)}", "details": "Unexpected error in signup endpoint"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5005)