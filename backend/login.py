from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import re
import logging
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from livereload import Server
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # Match frontend port

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# MySQL Connection
def get_db_connection():
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",  # Update if you have a password
            database="tripglide"
        )
        logger.info("Database connection established")
        return db
    except mysql.connector.Error as e:
        logger.error(f"Failed to connect to database: {e}")
        return None

db = get_db_connection()

# Root route
@app.route('/')
def index():
    if not db:
        return jsonify({"success": False, "error": "Database connection failed"}), 500
    return jsonify({"success": True, "message": "TripGlide API running"}), 200

# Load Twilio credentials
load_dotenv()
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_VERIFY_SERVICE_SID = os.getenv('TWILIO_VERIFY_SERVICE_SID')

twilio_client = None
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID:
    try:
        twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        logger.info("Twilio client initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Twilio client: {e}")
else:
    logger.error("Twilio credentials missing: SID=%s, Token=%s, Service SID=%s",
                 TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN[:4] + "..." if TWILIO_AUTH_TOKEN else None, TWILIO_VERIFY_SERVICE_SID)

# Validation Functions
def is_email(input_str):
    return bool(re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', input_str))

def is_phone(input_str):
    return bool(re.match(r'^\d{10}$', input_str))

def validate_password(password):
    return len(password) >= 6

# Twilio Functions
def send_verification(identifier, channel='sms'):
    if not twilio_client:
        logger.error("Twilio client not initialized")
        raise Exception("Twilio client not initialized")
    try:
        verification = twilio_client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID) \
            .verifications \
            .create(to=identifier if channel == 'email' else f"+91{identifier}", channel=channel)
        logger.info(f"Verification sent to {identifier} via {channel}: {verification.sid}")
        return verification.sid
    except TwilioRestException as e:
        logger.error(f"Twilio error sending OTP to {identifier}: {e}")
        raise

def verify_code(identifier, code, channel='sms'):
    if not twilio_client:
        logger.error("Twilio client not initialized for verification")
        raise Exception("Twilio client not initialized")
    try:
        verification_check = twilio_client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID) \
            .verification_checks \
            .create(to=identifier if channel == 'email' else f"+91{identifier}", code=code)
        logger.info(f"Verification check for {identifier}: {verification_check.status}")
        return verification_check.status == 'approved'
    except TwilioRestException as e:
        logger.error(f"Twilio verification error for {identifier}: {e}")
        return False

# Reset Route
@app.route("/api/reset", methods=["POST"])
def reset():
    logger.info("Server state reset")
    return jsonify({"success": True, "message": "Server state reset"}), 200

