export const generateGoogleMapsUrl = (latitude: number, longitude: number): string => {
  return `https://maps.google.com/?q=${latitude},${longitude}`;
};

export const generateWazeUrl = (latitude: number, longitude: number): string => {
  return `waze://?ll=${latitude},${longitude}&navigate=yes`;
};

export const generateWazeFallbackUrl = (latitude: number, longitude: number): string => {
  return `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
};

export const generateWhatsAppMessage = (latitude: number, longitude: number): string => {
  const mapsUrl = generateGoogleMapsUrl(latitude, longitude);
  const text = `Minha localização atual:\n${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nAbrir no Google Maps:\n${mapsUrl}`;
  return `whatsapp://send?text=${encodeURIComponent(text)}`;
};

export const generateSMSMessage = (latitude: number, longitude: number): string => {
  const mapsUrl = generateGoogleMapsUrl(latitude, longitude);
  const body = `Minha localização: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n${mapsUrl}`;
  return `sms:?body=${encodeURIComponent(body)}`;
};

export const generateEmailUri = (latitude: number, longitude: number): string => {
  const mapsUrl = generateGoogleMapsUrl(latitude, longitude);
  const subject = encodeURIComponent('Minha Localização');
  const body = encodeURIComponent(
    `Minha localização atual:\n\nCoordenadas: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nAbrir no Google Maps:\n${mapsUrl}`
  );
  return `mailto:?subject=${subject}&body=${body}`;
};

export const generateCoordsText = (latitude: number, longitude: number): string => {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};

export const generateShareMessage = (latitude: number, longitude: number): string => {
  const mapsUrl = generateGoogleMapsUrl(latitude, longitude);
  return `Minha localização atual:\n${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nAbrir no Google Maps:\n${mapsUrl}`;
};
