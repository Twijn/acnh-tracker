<script>
    import {hours, months} from "$lib/constants";

    const TITLE_PAD = 2;

    const {hemisphere} = $props();
</script>

<div class="grid-human">
    {hemisphere.time.join(", ")}
</div>
<div class="grid hour-grid">
    {#each hours as hour, index}
        {@const isActive = hemisphere.timeArray.includes(index)}
        {@const isNow = new Date().getHours() === index}
        <div class="slot" class:title-left={index < TITLE_PAD} class:title-right={index >= 24 - TITLE_PAD} class:active={isActive} class:now={isNow} title={hour}></div>
    {/each}
    <div class="slot-label">12 AM</div>
    <div class="slot-label slot-label-center">12 PM</div>
    <div class="slot-label slot-label-right">12 AM</div>
</div>
<div class="grid-human">
    {hemisphere.monthsArray.length === 12 ? "All year" : hemisphere.months.join(", ")}
</div>
<div class="grid month-grid">
    {#each months as month, index}
        {@const isActive = hemisphere.monthsArray.includes(index + 1)}
        {@const isNow = new Date().getMonth() === index}
        <div class="slot" class:title-left={index < TITLE_PAD} class:title-right={index >= 12 - TITLE_PAD} class:active={isActive} class:now={isNow} title={month}></div>
    {/each}
    <div class="slot-label">January</div>
    <div class="slot-label slot-label-right">December</div>
</div>

<style>
    .grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(24, 1fr);
        gap: .15em;
        border-radius: .15em;
    }

    .hour-grid {
        margin-bottom: .6em;
    }

    .month-grid {
        grid-template-columns: repeat(12, 1fr);
    }

    .slot {
        position: relative;
        background-color: rgba(var(--secondary-theme-color-rgb), 0.3);
        height: 1.3em;
        border-radius: .05em;
        transition: 200ms;
    }

    .slot:hover {
        transform: scale(1.1);
    }

    .slot.now {
        background-color: var(--primary-theme-color);
    }

    .slot.active {
        background-color: var(--secondary-theme-color);
    }

    .slot:last-child {
        margin-right: 0;
    }

    .slot-label {
        grid-column: span 8;
        opacity: .7;
        font-size: .9em;
    }

    .month-grid .slot-label {
        grid-column: span 6;
    }

    .slot-label-center {
        text-align: center;
    }

    .slot-label-right {
        text-align: right;
    }

    .grid-human {
        text-align: center;
    }
</style>
