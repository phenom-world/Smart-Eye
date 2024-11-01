import axios from 'axios';
import lookup from 'country-code-lookup';

type GeocodeResponse = {
  lat: number;
  lng: number;
};

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const geocode = async ({ address, country }: { address: string; country?: string | null }): Promise<GeocodeResponse | null> => {
  const countryCode = lookup.byCountry(country!);
  const countryComponent = countryCode?.iso2 ? `&components=country:${countryCode.iso2}` : '';

  const res = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}${countryComponent}&key=${process.env.GEOLOCATION_API_KEY}`
  );

  if (!res.data.results[0]) return null;
  return res.data.results[0].geometry.location;
};
