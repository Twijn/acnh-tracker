<script lang="ts">
    import "../app.css";
    import '$lib/form.css'

    import { page } from '$app/stores';
    import type {Creature} from "animal-crossing/lib/types/Creature";

    import Settings from "$lib/Settings.svelte";

    import { settings } from "$lib/shared";
    import {onDestroy, onMount} from "svelte";

    const { children, data } = $props();

    let settingsVisible = $state(false);
    let mobileNavOpen = $state(false);

    const hideSettings = () => {
        settingsVisible = false;
    }

    function handleOutsideClick(event) {
        const settingsModal = document.getElementById("settings-modal");
        const settingsToggle = document.getElementById("settings-toggle");
        if (settingsModal && !settingsModal.contains(event.target) &&
                settingsToggle && !settingsToggle.contains(event.target)) {
            settingsVisible = false;
        }
    }

    onMount(() => {
        if (typeof window !== 'undefined') {
            document.addEventListener("click", handleOutsideClick);
        }
    });

    onDestroy(() => {
        if (typeof window !== 'undefined') {
            document.removeEventListener("click", handleOutsideClick);
        }
    })

    const randomCreature: Creature = data.randomCreature;
</script>

<div class="app">
    <header>
        <a id="title" href="/">
            <img src="{randomCreature.iconImage}" alt="Image of Animal Crossing creature {randomCreature.name}" />
            <span class="title-text">
                AC:NH Tracker
            </span>
        </a>
        <nav id="main-nav">
            <ul class={mobileNavOpen ? "open" : undefined}>
                <li>
                    <a href="/" onclick={() => mobileNavOpen = false} aria-current={$page.url.pathname === "/" ? "page" : undefined}>
                        <i class="fa-duotone fa-solid fa-house"></i> Home
                    </a>
                </li>
                <li>
                    <a href="/all-creatures" onclick={() => mobileNavOpen = false}  aria-current={$page.url.pathname.startsWith("/all-creatures") ? "page" : undefined}>
                        <i class="fa-duotone fa-regular fa-globe"></i> All Creatures
                    </a>
                </li>
                <li>
                    <a href="/fish" onclick={() => mobileNavOpen = false}  aria-current={$page.url.pathname.startsWith("/fish") ? "page" : undefined}>
                        <i class="fa-sharp-duotone fa-solid fa-fish"></i> Fish
                    </a>
                </li>
                <li>
                    <a href="/bugs" onclick={() => mobileNavOpen = false}  aria-current={$page.url.pathname.startsWith("/bugs") ? "page" : undefined}>
                        <i class="fa-sharp-duotone fa-solid fa-bug"></i> Bugs
                    </a>
                </li>
                <li>
                    <a href="/sea-creatures" onclick={() => mobileNavOpen = false}  aria-current={$page.url.pathname.startsWith("/sea-creatures") ? "page" : undefined}>
                        <i class="fa-sharp-duotone fa-solid fa-wave"></i> Sea Creatures
                    </a>
                </li>
            </ul>
            <button type="button" class="toggle-nav" aria-label="Toggle Navigation" onclick={() => mobileNavOpen = !mobileNavOpen}>
                <i class="fa-solid fa-bars"></i>
            </button>
            <button id="settings-toggle" aria-label="Open Settings" onclick={() => settingsVisible = true}>
                <i class="fa-duotone fa-solid fa-gear"></i>
            </button>
        </nav>
    </header>
    <main>
        <div class="wrapper">
            {@render children()}
        </div>
    </main>
    <footer>
        <p>
            Made by <a href="https://twijn.dev" target="_blank">Tyler (Twijn)</a> &bullet; <a href="https://buymeacoffee.com/twijn" target="_blank"><i class="fa-duotone fa-solid fa-mug-saucer"></i> Buy me a Coffee</a>
        </p>
        <p>
            Huge thank you to the <a href="https://github.com/Norviah/animal-crossing" target="_blank">Animal Crossing NPM Package by Norviah</a>,
            <a href="https://docs.google.com/spreadsheets/d/1mo7myqHry5r_TKvakvIhHbcEAEQpSiNoNQoIS8sMpvM/edit#gid=1397507627" target="_blank">the Translations spreadsheet</a>,
            and <a href="https://docs.google.com/spreadsheets/d/1mo7myqHry5r_TKvakvIhHbcEAEQpSiNoNQoIS8sMpvM/edit#gid=1397507627" target="_blank">the Animal Crossing: New Horizon Spreadsheet</a>!
        </p>
        <p>
            <small>
                Animal Crossing: New Horizons Tracker &bullet; Version 1.0.0
                <br/>
                This site is not affiliated with Animal Crossing or Nintendo.
            </small>
        </p>
    </footer>
