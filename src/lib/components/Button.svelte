<script lang="ts">
	import type { ButtonProps } from './Button';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	const {
		href,
		newTab = false,
		variant = 'primary',
		size = 'medium',
		onClick,
		full = false,
		type = 'button',
		external = false,
		title,
		icon,
		iconSize = '1x',
		disabled = $bindable(false),
		loading = $bindable(false),
		children
	}: ButtonProps = $props();

	const isDisabled = $derived(disabled || loading);

	function handleClick(e: Event) {
		if (isDisabled) {
			e.preventDefault();
			return false;
		}
		if (onClick) {
			onClick(e);
		}
	}
</script>

{#if href}
	<a
		{href}
		class="button {variant} {size}"
		class:disabled={isDisabled}
		class:full
		class:loading
		target={newTab ? '_blank' : undefined}
		rel={external || newTab ? 'noopener noreferrer' : undefined}
		{title}
		onclick={handleClick}
		aria-disabled={isDisabled}
		aria-busy={loading}
	>
		{#if icon}
			<FontAwesomeIcon {icon} size={iconSize} />
		{/if}
		{#if children}
			{@render children()}
		{/if}
	</a>
{:else}
	<button
		onclick={handleClick}
		{type}
		class="button {variant} {size}"
		class:loading
		disabled={isDisabled}
		class:full
		aria-disabled={isDisabled}
		aria-busy={loading}
		{title}
	>
		{#if icon}
			<FontAwesomeIcon {icon} size={iconSize} />
		{/if}
		{#if children}
			{@render children()}
		{/if}
	</button>
{/if}

<style>
	.button {
		box-sizing: border-box;
		font-family: "Parkinsans", sans-serif;
		color: var(--primary-text-color);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.35em;
		padding: 0.5em 1em;
		border-radius: 0.4rem;
		font-size: 1rem;
		font-weight: 500;
		text-decoration: none;
		cursor: pointer;
		border: 1px solid transparent;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
	}

	.button :global(svg) {
		transition: transform 0.2s ease;
	}

	.button:hover:not(.disabled):not(.loading) :global(svg) {
		transform: scale(1.1);
	}

	.primary {
		background-color: var(--theme-color-1);
		background-color: var(--primary-theme-color);
		color: var(--light-text-color);
	}

	.primary:hover:not(.disabled):not(.loading) {
		background-color: var(--secondary-theme-color);
	}

	.secondary {
		background-color: var(--secondary-background-color);
		color: var(--secondary-text-color);
		border-color: rgba(0, 0, 0, 0.1);
	}

	.secondary:hover:not(.disabled):not(.loading) {
		background-color: var(--primary-background-color);
		border-color: var(--secondary-theme-color);
	}

	.success {
		background-color: #41a05f;
		color: var(--light-text-color);
	}

	.error {
		background-color: #da4b4b;
		color: var(--light-text-color);
	}

	.button:hover:not(.disabled):not(.loading) {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	.button:focus-visible {
		outline: 2px solid var(--secondary-theme-color);
		outline-offset: 2px;
	}

	.button:active:not(.disabled):not(.loading) {
		transform: translateY(0);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.disabled,
	.button:disabled,
	.loading {
		cursor: not-allowed;
		background-color: #cfd4db;
		color: #59616b;
		border-color: #b9c0c9;
		box-shadow: none;
		transform: none;
	}

	.loading {
		position: relative;
	}

	.full {
		width: 100%;
	}

	.xsmall {
		font-size: 0.8rem;
		padding: 0.3em 0.6em;
	}

	.small {
		font-size: 0.875rem;
		padding: 0.375em 0.75em;
	}

	.medium {
		font-size: 1rem;
		padding: 0.5em 1em;
	}

	.large {
		font-size: 1.125rem;
		padding: 0.625em 1.25em;
	}
</style>
