# #frontend conn
# from flask import Flask, jsonify, request
# import mysql.connector
# from flask_cors import CORS
# from datetime import timedelta

# app = Flask(__name__)
# CORS(app) # Enable CORS for all domains

# # MySQL connection function
# def get_db_connection():
#     try:
#         return mysql.connector.connect(
#         host='localhost',
#         user='root',  # Update with your MySQL username
#         password='',  # Update with your MySQL password
#         # port="3307",  # Update the port if different
#         database='tripglide'  # Update with your actual database name
#     )
#     except mysql.connector.Error as e:
#         print(f"Error connecting to MySQL: {e}")
#         return None
    
#     # General function to fetch data
# def fetch_data(query, params=None):
#     connection = get_db_connection()
#     if connection is None:
#         return None, "Database connection failed"

#     cursor = connection.cursor(dictionary=True)
#     try:
#         # Execute parameterized query properly
#         if params:
#             cursor.execute(query, params)
#         else:
#             cursor.execute(query)

#         data = cursor.fetchall()
#         return data, None

#     except Exception as e:
#         return None, str(e)
#     finally:
#         cursor.close()
#         connection.close()



# # ✅ New Endpoint to Fetch Locations
# @app.route('/arrival', methods=['GET'])
# def get_locations():
#     query = "SELECT DISTINCT Arrival FROM hotel ORDER BY Arrival ASC"
#     location_data, error = fetch_data(query)

#     if error:
#         return jsonify({"error": error}), 500

#     # Format locations as a list
#     locations = [row['Arrival'] for row in location_data if row.get('Arrival')]
#     return jsonify({"locations": locations})

# @app.route('/all', methods=['GET'])
# def get_all():
#     query = "SELECT DISTINCT * FROM hotel"
#     all, error = fetch_data(query)

#     if error:
#         return jsonify({"error": error}), 500

#     # Format locations as a list
#     # locations = [row[''] for row in location_data if row.get('Arrival')]
#     return jsonify({"all": all})




# # ✅ Combined API to handle multiple queries
# @app.route('/', methods=['GET'])
# def get_data():
#     # Get all query parameters
#     arrival = request.args.get('arrival')
#     hotel = request.args.get('hotel')
#     rating = request.args.get('rating')
#     bedroomtype = request.args.get('bedroomtype')
#     pricepernight = request.args.get('pricepernight')
#     adults = request.args.get('adults')
#     children = request.args.get('children')
#     totalbedrooms = request.args.get('totalbedrooms')
#     totalpricepernight = request.args.get('totalpricepernight')
#     amenities = request.args.get('amenities')
#     stayingdays = request.args.get('stayingdays')
#     totalcost = request.args.get('totalcost')
#     checkin = request.args.get('checkin')
#     checkout = request.args.get('checkout')

#     # Build dynamic query based on available params
#     query_conditions = []
#     query_params = []

#     if arrival:
#         query_conditions.append("Arrival = %s")
#         query_params.append(arrival)
#     if hotel:
#         query_conditions.append("Hotel = %s")
#         query_params.append(hotel)    
#     if rating:
#         query_conditions.append("Rating = %s")
#         query_params.append(rating)
#     if bedroomtype:
#         query_conditions.append("Bedroomtype: = %s")
#         query_params.append(bedroomtype)
#     if pricepernight:
#         query_conditions.append("PricePerNight: = %s")
#         query_params.append(pricepernight)
#     if adults:
#         query_conditions.append("Adults = %s")
#         query_params.append(adults)
#     if children:
#         query_conditions.append("Children: = %s")
#         query_params.append(children)
#     if totalbedrooms:
#         query_conditions.append("TotalBedrooms: = %s")
#         query_params.append(totalbedrooms)
#     if totalpricepernight:
#         query_conditions.append("TotalPricePerNight: = %s")
#         query_params.append(totalpricepernight)
#     if amenities:
#         query_conditions.append("Amenities: = %s")
#         query_params.append(amenities)
#     if stayingdays:
#         query_conditions.append("StayingDays: = %s")
#         query_params.append(stayingdays)
#     if totalcost:
#         query_conditions.append("TotalCost: = %s")
#         query_params.append(totalcost)
#     if checkin:
#         query_conditions.append("CheckIn: = %s")
#         query_params.append(checkin)
#     if checkout:
#         query_conditions.append("CheckOut: = %s")
#         query_params.append(checkout)
       