</div>

<Settings
        settings={settings}
        settingsVisible={settingsVisible}
        hideSettings={hideSettings} />

<style>
    .app {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .app main {
        flex-grow: 1;
    }

    header {
        --header-height: 3.5rem;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: var(--header-height);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--primary-theme-color);
        box-shadow: 2px 2px 12px rgba(0,0,0,0.2);
        border-bottom: .25rem solid var(--secondary-theme-color);
        z-index: 15;
    }

    header a {
        color: var(--light-text-color);
        text-decoration: none;
    }

    #title {
        display: flex;
        align-items: center;
        font-size: 1.4em;
    }

    #title img {
        height: var(--header-height);
        aspect-ratio: 1;
        margin: 0 .4em;
    }

    nav {
        display: flex;
        height: 100%;
    }

    nav ul {
        display: flex;
        list-style-type: none;
        align-items: center;
        margin: 0;
        padding: 0;
        height: 100%;
        z-index: 10;
    }

    nav li {
        height: 100%;
    }

    nav a {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 .6em;
        transition: 250ms;
    }

    nav a::after {
        content: "";
        display: block;
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        height: .2em;
        background-color: var(--secondary-theme-color);
        opacity: 0;
        transition: 250ms opacity;
        border-radius: .2em .2em 0 0;
    }

    nav a[aria-current=page]::after {
        opacity: 1;
    }

    nav a,
    nav button {
        text-shadow: 2px 2px 8px rgba(0,0,0,0.2);
    }

    nav a:hover,
    nav a:focus {
        background-color: var(--secondary-theme-color);
    }

    nav a i {
        display: inline-block;
        margin-right: .25em;
    }

    nav button {
        width: var(--header-height);
        height: var(--header-height);
        font-size: 1.4em;
        background-color: transparent;
        color: var(--light-text-color);
        border: none;
        padding: 0;
        transition: 250ms text-shadow;
        cursor: pointer;
    }

    nav button i {
        transition: 250ms font-size;
    }

    nav button:hover,
    nav button:focus-visible {
        color: white;
        text-shadow: 6px 6px 12px rgba(0,0,0,0.3);
    }

    nav button:hover i,
    nav button:focus-visible i {
        font-size: 1.2em;
    }

    .toggle-nav {
        display: none;
    }

    .wrapper {
        width: calc(100% - 3em);
        margin: 1em auto;
    }

    footer {
        background-color: var(--secondary-background-color);
        padding: .1em;
        box-shadow: 2px 2px 12px rgba(0,0,0,0.2);
    }

    footer p {
        margin: .8em 0;
        text-align: center;
        opacity: .6;
    }

    @media only screen and (max-width: 1000px) {
        .toggle-nav {
            display: block;
        }

        nav ul {
            display: block;
            position: fixed;
            top: calc(var(--header-height) + .25rem);
            right: -15rem;
            background-color: var(--secondary-theme-color);
            width: 100%;
            max-width: 15rem;
            opacity: 0;
            transition: 250ms;
            box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
        }

        nav ul.open {
            right: 0;
            opacity: 1;
        }

        nav li {
            width: 100%;
            height: var(--header-height);
        }

        nav a {
            padding: 0 1em;
        }

        nav a:hover,
        nav a:focus-visible {
            background-color: var(--primary-theme-color);
        }

        nav a::after {
            background-color: var(--primary-theme-color);
            top: 0;
            width: .2em;
            height: 100%;
            border-radius: .2em 0 0 .2em;
        }
    }
</style>
