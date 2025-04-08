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

    # Load CSV into DataFrame
    
    hotels_df = pd.read_csv(r"D:\xampp\htdocs\Inbox\tripglide\database\Finallll.csv", encoding="ISO-8859-1")

    # ✅ Rename columns to match MySQL table structure
    hotels_df.rename(columns={
        "travelCode": "TravelCode",
        "User_ID": "UserID",
        "Departure": "Departure",
        "Arrival": "Arrival",
        "Check-in": "CheckIn",
        "Hotel": "Hotel",
        "Stars": "Rating",
        "Bedroom Type": "BedroomType",
        "Room Price per Night": "PricePerNight",
        "Number of Adults": "Adults",
        "Number of Children": "Children",
        "Number of Bedrooms": "TotalBedrooms",
        "Total Price per Night": "TotalPricePerNight",
        "Amenities": "Amenities",
        "Days of Stay": "StayingDays",
        "Total Cost": "TotalCost",
        "Check-Out": "CheckOut",
        "Hotel_ID": "HotelID"
    }, inplace=True)

    # ✅ Ensure numeric columns are converted to appropriate types
    numeric_columns = [
        "TravelCode", "UserID", "Rating", "PricePerNight", "Adults",
        "Children", "TotalBedrooms", "TotalPricePerNight", "StayingDays", "TotalCost"
    ]
    for col in numeric_columns:
        hotels_df[col] = pd.to_numeric(hotels_df[col], errors='coerce').fillna(0).astype(int)

    # ✅ Convert date columns to proper format
    date_columns = ["CheckIn", "CheckOut"]
    for col in date_columns:
        hotels_df[col] = pd.to_datetime(hotels_df[col], errors='coerce').dt.date

    # ✅ Prepare SQL insert query
    insert_query = """
    INSERT INTO hotel (TravelCode, UserID, Departure, Arrival, CheckIn, Hotel, Rating, BedroomType, 
                       PricePerNight, Adults, Children, TotalBedrooms, TotalPricePerNight, 
                       Amenities, StayingDays, TotalCost, CheckOut, HotelID)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    # ✅ Convert DataFrame to list of tuples for insertion
    data_to_insert = [tuple(row) for row in hotels_df.itertuples(index=False, name=None)]

    # ✅ Insert data in batches to improve performance
    batch_size = 1000  
    total_rows = len(data_to_insert)

    for i in range(0, total_rows, batch_size):
        cursor.executemany(insert_query, data_to_insert[i:i + batch_size])
        conn.commit()
        print(f"✅ Inserted {i + batch_size if i + batch_size < total_rows else total_rows}/{total_rows} rows")

    print("🎉✅ Data successfully imported into 'hotel' table!")

except mysql.connector.Error as err:
    print(f"❌ DatabaseError: {err}")

finally:
    # ✅ Close database connection
    if 'cursor' in locals():
        cursor.close()
    if 'conn' in locals():
        conn.close()
