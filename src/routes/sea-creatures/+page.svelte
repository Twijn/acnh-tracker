<script lang="ts">
    import CreatureList from "$lib/creatures/CreatureList.svelte";

    const { data } = $props();
    const creatures = $derived(data.creatures);

    const allSeaCreatures = $derived(creatures.filter(x => x.sourceSheet === "Sea Creatures"));
</script>

<svelte:head>
    <title>Sea Creatures | Animal Crossing: New Horizons Tracker</title>
    <meta name="description" content="View Animal Crossing: New Horizons sea creatures, track what you've caught, and summarize your earnings!" />
</svelte:head>

<h1>
    <small>Animal Crossing: New Horizons</small>
    Sea Creatures
</h1>

<CreatureList creatures={allSeaCreatures} showType={false} />
