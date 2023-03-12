import fetch from 'node-fetch';
import { Collection, CollectionSub, RareIdsReponse } from "./schema";

export function isValidArray(items: any[]): boolean {
    return Array.isArray(items) && items.length > 0;
}

export const rareIdSetDict: Record<string, Set<string>> = {
    999: new Set<string>(["000", "001"])
};
let isInitialized = false;

async function updateRareIdSetDict(sub: CollectionSub) {
    const { id, name } = sub || {};
    if (!id || !name || !name["en"]) { return; }
    const key = name["en"];
    if (key === "Rare4D") { return; }
    const url = `https://api.rare.id/api/collections/${id}?compact=false`;
    const response = await fetch(url);
    const data: RareIdsReponse = await response.json();
    if (!data || !isValidArray(data.names)) { return; }
    const value: Set<string> = new Set<string>(data.names);
    rareIdSetDict[key] = value;
}

export async function initRareIdSetDict(): Promise<void> {
    if (isInitialized) { return; }
    const response = await fetch('https://api.rare.id/api/collections/v2?compact=true');
    const collections: Collection[] = await response.json();
    const digitCollection: Collection = collections.find(x => {
        const { name } = x || {};
        if (name && name["en"] && name["en"].includes("Digit")) {
            return true;
        }
    });
    const { subs = [] } = digitCollection || {};
    const promises: Promise<void>[] = [];
    subs.forEach((sub: CollectionSub) => {
        if (!sub || !isValidArray(sub.subs)) { return; }
        sub.subs.forEach((pattern: CollectionSub) => {
            promises.push(updateRareIdSetDict(pattern));
        });
    });
    await Promise.all(promises);
    isInitialized = true;
}

export function detectPatterns(name: `${string}.bit`): Set<string> {
    const result: Set<string> = new Set<string>();
    if (!name || !name.endsWith(".bit")) { return result; }
    const digits = name.substring(0, name.length - 4);
    for (let key in rareIdSetDict) {
        const rareIdSet: Set<string> = rareIdSetDict[key];
        if (rareIdSet && rareIdSet.has(digits)) {
            result.add(key);
        }
    }
    return result;
};
