<script lang="ts">
    import CreatureList from "$lib/CreatureList.svelte";

    const { data } = $props();
    const { creatures } = data;

    const allFish = creatures.filter(x => x.sourceSheet === "Fish");
</script>

<svelte:head>
    <title>Fish | Animal Crossing: New Horizons Tracker</title>
    <meta name="description" content="View Animal Crossing: New Horizons fish, track what you've caught, and summarize your earnings!" />
</svelte:head>

<h1>
    <small>Animal Crossing: New Horizons</small>
    Fish
</h1>

<CreatureList creatures={allFish} showType={false} />
