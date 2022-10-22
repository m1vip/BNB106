import { doubleNumber } from "./math";

export function formatNumberToHours(number) {
    if (number < 0) return {
        isErr:true,
        hours:"00",
        minutes:"00",
        seconds:"00"
    };

    let hours = Math.floor(number / 3600);
    let minutes = Math.floor((number % 3600) / 60);
    let seconds = ((number % 3600) % 60);


    return {
        isErr:false,
        hours: doubleNumber(hours),
        minutes: doubleNumber(minutes),
        seconds: doubleNumber(seconds)
    }
}