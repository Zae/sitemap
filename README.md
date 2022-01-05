# Sitemap

Small library for creating [schema.org compatible](https://www.sitemaps.org/protocol.html) XML sitemaps.

# Compatibility
Should work in all browser and node environments including service workers.

The code is generated using the typescript es2021 target, so you need to transpile
it to your needed target yourself when necessary.

# Example
~~~js
const sitemap = new Sitemap();
const entries = await getEntries();

entries.forEach((entry) => {
    sitemap.add(new Url(
        new URL(entry.uri),
        entry.dateUpdated,
        'weekly',
        0.5
    ));
    
    // or
    sitemap.add({
        loc: new URL(entry.uri),
        lastmod: entry.dateUpdated,
        changefreq: 'weekly',
        priority: 0.5
    });
});

// export as string
const result = sitemap.toString();

// or stream
sitemap.stream().pipe(response);
~~~

# Change defaults
~~~js
// static
Url.defaultChangeFreq = 'daily';
Url.defaultPriority = 1;

// or on an instance
const url = new Url();
url.defaultChangeFreq = 'daily';
url.defaultPriority = 1;
~~~

# Peer dependencies
- xml@^1.0.1
