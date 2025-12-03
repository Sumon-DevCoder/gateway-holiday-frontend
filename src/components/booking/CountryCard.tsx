import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CountryCardProps {
  country: {
    country: string;
    capital: string;
    flag: string;
    timezone: string;
    currency: string;
    population: string;
    area: string;
    languages: string;
  };
}

export const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  return (
    <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl">{country.flag}</span>
          <Badge className="bg-yellow-400 text-blue-600 font-bold">
            {country.country}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-yellow-300 font-semibold">Capital:</span>
            <span className="text-white font-bold">{country.capital}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-300 font-semibold">Languages:</span>
            <span className="text-white font-bold">{country.languages}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-300 font-semibold">Population:</span>
            <span className="text-white font-bold">{country.population}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-300 font-semibold">Currency:</span>
            <span className="text-white font-bold">{country.currency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-300 font-semibold">Timezone:</span>
            <span className="text-white font-bold">{country.timezone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-300 font-semibold">Area:</span>
            <span className="text-white font-bold">{country.area}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
