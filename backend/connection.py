# import mysql.connector
# import pandas as pd

# # Database Configuration (For XAMPP MySQL)
# db_config = {
#     "host": "127.0.0.1",
#     "user": "root",
#     "password": "",
#     "database": "main"
# }

# try:
#     # Establish database connection
#     conn = mysql.connector.connect(**db_config)
#     cursor = conn.cursor()

#     # Load the CSV file into a DataFrame
#     hotels_df = pd.read_csv("C:/Users/dell/Downloads/hotels.csv",encoding="ISO-8859-1")
#     main_df = pd.read_csv("C:/Users/dell/Downloads/hotels.csv",encoding="ISO-8859-1")

#     # ✅ Rename DataFrame columns to match MySQL table structure
#     hotels_df.rename(columns={
#         "TravelCode": "TravelCode",
#         "UserID": "UserID",
#         "Departure": "Departure",
#         "Arrival": "Arrival",
#         "Hotel": "Hotel",
#         "Rating" : "Rating",
#         "BedroomType": "BedroomType",
# "PricePerNight": "PricePerNight",
# "Adults": "Adults",
# "Children": "Children",
# "TotalBedrooms": "TotalBedrooms",
# "TotalPricePerNight" : "TotalPricePerNight",
#  "Amenities": "Amenities",
# "StayingDays":"StayingDays",
# "TotalCost": "TotalCost",
# "CheckOut" : "CheckOut",
# "CheckIn" : "CheckIn"
#     }, inplace=True)
       
#     # ✅ Ensure numeric columns are converted to appropriate types
#     numeric_columns = ["TravelCode", "UserID", "Adults",
# "Children", "TotalBedrooms", "StayingDays", "TotalCost", "PricePerNight", "TotalPricePerNight", "Rating"]
#     for col in numeric_columns:
#         hotels_df[col] = pd.to_numeric(hotels_df[col], errors='coerce').fillna(0).astype(int)

#     # ✅ Exclude 'CarID' while inserting (since it's auto-increment)
#     insert_query = """
#     INSERT INTO hotel (TravelCode, UserID, Departure, Arrival, Hotel, Rating, BedroomType, PricePerNight, Adults, Children, TotalBedrooms, TotalPricePerNight, Amenities, StayingDays, TotalCost, CheckOut, CheckIn)
#      VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,  %s, %s, %s, %s)
#     """

#     # ✅ Convert DataFrame to list of tuples for insertion
#     data_to_insert = [tuple(row) for row in hotels_df.itertuples(index=False, name=None)]

#     # ✅ Insert data in chunks to avoid packet size issues
#     chunk_size = 500  # Adjust chunk size based on your system performance
#     for i in range(0, len(data_to_insert), chunk_size):
#         cursor.executemany(insert_query, data_to_insert[i:i+chunk_size])
#         conn.commit()

#     print("✅ Data successfully inserted into hotels table.")

# except mysql.connector.Error as err:
#     print(f"❌ DatabaseError: {err}")

# finally:
#     # ✅ Close the connection
#     if 'cursor' in locals():
#         cursor.close()
#     if 'conn' in locals():
#         conn.close()





import mysql.connector
import pandas as pd

# Database Configuration (For XAMPP MySQL)
db_config = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "",
    "database": "main"
}

try:
    # Establish database connection
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    # Load the CSV file into a DataFrame
    hotels_df = pd.read_csv("C:/Users/dell/Downloads/hotels.csv",encoding="ISO-8859-1")
    main_df = pd.read_csv("C:/Users/dell/Downloads/hotels.csv",encoding="ISO-8859-1")

    # ✅ Rename DataFrame columns to match MySQL table structure
    hotels_df.rename(columns={
        "TravelCode": "TravelCode",
        "UserID": "UserID",
        "Departure": "Departure",
        "Arrival": "Arrival",
        "Hotel": "Hotel",
        "Rating" : "Rating",
        "BedroomType": "BedroomType",
"PricePerNight": "PricePerNight",
"Adults": "Adults",
"Children": "Children",
"TotalBedrooms": "TotalBedrooms",
"TotalPricePerNight" : "TotalPricePerNight",
 "Amenities": "Amenities",
"StayingDays":"StayingDays",
"TotalCost": "TotalCost",
"CheckOut" : "CheckOut",
"CheckIn" : "CheckIn"
    }, inplace=True)
       
    # ✅ Ensure numeric columns are converted to appropriate types
    numeric_columns = ["TravelCode", "UserID", "Adults",
"Children", "TotalBedrooms", "StayingDays", "TotalCost", "PricePerNight", "TotalPricePerNight", "Rating"]
    for col in numeric_columns:
        hotels_df[col] = pd.to_numeric(hotels_df[col], errors='coerce').fillna(0).astype(int)

    # ✅ Exclude 'CarID' while inserting (since it's auto-increment)
    insert_query = """
    INSERT INTO hotel (TravelCode, UserID, Departure, Arrival, Hotel, Rating, BedroomType, PricePerNight, Adults, Children, TotalBedrooms, TotalPricePerNight, Amenities, StayingDays, TotalCost, CheckOut, CheckIn)
     VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,  %s, %s, %s, %s)
    """

    # ✅ Convert DataFrame to list of tuples for insertion
    data_to_insert = [tuple(row) for row in hotels_df.itertuples(index=False, name=None)]

    # ✅ Insert data in chunks to avoid packet size issues
    chunk_size = 500  # Adjust chunk size based on your system performance
    for i in range(0, len(data_to_insert), chunk_size):
        cursor.executemany(insert_query, data_to_insert[i:i+chunk_size])
        conn.commit()

    print("✅ Data successfully inserted into hotels table.")

except mysql.connector.Error as err:
    print(f"❌ DatabaseError: {err}")

finally:
    # ✅ Close the connection
    if 'cursor' in locals():
        cursor.close()
    if 'conn' in locals():
        conn.close()