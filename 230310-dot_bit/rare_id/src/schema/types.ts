// © Kun Lei. All rights reserved.

export type Locale = "en" | "zh-cn";

export type Name = Record<Locale, string>;

export interface CollectionSub {
    id: string;
    name: Name;
    subs?: CollectionSub[];
}

export interface Collection {
    id: string;
    name: Name;
    subs: CollectionSub[];
}

export interface RareIdsReponse {
    id: string;
    names: string[];
}