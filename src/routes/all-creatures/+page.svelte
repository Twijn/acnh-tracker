<script lang="ts">
    import CreatureCard from "$lib/CreatureCard.svelte";
    import CreatureList from "$lib/CreatureList.svelte";

    const { data } = $props();
    const { creatures } = data;
</script>

<svelte:head>
    <title>All Creatures | Animal Crossing: New Horizons Tracker</title>
    <meta name="description" content="View all Animal Crossing: New Horizons creatures, track what you've caught, and summarize your earnings!" />
</svelte:head>

<h1>
    <small>Animal Crossing: New Horizons</small>
    All Creatures
</h1>

<CreatureList creatures={creatures} showType={true} />