#     # Create final query dynamically
#     base_query = "SELECT * FROM hotel"
#     if query_conditions:
#         base_query += " WHERE " + " AND ".join(query_conditions)

#     # Fetch cars based on dynamic query
#     car_data, error = fetch_data(base_query, tuple(query_params))
#     if error:
#         return jsonify({"error": error}), 500

#     # ✅ Format car data response
#     formatted_response = []
#     if car_data:
#         for row in car_data:
#             formatted_response.append({
#                 # "travelcode": row["TravelCode"],
#                 # "userID": row["UserID"],
#                 # "departure": row["Departure"],
#                 "arrival": row["Arrival"],
#                 "hotel": row["Hotel"],
#                 "rating": row["Rating"],
#                 "bedroomtype": row["BedroomType"],
#                 "pricepernight": row["PricePerNight"],
#                 "adults": row["Adults"],
#                 "children": row["Children"],
#                 "totalbedrooms": row["TotalBedrooms"],
#                 "totalpricepernight": row["TotalPricePerNight"],
#                 "amenities": row["Amenities"],
#                 "stayingdays": row["StayingDays"],
#                 "totalcost": row["TotalCost"],
#                 "checkout": row["CheckOut"],
#                 "checkin": row["CheckIn"]
#         })
            
#     return jsonify(formatted_response)


# # 📌 1️⃣ Fetch All Bookings
# @app.route('/bookings', methods=['GET'])
# def get_all_bookings():
#     cursor.execute("SELECT * FROM hotel_bookings")
#     bookings = cursor.fetchall()
#     return jsonify(bookings)


# # 📌 2️⃣ Fetch Booking by UserID
# @app.route('/bookings/user/<int:user_id>', methods=['GET'])
# def get_booking_by_user(user_id):
#     cursor.execute("SELECT * FROM hotel_bookings WHERE UserID = %s", (user_id,))
#     bookings = cursor.fetchall()
#     return jsonify(bookings)


# # 📌 3️⃣ Fetch Booking by TravelCode
# @app.route('/bookings/travel/<int:travel_code>', methods=['GET'])
# def get_booking_by_travel_code(travel_code):
#     cursor.execute("SELECT * FROM hotel_bookings WHERE TravelCode = %s", (travel_code,))
#     bookings = cursor.fetchall()
#     return jsonify(bookings)


# # 📌 4️⃣ Fetch Booking by Departure
# @app.route('/bookings/departure/<string:departure>', methods=['GET'])
# def get_booking_by_departure(departure):
#     cursor.execute("SELECT * FROM hotel_bookings WHERE Departure = %s", (departure,))
#     bookings = cursor.fetchall()
#     return jsonify(bookings)


# # 📌 5️⃣ Fetch Booking by Arrival
# @app.route('/bookings/arrival/<string:arrival>', methods=['GET'])
# def get_booking_by_arrival(arrival):
#     cursor.execute("SELECT * FROM hotel_bookings WHERE Arrival = %s", (arrival,))
#     bookings = cursor.fetchall()
#     return jsonify(bookings)


# # 📌 6️⃣ Fetch Booking by Hotel Name
# @app.route('/bookings/hotel/<string:hotel>', methods=['GET'])
# def get_booking_by_hotel(hotel):
#     cursor.execute("SELECT * FROM hotel_bookings WHERE Hotel = %s", (hotel,))
#     bookings = cursor.fetchall()
#     return jsonify(bookings)


