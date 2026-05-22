<script lang="ts">
    import type {Writable} from "svelte/store";
    import {onMount} from "svelte";
    import {type ISettings, Languages} from "$lib/types";
    import Modal from './components/Modal.svelte';

    const { settingsVisible, hideSettings, settings }:
        { settingsVisible: boolean, hideSettings(): void, settings: Writable<ISettings> } = $props();

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

<Modal title="Settings" onClose={hideSettings} open={settingsVisible}>
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
            <option value="north">Northern Hemisphere</option>
            <option value="south">Southern Hemisphere</option>
        </select>
    </label>
</Modal>
