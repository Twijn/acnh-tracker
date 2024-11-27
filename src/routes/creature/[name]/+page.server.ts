import type {PageServerLoad} from "../../../../.svelte-kit/types/src/routes/$types";
import {getURLFromName} from "$lib/utils";
import {error} from "@sveltejs/kit";
import {creatures} from "animal-crossing";

export const load: PageServerLoad = async ({ params }) => {
    let creatureList = creatures.filter(x => x.uniqueEntryId === params.name);

    if (creatureList.length === 0) {
        creatureList = creatures.filter(x => getURLFromName(x.name) === params.name);
    }

    if (creatureList.length === 0) {
        throw error(404, "Not Found");
    }

    return {
        creatureList,
    };
}
