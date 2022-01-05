/// <reference types="node" />
declare type Priority = number;
export declare enum ChangeFrequencies {
    ALWAYS = "always",
    HOURLY = "hourly",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly",
    NEVER = "never"
}
declare type UrlLike = {
    loc: URL;
    lastmod: Date;
    changefreq: ChangeFrequencies;
    priority: Priority;
};
declare type Urlable = UrlLike | Url;
declare type UrlDefaults = {
    changefreq: ChangeFrequencies;
    priority: Priority;
};
export declare class Sitemap {
    #private;
    constructor(urls?: Url[]);
    add(url: Readonly<Urlable>): void;
    stream(): NodeJS.ReadableStream;
    toString(): string;
}
export declare class Url {
    #private;
    constructor(location: Readonly<URL>, lastModificationDate: Readonly<Date>, changefrequency?: Readonly<ChangeFrequencies>, priority?: Readonly<Priority>);
    static get defaults(): UrlDefaults;
    get defaults(): UrlDefaults;
    static set defaultChangeFreq(value: Readonly<ChangeFrequencies>);
    set defaultChangeFreq(value: Readonly<ChangeFrequencies>);
    static set defaultPriority(value: Readonly<number>);
    defaultPriority(value: Readonly<number>): void;
    get loc(): URL;
    get lastmod(): Date;
    get changefreq(): ChangeFrequencies;
    get priority(): number;
    static validPriority(priority: Readonly<Priority>): priority is Priority;
    build(): UrlLike;
}
export {};
