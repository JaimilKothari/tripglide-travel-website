#frontend conn
from flask import Flask, jsonify
import mysql.connector
from flask_cors import CORS
from datetime import timedelta

app = Flask(__name__)
CORS(app) # Enable CORS for all domains

# MySQL connection function
def get_db_connection():
    try:
        return mysql.connector.connect(
        host='localhost',
        user='root',  # Update with your MySQL username
        password='',  # Update with your MySQL password
        database='main'  # Update with your actual database name
    )
    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# API endpoint to fetch cars data
@app.route('/', methods=['GET'])
def get_data():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM cars")
        data = cursor.fetchall()

        # Fetch unique cars
        cursor.execute("SELECT DISTINCT cartype FROM cars")
        car_type = [row["cartype"] for row in cursor.fetchall()]
        
        cursor.execute("SELECT DISTINCT model FROM cars")
        car_model = [row["model"] for row in cursor.fetchall()]

        return jsonify({
            "car_type": car_type if car_type else [],
            "car_model": car_model if car_model else [],
        })
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        connection.close()

# ✅ API: Fetch unique departure & arrival airports
@app.route('/location', methods=['GET'])
def get_cities():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)
    try:
        # Fetch unique cars
        cursor.execute("SELECT DISTINCT city FROM locations")
        car_city = [row["city"] for row in cursor.fetchall()]

        return jsonify({
            "car_city": car_city if car_city else [],
        })
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        connection.close()

# Run the Flask app and print data in the console
if __name__ == '__main__':
    # Run the Flask app to serve data via API
    app.run(debug=True, port=5001)