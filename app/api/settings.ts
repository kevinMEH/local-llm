"use server"

import { readFile, writeFile } from "fs/promises";

type Settings = {
    completedWelcome: boolean
};

let settings: Settings | null = null;

const saveSettings = async () => {
    await writeFile("data/settings.json", JSON.stringify(settings));
};

const loadSettings = async () => {
    try {
        const contents = (await readFile("data/settings.json")).toString();
        settings = JSON.parse(contents) as Settings;
        return settings;
    } catch(error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        settings = {
            completedWelcome: false
        };
        saveSettings();
        return settings;
    }
}

export async function getSettings(): Promise<Settings> {
    if(settings) {
        return settings;
    } else {
        return await loadSettings();
    }
}

export async function setSettings(incomingSettings: Settings) {
    settings = incomingSettings;
    await saveSettings();
}