<script lang="ts">
    import CreatureCard from "$lib/CreatureCard.svelte";
    import type {Creature, Hemispheres, Translations} from "animal-crossing/lib/types/Creature";
    import { scale, slide } from "svelte/transition";
    import {settings} from "$lib/shared";

    import "$lib/form.css";
    import "$lib/alert.css";
    import {getActivity} from "$lib/activity";

    const { creatures, showType }: {creatures: Creature[], showType: boolean} = $props();

    let lang: keyof Translations = $state("uSen");
    let hemisphere: keyof Hemispheres = $state("north");

    const creatureActivities = $derived.by((): Map<string, {active: boolean, inSeason: boolean, message: string}> => {
        const map = new Map<string, {active: boolean, inSeason: boolean, message: string}>();

        creatures.forEach(creature => {
            map.set(creature.uniqueEntryId, getActivity(creature, hemisphere));
        });

        return map;
    });

    const filterActivity = (creature: Creature, activity: "all"|"active"|"inSeason"|"outOfSeason") => {
        if (activity === "all") return true;

        const creatureActivity = creatureActivities.get(creature.uniqueEntryId);
        if (!creatureActivity) {
            console.error("Missing activity for " + creature.name);
            return false;
        }

        return activity === "outOfSeason" ? !creatureActivity.inSeason : creatureActivity[activity];
    };

    settings.subscribe(currentSettings => {
        try {
            lang = currentSettings.lang as keyof Translations;
            hemisphere = currentSettings.hemisphere as keyof Hemispheres;
        } catch(err) {
            console.error("Invalid lang/hemisphere: ", err);
        }
    });

    let sellPrices = [
        {
            name: "All Prices",
            min: 0,
            max: 99999,
        },
        {
            name: "1 - 199 Bells",
            min: 1,
            max: 199,
        },
        {
            name: "200 - 399 Bells",
            min: 200,
            max: 399,
        },
        {
            name: "400 - 749 Bells",
            min: 400,
            max: 749,
        },
        {
            name: "750 - 999 Bells",
            min: 750,
            max: 999,
        },
        {
            name: "1000 - 1499 Bells",
            min: 1000,
            max: 1499,
        },
        {
            name: "1500 - 1999 Bells",
            min: 1500,
            max: 1999,
        },
        {
            name: "2000 - 4999 Bells",
            min: 2000,
            max: 4999,
        },
        {
            name: "5000 - 9999 Bells",
            min: 5000,
            max: 9999,
        },
        {
            name: "10000 - 12499 Bells",
            min: 10000,
            max: 12499,
        },
        {
            name: "12500 - 14999 Bells",
            min: 12500,
            max: 14999,
        },
        {
            name: "15000+ Bells",
            min: 15000,
            max: 99999,
        },
    ];

    let sortOptions = [
        {
            name: "Name (Ascending)",
            sort: (a: Creature, b: Creature) => a.name.localeCompare(b.name),
        },
        {
            name: "Name (Descending)",
            sort: (a: Creature, b: Creature) => b.name.localeCompare(a.name),
        },
        {
            name: "Sell Price (Ascending)",
            sort: (a: Creature, b: Creature) => a.sell < b.sell ? -1 : 1,
        },
        {
            name: "Sell Price (Descending)",
            sort: (a: Creature, b: Creature) => a.sell > b.sell ? -1 : 1,
        },
    ];

    const getWhereHows = (): string[] => {
        let whereHowFish: string[] = [];
        let whereHowBugs: string[] = [];
        creatures.forEach(creature => {
            if (creature.whereHow && creature.sourceSheet === "Fish" && !whereHowFish.includes(creature.whereHow)) {
                whereHowFish.push(creature.whereHow);
            }
            if (creature.whereHow && creature.sourceSheet === "Insects" && !whereHowBugs.includes(creature.whereHow)) {
                whereHowBugs.push(creature.whereHow);
            }
        });
        return [
            "All Locations",
            ...whereHowFish,
            ...whereHowBugs,
        ];
    }

    const filterBySize = (creature: Creature, size: string): boolean => {
        if (size === "All Shadow Sizes") {
            return true;
        } else if (size === "No Shadow") {
            return !creature.shadow;
        } else {
            return creature?.shadow?.toString() === size;
        }
    }

    const getSizes = (): string[] => {
        let result: string[] = [];
        let includeNone = false;

        creatures.forEach(creature => {
            if (creature.shadow) {
                if (!result.includes(creature.shadow)) {
                    result.push(creature.shadow);
                }
            } else {
                includeNone = true;
            }
        })

        if (includeNone) {
            result = [
                "No Shadow",
                ...result,
            ]
        }

        return [
            "All Shadow Sizes",
            ...result,
        ];
    }

    let whereHows: string[] = getWhereHows();
    let sizes: string[] = getSizes();

    let season: "all"|"active"|"inSeason"|"outOfSeason" = $state("all");
    let filterName: string = $state("");
    let sellPrice: string = $state("All Prices");
    let whereHow: string = $state("All Locations");
    let size: string = $state("All Shadow Sizes");

    let sortBy: string = $state("Name (Ascending)");

    let creaturesFilteredForSell = $derived.by(() => {
        let result = creatures;

        if (filterName.length > 0) {
            result = result.filter(x => String(x.translations[lang]).toLowerCase().includes(filterName.toLowerCase()));
        }

        if (whereHow !== "All Locations") {
            result = result.filter(x => x.whereHow === whereHow);
        }

        result = result.filter(x => filterBySize(x, size));

        result = result.filter(x => filterActivity(x, season));

        return result;
    });

    let creaturesFilteredForLocation = $derived.by(() => {
        let result = creatures;

        if (filterName.length > 0) {
            result = result.filter(x => String(x.translations[lang]).toLowerCase().includes(filterName.toLowerCase()));
        }

        if (sellPrice !== "All Prices") {
            const price = sellPrices.find(x => x.name === sellPrice);
            if (price) {
                result = result.filter(x => x.sell >= price.min && x.sell <= price.max);
            }
        }

        result = result.filter(x => filterBySize(x, size));

        result = result.filter(x => filterActivity(x, season));

        return result;
    });

    let creaturesFilteredForSize = $derived.by(() => {
        let result = creatures;

        if (filterName.length > 0) {
            result = result.filter(x => String(x.translations[lang]).toLowerCase().includes(filterName.toLowerCase()));
        }

        if (sellPrice !== "All Prices") {
            const price = sellPrices.find(x => x.name === sellPrice);
            if (price) {
                result = result.filter(x => x.sell >= price.min && x.sell <= price.max);
            }
        }

        if (whereHow !== "All Locations") {
            result = result.filter(x => x.whereHow === whereHow);
        }

        result = result.filter(x => filterActivity(x, season));

        return result;
    });

    let creaturesFilteredForActivity = $derived.by(() => {
        let result = creatures;

        if (filterName.length > 0) {
            result = result.filter(x => String(x.translations[lang]).toLowerCase().includes(filterName.toLowerCase()));
        }

        if (sellPrice !== "All Prices") {
            const price = sellPrices.find(x => x.name === sellPrice);
            if (price) {
                result = result.filter(x => x.sell >= price.min && x.sell <= price.max);
            }
        }

        if (whereHow !== "All Locations") {
            result = result.filter(x => x.whereHow === whereHow);
        }

        result = result.filter(x => filterBySize(x, size));

        const sortOption = sortOptions.find(x => x.name === sortBy);
        if (sortOption) {
            result.sort(sortOption.sort);
            result = [...result]; // For some reason Svelte won't update the array unless it is reassigned while sorted.
        } else {
            console.error("No sort option!");
        }

        return result;
    });

    let creaturesFiltered = $derived.by(() => {
        let result = creatures;

        if (filterName.length > 0) {
            result = result.filter(x => String(x.translations[lang]).toLowerCase().includes(filterName.toLowerCase()));
        }

        if (sellPrice !== "All Prices") {
            const price = sellPrices.find(x => x.name === sellPrice);
            if (price) {
                result = result.filter(x => x.sell >= price.min && x.sell <= price.max);
            }
        }

        if (whereHow !== "All Locations") {
            result = result.filter(x => x.whereHow === whereHow);
        }

        result = result.filter(x => filterBySize(x, size));

        result = result.filter(x => filterActivity(x, season));

        const sortOption = sortOptions.find(x => x.name === sortBy);
        if (sortOption) {
            result.sort(sortOption.sort);
            result = [...result]; // For some reason Svelte won't update the array unless it is reassigned while sorted.
        } else {
            console.error("No sort option!");
        }

        return result;
    });

    const averageSellPrice = $derived.by(() => {
        let priceSum = 0;
        creaturesFiltered.forEach(x => priceSum += x.sell);
        return creaturesFiltered.length > 0 ? priceSum / creaturesFiltered.length : 0;
    });

    const active = $derived(creaturesFilteredForActivity.filter(x => filterActivity(x, "active")).length);
    const inSeason = $derived(creaturesFilteredForActivity.filter(x => filterActivity(x, "inSeason")).length);
