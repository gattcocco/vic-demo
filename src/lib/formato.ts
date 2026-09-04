/**
 * Formattazione numeri in italiano: numero(7000) -> "7.000", euro(10) -> "10 €".
 * useGrouping 'always' è necessario: il CLDR italiano ha minimumGroupingDigits = 2,
 * quindi senza questa opzione i numeri a quattro cifre uscirebbero senza punto (7000).
 */
const fmtNumero = new Intl.NumberFormat('it-IT', { useGrouping: 'always' });
const fmtEuro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: 'always' });

export const numero = (n: number): string => fmtNumero.format(n);
export const euro = (n: number): string => fmtEuro.format(n);

/** Media settimanale arrotondata all'intero (valore annuale / 52). */
export const perSettimana = (annuale: number): number => Math.round(annuale / 52);
