/*
TODO: upload to github hiding API keys

TODO: make everything functions
TODO: check for invalid response
*/

// create array of cities and corresponding airports
var cities_array = ["Buenos Aires", "Cape Town", "Marrakesh", "Rio de Janeiro", "Tel Aviv", "Tbilisi", "Vienna", "Moscow", "Chiang Mai", "Sydney", "Auckland"];
var airport_codes = ["EZE", "CPT", "RAK", "GIG", "TLV", "TBS", "VIE", "DME", "CNX", "SYD", "AKL"];

// set default city and airport as Boston
var src_city = "Boston";
var src_airport_code = "BOS";

// set default latitude and longitude as Boston
var latitude = 42.3583333;
var longitude = -71.0602778;

/*

    KEYSKEYSKEYSKEYSKEYS YOUR API KEYS GO HERE KEYSKEYSKEYSKEYSKEYS


*/

function main() {
  console.log(src_airport_code + "1");
  console.log(src_city + "1");

  var random = Math.floor(Math.random() * cities_array.length);
  var dst_city = cities_array[random];
  var dst_airport_code = airport_codes[random];
  // var current_date = new Date();
  // var outbound_date = `${current_date.getFullYear()}-${(current_date.getMonth() + 2) % 12}-${current_date.getDate()}`;

  // html container for photos
  var photo_container = document.getElementById('J&8eVp9t');
  $(photo_container).css("text-align", "center");

  // headers for skyscanner
  $.ajaxSetup({
    headers: {"X-RapidAPI-Key": skyscanner_key}
  });
  $.get(
    `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${src_airport_code}-sky/${dst_airport_code}-sky/anytime`,
    function(response) {
      var flight_cost = document.createElement("h2");
      var cheapest_price = response["Quotes"]["0"]["MinPrice"];

      // text for html
      flight_cost.textContent = `${src_city} -> ${dst_city} = $${cheapest_price}`;
      $(flight_cost).css({"font-size": "20px", "font-family": "Karla", "text-align": "center", "color": "#fe5f55"});
      photo_container.append(flight_cost);
    }
  );

  // headers for unsplash
  $.ajaxSetup({
    headers: {"Authorization": `Client-ID ${client_id}`}
  });

  var pictures_per_page = 9;

  // search for collection passing in a city -> id of first collection;
  $.get(`https://api.unsplash.com/search/collections?client_id=${client_id}&page=1&per_page=20&query=${encodeURIComponent(dst_city)}`, function(response) {
    var collection_id_options = [];
    var total_collections = response["results"].length;

    // append to array collection_id_options the id of all possible collections
    for (var m = 0; m < total_collections; m++) {
      var collection_id = response["results"][m]["id"];
      collection_id_options.push(collection_id);
    }

    // choose random collection to display
    var random_collection = Math.floor(Math.random() * collection_id_options.length);
    var collection_id = collection_id_options[random_collection];

    //access the urls of the first 9 images in the collection -> urls of images
    $.get(`https://api.unsplash.com/collections/${collection_id}/photos/?client_id=${client_id}`, function(response) {
      var br = document.createElement("br");
      photo_container.append(br);

      for (var i = 0; i < Math.min(pictures_per_page, response.length); i++) {
        var photo_frame = document.createElement("div");
        $(photo_frame).css({
          "height": "25vh",
          "width": "30vw",
          "overflow": "hidden",
          "display": "inline-block"
        });

        var photo = document.createElement("img");
        photo.src = response[i]["urls"]["small"];

        photo_frame.append(photo);
        photo_container.append(photo_frame);
      }
    });
  });
}

function get_location() {
  if (window.location.pathname == "/newtab.html") {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;


        // update src_airport_code, one header to auhorize lufthansa
        $.ajaxSetup({
          headers: {"Accept": "application/json", "Authorization": `Bearer ${lf_token}`}
        });

        $.get(`https://api.lufthansa.com/v1/references/airports/nearest/${latitude},${longitude}`, function(response) {
          src_airport_code = response["NearestAirportResource"]["Airports"]["Airport"]["0"]["AirportCode"];
          console.log(src_airport_code);


          // update src_city
          $.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${google_key}`, function(response) {
            src_city = response["results"]["6"]["address_components"]["0"]["long_name"];
            console.log(src_city);
            main();
          });
        });

      });
    }
  }
}
get_location();