# # 📌 7️⃣ Fetch Booking by Rating
# @app.route('/bookings/rating/<int:rating>', methods=['GET'])
# def get_booking_by_rating(rating):
#     cursor.execute("SELECT * FROM hotel_bookings WHERE Rating >= %s", (rating,))
#     bookings = cursor.fetchall()
#     return jsonify(bookings)


# # 📌 8️⃣ Fetch Booking by Check-In Date
# @app.route('/bookings/checkin/<string:checkin_date>', methods=['GET'])
# def get_booking_by_checkin(checkin_date):
#     cursor.execute("SELECT * FROM hotel_bookings WHERE CheckIn = %s", (checkin_date,))
#     bookings = cursor.fetchall()
#     return jsonify(bookings)


# # 📌 9️⃣ Fetch Booking by Check-Out Date
# @app.route('/bookings/checkout/<string:checkout_date>', methods=['GET'])
# def get_booking_by_checkout(checkout_date):
#     cursor.execute("SELECT * FROM hotel_bookings WHERE CheckOut = %s", (checkout_date,))
#     bookings = cursor.fetchall()
#     return jsonify(bookings)


# # 📌 🔟 Fetch Booking by Amenities
# @app.route('/bookings/amenities/<string:amenities>', methods=['GET'])
# def get_booking_by_amenities(amenities):
#     cursor.execute("SELECT * FROM hotel_bookings WHERE Amenities LIKE %s", (f"%{amenities}%",))
#     bookings = cursor.fetchall()
#     return jsonify(bookings)


# # 📌 1️⃣1️⃣ Add New Booking
# @app.route('/bookings', methods=['POST'])
# def add_booking():
#     data = request.json
#     query = """
#     INSERT INTO hotel_bookings (TravelCode, UserID, Departure, Arrival, Hotel, Rating, BedroomType, PricePerNight, 
#                                 Adults, Children, TotalBedrooms, TotalPricePerNight, Amenities, StayingDays, 
#                                 TotalCost, CheckOut, CheckIn) 
#     VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#     """
#     values = (data['TravelCode'], data['UserID'], data['Departure'], data['Arrival'], data['Hotel'], data['Rating'],
#               data['BedroomType'], data['PricePerNight'], data['Adults'], data['Children'], data['TotalBedrooms'],
#               data['TotalPricePerNight'], data['Amenities'], data['StayingDays'], data['TotalCost'],
#               data['CheckOut'], data['CheckIn'])
    
#     cursor.execute(query, values)
#     db.commit()
#     return jsonify({"message": "Booking added successfully"}), 201


# # 📌 1️⃣2️⃣ Update Booking Price by TravelCode
# @app.route('/bookings/update-price/<int:travel_code>', methods=['PUT'])
# def update_price(travel_code):
#     data = request.json
#     cursor.execute("UPDATE hotel_bookings SET PricePerNight = %s WHERE TravelCode = %s", 
#                    (data['PricePerNight'], travel_code))
#     db.commit()
#     return jsonify({"message": "Price updated successfully"})


# # 📌 1️⃣3️⃣ Delete Booking by TravelCode
# @app.route('/bookings/delete/<int:travel_code>', methods=['DELETE'])
# def delete_booking(travel_code):
#     cursor.execute("DELETE FROM hotel_bookings WHERE TravelCode = %s", (travel_code,))
#     db.commit()
#     return jsonify({"message": "Booking deleted successfully"})



# # Run the Flask app and print data in the console
# if __name__ == '__main__':
#     # Run the Flask app to serve data via API
#     app.run(debug=True, port=5001)








#frontend conn
from flask import Flask, jsonify, request
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
        # port="3307",  # Update the port if different
        database='tripglide'  # Update with your actual database name
    )
    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None
    
    # General function to fetch data
