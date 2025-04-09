import React from "react";
import Footer from "./Footer"; // Assuming Footer is in the same directory

const CountryFacts = () => {
  // Static data for country facts
  const countries = [
    {
      name: "India",
      capital: "New Delhi",
      population: "1.39 billion",
      currency: "Indian Rupee (INR)",
      language: "Hindi, English (and 21 other official languages)",
      description:
        "India is known for its rich cultural heritage, diverse landscapes, and historical landmarks like the Taj Mahal. It is the world's largest democracy and has a rapidly growing economy.",
    },
    {
      name: "United States",
      capital: "Washington, D.C.",
      population: "331 million",
      currency: "United States Dollar (USD)",
      language: "English",
      description:
        "The United States is a global leader in technology, entertainment, and innovation. It is home to iconic landmarks like the Statue of Liberty and the Grand Canyon.",
    },
    {
      name: "Japan",
      capital: "Tokyo",
      population: "125 million",
      currency: "Japanese Yen (JPY)",
      language: "Japanese",
      description:
        "Japan blends ancient traditions with modern technology. It is famous for its cherry blossoms, sushi, and cultural festivals like Hanami.",
    },
    {
      name: "Brazil",
      capital: "Brasília",
      population: "213 million",
      currency: "Brazilian Real (BRL)",
      language: "Portuguese",
      description:
        "Brazil is the largest country in South America, known for the Amazon Rainforest, Carnival festival, and vibrant culture.",
    },
    {
      name: "Australia",
      capital: "Canberra",
      population: "26 million",
      currency: "Australian Dollar (AUD)",
      language: "English",
      description:
        "Australia is famous for its unique wildlife, such as kangaroos and koalas, as well as natural wonders like the Great Barrier Reef.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-[#06152B] text-white py-4 px-4 shadow-lg">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold">Country Facts</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h2 className="text-3xl font-bold text-black mb-6 text-center">
          Explore Country Facts
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Learn interesting facts and details about countries around the world.
        </p>

        {/* Country Facts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-black mb-3">
                {country.name}
              </h3>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Capital:</span> {country.capital}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Population:</span>{" "}
                {country.population}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Currency:</span>{" "}
                {country.currency}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Language:</span>{" "}
                {country.language}
              </p>
              <p className="text-gray-600 mt-3">{country.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CountryFacts;