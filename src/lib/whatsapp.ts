function normalizarNumeroUy(numero: string): string {
  const digitos = numero.replace(/\D/g, "");
  if (digitos.startsWith("598")) return digitos;
  if (digitos.startsWith("0")) return `598${digitos.slice(1)}`;
  return `598${digitos}`;
}

export function linkWhatsApp(numero: string, mensaje: string): string {
  const normalizado = normalizarNumeroUy(numero);
  return `https://wa.me/${normalizado}?text=${encodeURIComponent(mensaje)}`;
}
