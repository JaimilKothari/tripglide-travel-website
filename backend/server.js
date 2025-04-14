require("dotenv").config();

const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");
const app = express();

app.use(cors()); // Enable CORS for frontend communication
app.use(express.json());

// Optional: Add a root route for debugging
app.get("/", (req, res) => {
  res.send("Server is running! Use POST /create-checkout-session to create a Stripe Checkout session.");
});

app.post("/create-checkout-session", async (req, res) => {
  const { amount, description } = req.body;

  // Validate request body
  if (!amount || !description) {
    return res.status(400).json({ error: "Missing required fields: amount and description" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: description,
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/booking-confirmation", // Updated to port 5173
      cancel_url: "http://localhost:5173/flight-cart", // Updated to port 5173
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5002, () => console.log("Server running on port 5002"));