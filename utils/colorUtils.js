import chroma from 'chroma-js';

// Define the coolwarm colormap endpoints (approximation)
const coolwarmScale = chroma.scale(['#0571b0', '#3b4cc0', '#fafa6e', '#b40426', '#ca0020']).domain([-20,14, 36, 40]);

/**
 * Get background color based on temperature
 * @param {number} temperature - Temperature in Celsius
 * @returns {string} - HEX color
 */
export function getTemperatureColor(temperature) {
  // Clamp temperature within range
  const temp = Math.max(-20, Math.min(40, temperature));
  return coolwarmScale(temp).hex();
}
