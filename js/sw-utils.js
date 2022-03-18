// Funciones auxiliares del SW principal


// Guardar en el cache dinamico
function actualizarCacheDinamico( dynamicCache, req, res ) {

    // Si la respuesta tiene datos
    if( res.ok ){
        // Almacenar en el cache si trae datos
        // Retorna una promesa
        return caches.open( dynamicCache ).then( cache => {
            cache.put( req, res.clone() );
            // Retorna una promesa
            return res.clone();
        });
    } else {
        // Si falla el cache y falla la peticion 
        // regresa la respuesta cualquiera que esta sea
        return res;
    }
    
}