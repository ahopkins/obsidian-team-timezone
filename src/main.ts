import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { TZ_VIEW, TimezoneView } from "./view";
import { DEFAULT_SETTINGS } from "./settings";
import type { TZSettings } from "./settings";

const currentTime = () => {
	const date = new Date();
	return date.toLocaleString();
}

export default class MyPlugin extends Plugin {
	settings: TZSettings;

	async onload() {
		await this.loadSettings();

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText(currentTime());

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TZSettingTab(this.app, this));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => statusBarItemEl.setText(currentTime()), 1000));

		this.registerView(TZ_VIEW, (leaf) => new TimezoneView(
			leaf,
			() => this.settings
		));
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(TZ_VIEW);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class TZSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings for my awesome plugin.' });

		new Setting(containerEl)
			.setName('Timezone info')
			.setDesc('Set the JSON for timezones')
			.addTextArea(text => text
				.setValue(this.plugin.settings.tzinfo)
				.onChange(async (value) => {
					this.plugin.settings.tzinfo = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Timezone format')
			.setDesc('Set the format for time display')
			.addText(text => text
				.setValue(this.plugin.settings.format)
				.onChange(async (value) => {
					this.plugin.settings.format = value;
					await this.plugin.saveSettings();
				}));
	}
}
