const APP_PREFIX = 'budget-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    './public/index.html',
    './public/css/styles.css',
    './public/js/index.js'
]

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log(`installing cache : ${CACHE_NAME}`)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})