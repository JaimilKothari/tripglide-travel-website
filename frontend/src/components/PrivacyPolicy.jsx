import React from "react";
import Footer from "./Footer"; // Assuming Footer is in the same directory

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-[#06152B] text-white py-4 px-4 shadow-lg">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold">Tripglide Privacy Policy</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h2 className="text-3xl font-bold text-black mb-6 text-center">
          Privacy Policy
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Last Updated: March 21, 2025
        </p>

        {/* Privacy Policy Sections */}
        <div className="space-y-8">
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              Introduction
            </h3>
            <p className="text-gray-600">
              At Tripglide, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you use our website, mobile app, or services to book flights, hotels, car hires, or other travel-related services. By using Tripglide, you agree to the practices described in this policy.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              Information We Collect
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-black">
                  Personal Information
                </h4>
                <p className="text-gray-600">
                  We may collect personal information such as your name, email address, phone number, date of birth, passport details, payment information (e.g., credit card details), and travel preferences when you create an account, make a booking, or contact our support team.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  Non-Personal Information
                </h4>
                <p className="text-gray-600">
                  We also collect non-personal information, such as your IP address, browser type, device information, and browsing behavior (e.g., pages visited, search queries), to improve our services and user experience.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  Cookies and Tracking Technologies
                </h4>
                <p className="text-gray-600">
                  Tripglide uses cookies, web beacons, and similar technologies to track user activity, store preferences, and enhance functionality. Cookies help us remember your settings, provide personalized recommendations, and analyze website performance.
                </p>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              How We Use Your Information
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-black">
                  To Provide Services
                </h4>
                <p className="text-gray-600">
                  We use your personal information to process bookings, send confirmation emails, manage your travel itinerary, and provide customer support. This includes sharing your details with airlines, hotels, car rental agencies, and other service providers to fulfill your travel requests.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  To Improve Our Services
                </h4>
                <p className="text-gray-600">
                  We analyze user data to understand trends, improve our website and app functionality, and enhance the overall user experience. This may include personalizing search results and recommendations based on your travel history and preferences.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  For Marketing and Communication
                </h4>
                <p className="text-gray-600">
                  We may use your email address or phone number to send promotional offers, newsletters, and updates about Tripglide services. You can opt out of marketing communications at any time by adjusting your account settings or unsubscribing from emails.
                </p>
              </div>
            </div>
          </div>

          {/* Data Sharing and Disclosure */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              Data Sharing and Disclosure
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-black">
                  With Service Providers
                </h4>
                <p className="text-gray-600">
                  We share your information with third-party service providers (e.g., airlines, hotels, car rental agencies) to fulfill your bookings. These providers are contractually obligated to protect your data and use it only for the purpose of providing the requested services.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  With Business Partners
                </h4>
                <p className="text-gray-600">
                  We may share anonymized or aggregated data with business partners for marketing, advertising, or analytics purposes. This data does not identify you personally.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  For Legal Reasons
                </h4>
                <p className="text-gray-600">
                  We may disclose your information if required by law, regulation, or legal process, or to protect the rights, property, or safety of Tripglide, our users, or the public.
                </p>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              Data Security
            </h3>
            <p className="text-gray-600">
              We implement industry-standard security measures, such as encryption, secure socket layer (SSL) technology, and access controls, to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          {/* Your Rights and Choices */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              Your Rights and Choices
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-black">
                  Access and Update Your Information
                </h4>
                <p className="text-gray-600">
                  You can access and update your personal information by logging into your Tripglide account and navigating to your profile settings.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  Opt-Out of Marketing
                </h4>
                <p className="text-gray-600">
                  You can opt out of receiving marketing emails or notifications by adjusting your account preferences or unsubscribing via the link provided in our emails.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  Data Deletion
                </h4>
                <p className="text-gray-600">
                  You may request the deletion of your personal data by contacting our support team. We will comply with your request unless we are required to retain certain information for legal or operational purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Children's Privacy */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              Children's Privacy
            </h3>
            <p className="text-gray-600">
              Tripglide’s services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
            </p>
          </div>

          {/* International Data Transfers */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              International Data Transfers
            </h3>
            <p className="text-gray-600">
              Your information may be transferred to and processed in countries other than your own, including countries where data protection laws may differ. We ensure that such transfers comply with applicable laws and that appropriate safeguards are in place to protect your data.
            </p>
          </div>

          {/* Changes to This Privacy Policy */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              Changes to This Privacy Policy
            </h3>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated policy will be posted on this page with a revised "Last Updated" date. We encourage you to review this policy periodically.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;