def fetch_data(query, params=None):
    connection = get_db_connection()
    if connection is None:
        return None, "Database connection failed"

    cursor = connection.cursor(dictionary=True)
    try:
        # Execute parameterized query properly
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



# ✅ New Endpoint to Fetch Locations
@app.route('/arrival', methods=['GET'])
def get_locations():
    query = "SELECT DISTINCT Arrival FROM hotel ORDER BY Arrival ASC"
    location_data, error = fetch_data(query)

    if error:
        return jsonify({"error": error}), 500

    # Format locations as a list
    locations = [row['Arrival'] for row in location_data if row.get('Arrival')]
    return jsonify({"locations": locations})

# @app.route('/all', methods=['GET'])
# def get_all():
#     query = "SELECT DISTINCT * FROM hotel"
#     all, error = fetch_data(query)

#     if error:
#         return jsonify({"error": error}), 500

#     # Format locations as a list
#     # locations = [row[''] for row in location_data if row.get('Arrival')]
#     return jsonify({"all": all})

# @app.route('/all', methods=['GET'])
# def get_all():
#     # Get the 'arrival' query parameter from the request
#     arrival = request.args.get('arrival')
    
#     # Base query to fetch hotels
#     query = "SELECT DISTINCT * FROM hotel"
#     params = None
    
#     # If an arrival location is provided, filter by it
#     if arrival:
#         query += " WHERE Arrival = %s"
#         params = (arrival,)
    
#     # Fetch hotel data
#     hotel_data, error = fetch_data(query, params)
    
#     if error:
#         return jsonify({"error": error}), 500
    
#     # Format the response to match the frontend's expected structure
#     formatted_hotels = []
#     for hotel in hotel_data:
#         formatted_hotels.append({
#             "hotel": hotel["Hotel"],
#             "arrival": hotel["Arrival"],
#             "rating": hotel["Rating"],
#             "totalpricepernight": hotel["TotalPricePerNight"],
#             "totalcost": hotel["TotalCost"],
#             "amenities": hotel["Amenities"].replace("['", "").replace("']", "").replace("'", "")  # Clean up amenities string
#         })
    
#     return jsonify({"all": formatted_hotels})
@app.route('/all', methods=['GET'])
def get_all():
    arrival = request.args.get('arrival')
    
    # Base query to select one row per Hotel and Arrival
    query = """
        SELECT Hotel, Arrival, Rating, TotalPricePerNight, TotalCost, Amenities 
        FROM hotel 
        GROUP BY Hotel, Arrival
    """
    params = None
    
    if arrival:
        query += " HAVING Arrival = %s"
        params = (arrival,)
    
    hotel_data, error = fetch_data(query, params)
    
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
            "amenities": hotel["Amenities"].replace("['", "").replace("']", "").replace("'", "")
        })
    
    return jsonify({"all": formatted_hotels})

