<script>
    import {hours, months} from "$lib/constants";

    const {hemisphere} = $props();
</script>

<div class="grid-human">
    {hemisphere.time.join(", ")}
</div>
<div class="grid hour-grid">
    {#each hours as hour, index}
        <div class="slot {hemisphere.timeArray.includes(index) ? 'active' : ''} {new Date().getHours() === index ? 'now' : ''}" title={hour}></div>
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
        <div class="slot {hemisphere.monthsArray.includes(index + 1) ? 'active' : ''} {new Date().getMonth() === index ? 'now' : ''}" title={month}></div>
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
        overflow: hidden;
    }

    .hour-grid {
        margin-bottom: .6em;
    }

    .month-grid {
        grid-template-columns: repeat(12, 1fr);
    }

    .slot {
        position: relative;
        background-color: var(--secondary-theme-color);
        height: 1.3em;
        opacity: .3;
        border-radius: .05em;
    }

    .slot.now {
        background-color: var(--primary-theme-color);
    }

    .slot.active {
        opacity: .9;
    }

    .slot.now:not(.active) {
        opacity: .45;
    }

    .slot.now.active {
        opacity: 1;
    }

    .slot:last-child {
        margin-right: 0;
    }

    .slot-label {
        font-size: .9em;
        grid-column: span 8;
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
        font-size: .9em;
    }
</style>
