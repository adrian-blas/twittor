// imports
importScripts('./js/sw-utils.js');

// Se guardan archivos propios de la aplicacion
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
// Se guardan librerias externas normalmente usadas 
// por ejemplo: bootstrap, fuentes de google, font awesome, etc.
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {

    // Crea una promesa donde abre el cache 
    // Se le pasa como parametro el nombre del cache 
    //  donde se va a guardar "STATIC_CACHE"
    // Agrega el arreglo de archivos que se van a guardar 
    //  en el cache "APP_SHELL"
    const cacheStatic = caches.open( STATIC_CACHE )
                .then( cache => cache.addAll( APP_SHELL ) );
    
    const cacheInmutable = caches.open( INMUTABLE_CACHE )
                .then( cache => cache.addAll( APP_SHELL_INMUTABLE ) );
    
    // Espera a que las 2 promesas sean resueltas 
    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]));

});

// Se utiliza normalmente para eliminar los caches antiguos 
self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if( key !== STATIC_CACHE && key.includes('static') ){
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});

self.addEventListener('fetch', e => {

    // Cache with Network Fallback

    // Verificar si existe el request
    // Si no existe el request lo muestra en consola y
    // es necesario hacer un fetch a ese recurso
    const respuesta = caches.match( e.request ).then( res => {

        if( res ){
            return res;
        } else {
            console.log(e.request.url);
            return fetch( e.request ).then( newRes => {

                return actualizarCacheDinamico( DYNAMIC_CACHE, e.request, newRes );

            });
        }

    });

    e.respondWith( respuesta );

});