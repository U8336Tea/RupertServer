import { randomInt } from 'crypto'

export function rand(max: number, min: number = 0): number {
    if (min == max) return max;
    return randomInt(min, max);
}

export function randElement<T>(array: Array<T>): T {
    return array[rand(array.length)];
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}