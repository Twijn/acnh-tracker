import type {Creature, Hemispheres} from "animal-crossing/lib/types/Creature";
import {hours, months} from "./constants";

const getMonthWhere = (monthsArray: number[], isActive: boolean): number => {
    let i = new Date().getMonth() + 1;
    while (monthsArray.includes(i) !== isActive) {
        i++;
        if (i > 12) {
            i = 1;
        }
    }
    return i - 1;
}

const getHourWhere = (hoursArray: (number|number[])[], isActive: boolean): number => {
    let finalArray: number[] = [];
    hoursArray.forEach(entry => {
        if (typeof entry === "number") {
            finalArray.push(entry);
        } else {
            finalArray = [
                ...finalArray,
                ...entry,
            ];
        }
    });
    hoursArray = finalArray;

    let i = new Date().getHours();
    while (hoursArray.includes(i) !== isActive) {
        i++;
        if (i > 23) {
            i = 0;
        }
    }
    return i;
}

export const getActivity = (creature: Creature, hemisphere: keyof Hemispheres): {active: boolean, inSeason: boolean, message: string} => {
    const now = new Date();

    if (creature.hemispheres[hemisphere].monthsArray.includes(now.getMonth() + 1)) {
        if (creature.hemispheres[hemisphere].timeArray.includes(now.getHours())) {
            // Creature is active at all times of the day
            if (creature.hemispheres[hemisphere].timeArray.length === 24) {
                if (creature.hemispheres[hemisphere].monthsArray.length === 12) {
                    return {
                        active: true,
                        inSeason: true,
                        message: "Always Active!",
                    };
                } else {
                    return {
                        active: true,
                        inSeason: true,
                        message: `Active until ${months[getMonthWhere(creature.hemispheres[hemisphere].monthsArray, false)]}!`,
                    };
                }
            } else {
                return {
                    active: true,
                    inSeason: true,
                    message: `Active until ${hours[getHourWhere(creature.hemispheres[hemisphere].timeArray, false)]}!`,
                }
            }
        } else {
            return {
                active: false,
                inSeason: true,
                message: `Inactive until ${hours[getHourWhere(creature.hemispheres[hemisphere].timeArray, true)]}!`,
            }
        }
    } else {
        return {
            active: false,
            inSeason: false,
            message: `Inactive until ${months[getMonthWhere(creature.hemispheres[hemisphere].monthsArray, true)]}`,
        }
    }

}
