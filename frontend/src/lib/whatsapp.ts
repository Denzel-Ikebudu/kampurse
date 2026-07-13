export const KAMPURSE_WHATSAPP_NUMBER = "2348156981023"; // no + or spaces, matches wa.me format

export function getWhatsAppLink(message?: string) {
  const defaultMessage = "Hi Kampurse, I have an item I'd like to sell.";
  const text = encodeURIComponent(message ?? defaultMessage);
  return `https://wa.me/${KAMPURSE_WHATSAPP_NUMBER}?text=${text}`;
}