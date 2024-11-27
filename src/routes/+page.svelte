<script lang="ts">
    import {settings} from "$lib/shared";
    import type {Creature} from "animal-crossing/lib/types/Creature";
    import CreatureCard from "$lib/CreatureCard.svelte";

    const { data } = $props();
    const { creatures } = data;

    const allFish = creatures.filter(x => x.sourceSheet === "Fish");
    const allBugs = creatures.filter(x => x.sourceSheet === "Insects");
    const allSeaCreatures = creatures.filter(x => x.sourceSheet === "Sea Creatures");

    let currentFish: Creature[] = $state([]);
    let currentBugs: Creature[] = $state([]);
    let currentSeaCreatures: Creature[] = $state([]);
    let creaturesLeaving: Creature[] = $state([]);
    let creaturesComing: Creature[] = $state([]);

    const sortFunctions:
        {id: string, name: string, sort: (a: Creature, b: Creature) => number}[] = [
        {
            id: "name-asc",
            name: "Name (Ascending)",
            sort: (a: Creature, b: Creature) => a.name < b.name ? -1 : 1,
        },
    ];

    settings.subscribe(currentSettings => {
        const now = new Date();

        const filterActiveOnly = (x: Creature) =>
            x.hemispheres[currentSettings.hemisphere].monthsArray.includes(now.getMonth() + 1) &&
            x.hemispheres[currentSettings.hemisphere].timeArray.includes(now.getHours());

        const sortAsc = sortFunctions.find(x => x.id === "name-asc");

        if (!sortAsc) return;

        currentFish = allFish
            .filter(filterActiveOnly)
            .sort(sortAsc.sort);

        currentBugs = allBugs
            .filter(filterActiveOnly)
            .sort(sortAsc.sort);

        currentSeaCreatures = allSeaCreatures
            .filter(filterActiveOnly)
            .sort(sortAsc.sort);

        let nextMonth = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
        creaturesLeaving = creatures
            .filter(filterActiveOnly)
            .filter(x => !x.hemispheres[currentSettings.hemisphere].monthsArray.includes(nextMonth + 1))
            .sort(sortAsc.sort);

        creaturesComing = creatures
            .filter(x => {
                const monthsArray = x.hemispheres[currentSettings.hemisphere].monthsArray;
                return !monthsArray.includes(now.getMonth() + 1) && monthsArray.includes(nextMonth + 1);
            });
    });
</script>

<svelte:head>
    <title>Animal Crossing: New Horizons Tracker</title>
</svelte:head>

<h1>
    <small>Animal Crossing: New Horizons</small>
    Bug, Fish, &amp; Item Tracking
</h1>

<h2>
    Active Fish &bullet; {currentFish.length}
</h2>

<div class="container">
    {#each currentFish as fish}
        <CreatureCard creature={fish} showType={false} />
    {/each}
</div>

<h2>
    Active Bugs &bullet; {currentBugs.length}
</h2>

<div class="container">
    {#each currentBugs as bug}
        <CreatureCard creature={bug} showType={false} />
    {/each}
</div>

<h2>
    Active Sea Creatures &bullet; {currentSeaCreatures.length}
</h2>

<div class="container">
    {#each currentSeaCreatures as seaCreatures}
        <CreatureCard creature={seaCreatures} showType={false} />
    {/each}
</div>

<h2>
    Creatures Leaving This Month &bullet; {creaturesLeaving.length}
</h2>

<div class="container">
    {#each creaturesLeaving as creature}
        <CreatureCard creature={creature} showType={true} />
    {/each}
</div>

<h2>
    Creatures Coming Next Month &bullet; {creaturesComing.length}
</h2>

<div class="container">
    {#each creaturesComing as creature}
        <CreatureCard creature={creature} showType={true} />
    {/each}
</div>



<style>
    .container {
        display: flex;
        overflow-x: auto;
    }
</style>
