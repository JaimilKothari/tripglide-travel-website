from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS
import stripe

app = Flask(__name__)
CORS(app)

# Stripe configuration
stripe.api_key = '***REMOVED***'

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

@app.route('/arrival', methods=['GET'])
def get_locations():
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

    # Remove duplicates based on "hotel" name only
    seen_hotels = set()
    unique_hotels = []
    for hotel in formatted_hotels:
        if hotel["hotel"] not in seen_hotels:
            seen_hotels.add(hotel["hotel"])
            unique_hotels.append(hotel)

    return jsonify({"all": unique_hotels})

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
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
        return jsonify({'id': session.id})
    except Exception as e:
        print(f"Error creating checkout session: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)