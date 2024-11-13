export const secondsToTime = (seconds: number) => {
    if (!seconds) return "";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    } else {
        return `${Math.abs(remainingSeconds)}s`;
    }
}