export class DateUtils {
  static isoToDate(isoString: string): Date {
    return new Date(isoString);
  }
  
  static diffInMinutes(date1: Date, date2: Date): number {
    return Math.abs(date1.getTime() - date2.getTime()) / 1000 / 60;
  }
  
  static toTimeString(date: Date): string {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  static minutesSince(date: Date): number {
    return (new Date().getTime() - date.getTime()) / 1000 / 60;
  }
}