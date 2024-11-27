<script lang="ts">
    import type {Creature, Hemispheres, Translations} from "animal-crossing/lib/types/Creature";
    import {settings} from "$lib/shared";
    import {getURLFromName} from "$lib/utils.js";
    import Activity from "$lib/Activity.svelte";
    import {getActivity} from "$lib/activity";

    const { creature, showType }:
        {creature: Creature, showType: boolean} = $props();

    let lang: keyof Translations = $state("uSen");
    let hemisphere: keyof Hemispheres = $state("north");

    settings.subscribe(currentSettings => {
        try {
            lang = currentSettings.lang as keyof Translations;
            hemisphere = currentSettings.hemisphere as keyof Hemispheres;
        } catch(err) {
            console.error("Invalid lang/hemisphere: ", err);
        }
    });

    const isActive = (x: Creature, hemisphere: keyof Hemispheres) =>
        x.hemispheres[hemisphere].monthsArray.includes(new Date().getMonth() + 1) &&
        x.hemispheres[hemisphere].timeArray.includes(new Date().getHours());

    const activity = $derived(getActivity(creature, hemisphere));
    const creatureName = $derived(creature.translations[lang]);
</script>

<section class="card">
    <div class="card-header">
        <img src={creature.iconImage} alt="{creatureName} icon" />
        <h2>{creatureName}</h2>
    </div>
    <div class="card-body flex">
        {#if showType}
            <div class="pill pill-secondary-theme">
                {creature.sourceSheet === "Insects" ? "Bugs" : creature.sourceSheet}
            </div>
        {/if}
        <div class="section">
            <h3>Activity</h3>
            <Activity hemisphere={creature.hemispheres[hemisphere]} />
        </div>
    </div>
    <div class="card-body">
        <div class="section">
            <div class="dual-pill">
                <div class="pill sell-price">
                    <picture>
                        <source srcset="/assets/images/bells/{creature.sell >= 1000 ? 'bag' : 'coin'}.webp" type="image/webp">
                        <source srcset="/assets/images/bells/{creature.sell >= 1000 ? 'bag' : 'coin'}.png" type="image/png">
                        <img src="/assets/images/bells/{creature.sell >= 1000 ? 'bag' : 'coin'}.png" alt="Animal Crossing bell icon">
                    </picture>
                    {creature.sell.toLocaleString()} Bells
                </div>
                {#if creature.whereHow}
                    <div class="pill">
                        <i class="fa-sharp-duotone fa-solid fa-location-dot"></i> {creature.whereHow}
                    </div>
                {/if}
                {#if creature.shadow}
                    <div class="pill">
                        <i class="fa-duotone fa-regular fa-expand"></i> {creature.shadow}
                    </div>
                {/if}
            </div>
        </div>
        <div class="pill {activity.active ? 'pill-red' : (activity.inSeason ? 'pill-yellow' : undefined)}">
            {#if activity.active}<i class="fa-solid fa-circle-exclamation"></i>{/if}
            {activity.message}
        </div>
    </div>
    <div class="card-footer">
        <a href="/creature/{getURLFromName(creature.name)}">View more information!</a>
    </div>
</section>

<style>
    .card {
        --image-size: 3em;
        display: flex;
        flex-direction: column;
        background-color: var(--primary-background-color);
        min-width: 16em;
        margin: .6em;
        border-radius: .4em;
        overflow: hidden;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
    }

    .section {
        margin: .4em 0;
    }

    .card-header {
        display: flex;
        align-items: center;
        background-color: var(--primary-theme-color);
        color: var(--light-text-color);
        padding: .4em;
    }

    .card-header img {
        width: var(--image-size);
        height: var(--image-size);
        margin-right: .4em;
    }

    h2 {
        margin: 0;
        font-size: 1.2em;
        font-weight: 500;
        text-transform: capitalize;
        text-align: left;
        flex-grow: 1;
    }

    h3 {
        margin: 0;
        font-size: .95em;
        font-weight: 500;
        text-transform: uppercase;
        text-align: center;
    }

    .card-body {
        padding: .4em;
    }

    .flex {
        flex-grow: 1;
    }

    .card-footer {
        padding: .4em;
    }

    .card-footer a {
        display: block;
        padding: .4em .6em;
        background-color: var(--primary-theme-color);
        color: var(--light-text-color);
        text-align: center;
        text-decoration: none;
        font-weight: 500;
        border-radius: .2em;
    }
</style>
