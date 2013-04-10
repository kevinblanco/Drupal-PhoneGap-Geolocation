/**
 * Boton de Buscan Amigos
 */
function buscarAmigosCerca( ){

  //Muestra mensaje al usuario..
  $('#lista_amigos').html('Obteniendo tu posicion y buscando amigos ...');

  //Obtiene la ubicacion del dispositivo mediante el GPS
  navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});
  return false;
};

/**
 * Funcion que maneja el exito en la Geolocalizacion 
 */

function onSuccess(position) {

  //Crea mensaje al usuario con su actual ubicacion..
  var message = 'Tu Latitud: '  + position.coords.latitude + '<br />' +
                'Tu Longitud: ' + position.coords.longitude;

  //... y la despliega
  $('#lista_amigos').html(message);

  //Luego, llama a la funcion que obtiene amigos cercanos pasandole tu latitud y longitud
  drupal_geo_locate_friends(position.coords.latitude, position.coords.longitude);
}

/**
 * Funcion que busca amigos cerca recibiendo Latiduo y Longitud como paramentros
 */
function drupal_geo_locate_friends(lat, lng) {

  try {
    
    //Obtiene el rango en KM del spiner
    var range = $( '#distancia' ).val( );
    
    //crea la URL del Webservice
    var drupal_view_url = "http://services.kevin-blanco.com/locations/" + 
      lat + "," + 
      lng + "_" + 
      range;
      
    //Realiza peticion AJAX para obtener a los amigos
    $.ajax({
      url: drupal_view_url,
      type: 'get',
      dataType: 'json',

      //En caso de error muestra mensaje al usuario
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('Error al obtener tus amigos cercanos');
      },

      //En caso de exito...
      success: function (data) {
        
     // Limpia la lista
        $("#lista_de_amigos").html("");

        // Por cada resultado, crea un elemento de lista con la informacion del amigo...
        $.each(data.nodes,function(index,obj){
          html = "(a " + obj.node.Distance + ") " + obj.node.title + "<br />Provincia: " + obj.node.province + "<br />" + obj.node.body;
          $("#lista_de_amigos").append($("<li></li>",{"html":html}));
        });

        // Refresca la lista
        $("#lista_de_amigos").listview("destroy").listview();
      }
    });

  }
  catch (error) { alert("Error  - " + error); }
}
/**
 * Error en Geolocalizacion
 */
function onError(error) {
  alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}