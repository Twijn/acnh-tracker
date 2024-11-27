<script lang="ts">
    import CreatureList from "$lib/CreatureList.svelte";

    const { data } = $props();
    const { creatures } = data;

    const allBugs = creatures.filter(x => x.sourceSheet === "Insects");
</script>

<svelte:head>
    <title>Bugs | Animal Crossing: New Horizons Tracker</title>
    <meta name="description" content="View Animal Crossing: New Horizons bugs, track what you've caught, and summarize your earnings!" />
</svelte:head>

<h1>
    <small>Animal Crossing: New Horizons</small>
    Bugs
</h1>

<CreatureList creatures={allBugs} showType={false} />