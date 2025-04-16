from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS
import stripe
from datetime import date

app = Flask(__name__)
# Apply CORS to all routes
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Stripe configuration
stripe.api_key = 'sk_test_51RBDzAQVbUKIjAtM6UPjWghbzD1KfUtRfU4CezBB2BfzXAiDzVhevRZ5gzvDTTwnppMqs8ODDcaTgVI6DSLn3Vgm00CGD9930m'

def get_db_connection():
    try:
        return mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='tripglide'
        )
    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def fetch_data(query, params=None):
    connection = get_db_connection()
    if connection is None:
        return None, "Database connection failed"
    cursor = connection.cursor(dictionary=True)
    try:
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        data = cursor.fetchall()
        return data, None
    except Exception as e:
        return None, str(e)
    finally:
        cursor.close()
        connection.close()

@app.route('/arrival', methods=['GET', 'OPTIONS'])
def get_locations():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    query = "SELECT DISTINCT Arrival FROM hotel ORDER BY Arrival ASC"
    location_data, error = fetch_data(query)
    if error:
        return jsonify({"error": error}), 500
    locations = [row['Arrival'] for row in location_data if row.get('Arrival')]
    return jsonify({"locations": locations})

@app.route('/all', methods=['GET'])
def get_all():
    arrival = request.args.get('arrival')
    hotel = request.args.get('hotel')
    bedroom_type = request.args.get('bedroomtype')
    totalpricepernight = request.args.get('totalpricepernight')
    rating = request.args.get('rating')
    amenities = request.args.get('amenities')

    query = """
        SELECT Hotel, Arrival, Rating, TotalPricePerNight, TotalCost, Amenities, BedroomType, Images 
        FROM hotel
    """
    query_conditions = []
    query_params = []

    if hotel:
        query_conditions.append("Hotel = %s")
        query_params.append(hotel)
    if arrival:
        query_conditions.append("Arrival = %s")
        query_params.append(arrival)
    if bedroom_type:
        query_conditions.append("BedroomType = %s")
        query_params.append(bedroom_type)
    if totalpricepernight:
        price_conditions = []
        for range_str in totalpricepernight.split(','):
            if range_str == '10000+':
                price_conditions.append("TotalPricePerNight > 10000")
            else:
                min_price, max_price = range_str.split('-')
                price_conditions.append("TotalPricePerNight BETWEEN %s AND %s")
                query_params.extend([min_price, max_price])
        if price_conditions:
            query_conditions.append("(" + " OR ".join(price_conditions) + ")")
    if rating:
        rating_conditions = []
        for rating_str in rating.split(','):
            if rating_str == '0-2.9':
                rating_conditions.append("Rating <= 2.9")
            else:
                rating_conditions.append("Rating = %s")
                query_params.append(rating_str)
        if rating_conditions:
            query_conditions.append("(" + " OR ".join(rating_conditions) + ")")
    if amenities:
        amenity_list = amenities.split(',')
        for amenity in amenity_list:
            query_conditions.append("Amenities LIKE %s")
            query_params.append(f"%{amenity}%")

    if query_conditions:
        query += " WHERE " + " AND ".join(query_conditions)

    hotel_data, error = fetch_data(query, tuple(query_params) if query_params else None)
    if error:
        return jsonify({"error": error}), 500

    formatted_hotels = []
    for hotel in hotel_data:
        formatted_hotels.append({
            "hotel": hotel["Hotel"],
            "arrival": hotel["Arrival"],
            "rating": hotel["Rating"],
            "totalpricepernight": hotel["TotalPricePerNight"],
            "totalcost": hotel["TotalCost"],
            "amenities": hotel["Amenities"].replace("['", "").replace("']", "").replace("'", ""),
            "bedroomtype": hotel["BedroomType"],
            "images": hotel.get("Images", None)
        })

    seen_hotels = set()
    unique_hotels = []
    for hotel in formatted_hotels:
        if hotel["hotel"] not in seen_hotels:
            seen_hotels.add(hotel["hotel"])
            unique_hotels.append(hotel)

    return jsonify({"all": unique_hotels})

