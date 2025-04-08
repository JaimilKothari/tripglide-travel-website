import pandas as pd
import mysql.connector

# Load CSV file correctly
csv_file = r"C:\Users\jenyf\OneDrive\Desktop\Ease my trip\Data\hotel_booking.csv"
df = pd.read_csv(csv_file, encoding="ISO-8859-1")

# Connect to MySQL
try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Jeny2512!",  # Ensure password security (consider using environment variables)
        database="hotel_booking_db"
    )
    cursor = conn.cursor()

    # Prepare SQL Query for Inserting Data
    query = """
    INSERT INTO hotel_bookings (
        TravelCode, UserID, Departure, Arrival, Hotel, Rating, BedroomType, PricePerNight,
        Adults, Children, TotalBedrooms, TotalPricePerNight, Amenities, StayingDays, 
        TotalCost, CheckOut, CheckIn
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    # Convert DataFrame to List of Tuples
    data_to_insert = [tuple(row) for row in df.itertuples(index=False, name=None)]

    # Insert Data into MySQL Table
    cursor.executemany(query, data_to_insert)
    
    # Commit changes
    conn.commit()

    print(f" Data Imported Successfully! {len(data_to_insert)} rows added.")

except mysql.connector.Error as err:
    print(f" MySQL Error: {err}")

finally:
    # Close connection
    if 'cursor' in locals():
        cursor.close()
    if 'conn' in locals():
        conn.close()
