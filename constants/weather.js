import i18n from '../utils/i18n';

export const WEATHER_CONDITIONS = {
  Sunny: {
    label: i18n.t("weather_sunny"),
    icon: require("../assets/images/weather-sunny.png"),
  },
  Clear: {
    label: i18n.t("weather_clear"),
    icon: require("../assets/images/weather-sunny.png"),
  },  
  Clouds: {
    label: i18n.t("weather_cloudy"),
    icon: require("../assets/images/weather-rainy.png"),
  },
  Rain: {
    label: i18n.t("weather_rainy"),
    icon: require("../assets/images/weather-cloudy.png"),
  },
  Stormy: {
    label: i18n.t("weather_stormy"),
    icon: require("../assets/images/weather-stormy.png"),
  },
  // Add more weather types as needed
};

