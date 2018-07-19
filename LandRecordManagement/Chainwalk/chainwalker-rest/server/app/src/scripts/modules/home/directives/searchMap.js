export default class SearchPanelMap {
  constructor() {
      this.restrict = 'E';
      this.template = require("../templates/searchMap.html");
      this.replace =  true;
      this.scope = {
        model: "=",
        userCallbacks: '=?callbacks'
      };
      this.controller = 'HomeController';
  }

  link(scope, element) {

    var marker = null;

    var options = {
      center: new google.maps.LatLng(15.317277, 75.713890),
      zoom: 7,
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
        style: google.maps.ZoomControlStyle.LARGE
      },
      panControl: false,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "poi.business",
          elementType: "labels",
          stylers: [
            {visibility: "off"}
          ]
        }
      ],
      disableDefaultUI: false
    };

    var map = new google.maps.Map(element[0].querySelectorAll('.map-container')[0], options);

    var input = element[0].querySelectorAll('.controls')[0];
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var geocoder = new google.maps.Geocoder;

    google.maps.event.addListener(map, 'click', function(event) {
      geocoder.geocode({'location': event.latLng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
              placeMarker(event.latLng);
              console.log(results[0]);
            }
          }
      });
    });

    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      //clear marker
      if(marker) {
        marker.setMap(null);
      }

      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    })

    function placeMarker(location) {
        if(marker) {
          marker.setMap(null);
        }
        marker = new google.maps.Marker({
            position: location,
            map: map
        });
    }
  }

  static mapFactory() {
    SearchPanelMap.instance = new SearchPanelMap();
    return SearchPanelMap.instance;
  }

}
