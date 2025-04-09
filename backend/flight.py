from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS to allow frontend requests
import mysql.connector
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # Allow requests from any frontend (React)

# ✅ Function to connect to the MySQL database
def get_db_connection():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="tripglide"
        )
    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# ✅ API: Fetch all flight details
@app.route('/get_data', methods=['GET'])
def get_data():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM flights")
        data = cursor.fetchall()

        # Convert timedelta & datetime objects to string format
        for row in data:
            for key, value in row.items():
                if isinstance(value, timedelta):
                    row[key] = str(value)  # Converts timedelta to "HH:MM:SS"
                elif isinstance(value, datetime):
                    row[key] = value.strftime("%Y-%m-%d %H:%M:%S")  # Converts datetime to readable format

        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        connection.close()

# ✅ API: Fetch unique departure & arrival airports
@app.route('/get_flights', methods=['GET'])
def get_cities():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)
    try:
        # Fetch unique departure airports
        cursor.execute("SELECT DISTINCT departure FROM flights")
        departure_airports = [row["departure"] for row in cursor.fetchall()]

        # Fetch unique arrival airports
        cursor.execute("SELECT DISTINCT arrival FROM flights")
        arrival_airports = [row["arrival"] for row in cursor.fetchall()]

        return jsonify({
            "departure_airport": departure_airports if departure_airports else [],
            "arrival_airport": arrival_airports if arrival_airports else []
        })
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")  # Allow external connections