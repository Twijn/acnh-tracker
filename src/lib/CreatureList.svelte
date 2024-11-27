<script lang="ts">
    import CreatureCard from "$lib/CreatureCard.svelte";
    import type {Creature, Hemispheres, Translations} from "animal-crossing/lib/types/Creature";
    import { scale, slide } from "svelte/transition";
    import {settings} from "$lib/shared";

    import "$lib/form.css";
    import "$lib/alert.css";

    const { creatures, showType }: {creatures: Creature[], showType: boolean} = $props();

    let lang: keyof Translations = $state("uSen");
    // let hemisphere: keyof Hemispheres = $state("north");

    settings.subscribe(currentSettings => {
        try {
            lang = currentSettings.lang as keyof Translations;
            // hemisphere = currentSettings.hemisphere as keyof Hemispheres;
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

        const sortOption = sortOptions.find(x => x.name === sortBy);
        if (sortOption) {
            result.sort(sortOption.sort);
            result = [...result]; // For some reason Svelte won't update the array unless it is reassigned while sorted.
        } else {
            console.error("No sort option!");
        }

        return result;
    });

</script>

<div class="filter-sort">
    <label class={sizes.length > 2 ? "span-4" : "span-6"}>
        Search by Name
        <input type="search" name="search" placeholder="Filter by name..." bind:value={filterName} />
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
    <label class="span-2">
        Search by Location
        <select name="whereHow" bind:value={whereHow}>
            {#each whereHows as wh}
                {@const count = creaturesFilteredForLocation.filter(x => wh === "All Locations" || x.whereHow === wh).length}
                <option value={wh} disabled={count === 0}>{wh} ({count})</option>
            {/each}
        </select>
    </label>
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
    <label class="span-2">
        Sort By
        <select name="sortBy" bind:value={sortBy}>
            {#each sortOptions as sortOption}
                <option value={sortOption.name}>Sort by {sortOption.name}</option>
            {/each}
        </select>
    </label>
</div>

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

<style>
    .filter-sort {
        display: block;
        grid-template-columns: repeat(12, 1fr);
        gap: .8em;
    }

    .span-2 {
        grid-column: span 2;
    }

    .span-4 {
        grid-column: span 4;
    }

    .span-6 {
        grid-column: span 6;
    }

    .container {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
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
