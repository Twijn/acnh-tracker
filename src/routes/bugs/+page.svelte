<script lang="ts">
    import {page} from "$app/state";
    import CreatureList from "$lib/creatures/CreatureList.svelte";

    const { data } = $props();
    const creatures = $derived(data.creatures);

    const allBugs = $derived(creatures.filter(x => x.sourceSheet === "Insects"));
</script>

<svelte:head>
    <title>Bugs | Animal Crossing: New Horizons Tracker</title>
    <meta name="description" content="View Animal Crossing: New Horizons bugs, track what you've caught, and summarize your earnings!" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={page.url.toString()} />
    <meta property="og:title" content="Bugs | Animal Crossing: New Horizons Tracker" />
    <meta property="og:description" content="Track all AC:NH bugs, what is currently available, and your catch progress." />
    <meta name="twitter:title" content="Bugs | AC:NH Tracker" />
    <meta name="twitter:description" content="Track AC:NH bugs, current availability, and catch progress." />
</svelte:head>

<h1>
    <small>Animal Crossing: New Horizons</small>
    Bugs
</h1>

<CreatureList creatures={allBugs} showType={false} />