</script>

<div class="filter-sort">
    <label class={sizes.length > 2 && whereHows.length > 1 ? "span-3" : "span-5"}>
        Search by Name
        <input type="search" name="search" placeholder="Filter by name..." bind:value={filterName} />
    </label>
    <label class="span-2">
        Include only...
        <select name="season" bind:value={season}>
            <option value="all">All ({creaturesFilteredForActivity.length})</option>
            <option value="active" disabled={active === 0}>Active Now ({active})</option>
            <option value="inSeason" disabled={inSeason === 0}>In Season (Active this Month) ({inSeason})</option>
            <option value="outOfSeason" disabled={creaturesFilteredForActivity.length - inSeason === 0}>Out of Season ({creaturesFilteredForActivity.length - inSeason})</option>
        </select>
    </label>
    <label class="span-2">
        Search by Sell Price
        <select name="sellPrice" bind:value={sellPrice}>
            {#each sellPrices as sellPrice}
                {@const count = creaturesFilteredForSell.filter(x => x.sell >= sellPrice.min && x.sell <= sellPrice.max).length}
                <option value={sellPrice.name} disabled={count === 0}>{sellPrice.name} ({count})</option>
            {/each}
        </select>
    </label>
    {#if whereHows.length > 1}
    <label class="span-2">
        Search by Location
        <select name="whereHow" bind:value={whereHow}>
            {#each whereHows as wh}
                {@const count = creaturesFilteredForLocation.filter(x => wh === "All Locations" || x.whereHow === wh).length}
                <option value={wh} disabled={count === 0}>{wh} ({count})</option>
            {/each}
        </select>
    </label>
    {/if}
    {#if sizes.length > 2}
    <label class="span-2">
        Search by Shadow Size
        <select name="size" bind:value={size}>
            {#each sizes as size}
                {@const count = creaturesFilteredForSize.filter(x => filterBySize(x, size)).length}
                <option value={size} disabled={count === 0}>{size} ({count})</option>
            {/each}
        </select>
    </label>
    {/if}
    <label class="span-1">
        Sort By
        <select name="sortBy" bind:value={sortBy}>
            {#each sortOptions as sortOption}
                <option value={sortOption.name}>Sort by {sortOption.name}</option>
            {/each}
        </select>
    </label>
</div>

<p class="creature-count">
    Showing {creaturesFiltered.length}/{creatures.length} creatures. Average sell price: {Math.floor(averageSellPrice + .5).toLocaleString()} Bells
</p>

{#if creaturesFiltered.length === 0}
    <div class="alert alert-center alert-danger" in:scale out:slide>
        No creatures found!
    </div>
{/if}

<div class="container">
    {#each creaturesFiltered as creature}
        <CreatureCard creature={creature} showType={showType} />
    {/each}
</div>

<p class="creature-count">
    Showing {creaturesFiltered.length}/{creatures.length} creatures. Average sell price: {Math.floor(averageSellPrice + .5).toLocaleString()} Bells
</p>

<style>
    .filter-sort {
        display: block;
        grid-template-columns: repeat(12, 1fr);
        gap: .8em;
    }

    .span-1 {
        grid-column: span 1;
    }

    .span-2 {
        grid-column: span 2;
    }

    .span-3 {
        grid-column: span 3;
    }

    .span-5 {
        grid-column: span 5;
    }

    .creature-count {
        font-size: .8em;
        color: var(--secondary-text-color);
        text-align: center;
        margin: .1em 0;
    }

    .container {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        margin: 0 -.6em;
    }

    @media only screen and (min-width: 600px) {
        .container {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media only screen and (min-width: 900px) {
        .container {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media only screen and (min-width: 1200px) {
        .container {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    @media only screen and (min-width: 1500px) {
        .container {
            grid-template-columns: repeat(5, 1fr);
        }

        .filter-sort {
            display: grid;
        }
    }
</style>
