export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatWhatsAppLink(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
