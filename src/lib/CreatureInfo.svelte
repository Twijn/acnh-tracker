<script lang="ts">
    import Activity from "$lib/Activity.svelte";
    import {
        CatchDifficulty,
        type Creature,
        type Hemispheres,
        type Translations
    } from "animal-crossing/lib/types/Creature.js";
    import {settings} from "$lib/shared";
    import {getActivity} from "$lib/activity";

    const { creature }: {creature: Creature} = $props();

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

    const activity = $derived(getActivity(creature, hemisphere));
    const creatureName = $derived(creature.translations[lang]);

    let difficultyGauge: string = $state("");
    switch (creature.catchDifficulty) {
        case CatchDifficulty.VeryEasy:
            difficultyGauge = "-min";
            break;
        case CatchDifficulty.Easy:
            difficultyGauge = "-low";
            break;
        case CatchDifficulty.Hard:
            difficultyGauge = "-high";
            break;
        case CatchDifficulty.VeryHard:
            difficultyGauge = "-max";
    }
</script>
<h1>
    <small>Animal Crossing: New Horizons</small>
    <span class="capitalize">{creatureName}</span>
</h1>

<div class="container">
    <div>
        <img class="icon" src={creature.iconImage} alt="Image for {creatureName}" />

        <section>
            <h2>Creature Information</h2>

            <div class="body">

                <div class="pill {activity.active ? 'pill-red' : (activity.inSeason ? 'pill-yellow' : undefined)}">
                    {#if activity.active}<i class="fa-solid fa-circle-exclamation"></i>{/if}
                    {activity.message}
                </div>

                <h3>Activity</h3>
                <Activity hemisphere={creature.hemispheres[hemisphere]} />

                <div class="pill-box pill-box-3">
                    {#if creature.sell}
                        <div class="pill sell-price">
                            <picture>
                                <source srcset="/assets/images/bells/{creature.sell >= 1000 ? 'bag' : 'coin'}.webp" type="image/webp">
                                <source srcset="/assets/images/bells/{creature.sell >= 1000 ? 'bag' : 'coin'}.png" type="image/png">
                                <img src="/assets/images/bells/{creature.sell >= 1000 ? 'bag' : 'coin'}.png" alt="Animal Crossing bell icon">
                            </picture>
                            <strong>Nook's Price</strong>
                            {creature.sell.toLocaleString()} Bells
                        </div>
                    {/if}
                    {#if creature.sell}
                        <div class="pill sell-price">
                            <picture>
                                <source srcset="/assets/images/bells/{creature.sell * .8 >= 1000 ? 'bag' : 'coin'}.webp" type="image/webp">
                                <source srcset="/assets/images/bells/{creature.sell * .8 >= 1000 ? 'bag' : 'coin'}.png" type="image/png">
                                <img src="/assets/images/bells/{creature.sell * .8 >= 1000 ? 'bag' : 'coin'}.png" alt="Animal Crossing bell icon">
                            </picture>
                            <strong>Drop Box</strong>
                            {(creature.sell * .8).toLocaleString()} Bells
                        </div>
                    {/if}
                    {#if ["Fish","Insects"].includes(creature.sourceSheet)}
                        <div class="pill sell-price">
                            <picture>
                                <source srcset="/assets/images/bells/{creature.sell * 1.5 >= 1000 ? 'bag' : 'coin'}.webp" type="image/webp">
                                <source srcset="/assets/images/bells/{creature.sell * 1.5 >= 1000 ? 'bag' : 'coin'}.png" type="image/png">
                                <img src="/assets/images/bells/{creature.sell * 1.5 >= 1000 ? 'bag' : 'coin'}.png" alt="Animal Crossing bell icon">
                            </picture>
                            <strong>{creature.sourceSheet === "Fish" ? "C.J." : "Flick"} Price</strong>
                            {(creature.sell * 1.5).toLocaleString()} Bells
                        </div>
                    {/if}
                    {#if creature.shadow}
                        <div class="pill">
                            <i class="fa-duotone fa-regular fa-expand"></i>
                            <strong>Shadow Size</strong>
                            {creature.shadow}
                        </div>
                    {/if}
                    {#if creature.whereHow}
                        <div class="pill">
                            {#if creature.sourceSheet === "Fish"}
                                <i class="fa-sharp-duotone fa-solid fa-location-dot"></i>
                                <strong>Location</strong>
                            {:else}
                                <i class="fa-duotone fa-regular fa-circle-question"></i>
                                <strong>How to Catch</strong>
                            {/if}
                            {creature.whereHow}
                        </div>
                    {/if}
                    {#if creature.movementSpeed}
                        <div class="pill">
                            <i class="fa-duotone fa-regular fa-rabbit"></i>
                            <strong>Speed</strong>
                            {creature.movementSpeed}
                        </div>
                    {/if}
                    {#if creature.catchDifficulty}
                        <div class="pill">
                            <i class="fa-duotone fa-solid fa-gauge-simple{difficultyGauge}"></i>
                            <strong>Difficulty</strong>
                            {creature.catchDifficulty}
                        </div>
                    {/if}
                    {#if creature.vision}
                        <div class="pill">
                            <i class="fa-duotone fa-solid fa-eye"></i>
                            <strong>Vision</strong>
                            {creature.vision}
                        </div>
                    {/if}
                    <div class="pill">
                        <i class="fa-duotone fa-solid fa-unlock"></i>
                        <strong>Unlocked After</strong>
                        {creature.totalCatchesToUnlock} Catches
                    </div>
                </div>
            </div>
        </section>
    </div>
    <div>
        <img class="icon" src={creature.furnitureImage} alt="Furniture Item for {creatureName}" />

        <section>
            <h2>Furniture Details</h2>
            <div class="body">
                <h3>Happy Home Academy</h3>
                <div class="pill-box pill-box-2">
                    <div class="pill">
                        <i class="fa-duotone fa-solid fa-list"></i>
                        <strong>Category</strong>
                        {creature.hhaCategory}
                    </div>
                    <div class="pill">
                        <i class="fa-duotone fa-solid fa-hundred-points"></i>
                        <strong>Base Points</strong>
                        {creature.hhaBasePoints}
                    </div>
                    <div class="pill">
                        <i class="fa-duotone fa-solid fa-arrow-up-small-big"></i>
                        <strong>Size</strong>
                        {creature.size}
                    </div>
                </div>
            </div>
        </section>

        <section>
            <h2>Phrases</h2>
            <div class="body">
                <h3>Catchphrases</h3>
                {#each creature.catchPhrase as phrase}
                    <div class="pill pill-justified">
                        <i class="fa-duotone fa-solid fa-quote-left"></i>
                        {phrase}
                    </div>
                {/each}
                <h3>Blathers Information</h3>
                {#each creature.description as phrase}
                    <div class="pill pill-justified">
                        <i class="fa-duotone fa-solid fa-circle-ellipsis"></i>
                        {phrase}
                    </div>
                {/each}
            </div>
        </section>
    </div>
</div>

<style>
    .container {
        width: 100%;
        max-width: 80em;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 1em;
    }

    .icon {
        display: block;
        width: 8em;
        height: 8em;
        padding: .6em;
        margin: 1.4em auto;
        background-color: var(--secondary-theme-color);
        border: .3em solid var(--primary-theme-color);
        border-radius: 4.9em;
    }

    section {
        margin: .6em 0;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
        border-radius: .3em;
        overflow: hidden;
    }

    section h2 {
        background-color: var(--primary-theme-color);
        color: var(--light-text-color);
        font-size: 1em;
        text-align: center;
        font-weight: 500;
        text-transform: uppercase;
        padding: .4em;
        margin: 0;
    }

    section h3 {
        font-size: .9em;
        font-weight: 500;
        text-align: center;
        margin: .2em 0 .5em 0;
    }

    section .body {
        padding: .6em;
    }

    @media only screen and (min-width: 850px) {
        .container {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media only screen and (max-width: 525px) {
        .pill-box-3 {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media only screen and (max-width: 370px) {
        .pill-box {
            display: block;
        }
    }
</style>