@app.route('/create-checkout-session', methods=['POST', 'OPTIONS'])
def create_checkout_session():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    try:
        data = request.get_json()
        hotel_name = data['hotelName']
        total_amount = data['totalAmount']
        check_in_date = data['checkInDate']
        check_out_date = data['checkOutDate']
        adults = data['adults']
        children = data['children']
        rooms = data['rooms']
        room_type = data['roomType']
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'inr',
                        'product_data': {
                            'name': f'Booking: {hotel_name} ({room_type})',
                            'description': f'Check-in: {check_in_date}, Check-out: {check_out_date}, Guests: {adults + children}, Rooms: {rooms}',
                        },
                        'unit_amount': int(total_amount * 100),
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url='http://localhost:5173/hotel-booking',
            cancel_url='http://localhost:3000/cancel',
        )
        print(f"Stripe session created: {session.id}")
        return jsonify({'id': session.id})
    except Exception as e:
        print(f"Error creating checkout session: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['POST', 'OPTIONS'])
def store_booking():
    if request.method == 'OPTIONS':
        print("Handling OPTIONS preflight request")
        return jsonify({}), 200
    try:
        data = request.get_json()
        print(f"Received booking data: {data}")

        booking_number = data.get('booking_number')
        hotel_name = data.get('hotel_name')
        arrival = data.get('arrival')
        check_in_date = data.get('check_in_date')
        check_out_date = data.get('check_out_date')
        adults = data.get('adults')
        children = data.get('children')
        rooms = data.get('rooms')
        room_type = data.get('room_type')
        price_per_night = data.get('price_per_night')
        total_amount = data.get('total_amount')
        guest_name = data.get('guest_name')
        email = data.get('email')
        phone = data.get('phone')
        booked_on = data.get('booked_on')
        payment_method = data.get('payment_method', 'Credit Card')

        required_fields = {
            'booking_number': booking_number,
            'hotel_name': hotel_name,
            'check_in_date': check_in_date,
            'check_out_date': check_out_date,
            'adults': adults,
            'children': children,
            'rooms': rooms,
            'room_type': room_type,
            'price_per_night': price_per_night,
            'total_amount': total_amount,
            'guest_name': guest_name,
            'email': email,
            'booked_on': booked_on
        }
        missing_fields = [k for k, v in required_fields.items() if v is None or v == '']
        if missing_fields:
            error_msg = f"Missing required fields: {', '.join(missing_fields)}"
            print(error_msg)
            return jsonify({'error': error_msg}), 400

        try:
            adults = int(adults)
            children = int(children)
            rooms = int(rooms)
            price_per_night = float(price_per_night)
            total_amount = float(total_amount)
        except (ValueError, TypeError) as e:
            print(f"Numeric conversion error: {e}")
            return jsonify({'error': 'Invalid numeric values'}), 400

        connection = get_db_connection()
        if not connection:
            print("Database connection failed")
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor()
        query = """
        INSERT INTO hotel_bookings (
            booking_number, hotel_name, arrival, check_in_date, check_out_date,
            adults, children, rooms, room_type, price_per_night, total_amount,
            guest_name, email, phone, booked_on, payment_method, status
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'Upcoming')
        """
        values = (
            booking_number, hotel_name, arrival, check_in_date, check_out_date,
            adults, children, rooms, room_type, price_per_night, total_amount,
            guest_name, email, phone, booked_on, payment_method
        )

        try:
            cursor.execute(query, values)
            connection.commit()
            print(f"Booking {booking_number} stored successfully")
        except mysql.connector.Error as e:
            print(f"Database error: {e}")
            if "Duplicate entry" in str(e):
                return jsonify({'error': 'Booking number already exists'}), 409
            return jsonify({'error': f'Database error: {e}'}), 500
        finally:
            cursor.close()
            connection.close()

        return jsonify({'message': 'Booking stored successfully'}), 201
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'error': f'An error occurred: {e}'}), 500
    

