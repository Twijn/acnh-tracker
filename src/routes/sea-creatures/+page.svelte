<script lang="ts">
    import {page} from "$app/state";
    import CreatureList from "$lib/creatures/CreatureList.svelte";

    const { data } = $props();
    const creatures = $derived(data.creatures);

    const allSeaCreatures = $derived(creatures.filter(x => x.sourceSheet === "Sea Creatures"));
</script>

<svelte:head>
    <title>Sea Creatures | Animal Crossing: New Horizons Tracker</title>
    <meta name="description" content="View Animal Crossing: New Horizons sea creatures, track what you've caught, and summarize your earnings!" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={page.url.toString()} />
    <meta property="og:title" content="Sea Creatures | Animal Crossing: New Horizons Tracker" />
    <meta property="og:description" content="Track all AC:NH sea creatures, current availability, and catch progress." />
    <meta name="twitter:title" content="Sea Creatures | AC:NH Tracker" />
    <meta name="twitter:description" content="Track AC:NH sea creatures, current availability, and catch progress." />
</svelte:head>

<h1>
    <small>Animal Crossing: New Horizons</small>
    Sea Creatures
</h1>

<CreatureList creatures={allSeaCreatures} showType={false} />
