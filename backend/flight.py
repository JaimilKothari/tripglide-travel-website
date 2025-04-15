from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import mysql.connector
from datetime import datetime, timedelta
import logging
import traceback

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler('flight_api.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Database connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="tripglide"
        )
        logger.info("Database connection established")
        return conn
    except mysql.connector.Error as e:
        logger.error(f"Database connection failed: {str(e)}")
        return None

# API: Fetch all flight details
@app.route('/get_data', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_data():
    if request.method == 'OPTIONS':
        logger.info("Handling OPTIONS for /get_data")
        return jsonify({}), 200
    logger.info("Received GET request for /get_data")
    connection = get_db_connection()
    if connection is None:
        logger.error("Failed to connect to database for /get_data")
        return jsonify({"error": "DatabaseConnectionError", "message": "Failed to connect to database"}), 500
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM flights")
        data = cursor.fetchall()
        for row in data:
            for key, value in row.items():
                if isinstance(value, timedelta):
                    row[key] = str(value)
                elif isinstance(value, datetime):
                    row[key] = value.strftime("%Y-%m-%d %H:%M:%S")
        logger.info(f"Returning {len(data)} flights")
        return jsonify(data)
    except mysql.connector.Error as e:
        logger.error(f"Database query error in /get_data: {str(e)}")
        return jsonify({"error": "DatabaseQueryError", "message": str(e)}), 500
    except Exception as e:
        logger.error(f"Unexpected error in /get_data: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": "UnexpectedError", "message": str(e)}), 500
    finally:
        cursor.close()
        connection.close()
        logger.info("Database connection closed for /get_data")

# API: Fetch unique airports
@app.route('/get_flights', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_cities():
    if request.method == 'OPTIONS':
        logger.info("Handling OPTIONS for /get_flights")
        return jsonify({}), 200
    logger.info("Received GET request for /get_flights")
    connection = get_db_connection()
    if connection is None:
        logger.error("Failed to connect to database for /get_flights")
        return jsonify({"error": "DatabaseConnectionError", "message": "Failed to connect to database"}), 500
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT DISTINCT departure FROM flights")
        departure_airports = [row["departure"] for row in cursor.fetchall()]
        cursor.execute("SELECT DISTINCT arrival FROM flights")
        arrival_airports = [row["arrival"] for row in cursor.fetchall()]
        response = {
            "departure_airport": departure_airports if departure_airports else [],
            "arrival_airport": arrival_airports if arrival_airports else []
        }
        logger.info("Returning airports data")
        return jsonify(response)
    except mysql.connector.Error as e:
        logger.error(f"Database query error in /get_flights: {str(e)}")
        return jsonify({"error": "DatabaseQueryError", "message": str(e)}), 500
    except Exception as e:
        logger.error(f"Unexpected error in /get_flights: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": "UnexpectedError", "message": str(e)}), 500
    finally:
        cursor.close()
        connection.close()
        logger.info("Database connection closed for /get_flights")

