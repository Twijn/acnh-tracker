<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faTimes } from '@fortawesome/free-solid-svg-icons';
	import { trapFocus } from '$lib/utils/a11y';
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import type { ButtonProps } from './Button';

	type Props = {
		open?: boolean;
		title?: string;
		onSubmit?: () => void | Promise<void>;
		onClose: () => void;
		cancelButtonOverrides?: Partial<ButtonProps>;
		confirmButtonOverrides?: Partial<ButtonProps>;
		maxWidth?: string;
		children: Snippet;
	};

	const {
		open = $bindable(false),
		title = '',
		onSubmit,
		onClose,
		maxWidth = '500px',
		cancelButtonOverrides = {},
		confirmButtonOverrides = {},
		children
	}: Props = $props();

	let submitting = $state(false);
	const dialogId = `modal-${Math.random().toString(36).substring(7)}`;
	const titleId = `${dialogId}-title`;

	const focusFirst = (node: HTMLElement) => {
		const content = node.querySelector('.modal-content');
		const focusable = content?.querySelector<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		focusable?.focus();
	};

	const handleClickOutside = (node: HTMLElement) => {
		const handleClick = (event: MouseEvent) => {
			const target = event.target as Node;

			// Don't close if target is no longer in the document (was in a now-closed modal)
			if (!document.body.contains(target)) {
				return;
			}

			// Don't close if clicking inside this modal
			if (node && node.contains(target)) {
				return;
			}

			// Don't close if clicking inside another modal (prompt, confirm, etc.)
			const closestBackdrop = (target as Element).closest?.('.modal-backdrop');
			if (closestBackdrop && closestBackdrop !== node.parentElement) {
				return;
			}

			// Close if clicking outside (on this modal's backdrop or elsewhere)
			onClose();
		};

		const handleKeydown = (event: KeyboardEvent) => {
			// Don't close on Escape if another modal is open on top
			const hasOtherModalOpen = document.querySelectorAll('.modal-backdrop').length > 1;
			if (event.key === 'Escape' && !hasOtherModalOpen) {
				onClose();
			}
		};

		document.addEventListener('click', handleClick, true);
		document.addEventListener('keydown', handleKeydown, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
				document.removeEventListener('keydown', handleKeydown, true);
			}
		};
	};

	const handleSubmit = (e: Event) => {
		if (!onSubmit) return;
		submitting = true;
		e.preventDefault();
		const result = onSubmit();
		if (result instanceof Promise) {
			result.finally(() => {
				submitting = false;
			});
		} else {
			submitting = false;
		}
	};
</script>

{#if open}
	<div class="modal-backdrop" transition:fade={{ duration: 120 }}>
		<div
			class="modal"
			style="max-width: {maxWidth}"
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			transition:scale={{ duration: 120, start: 0.95 }}
			use:handleClickOutside
			use:trapFocus
			use:focusFirst
		>
			<form method="POST" onsubmit={handleSubmit}>
				{#if title}
					<div class="modal-header">
						<h2 id={titleId}>{title}</h2>
						<button
							type="button"
							class="close-btn"
							onclick={onClose}
                            aria-label={`Close ${title}`}
						>
							<FontAwesomeIcon icon={faTimes} />
						</button>
					</div>
				{:else}
					<button
						type="button"
						class="close-btn absolute"
						onclick={onClose}
						aria-label={`Close ${title}`}
					>
						<FontAwesomeIcon icon={faTimes} />
					</button>
				{/if}

				<div class="modal-content">
					{@render children()}
				</div>
				{#if onSubmit}
					<div class="modal-footer">
						<Button
							type="button"
							variant="secondary"
							tk="common.cancel"
							onClick={onClose}
							{...cancelButtonOverrides}
						/>
						<Button
							type="submit"
							variant="primary"
							tk="common.confirm"
							{...confirmButtonOverrides}
							bind:loading={submitting}
						/>
					</div>
				{/if}
			</form>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(3px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10100;
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal {
		position: relative;
		background: var(--primary-background-color);
		padding: 1.5rem;
		border-radius: 0.6rem;
		border-top: 0.3rem solid var(--primary-theme-color);
		box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.25);
		width: calc(100% - 4rem);
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.25rem;
		color: var(--primary-text-color);
		font-weight: 600;
	}

	.close-btn {
		background: transparent;
		border: none;
		color: var(--secondary-text-color);
		cursor: pointer;
		padding: 0.4rem;
		border-radius: 0.4rem;
		font-size: 1.25rem;
		transition: 200ms;
	}

	.close-btn:hover,
	.close-btn:focus-visible {
		color: var(--light-text-color);
		background-color: var(--primary-theme-color);
		outline: none;
	}

	.close-btn.absolute {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		color: var(--primary-text-color);
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	@media only screen and (max-width: 768px) {
		.modal {
			padding: 1rem;
			width: calc(100% - 2rem);
		}
	}
</style>
