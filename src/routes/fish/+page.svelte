<script lang="ts">
    import {page} from "$app/state";
    import CreatureList from "$lib/creatures/CreatureList.svelte";

    const { data } = $props();
    const creatures = $derived(data.creatures);

    const allFish = $derived(creatures.filter(x => x.sourceSheet === "Fish"));
</script>

<svelte:head>
    <title>Fish | Animal Crossing: New Horizons Tracker</title>
    <meta name="description" content="View Animal Crossing: New Horizons fish, track what you've caught, and summarize your earnings!" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={page.url.toString()} />
    <meta property="og:title" content="Fish | Animal Crossing: New Horizons Tracker" />
    <meta property="og:description" content="Track all AC:NH fish, current availability, and catch progress." />
    <meta name="twitter:title" content="Fish | AC:NH Tracker" />
    <meta name="twitter:description" content="Track AC:NH fish, current availability, and catch progress." />
</svelte:head>

<h1>
    <small>Animal Crossing: New Horizons</small>
    Fish
</h1>

<CreatureList creatures={allFish} showType={false} />
