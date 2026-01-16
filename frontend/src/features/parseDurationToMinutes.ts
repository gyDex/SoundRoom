export function parseDurationToMinutes(duration: any): number {
     const date = new Date(duration);
    const timestamp = date.getTime(); 
    return timestamp / 1000 / 60;
}

function timeStringToMinutes(timeString: any) {
  const parts = timeString.split(':');
  
  if (parts.length === 3) {
    // HH:MM:SS
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);
    return hours * 60 + minutes + seconds / 60;
  } else if (parts.length === 2) {
    // MM:SS
    const minutes = parseInt(parts[0]);
    const seconds = parseInt(parts[1]);
    return minutes + seconds / 60;
  } else if (parts.length === 1) {
    // Только секунды или только минуты
    return parseFloat(timeString) / 60;
  }
  
  return 0;
}