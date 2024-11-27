import {writable} from 'svelte/store';
import type {ISettings} from "$lib/types";

export const settings = writable<ISettings>({
    lang: "uSen",
    hemisphere: "north",
});
