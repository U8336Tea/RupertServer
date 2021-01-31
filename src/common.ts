export function rand(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min) + min);
}

export function randElement<T>(array: Array<T>): T {
    return array[rand(array.length)];
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}