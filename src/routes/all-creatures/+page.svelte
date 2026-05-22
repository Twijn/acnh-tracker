<script lang="ts">
    import {page} from "$app/state";
    import CreatureList from "$lib/creatures/CreatureList.svelte";

    const { data } = $props();
    const creatures = $derived(data.creatures);
</script>

<svelte:head>
    <title>All Creatures | Animal Crossing: New Horizons Tracker</title>
    <meta name="description" content="View all Animal Crossing: New Horizons creatures, track what you've caught, and summarize your earnings!" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={page.url.toString()} />
    <meta property="og:title" content="All Creatures | Animal Crossing: New Horizons Tracker" />
    <meta property="og:description" content="Browse every creature in Animal Crossing: New Horizons and track your collection progress." />
    <meta name="twitter:title" content="All Creatures | AC:NH Tracker" />
    <meta name="twitter:description" content="Browse all creatures in AC:NH and track your collection progress." />
</svelte:head>

<h1>
    <small>Animal Crossing: New Horizons</small>
    All Creatures
</h1>

<CreatureList creatures={creatures} showType={true} />
