from fastapi import FastAPI
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow React frontend to access this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MySQL
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="yourpassword",
        database="flight_booking"
    )

# API to fetch flights
@app.get("/flights")
def get_flights():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM flights")
    flights = cursor.fetchall()
    
    conn.close()
    return {"flights": flights}

# Run the server: uvicorn main:app --reload
