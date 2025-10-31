interface ITime {
    hours: number,
    minutes: number,
    seconds: number,
}

export function conversionToTime(duration: number): string {

    const mins = Math.floor(duration / 60);
    const hours = Math.floor(mins / 60);
    const secs = Math.floor(duration % 60);
    
    if (hours !== 0) {
        return  `${hours.toString().padStart(2,'0')}:${mins}:${secs.toString().padStart(2,'0')}`
    }

    return `${mins}:${secs.toString().padStart(2, '0')}`;
}