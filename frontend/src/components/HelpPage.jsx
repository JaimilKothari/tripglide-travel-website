import React, { useState } from 'react';
import Footer from './Footer';
import { Link } from 'react-router-dom';

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#06152B] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Help Center</h1>
          <p className="mt-4 text-center max-w-2xl mx-auto">
            Find answers to your questions and get the support you need for your travels
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Category sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4">Categories</h2>
              <nav className="flex flex-col gap-2">
                <button 
                  className={`p-2 rounded-md text-left ${activeCategory === 'general' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveCategory('general')}
                >
                  General Information
                </button>
                <button 
                  className={`p-2 rounded-md text-left ${activeCategory === 'booking' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveCategory('booking')}
                >
                  Booking & Reservations
                </button>
                <button 
                  className={`p-2 rounded-md text-left ${activeCategory === 'payment' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveCategory('payment')}
                >
                  Payment & Pricing
                </button>
                <button 
                  className={`p-2 rounded-md text-left ${activeCategory === 'account' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveCategory('account')}
                >
                  Account Management
                </button>
                <button 
                  className={`p-2 rounded-md text-left ${activeCategory === 'contact' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveCategory('contact')}
                >
                  Contact Support
                </button>
              </nav>
            </div>
          </div>
          
          {/* FAQ Content */}
          <div className="md:w-3/4">
            <div className="bg-white shadow rounded-lg p-6">
              {activeCategory === 'general' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">General Information</h2>
                  
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-2">What is Tripglide?</h3>
                      <p>Tripglide is a travel platform designed to help you find the best flights, hotels, and car hire deals. We aggregate offers from various providers to ensure you get the best prices for your travels.</p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-2">How do I search for flights on Tripglide?</h3>
                      <p>To search for flights, simply enter your departure and arrival locations, travel dates, and the number of passengers on our homepage. Click the "Search Flights" button to see available options.</p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-2">Can I book hotels and flights together?</h3>
                      <p>Yes! Tripglide offers package deals that allow you to book flights and hotels together, often at a discounted rate compared to booking them separately.</p>
                    </div>
                    
                    <div className="pb-4">
                      <h3 className="text-lg font-medium mb-2">Are there any booking fees?</h3>
                      <p>Tripglide strives to be transparent about pricing. Any applicable fees will be clearly displayed before you complete your booking. In many cases, we don't charge additional booking fees.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeCategory === 'booking' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Booking & Reservations</h2>
                  
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-2">How do I cancel or modify my booking?</h3>
                      <p>To cancel or modify a booking, log in to your account, go to "My Trips," select the booking you wish to change, and follow the instructions for cancellation or modification. Please note that cancellation policies vary depending on the service provider.</p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-2">What information do I need to make a booking?</h3>
                      <p>For flight bookings, you'll need the full names of all travelers (as they appear on their ID/passport), contact information, and payment details. For hotels, you'll need guest names, check-in/check-out dates, and payment information.</p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-2">How can I get booking confirmation?</h3>
                      <p>Once your booking is confirmed, you'll receive a confirmation email with all the details. You can also view your booking information in the "My Trips" section of your account.</p>
                    </div>
                    
                    <div className="pb-4">
                      <h3 className="text-lg font-medium mb-2">What if I don't receive a confirmation email?</h3>
                      <p>If you haven't received a confirmation email within 24 hours after booking, please check your spam folder. If you still don't see it, contact our customer support team with your booking reference number for assistance.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeCategory === 'payment' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Payment & Pricing</h2>
                  
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-2">What payment methods do you accept?</h3>
                      <p>Tripglide accepts major credit and debit cards including Visa, Mastercard, and American Express. In some regions, we also offer payment options like PayPal and Apple Pay.</p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-2">Is it safe to enter my credit card details on your website?</h3>
                      <p>Yes, Tripglide uses industry-standard encryption and security protocols to protect your payment information. We never store your complete credit card details on our servers.</p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-2">Why do prices change when I'm searching?</h3>
                      <p>Flight and hotel prices are dynamic and can change based on availability, demand, and other factors. The final price is confirmed at the time of booking. We recommend booking quickly once you find a deal you like.</p>
                    </div>
                    
                    <div className="pb-4">
                      <h3 className="text-lg font-medium mb-2">Do you offer refunds?</h3>
                      <p>Refund policies depend on the specific terms and conditions of your booking and the service provider. Some bookings are non-refundable, while others may offer partial or full refunds under certain conditions. Always review the terms before booking.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeCategory === 'account' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Account Management</h2>
                  
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-2">How do I create an account?</h3>
                      <p>To create an account, click on the "Sign Up" button in the top right corner of the website. You can sign up using your email address or connect with your Google or Facebook account.</p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-2">I forgot my password. How can I reset it?</h3>
                      <p>Click on the "Sign In" button, then select "Forgot Password." Enter the email address associated with your account, and we'll send you instructions to reset your password.</p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-2">How do I update my personal information?</h3>
                      <p>Once signed in, go to "My Account" and select "Profile Settings." From there, you can update your name, email, phone number, and other personal details.</p>
                    </div>
                    
                    <div className="pb-4">
                      <h3 className="text-lg font-medium mb-2">Can I delete my account?</h3>
                      <p>Yes, you can delete your account by going to "My Account," selecting "Profile Settings," and clicking on "Delete Account" at the bottom of the page. Please note that this action is irreversible and will remove all your booking history and saved preferences.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeCategory === 'contact' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Contact Support</h2>
                  
                  <div className="mb-8">
                    <p className="mb-4">Our customer support team is available to assist you with any questions or concerns.</p>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h3 className="text-lg font-medium mb-2">Email Support</h3>
                      <p className="mb-1">For general inquiries: <a href="mailto:support@tripglide.com" className="text-blue-600 hover:underline">support@tripglide.com</a></p>
                      <p>For booking issues: <a href="mailto:bookings@tripglide.com" className="text-blue-600 hover:underline">bookings@tripglide.com</a></p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Phone Support</h3>
                      <p className="mb-1">International: <strong>+1 (555) 123-4567</strong></p>
                      <p className="text-sm text-gray-600">Available Monday to Friday, 9 AM to 8 PM EST</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Send Us a Message</h3>
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input type="text" id="name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <select id="subject" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">Select a subject</option>
                          <option value="booking">Booking Issue</option>
                          <option value="payment">Payment Problem</option>
                          <option value="refund">Refund Request</option>
                          <option value="account">Account Problem</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                        <textarea id="message" rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                      </div>
                      
                      <button type="submit" className="bg-[#06214a] hover:bg-blue-900 text-white font-medium py-2 px-4 rounded-md transition duration-300">
                        Submit Message
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}