@app.route('/api/hotel_bookings', methods=['GET', 'OPTIONS'])
def get_hotel_bookings():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    identifier = request.args.get('identifier')
    if not identifier:
        return jsonify({"error": "Identifier (email or phone) is required"}), 400

    # Update booking statuses
    connection = get_db_connection()
    if not connection:
        print("Database connection failed")
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor()
    today = date.today().strftime('%Y-%m-%d')
    try:
        # Update to Ongoing: check_in_date <= today AND check_out_date > today
        update_ongoing_query = """
            UPDATE hotel_bookings 
            SET status = 'Ongoing'
            WHERE check_in_date <= %s AND check_out_date > %s AND status = 'Upcoming'
        """
        cursor.execute(update_ongoing_query, (today, today))
        connection.commit()
        print(f"Updated bookings to Ongoing for check_in_date <= {today} and check_out_date > {today}")

        # Update to Upcoming: check_in_date > today
        update_upcoming_query = """
            UPDATE hotel_bookings 
            SET status = 'Upcoming'
            WHERE check_in_date > %s AND status != 'Cancelled'
        """
        cursor.execute(update_upcoming_query, (today,))
        connection.commit()
        print(f"Updated bookings to Upcoming for check_in_date > {today}")
    except mysql.connector.Error as e:
        print(f"Error updating booking status: {e}")
        connection.rollback()
        return jsonify({"error": f"Database error: {e}"}), 500
    finally:
        cursor.close()
        connection.close()

    # Fetch bookings
    query = """
        SELECT id, booking_number, hotel_name, arrival, check_in_date, check_out_date,
               adults, children, rooms, room_type, price_per_night, total_amount,
               guest_name, email, phone, booked_on, payment_method, created_at, status
        FROM hotel_bookings
        WHERE email = %s OR phone = %s
        ORDER BY booked_on DESC
    """
    params = (identifier, identifier)

    bookings_data, error = fetch_data(query, params)
    if error:
        print(f"Error fetching hotel bookings: {error}")
        return jsonify({"error": error}), 500

    if not bookings_data:
        return jsonify({"bookings": []}), 200

    # Format the bookings data
    formatted_bookings = []
    for booking in bookings_data:
        formatted_bookings.append({
            "id": booking["id"],
            "booking_number": booking["booking_number"],
            "hotel_name": booking["hotel_name"],
            "arrival": booking["arrival"],
            "check_in_date": booking["check_in_date"],
            "check_out_date": booking["check_out_date"],
            "adults": booking["adults"],
            "children": booking["children"],
            "rooms": booking["rooms"],
            "room_type": booking["room_type"],
            "price_per_night": float(booking["price_per_night"]),
            "total_amount": float(booking["total_amount"]),
            "guest_name": booking["guest_name"],
            "email": booking["email"],
            "phone": booking["phone"],
            "booked_on": booking["booked_on"].isoformat() if booking["booked_on"] else None,
            "payment_method": booking["payment_method"],
            "created_at": booking["created_at"].isoformat() if booking["created_at"] else None,
            "hotel_details": f"{booking['hotel_name']} - {booking['room_type']} ({booking['rooms']} rooms)",
            "status": booking["status"]
        })

    return jsonify({"bookings": formatted_bookings, "success": True})


@app.route('/api/hotel_bookings/<int:booking_id>/cancel', methods=['POST', 'OPTIONS'])
def cancel_booking(booking_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = connection.cursor()
        query = "UPDATE hotel_bookings SET status = 'Cancelled' WHERE id = %s AND status = 'Upcoming'"
        cursor.execute(query, (booking_id,))
        if cursor.rowcount == 0:
            connection.close()
            return jsonify({"error": "Booking not found or not cancellable"}), 404

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"success": true, "message": "Booking cancelled successfully"})
    except Exception as e:
        print(f"Error cancelling booking: {e}")
        return jsonify({"error": f"An error occurred: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5003)