# API: Save booking confirmation
@app.route('/api/save_booking_confirmation', methods=['POST', 'OPTIONS'])
@cross_origin()
def save_booking_confirmation():
    if request.method == 'OPTIONS':
        logger.info("Handling OPTIONS for /save_booking_confirmation")
        return jsonify({}), 200
    logger.info("Received POST request for /save_booking_confirmation")
    connection = get_db_connection()
    if connection is None:
        logger.error("Failed to connect to database for /save_booking_confirmation")
        return jsonify({"error": "DatabaseConnectionError", "message": "Failed to connect to database"}), 500
    cursor = connection.cursor()
    try:
        data = request.get_json()
        if not data:
            logger.warning("No JSON data received in /save_booking_confirmation")
            return jsonify({"error": "ValidationError", "message": "Request body must be JSON"}), 400
        logger.debug(f"Booking data: {data}")
        booking_number = data.get('booking_number')
        traveler_name = data.get('traveler_name')
        email = data.get('email')
        phone = data.get('phone')
        booked_on = data.get('booked_on')
        airline = data.get('airline')
        flight_number = data.get('flight_number')
        departure_airport = data.get('departure_airport')
        departure_time = data.get('departure_time')
        departure_date = data.get('departure_date')
        arrival_airport = data.get('arrival_airport')
        arrival_time = data.get('arrival_time')
        arrival_date = data.get('arrival_date')
        duration = data.get('duration')
        stops = data.get('stops', 0)
        fare_type = data.get('fare_type')
        total_price = data.get('total_price')
        trip_type = data.get('trip_type')
        payment_method = data.get('payment_method')
        ticket_number = data.get('ticket_number')
        meal_preference = data.get('meal_preference')
        special_request = data.get('special_request', '')
        status = data.get('status', 'Upcoming')
        required_fields = ['booking_number', 'traveler_name', 'booked_on', 'trip_type']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            logger.warning(f"Missing required fields: {missing_fields}")
            return jsonify({
                "error": "ValidationError",
                "message": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
        query = """
            INSERT INTO flight_bookings (
                booking_number, traveler_name, email, phone, booked_on, airline, flight_number,
                departure_airport, departure_time, departure_date, arrival_airport, arrival_time,
                arrival_date, duration, stops, fare_type, total_price, trip_type, payment_method,
                ticket_number, meal_preference, special_request, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            booking_number, traveler_name, email, phone, booked_on, airline, flight_number,
            departure_airport, departure_time, departure_date, arrival_airport, arrival_time,
            arrival_date, duration, stops, fare_type, total_price, trip_type, payment_method,
            ticket_number, meal_preference, special_request, status
        )
        cursor.execute(query, values)
        connection.commit()
        logger.info(f"Booking saved successfully: {booking_number}")
        return jsonify({"message": "Booking saved successfully"}), 200
    except mysql.connector.Error as e:
        logger.error(f"Database error in /save_booking_confirmation: {str(e)}")
        return jsonify({"error": "DatabaseQueryError", "message": str(e)}), 500
    except Exception as e:
        logger.error(f"Unexpected error in /save_booking_confirmation: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": "UnexpectedError", "message": str(e)}), 500
    finally:
        cursor.close()
        connection.close()
        logger.info("Database connection closed for /save_booking_confirmation")

# API: Fetch user profile
@app.route('/api/profile', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_profile():
    if request.method == 'OPTIONS':
        logger.info("Handling OPTIONS for /api/profile")
        return jsonify({}), 200
    logger.info("Received GET request for /api/profile")
    connection = get_db_connection()
    if connection is None:
        logger.error("Failed to connect to database for /api/profile")
        return jsonify({"error": "DatabaseConnectionError", "message": "Failed to connect to database"}), 500
    cursor = connection.cursor(dictionary=True)
    try:
        identifier = request.args.get('identifier')
        if not identifier:
            logger.warning("Missing identifier in /api/profile request")
            return jsonify({"error": "ValidationError", "message": "Identifier is required"}), 400
        query = """
            SELECT username, email, phone 
            FROM users 
            WHERE email = %s OR phone = %s
        """
        cursor.execute(query, (identifier, identifier))
        user = cursor.fetchone()
        if not user:
            logger.info(f"No user found for identifier: {identifier}")
            return jsonify({"error": "NotFoundError", "message": "User not found"}), 404
        response = {
            "success": True,
            "user": {
                "username": user['username'] or "Guest",
                "email": user['email'] or "Not provided",
                "phone": user['phone'] or "Not provided"
            }
        }
        logger.info(f"Returning user profile for {identifier}")
        return jsonify(response)
    except mysql.connector.Error as e:
        logger.error(f"Database error in /api/profile: {str(e)}")
        return jsonify({"error": "DatabaseQueryError", "message": str(e)}), 500
    except Exception as e:
        logger.error(f"Unexpected error in /api/profile: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": "UnexpectedError", "message": str(e)}), 500
    finally:
        cursor.close()
        connection.close()
        logger.info("Database connection closed for /api/profile")

# API: Fetch flight bookings by email or phone
@app.route('/api/flight_bookings', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_flight_bookings():
    if request.method == 'OPTIONS':
        logger.info("Handling OPTIONS for /api/flight_bookings")
        return jsonify({}), 200
    logger.info("Received GET request for /api/flight_bookings")
    connection = get_db_connection()
    if connection is None:
        logger.error("Failed to connect to database for /api/flight_bookings")
        return jsonify({"error": "DatabaseConnectionError", "message": "Failed to connect to database"}), 500
    cursor = connection.cursor(dictionary=True)
    try:
        identifier = request.args.get('identifier')
        if not identifier:
            logger.warning("Missing identifier in /api/flight_bookings request")
            return jsonify({"error": "ValidationError", "message": "Identifier (email or phone) is required"}), 400
        query = """
            SELECT *
            FROM flight_bookings
            WHERE email = %s OR CAST(phone AS CHAR) = %s
            ORDER BY 
                CASE 
                    WHEN status = 'Upcoming' THEN 1
                    WHEN status = 'Completed' THEN 2
                    WHEN status = 'Cancelled' THEN 3
                END,
                booked_on DESC
        """
        logger.debug(f"Executing query with identifier: {identifier}")
        cursor.execute(query, (identifier, identifier))
        bookings = cursor.fetchall()
        logger.debug(f"Fetched {len(bookings)} bookings")
        for booking in bookings:
            for key, value in booking.items():
                try:
                    if isinstance(value, datetime):
                        booking[key] = value.strftime("%Y-%m-%d %H:%M:%S")
                    elif isinstance(value, timedelta):
                        total_seconds = int(value.total_seconds())
                        hours, remainder = divmod(total_seconds, 3600)
                        minutes, seconds = divmod(remainder, 60)
                        booking[key] = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
                    elif value is None:
                        booking[key] = ""
                except Exception as e:
                    logger.warning(f"Error processing field {key} in booking {booking.get('booking_number', 'unknown')}: {str(e)}")
                    booking[key] = ""
        logger.info(f"Returning {len(bookings)} flight bookings for identifier={identifier}")
        return jsonify({"success": True, "bookings": bookings})
    except mysql.connector.Error as e:
        logger.error(f"Database query error in /api/flight_bookings: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": "DatabaseQueryError", "message": str(e)}), 500
    except Exception as e:
        logger.error(f"Unexpected error in /api/flight_bookings: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": "UnexpectedError", "message": str(e)}), 500
    finally:
        try:
            cursor.close()
            connection.close()
            logger.info("Database connection closed for /api/flight_bookings")
        except Exception as e:
            logger.error(f"Error closing database connection: {str(e)}")

# API: Cancel a flight booking
@app.route('/api/cancel_flight_booking', methods=['POST', 'OPTIONS'])
@cross_origin()
def cancel_flight_booking():
    if request.method == 'OPTIONS':
        logger.info("Handling OPTIONS for /api/cancel_flight_booking")
        return jsonify({}), 200
    logger.info("Received POST request for /api/cancel_flight_booking")
    connection = get_db_connection()
    if connection is None:
        logger.error("Failed to connect to database for /api/cancel_flight_booking")
        return jsonify({"error": "DatabaseConnectionError", "message": "Failed to connect to database"}), 500
    cursor = connection.cursor()
    try:
        data = request.get_json()
        if not data:
            logger.warning("No JSON data received in /api/cancel_flight_booking")
            return jsonify({"error": "ValidationError", "message": "Request body must be JSON"}), 400
        booking_number = data.get('booking_number')
        if not booking_number:
            logger.warning("Missing booking_number in /api/cancel_flight_booking request")
            return jsonify({"error": "ValidationError", "message": "Booking number is required"}), 400
        # Check if booking exists and is Upcoming
        cursor.execute("SELECT status FROM flight_bookings WHERE booking_number = %s", (booking_number,))
        booking = cursor.fetchone()
        if not booking:
            logger.info(f"No booking found for booking_number: {booking_number}")
            return jsonify({"error": "NotFoundError", "message": "Booking not found"}), 404
        if booking[0] != 'Upcoming':
            logger.info(f"Booking {booking_number} cannot be cancelled, current status: {booking[0]}")
            return jsonify({"error": "InvalidStateError", "message": f"Cannot cancel booking with status: {booking[0]}"}), 400
        # Update status to Cancelled
        query = "UPDATE flight_bookings SET status = 'Cancelled' WHERE booking_number = %s"
        cursor.execute(query, (booking_number,))
        connection.commit()
        logger.info(f"Booking cancelled successfully: {booking_number}")
        return jsonify({"success": True, "message": "Booking cancelled successfully"}), 200
    except mysql.connector.Error as e:
        logger.error(f"Database error in /api/cancel_flight_booking: {str(e)}")
        return jsonify({"error": "DatabaseQueryError", "message": str(e)}), 500
    except Exception as e:
        logger.error(f"Unexpected error in /api/cancel_flight_booking: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": "UnexpectedError", "message": str(e)}), 500
    finally:
        cursor.close()
        connection.close()
        logger.info("Database connection closed for /api/cancel_flight_booking")

if __name__ == '__main__':
    logger.info("Starting Flask server on port 5000")
    app.run(debug=True, host="0.0.0.0", port=5000)