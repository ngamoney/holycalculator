/**
 * conversionFactors.js — Data definitions and conversion formulas for Unit Conversion Calculator
 */

export const CONVERSION_CATEGORIES = [
  { id: "length", name: "Length", icon: "📏" },
  { id: "weight", name: "Weight & Mass", icon: "⚖️" },
  { id: "temperature", name: "Temperature", icon: "🌡️" },
  { id: "area", name: "Area", icon: "🗺️" },
  { id: "volume", name: "Volume", icon: "🧪" },
  { id: "time", name: "Time", icon: "⏱️" },
  { id: "speed", name: "Speed", icon: "🚀" },
];

export const CONVERSION_UNITS = {
  length: [
    { id: "m", name: "Meters (m)", factor: 1 },
    { id: "cm", name: "Centimeters (cm)", factor: 0.01 },
    { id: "mm", name: "Millimeters (mm)", factor: 0.001 },
    { id: "km", name: "Kilometers (km)", factor: 1000 },
    { id: "in", name: "Inches (in)", factor: 0.0254 },
    { id: "ft", name: "Feet (ft)", factor: 0.3048 },
    { id: "yd", name: "Yards (yd)", factor: 0.9144 },
    { id: "mi", name: "Miles (mi)", factor: 1609.344 },
  ],
  weight: [
    { id: "kg", name: "Kilograms (kg)", factor: 1000 },
    { id: "g", name: "Grams (g)", factor: 1 },
    { id: "mg", name: "Milligrams (mg)", factor: 0.001 },
    { id: "tonne", name: "Metric Tonnes (t)", factor: 1000000 },
    { id: "lb", name: "Pounds (lb)", factor: 453.59237 },
    { id: "oz", name: "Ounces (oz)", factor: 28.349523125 },
    { id: "stone", name: "Stone (st)", factor: 6350.29318 },
  ],
  temperature: [
    { id: "celsius", name: "Celsius (°C)" },
    { id: "fahrenheit", name: "Fahrenheit (°F)" },
    { id: "kelvin", name: "Kelvin (K)" },
  ],
  area: [
    { id: "sq_m", name: "Square Meters (m²)", factor: 1 },
    { id: "sq_cm", name: "Square Centimeters (cm²)", factor: 0.0001 },
    { id: "sq_mm", name: "Square Millimeters (mm²)", factor: 0.000001 },
    { id: "sq_km", name: "Square Kilometers (km²)", factor: 1000000 },
    { id: "hectare", name: "Hectares (ha)", factor: 10000 },
    { id: "sq_ft", name: "Square Feet (ft²)", factor: 0.09290304 },
    { id: "sq_in", name: "Square Inches (in²)", factor: 0.00064516 },
    { id: "sq_yd", name: "Square Yards (yd²)", factor: 0.83612736 },
    { id: "acre", name: "Acres (ac)", factor: 4046.8564224 },
    { id: "sq_mi", name: "Square Miles (mi²)", factor: 2589988.110336 },
  ],
  volume: [
    { id: "L", name: "Liters (L)", factor: 1 },
    { id: "mL", name: "Milliliters (mL)", factor: 0.001 },
    { id: "m3", name: "Cubic Meters (m³)", factor: 1000 },
    { id: "cup", name: "US Cups", factor: 0.2365882365 },
    { id: "fl_oz", name: "US Fluid Ounces (fl oz)", factor: 0.0295735295625 },
    { id: "tsp", name: "US Teaspoons (tsp)", factor: 0.00492892159375 },
    { id: "tbsp", name: "US Tablespoons (tbsp)", factor: 0.01478676478125 },
    { id: "pint", name: "US Pints (pt)", factor: 0.473176473 },
    { id: "quart", name: "US Quarts (qt)", factor: 0.946352946 },
    { id: "gallon", name: "US Gallons (gal)", factor: 3.785411784 },
  ],
  time: [
    { id: "sec", name: "Seconds (s)", factor: 1 },
    { id: "min", name: "Minutes (min)", factor: 60 },
    { id: "hr", name: "Hours (h)", factor: 3600 },
    { id: "day", name: "Days (d)", factor: 86400 },
    { id: "week", name: "Weeks (wk)", factor: 604800 },
    { id: "month", name: "Months (avg 30.44d)", factor: 2629746 },
    { id: "yr", name: "Years (avg 365.24d)", factor: 31556952 },
  ],
  speed: [
    { id: "m_s", name: "Meters per second (m/s)", factor: 1 },
    { id: "km_h", name: "Kilometers per hour (km/h)", factor: 0.2777777777777778 },
    { id: "mph", name: "Miles per hour (mph)", factor: 0.44704 },
    { id: "knot", name: "Knots (kn)", factor: 0.5144444444444444 },
  ],
};

/**
 * Execute Unit Conversion
 * Converts to internal base unit first, then to target unit.
 */
export function convertUnit(category, fromUnitId, toUnitId, valueStr) {
  const val = parseFloat(valueStr);
  if (isNaN(val)) return null;

  if (category === "temperature") {
    let result = val;
    if (fromUnitId === toUnitId) return result;

    if (fromUnitId === "celsius" && toUnitId === "fahrenheit") result = (val * 9) / 5 + 32;
    else if (fromUnitId === "fahrenheit" && toUnitId === "celsius") result = ((val - 32) * 5) / 9;
    else if (fromUnitId === "celsius" && toUnitId === "kelvin") result = val + 273.15;
    else if (fromUnitId === "kelvin" && toUnitId === "celsius") result = val - 273.15;
    else if (fromUnitId === "fahrenheit" && toUnitId === "kelvin") result = ((val - 32) * 5) / 9 + 273.15;
    else if (fromUnitId === "kelvin" && toUnitId === "fahrenheit") result = ((val - 273.15) * 9) / 5 + 32;

    return Math.round(result * 100000) / 100000;
  }

  const unitsList = CONVERSION_UNITS[category];
  if (!unitsList) return null;

  const fromUnit = unitsList.find((u) => u.id === fromUnitId);
  const toUnit = unitsList.find((u) => u.id === toUnitId);

  if (!fromUnit || !toUnit) return null;

  // Convert fromUnit to base unit
  const baseValue = val * fromUnit.factor;
  // Convert base unit to toUnit
  const targetValue = baseValue / toUnit.factor;

  return Math.round(targetValue * 1000000) / 1000000;
}
