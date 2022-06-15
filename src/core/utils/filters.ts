export const isWeekend = (date: Date): boolean => date.getDay() % 6 === 0; // 0 or 6 days is weekday

export const not = { isWeekend: (date: Date) => !isWeekend(date) };
