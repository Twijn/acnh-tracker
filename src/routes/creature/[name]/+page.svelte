<script lang="ts">
    import {toTitleCase} from "$lib/utils.js";
    import type {Translations} from "animal-crossing/lib/types/Creature";
    import {settings} from "$lib/shared";
    import CreatureInfo from "$lib/CreatureInfo.svelte";

    const { data } = $props();
    const { creatureList } = data;

    const creature = creatureList[0];

    let lang: keyof Translations = $state("uSen");

    settings.subscribe(currentSettings => {
        try {
            lang = currentSettings.lang as keyof Translations;
        } catch(err) {
            console.error("Invalid lang: ", err);
        }
    });
</script>

<svelte:head>
    <title>{toTitleCase(creature.translations[lang].toString())} | Fish | Animal Crossing: New Horizons Tracker</title>
</svelte:head>

{#if creatureList.length > 1}
    <h1>
        Disambiguation: Choose one of the following
    </h1>
    <nav>
        {#each creatureList as fish}
            <a href="/fish/{fish.uniqueEntryId}">{fish.name}</a>
        {/each}
    </nav>
{:else}
    <CreatureInfo creature={creature} />
{/if}
