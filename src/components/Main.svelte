<script lang="ts">
	import { getTimezoneOffset } from "date-fns-tz";
	import { timestore, timeoverride } from "../stores/timestore";
	import type { SettingsGetter } from "../settings";

	export let settingsGetter: SettingsGetter;

	const people = JSON.parse(settingsGetter().tzinfo);
	const timezones = Object.entries(
		people.reduce((o, i) => {
			const offset = getTimezoneOffset(i.tz);

			if (!o.hasOwnProperty(offset)) {
				o[offset] = [];
			}
			o[offset].push(i);
			return o;
		}, {})
	).sort(([a], [b]) => a - b);

	const showOffset = function (offset: number) {
		offset = offset / 60 / 60 / 1000;
		if (offset === 0) {
			return "";
		} else if (offset > 0) {
			return `UTC+${offset}`;
		}
		return `UTC${offset}`;
	};

	const times = timestore(
		Object.values(people).reduce((o, i) => {
			o.push(i.tz);
			return o;
		}, []),
		settingsGetter,
		timeoverride
	);
</script>

<div class="team-timezone-wrapper">
	<label>
		Set time
		<input bind:value={$timeoverride} />
		<button on:click={() => timeoverride.set(null)}>Clear</button>
	</label>
	{#each timezones as [offset, people]}
		<h3>
			<strong>{$times[offset]}</strong>
			{showOffset(offset)}
		</h3>
		<div class="team-timezone-people">
			{#each people as person}
				<div class="team-timezone-person">
					<div class="team-timezone-avatar">
						<img src={person.avatar} alt={person.name} />
					</div>
					<div class="team-timezone-name">
						{person.name},
						<em>{person.city}</em>
					</div>
					<div class="team-timezone-tz">{person.tz}</div>
				</div>
			{/each}
		</div>
	{/each}
</div>
