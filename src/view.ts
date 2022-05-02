import { ItemView, WorkspaceLeaf } from "obsidian";
import Main from "./components/Main.svelte";
export const TZ_VIEW = "timezone-view";
import type { SettingsGetter } from "./settings";





export class TimezoneView extends ItemView {
    component: Main;
    settings: SettingsGetter;

    constructor(leaf: WorkspaceLeaf, settings: SettingsGetter) {
        super(leaf);
        this.settings = settings;
    }

    getViewType() {
        return TZ_VIEW;
    }

    getIcon(): string {
        return "clock3";
    }

    getDisplayText() {
        return "Team Timezone";
    }

    async onOpen() {
        this.component = new Main(
            {
                target: this.contentEl,
                props: {
                    settingsGetter: this.settings
                }
            }
        );
    }

    async onClose() {
        // Nothing to clean up.
    }
}
