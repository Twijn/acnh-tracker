<script lang="ts">
    import {page} from "$app/state";
    import {toTitleCase} from "$lib/utils.js";
    import type {Translations} from "animal-crossing/lib/types/Creature";
    import {settings} from "$lib/shared";
    import CreatureInfo from "$lib/creatures/CreatureInfo.svelte";

    const { data } = $props();
    const creatureList = $derived(data.creatureList);

    const creature = $derived(creatureList[0]);
    let lang: keyof Translations = $state("uSen");

    const creatureTitle = $derived(toTitleCase(creature.translations[lang].toString()));
    const creatureDescription = $derived(`View information for ${creatureTitle} in Animal Crossing: New Horizons, including activity times, seasonality, and sell prices.`);

    settings.subscribe(currentSettings => {
        try {
            lang = currentSettings.lang as keyof Translations;
        } catch(err) {
            console.error("Invalid lang: ", err);
        }
    });
</script>

<svelte:head>
    <title>{creatureTitle} | Creatures | Animal Crossing: New Horizons Tracker</title>
    <meta name="description" content={creatureDescription} />
    <meta property="og:type" content="article" />
    <meta property="og:url" content={page.url.toString()} />
    <meta property="og:title" content={`${creatureTitle} | AC:NH Tracker`} />
    <meta property="og:description" content={creatureDescription} />
    <meta property="og:image" content={creature.iconImage} />
    <meta property="og:image:alt" content={`${creatureTitle} from Animal Crossing: New Horizons`} />
    <meta name="twitter:title" content={`${creatureTitle} | AC:NH Tracker`} />
    <meta name="twitter:description" content={creatureDescription} />
    <meta name="twitter:image" content={creature.iconImage} />
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
