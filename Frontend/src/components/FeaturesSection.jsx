import React from "react";

const FeaturesSection = ({ features }) => {
  return (
    <div className="py-6 px-6 max-w-7xl container mx-auto justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3 sm:gap-2 justify-center sm:justify-start">
            <span className="text-3xl sm:text-2xl">{feature.icon}</span>
            <p className="text-black font-semibold">{feature.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