# Signup Route
@app.route("/api/signup", methods=["POST"])
def signup():
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 500
    try:
        data = request.get_json()
        identifier = data.get("identifier")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        if not all([identifier, password, confirm_password]):
            return jsonify({"success": False, "error": "All fields required"}), 400
        if password != confirm_password:
            return jsonify({"success": False, "error": "Passwords don’t match"}), 400
        if not validate_password(password):
            return jsonify({"success": False, "error": "Password too short (min 6 chars)"}), 400
        if not (is_email(identifier) or is_phone(identifier)):
            return jsonify({"success": False, "error": "Invalid email/phone"}), 400

        cursor = db.cursor(dictionary=True)
        field = "email" if is_email(identifier) else "phone"
        cursor.execute(f"SELECT user_id FROM users WHERE {field} = %s", (identifier,))
        if cursor.fetchone():
            cursor.close()
            return jsonify({"success": False, "error": "User already exists"}), 409

        cursor.execute(
            f"INSERT INTO users ({field}, password, username, gender) VALUES (%s, %s, %s, %s)",
            (identifier, password, "NewUser", "Unknown")
        )
        db.commit()
        cursor.close()
        logger.info(f"User signed up: {field}={identifier}")
        return jsonify({"success": True, "message": "Signup successful"}), 201
    except mysql.connector.Error as e:
        db.rollback()
        logger.error(f"Database error in signup: {e}")
        return jsonify({"success": False, "error": "Database error"}), 500
    except Exception as e:
        db.rollback()
        logger.error(f"Signup error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500

# Login Route
@app.route("/api/login", methods=["POST"])
def login():
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 500
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400

        identifier = data.get("identifier")
        password = data.get("password")
        logger.debug(f"Login attempt: identifier={identifier}, password={password}")

        if not identifier or not password:
            return jsonify({"success": False, "error": "Identifier and password required"}), 400
        if not (is_email(identifier) or is_phone(identifier)):
            return jsonify({"success": False, "error": "Invalid email/phone"}), 400

        cursor = db.cursor(dictionary=True)
        field = "email" if is_email(identifier) else "phone"
        query = f"SELECT * FROM users WHERE {field} = %s AND password = %s"
        cursor.execute(query, (identifier, password))
        user = cursor.fetchone()
        logger.debug(f"Query: {query}, Result: {user}")

        if not user:
            cursor.close()
            logger.info(f"Login failed: {field}={identifier} not found or wrong password")
            return jsonify({"success": False, "error": "Invalid credentials"}), 401

        identifiers_to_verify = []
        try:
            channel = 'email' if is_email(identifier) else 'sms'
            send_verification(identifier, channel=channel)
            identifiers_to_verify.append({"identifier": identifier, "type": channel})

            if field == "phone" and user["email"]:
                try:
                    send_verification(user["email"], channel='email')
                    identifiers_to_verify.append({"identifier": user["email"], "type": "email"})
                except Exception as e:
                    logger.warning(f"Failed to send email OTP to {user['email']}: {e}")
            elif field == "email" and user["phone"]:
                try:
                    send_verification(user["phone"], channel='sms')
                    identifiers_to_verify.append({"identifier": user["phone"], "type": "phone"})
                except Exception as e:
                    logger.warning(f"Failed to send SMS OTP to {user['phone']}: {e}")

            user_data = {k: v for k, v in user.items() if k != "password"}
            cursor.close()
            logger.info(f"Login pending OTP: {field}={identifier}, sent to {identifiers_to_verify}")
            return jsonify({
                "success": False,
                "requires_verification": True,
                "identifiers": identifiers_to_verify,
                "user": user_data
            }), 200

        except TwilioRestException as e:
            cursor.close()
            logger.error(f"Twilio error sending OTP: {e}")
            return jsonify({"success": False, "error": f"Failed to send OTP: {str(e)}"}), 500
        except Exception as e:
            cursor.close()
            logger.error(f"Unexpected error sending OTP: {e}")
            return jsonify({"success": False, "error": "Failed to send OTP due to server error"}), 500

    except mysql.connector.Error as e:
        logger.error(f"Database error in login: {e}")
        return jsonify({"success": False, "error": "Database error"}), 500
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500

# Verify Code Route
@app.route("/api/verify_code", methods=["POST"])
def verify_code_route():
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 500
    try:
        data = request.get_json()
        identifier = data.get("identifier")
        code = data.get("code")

        if not identifier or not code:
            return jsonify({"success": False, "error": "Identifier and code required"}), 400
        if not (is_email(identifier) or is_phone(identifier)):
            return jsonify({"success": False, "error": "Invalid email/phone"}), 400

        channel = 'email' if is_email(identifier) else 'sms'
        if verify_code(identifier, code, channel):
            cursor = db.cursor(dictionary=True)
            field = "email" if is_email(identifier) else "phone"
            cursor.execute(f"SELECT * FROM users WHERE {field} = %s", (identifier,))
            user = cursor.fetchone()
            cursor.close()
            if not user:
                return jsonify({"success": False, "error": "User not found"}), 404
            logger.info(f"{field} verified for {identifier}")
            return jsonify({"success": True, "message": "Verification successful", "user": {k: v for k, v in user.items() if k != "password"}}), 200
        return jsonify({"success": False, "error": "Invalid code"}), 400
    except Exception as e:
        logger.error(f"Verify code error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500

# Forgot Password - Step 1: Check Identifier
@app.route("/api/forgot_password", methods=["POST"])
def forgot_password():
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 500
    try:
        data = request.get_json()
        identifier = data.get("identifier")
        if not identifier:
            return jsonify({"success": False, "error": "Identifier required"}), 400
        if not (is_email(identifier) or is_phone(identifier)):
            return jsonify({"success": False, "error": "Invalid email/phone"}), 400

        cursor = db.cursor(dictionary=True)
        field = "email" if is_email(identifier) else "phone"
        cursor.execute(f"SELECT email, phone, password FROM users WHERE {field} = %s", (identifier,))
        user = cursor.fetchone()
        cursor.close()

        if not user:
            return jsonify({"success": False, "error": "No account found with this identifier"}), 404

        return jsonify({
            "success": True,
            "email": user["email"] or "",
            "phone": user["phone"] or "",
            "requires_password": True
        }), 200
    except Exception as e:
        logger.error(f"Forgot password error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500

# Forgot Password - Step 2: Verify Current Password and Send OTP
@app.route("/api/reset_password_request", methods=["POST"])
def reset_password_request():
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 500
    try:
        data = request.get_json()
        identifier = data.get("identifier")
        current_password = data.get("current_password")
        new_password = data.get("new_password")

        if not all([identifier, current_password, new_password]):
            return jsonify({"success": False, "error": "All fields required"}), 400
        if not validate_password(new_password):
            return jsonify({"success": False, "error": "New password too short (min 6 chars)"}), 400

        cursor = db.cursor(dictionary=True)
        field = "email" if is_email(identifier) else "phone"
        cursor.execute(f"SELECT * FROM users WHERE {field} = %s AND password = %s", (identifier, current_password))
        user = cursor.fetchone()
        if not user:
            cursor.close()
            return jsonify({"success": False, "error": "Invalid current password"}), 401

        channel = 'email' if is_email(identifier) else 'sms'
        send_verification(identifier, channel)
        cursor.close()
        logger.info(f"Password reset OTP sent to {identifier}")
        return jsonify({
            "success": True,
            "message": "OTP sent for password reset",
            "identifier": identifier,
            "new_password": new_password
        }), 200
    except TwilioRestException as e:
        logger.error(f"Twilio error sending reset OTP: {e}")
        return jsonify({"success": False, "error": f"Failed to send OTP: {str(e)}"}), 500
    except Exception as e:
        logger.error(f"Reset password request error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500

# Forgot Password - Step 3: Verify OTP and Update Password
@app.route("/api/reset_password_verify", methods=["POST"])
def reset_password_verify():
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 500
    try:
        data = request.get_json()
        identifier = data.get("identifier")
        code = data.get("code")
        new_password = data.get("new_password")

        if not all([identifier, code, new_password]):
            return jsonify({"success": False, "error": "All fields required"}), 400

        channel = 'email' if is_email(identifier) else 'sms'
        if verify_code(identifier, code, channel):
            cursor = db.cursor(dictionary=True)
            field = "email" if is_email(identifier) else "phone"
            cursor.execute(f"UPDATE users SET password = %s WHERE {field} = %s", (new_password, identifier))
            db.commit()
            cursor.execute(f"SELECT * FROM users WHERE {field} = %s", (identifier,))
            user = cursor.fetchone()
            cursor.close()
            logger.info(f"Password reset successful for {identifier}")
            return jsonify({
                "success": True,
                "message": "Password reset successful",
                "user": {k: v for k, v in user.items() if k != "password"}
            }), 200
        return jsonify({"success": False, "error": "Invalid OTP"}), 400
    except mysql.connector.Error as e:
        db.rollback()
        logger.error(f"Database error in reset_password_verify: {e}")
        return jsonify({"success": False, "error": "Database error"}), 500
    except Exception as e:
        logger.error(f"Reset password verify error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500

# Profile Route
@app.route("/api/profile", methods=["GET"])
def profile():
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 500
    try:
        identifier = request.args.get("identifier")
        if not identifier:
            return jsonify({"success": False, "error": "Identifier required"}), 400

        cursor = db.cursor(dictionary=True)
        field = "email" if is_email(identifier) else "phone"
        cursor.execute(f"SELECT * FROM users WHERE {field} = %s", (identifier,))
        user = cursor.fetchone()
        cursor.close()

        if not user:
            return jsonify({"success": False, "error": "User not found"}), 404

        user_data = {k: v for k, v in user.items() if k != "password"}
        return jsonify({"success": True, "user": user_data}), 200
    except mysql.connector.Error as e:
        logger.error(f"Database error in profile: {e}")
        return jsonify({"success": False, "error": "Database error"}), 500
    except Exception as e:
        logger.error(f"Profile error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500

# Update Profile Route
@app.route("/api/update_profile", methods=["POST"])
def update_profile():
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 500
    try:
        data = request.get_json()
        identifier = data.get("identifier")
        if not identifier:
            return jsonify({"success": False, "error": "Identifier required"}), 400

        cursor = db.cursor(dictionary=True)
        field = "email" if is_email(identifier) else "phone"
        cursor.execute(f"SELECT user_id FROM users WHERE {field} = %s", (identifier,))
        user = cursor.fetchone()
        if not user:
            cursor.close()
            return jsonify({"success": False, "error": "User not found"}), 404

        update_fields = {k: v for k, v in data.items() if k in ["username", "birthday", "gender", "address", "pincode", "state", "email", "phone"]}
        if not update_fields:
            cursor.close()
            return jsonify({"success": False, "error": "No valid fields to update"}), 400

        set_clause = ", ".join([f"{k} = %s" for k in update_fields.keys()])
        values = list(update_fields.values()) + [identifier]
        query = f"UPDATE users SET {set_clause} WHERE {field} = %s"
        cursor.execute(query, values)
        db.commit()
        cursor.close()

        logger.info(f"Profile updated for {field}={identifier}")
        return jsonify({"success": True, "message": "Profile updated"}), 200
    except mysql.connector.Error as e:
        db.rollback()
        logger.error(f"Database error in update_profile: {e}")
        return jsonify({"success": False, "error": "Database error"}), 500
    except Exception as e:
        db.rollback()
        logger.error(f"Update profile error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500

# Change Password Route
@app.route("/api/change_password", methods=["POST"])
def change_password():
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 500
    try:
        data = request.get_json()
        identifier = data.get("identifier")
        current_password = data.get("currentPassword")
        new_password = data.get("newPassword")

        if not all([identifier, current_password, new_password]):
            return jsonify({"success": False, "error": "All fields required"}), 400
        if not validate_password(new_password):
            return jsonify({"success": False, "error": "New password too short (min 6 chars)"}), 400

        cursor = db.cursor(dictionary=True)
        field = "email" if is_email(identifier) else "phone"
        cursor.execute(f"SELECT user_id FROM users WHERE {field} = %s AND password = %s", (identifier, current_password))
        user = cursor.fetchone()
        if not user:
            cursor.close()
            return jsonify({"success": False, "error": "Invalid current password"}), 401

        cursor.execute(f"UPDATE users SET password = %s WHERE {field} = %s", (new_password, identifier))
        db.commit()
        cursor.close()

        logger.info(f"Password changed for {field}={identifier}")
        return jsonify({"success": True, "message": "Password changed"}), 200
    except mysql.connector.Error as e:
        db.rollback()
        logger.error(f"Database error in change_password: {e}")
        return jsonify({"success": False, "error": "Database error"}), 500
    except Exception as e:
        db.rollback()
        logger.error(f"Change password error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500

# Request Verification Route
@app.route("/api/request_verification", methods=["POST"])
def request_verification():
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 500
    try:
        data = request.get_json()
        identifier = data.get("identifier")
        if not identifier:
            return jsonify({"success": False, "error": "Identifier required"}), 400
        if not (is_email(identifier) or is_phone(identifier)):
            return jsonify({"success": False, "error": "Invalid email/phone"}), 400

        channel = 'email' if is_email(identifier) else 'sms'
        send_verification(identifier, channel)
        return jsonify({"success": True, "message": f"Verification sent to {identifier}"}), 200
    except TwilioRestException as e:
        logger.error(f"Twilio error in request_verification: {e}")
        return jsonify({"success": False, "error": "Verification service error"}), 500
    except Exception as e:
        logger.error(f"Request verification error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500

# Booking History Routes
@app.route("/api/flight_bookings", methods=["GET"])
def flight_bookings():
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 500
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"success": False, "error": "User ID required"}), 400

        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM flight_bookings WHERE user_id = %s", (user_id,))
        bookings = cursor.fetchall()
        cursor.close()
        return jsonify({"success": True, "bookings": bookings}), 200
    except mysql.connector.Error as e:
        logger.error(f"Database error in flight_bookings: {e}")
        return jsonify({"success": False, "error": "Database error"}), 500
    except Exception as e:
        logger.error(f"Flight bookings error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500

@app.route("/api/hotel_bookings", methods=["GET"])
def hotel_bookings():
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 500
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"success": False, "error": "User ID required"}), 400

        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM hotel_bookings WHERE user_id = %s", (user_id,))
        bookings = cursor.fetchall()
        cursor.close()
        return jsonify({"success": True, "bookings": bookings}), 200
    except mysql.connector.Error as e:
        logger.error(f"Database error in hotel_bookings: {e}")
        return jsonify({"success": False, "error": "Database error"}), 500
    except Exception as e:
        logger.error(f"Hotel bookings error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500

@app.route("/api/car_rentals", methods=["GET"])
def car_rentals():
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 500
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"success": False, "error": "User ID required"}), 400

        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM car_rentals WHERE user_id = %s", (user_id,))
        bookings = cursor.fetchall()
        cursor.close()
        return jsonify({"success": True, "bookings": bookings}), 200
    except mysql.connector.Error as e:
        logger.error(f"Database error in car_rentals: {e}")
        return jsonify({"success": False, "error": "Database error"}), 500
    except Exception as e:
        logger.error(f"Car rentals error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500

if __name__ == "__main__":
    server = Server(app.wsgi_app)
    server.watch('*.py')
    server.serve(host='0.0.0.0', port=5001, debug=True)