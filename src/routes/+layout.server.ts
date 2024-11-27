import type {LayoutServerLoad} from "./$types";
import {creatures} from "animal-crossing";
import type {Creature} from "animal-crossing/lib/types/Creature";

const getRandomCreature = () => {
    return creatures[Math.floor(Math.random() * creatures.length)];
}

const sortAsc = (a: Creature, b: Creature) => a.name < b.name ? -1 : 1;

const randomCreature: Creature = getRandomCreature();
const sortedCreatures: Creature[] = creatures.sort(sortAsc);

console.log("Chose random creature as " + randomCreature.name);

export const load: LayoutServerLoad = async () => {
    return {
        randomCreature,
        creatures: sortedCreatures,
    };
}
