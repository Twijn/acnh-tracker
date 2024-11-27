<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import type {Writable} from "svelte/store";
    import {onMount, tick} from "svelte";
    import {type ISettings, Languages} from "$lib/types";

    const { settingsVisible, hideSettings, settings }:
        { settingsVisible: boolean, hideSettings(): void, settings: Writable<ISettings> } = $props();

    async function autofocus(el: HTMLElement) {
        await tick();
        el.focus();
    }

    let formSettings: ISettings = $state({
        lang: "uSen",
        hemisphere: "north",
    });

    onMount(() => {
        let localSettings = localStorage.getItem("settings");

        settings.subscribe(currentSettings => {
            localStorage.setItem("settings", JSON.stringify(currentSettings));
        });

        if (localSettings) {
            settings.update(currentSettings => {
                    const object = {
                        ...currentSettings,
                        ...JSON.parse(localSettings ?? "{}")
                    };
                    formSettings = object;
                    return object
            });
        }
    });

    async function updateSettings() {
        settings.update(currentSettings => {
            return {
                ...currentSettings,
                ...formSettings,
            }
        });
    }
</script>

{#if settingsVisible}
    <div id="settings-container" in:fade={{duration: 250}} out:fade={{duration: 250}}>
        <section id="settings-modal" in:scale={{duration: 250}} out:scale={{duration: 250}}>
            <h1>Settings</h1>

            <label>
                Language
                <select name="lang" id="lang" bind:value={formSettings.lang} onchange={updateSettings}>
                    {#each Languages as lang}
                        <option value={lang.id}>{lang.name}</option>
                    {/each}
                </select>
                <small>At this time, this will only impact Animal Crossing names &amp; descriptions.</small>
            </label>

            <label>
                Hemisphere
                <select name="hemisphere" id="hemisphere" bind:value={formSettings.hemisphere} onchange={updateSettings}>
                    <option value="north">Northern</option>
                    <option value="south">Southern</option>
                </select>
            </label>

            <button id="close-settings" onclick={hideSettings} aria-label="Close Settings" use:autofocus>
                <i class="fa-sharp fa-solid fa-xmark"></i>
            </button>
        </section>
    </div>
{/if}

<style>
    #settings-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        background-color: rgba(0,0,0,0.3);
    }

    #settings-container section {
        position: relative;
        background-color: var(--secondary-background-color);
        width: calc(100% - 4em);
        max-width: 30em;
        padding: .8em;
        margin: 3em auto;
        z-index: 10;
        border-radius: .3em;
        overflow: hidden;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
    }

    #settings-container h1 {
        background-color: var(--primary-theme-color);
        color: var(--light-text-color);
        font-size: 1em;
        font-weight: 600;
        width: 100%;
        margin: -.8em -.8em .8em -.8em;
        padding: .6em .8em;
        border-bottom: .2em solid var(--secondary-theme-color);
        text-transform: uppercase;
        text-align: center;
    }

    #close-settings {
        position: absolute;
        top: .5em;
        right: .5em;
        background-color: transparent;
        color: var(--light-text-color);
        border: none;
        font-size: 1rem;
        padding: .4em;
        cursor: pointer;
    }
</style>