# ✅ Combined API to handle multiple queries
@app.route('/', methods=['GET'])
def get_data():
    # Get all query parameters
    arrival = request.args.get('arrival')
    hotel = request.args.get('hotel')
    rating = request.args.get('rating')
    bedroomtype = request.args.get('bedroomtype')
    pricepernight = request.args.get('pricepernight')
    adults = request.args.get('adults')
    children = request.args.get('children')
    totalbedrooms = request.args.get('totalbedrooms')
    totalpricepernight = request.args.get('totalpricepernight')
    amenities = request.args.get('amenities')
    stayingdays = request.args.get('stayingdays')
    totalcost = request.args.get('totalcost')
    checkin = request.args.get('checkin')
    checkout = request.args.get('checkout')

    # Build dynamic query based on available params
    query_conditions = []
    query_params = []

    if arrival:
        query_conditions.append("Arrival = %s")
        query_params.append(arrival)
    if hotel:
        query_conditions.append("Hotel = %s")
        query_params.append(hotel)    
    if rating:
        query_conditions.append("Rating = %s")
        query_params.append(rating)
    if bedroomtype:
        query_conditions.append("Bedroomtype: = %s")
        query_params.append(bedroomtype)
    if pricepernight:
        query_conditions.append("PricePerNight: = %s")
        query_params.append(pricepernight)
    if adults:
        query_conditions.append("Adults = %s")
        query_params.append(adults)
    if children:
        query_conditions.append("Children: = %s")
        query_params.append(children)
    if totalbedrooms:
        query_conditions.append("TotalBedrooms: = %s")
        query_params.append(totalbedrooms)
    if totalpricepernight:
        query_conditions.append("TotalPricePerNight: = %s")
        query_params.append(totalpricepernight)
    if amenities:
        query_conditions.append("Amenities: = %s")
        query_params.append(amenities)
    if stayingdays:
        query_conditions.append("StayingDays: = %s")
        query_params.append(stayingdays)
    if totalcost:
        query_conditions.append("TotalCost: = %s")
        query_params.append(totalcost)
    if checkin:
        query_conditions.append("CheckIn: = %s")
        query_params.append(checkin)
    if checkout:
        query_conditions.append("CheckOut: = %s")
        query_params.append(checkout)
       
    # Create final query dynamically
    base_query = "SELECT * FROM hotel"
    if query_conditions:
        base_query += " WHERE " + " AND ".join(query_conditions)

    # Fetch cars based on dynamic query
    car_data, error = fetch_data(base_query, tuple(query_params))
    if error:
        return jsonify({"error": error}), 500

    # ✅ Format car data response
    formatted_response = []
    if car_data:
        for row in car_data:
            formatted_response.append({
                # "travelcode": row["TravelCode"],
                # "userID": row["UserID"],
                # "departure": row["Departure"],
                "arrival": row["Arrival"],
                "hotel": row["Hotel"],
                "rating": row["Rating"],
                "bedroomtype": row["BedroomType"],
                "pricepernight": row["PricePerNight"],
                "adults": row["Adults"],
                "children": row["Children"],
                "totalbedrooms": row["TotalBedrooms"],
                "totalpricepernight": row["TotalPricePerNight"],
                "amenities": row["Amenities"],
                "stayingdays": row["StayingDays"],
                "totalcost": row["TotalCost"],
                "checkout": row["CheckOut"],
                "checkin": row["CheckIn"]
        })
            
    return jsonify(formatted_response)


# 📌 1️⃣ Fetch All Bookings
@app.route('/bookings', methods=['GET'])
def get_all_bookings():
    cursor.execute("SELECT * FROM hotel_bookings")
    bookings = cursor.fetchall()
    return jsonify(bookings)


# 📌 2️⃣ Fetch Booking by UserID
@app.route('/bookings/user/<int:user_id>', methods=['GET'])
def get_booking_by_user(user_id):
    cursor.execute("SELECT * FROM hotel_bookings WHERE UserID = %s", (user_id,))
    bookings = cursor.fetchall()
    return jsonify(bookings)


# 📌 3️⃣ Fetch Booking by TravelCode
@app.route('/bookings/travel/<int:travel_code>', methods=['GET'])
def get_booking_by_travel_code(travel_code):
    cursor.execute("SELECT * FROM hotel_bookings WHERE TravelCode = %s", (travel_code,))
    bookings = cursor.fetchall()
    return jsonify(bookings)


# 📌 4️⃣ Fetch Booking by Departure
@app.route('/bookings/departure/<string:departure>', methods=['GET'])
def get_booking_by_departure(departure):
    cursor.execute("SELECT * FROM hotel_bookings WHERE Departure = %s", (departure,))
    bookings = cursor.fetchall()
    return jsonify(bookings)


# 📌 5️⃣ Fetch Booking by Arrival
@app.route('/bookings/arrival/<string:arrival>', methods=['GET'])
def get_booking_by_arrival(arrival):
    cursor.execute("SELECT * FROM hotel_bookings WHERE Arrival = %s", (arrival,))
    bookings = cursor.fetchall()
    return jsonify(bookings)


