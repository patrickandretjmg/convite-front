/**
 * Converte data (yyyy-MM-dd) e hora (HH:mm) para ISO datetime
 * @param date - Data no formato yyyy-MM-dd
 * @param time - Hora no formato HH:mm
 * @returns ISO datetime string (ex: 2025-12-25T18:00:00.000Z)
 */
export const toISODateTime = (date: string, time: string): string => {
  const dateTime = new Date(`${date}T${time}:00`);
  return dateTime.toISOString();
};

/**
 * Converte datetime-local (yyyy-MM-ddTHH:mm) para ISO datetime
 * @param datetimeLocal - Datetime no formato yyyy-MM-ddTHH:mm
 * @returns ISO datetime string
 */
export const datetimeLocalToISO = (datetimeLocal: string): string => {
  const dateTime = new Date(datetimeLocal);
  return dateTime.toISOString();
};