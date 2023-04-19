<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let type: 'mute' | 'unmute' | 'info' | 'close' = 'info'
	export let inverted: boolean = false

	const dispatch = createEventDispatcher()
	$: classes = [$$restProps.class, `button-${type}`].join(' ')
</script>

<button on:click={(e) => dispatch('click', e)} class={classes} class:inverted>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 55">
		{#if type !== 'close'}
			<rect class="bg-circle" width="55" height="55" rx="27.5" ry="27.5" />
		{/if}

		{#if type === 'info'}
			<path
				d="M27.5 44.61c-9.43 0-17.11-7.67-17.11-17.11s7.68-17.11 17.11-17.11 17.11 7.67 17.11 17.11-7.67 17.11-17.11 17.11Zm0-31.71c-8.05 0-14.6 6.55-14.6 14.6s6.55 14.6 14.6 14.6 14.6-6.55 14.6-14.6-6.55-14.6-14.6-14.6Z"
			/>
			<path d="M26.1 37.11V24.84h2.81v12.27H26.1Z" />
			<circle cx="27.5" cy="20.62" r="1.91" />
		{/if}

		{#if type === 'mute' || type === 'unmute'}
			<path
				d="m34.29 42.36-9.25-7.11h-10.2V18.23h10.2l9.25-7.11v31.23ZM17.2 32.9h8.64l6.1 4.69V15.9l-6.1 4.69-8.64.02v12.3Z"
			/>
		{/if}

		{#if type === 'mute'}
			<path
				d="m39.18 35.89-1.67-1.66c1.81-1.81 2.85-4.42 2.85-7.14s-1.04-5.33-2.85-7.14l1.67-1.66c2.24 2.25 3.53 5.46 3.53 8.8s-1.29 6.55-3.53 8.8Z"
			/>
		{/if}

		{#if type === 'close'}
			<path
				d="m42.25 14.96-2.21-2.21L27.5 25.28 14.96 12.75l-2.21 2.21L25.28 27.5 12.75 40.04l2.21 2.21L27.5 29.72l12.54 12.53 2.21-2.21L29.72 27.5l12.53-12.54z"
			/>
		{/if}
	</svg>
</button>

<style lang="scss">
	button {
		display: inline-block;
		position: relative;
		cursor: pointer;
		width: 100%;
		height: 100%;
		padding: 0;

		--background-color: #000;
		--text-color: #fff;

		&.button-close {
			--background-color: #fff;
			--text-color: #000;
		}

		@media (hover: hover) {
			&:hover {
				--background-color: #fff;
				--text-color: #000;

				// &.button-close {
				// 	--background-color: #000;
				// 	--text-color: #fff;
				// }
			}
		}

		&.inverted {
			--background-color: #fff;
			--text-color: #000;

			&.button-close {
				--background-color: #000;
				--text-color: #fff;
			}

			@media (hover: hover) {
				&:hover {
					--background-color: #000;
					--text-color: #fff;

					// &.button-close {
					// 	--background-color: #fff;
					// 	--text-color: #000;
					// }
				}
			}
		}

		&:not(.button-close) {
			filter: drop-shadow(0.25rem 0.25rem 0.2rem rgb(0 0 0 / 0.4));
		}

		svg {
			rect,
			path,
			circle {
				fill: var(--text-color);
			}
		}

		svg rect.bg-circle {
			fill: var(--background-color);
		}
	}

	:global(.buttons button + button) {
		margin-left: 1rem;
	}
</style>
