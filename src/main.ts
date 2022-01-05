import xml from 'xml';

type Priority = number;

export enum ChangeFrequencies {
    ALWAYS = 'always',
    HOURLY = 'hourly',
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
    NEVER = 'never',
}

type UrlLike = {
    loc: URL,
    lastmod: Date,
    changefreq: ChangeFrequencies,
    priority: Priority
}

type Urlable = UrlLike | Url;

type UrlDefaults = {
    changefreq: ChangeFrequencies,
    priority: Priority
}

export class Sitemap {
    readonly #namespace = 'http://www.sitemaps.org/schemas/sitemap/0.9';
    readonly #namespaceXsi = 'http://www.w3.org/2001/XMLSchema-instance';
    readonly #namespaceXsiSchemaLocation = 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd';
    #urls: Url[];

    constructor(urls: Url[] = []) {
        this.#urls = urls;
    }

    add(url: Readonly<Urlable>) {
        if (url instanceof Url) {
            this.#urls.push(url);
            return;
        }

        this.#urls.push(new Url(
            url.loc ?? '',
            url.lastmod ?? null,
            url.changefreq ?? Url.defaults.changefreq,
            url.priority ?? Url.defaults.priority,
        ));
    }

    stream(): NodeJS.ReadableStream {
        return this.#build(true) as unknown as NodeJS.ReadableStream;
    }

    toString(): string {
        return this.#build(false) as string;
    }

    #build(stream : Readonly<boolean> = false): string | NodeJS.ReadableStream {
        return xml({
            urlset: [
                {
                    _attr: {
                        xmlns: this.#namespace,
                        'xmlns:xsi': this.#namespaceXsi,
                        'xsi:schemaLocation': this.#namespaceXsiSchemaLocation,
                    },
                },
                ...this.#urls.map((url: Readonly<Url>) => {
                    return {
                        url: Object
                            .entries(url.build())
                            .map(([key, value]) => {
                                if (value instanceof URL) {
                                    return { [key]: value.toString() };
                                }

                                return { [key]: value };
                            })
                    };
                })
            ]
        }, {
            indent: '',
            stream,
            declaration: true
        });
    }
}

export class Url {
    readonly #loc: URL;
    readonly #lastmod: Date;
    readonly #changefreq: ChangeFrequencies;
    readonly #priority: Priority;

    constructor(
        location: Readonly<URL>,
        lastModificationDate: Readonly<Date>,
        changefrequency: Readonly<ChangeFrequencies> = Url.#defaults.changefreq,
        priority: Readonly<Priority> = Url.#defaults.priority
    ) {
        if (!Url.validPriority(priority)) {
            throw new Error('Invalid priority passed');
        }

        this.#loc = location;
        this.#lastmod = lastModificationDate ?? new Date();
        this.#changefreq = changefrequency ?? Url.defaults.changefreq;
        this.#priority = priority ?? Url.defaults.priority;
    }

    static #defaults: UrlDefaults = {
        changefreq: ChangeFrequencies.ALWAYS,
        priority: 0.5
    };

    static get defaults() { return Url.#defaults; }
    get defaults() { return Url.#defaults; }
    static set defaultChangeFreq(value: Readonly<ChangeFrequencies>) {
        Url.#defaults.changefreq = value;
    }
    set defaultChangeFreq(value: Readonly<ChangeFrequencies>) {
        Url.defaultChangeFreq = value;
    }

    static set defaultPriority(value: Readonly<number>) {
        if (!Url.validPriority(value)) {
            throw new Error('Invalid priority passed');
        }

        Url.#defaults.priority = value;
    }
    defaultPriority(value: Readonly<number>) {
        Url.defaultPriority = value;
    }

    get loc() { return this.#loc; }
    get lastmod() { return this.#lastmod; }
    get changefreq() { return this.#changefreq; }
    get priority() { return this.#priority; }

    static validPriority(priority: Readonly<Priority>): priority is Priority {
        return (priority >= 0.0 && priority <= 1.0);
    }

    build(): UrlLike {
        return {
            loc: this.#loc,
            lastmod: this.#lastmod,
            changefreq: this.#changefreq,
            priority: this.#priority,
        };
    }
}