# 📌 6️⃣ Fetch Booking by Hotel Name
@app.route('/bookings/hotel/<string:hotel>', methods=['GET'])
def get_booking_by_hotel(hotel):
    cursor.execute("SELECT * FROM hotel_bookings WHERE Hotel = %s", (hotel,))
    bookings = cursor.fetchall()
    return jsonify(bookings)


# 📌 7️⃣ Fetch Booking by Rating
@app.route('/bookings/rating/<int:rating>', methods=['GET'])
def get_booking_by_rating(rating):
    cursor.execute("SELECT * FROM hotel_bookings WHERE Rating >= %s", (rating,))
    bookings = cursor.fetchall()
    return jsonify(bookings)


# 📌 8️⃣ Fetch Booking by Check-In Date
@app.route('/bookings/checkin/<string:checkin_date>', methods=['GET'])
def get_booking_by_checkin(checkin_date):
    cursor.execute("SELECT * FROM hotel_bookings WHERE CheckIn = %s", (checkin_date,))
    bookings = cursor.fetchall()
    return jsonify(bookings)


# 📌 9️⃣ Fetch Booking by Check-Out Date
@app.route('/bookings/checkout/<string:checkout_date>', methods=['GET'])
def get_booking_by_checkout(checkout_date):
    cursor.execute("SELECT * FROM hotel_bookings WHERE CheckOut = %s", (checkout_date,))
    bookings = cursor.fetchall()
    return jsonify(bookings)


# 📌 🔟 Fetch Booking by Amenities
@app.route('/bookings/amenities/<string:amenities>', methods=['GET'])
def get_booking_by_amenities(amenities):
    cursor.execute("SELECT * FROM hotel_bookings WHERE Amenities LIKE %s", (f"%{amenities}%",))
    bookings = cursor.fetchall()
    return jsonify(bookings)


# 📌 1️⃣1️⃣ Add New Booking
@app.route('/bookings', methods=['POST'])
def add_booking():
    data = request.json
    query = """
    INSERT INTO hotel_bookings (TravelCode, UserID, Departure, Arrival, Hotel, Rating, BedroomType, PricePerNight, 
                                Adults, Children, TotalBedrooms, TotalPricePerNight, Amenities, StayingDays, 
                                TotalCost, CheckOut, CheckIn) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (data['TravelCode'], data['UserID'], data['Departure'], data['Arrival'], data['Hotel'], data['Rating'],
              data['BedroomType'], data['PricePerNight'], data['Adults'], data['Children'], data['TotalBedrooms'],
              data['TotalPricePerNight'], data['Amenities'], data['StayingDays'], data['TotalCost'],
              data['CheckOut'], data['CheckIn'])
    
    cursor.execute(query, values)
    db.commit()
    return jsonify({"message": "Booking added successfully"}), 201


# 📌 1️⃣2️⃣ Update Booking Price by TravelCode
@app.route('/bookings/update-price/<int:travel_code>', methods=['PUT'])
def update_price(travel_code):
    data = request.json
    cursor.execute("UPDATE hotel_bookings SET PricePerNight = %s WHERE TravelCode = %s", 
                   (data['PricePerNight'], travel_code))
    db.commit()
    return jsonify({"message": "Price updated successfully"})


# 📌 1️⃣3️⃣ Delete Booking by TravelCode
@app.route('/bookings/delete/<int:travel_code>', methods=['DELETE'])
def delete_booking(travel_code):
    cursor.execute("DELETE FROM hotel_bookings WHERE TravelCode = %s", (travel_code,))
    db.commit()
    return jsonify({"message": "Booking deleted successfully"})



# Run the Flask app and print data in the console
if __name__ == '__main__':
    # Run the Flask app to serve data via API
    app.run(debug=True, port=5001)