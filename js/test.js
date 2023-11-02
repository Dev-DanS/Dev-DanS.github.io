var map = L.map("map", {
  zoomControl: false,
  doubleClickZoom: false,
}).setView([0, 0], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var userLocationMarker; // Define userLocationMarker globally

function updateLocation(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var accuracy = position.coords.accuracy; // Get accuracy

  var signalStrength = accuracy; // Signal strength based on accuracy
  var signalStrengthCategory, textColor;

  if (signalStrength <= 40) {
    signalStrengthCategory = "Good";
    textColor = "green";
  } else if (signalStrength <= 80) {
    signalStrengthCategory = "Fair";
    textColor = "yellow";
  } else {
    signalStrengthCategory = "Bad";
    textColor = "red";
  }

  var coordinatesElement = document.getElementById("coordinates");
  coordinatesElement.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;

  if (userLocationMarker) {
    // If userLocationMarker exists, update its position and popup
    userLocationMarker.setLatLng([latitude, longitude]);
    userLocationMarker
      .getPopup()
      .setContent(
        `Signal Strength: <span style="color: ${textColor};">${signalStrengthCategory}</span><br>You are here!`
      );
  } else {
    // If userLocationMarker doesn't exist, create it
    userLocationMarker = L.marker([latitude, longitude]).addTo(map);
    userLocationMarker
      .bindPopup(
        `Signal Strength: <span style="color: ${textColor};">${signalStrengthCategory}</span><br>You are here!`
      )
      .openPopup();
  }

  map.setView([latitude, longitude], 15);

  $.ajax({
    url: "https://nominatim.openstreetmap.org/reverse",
    method: "GET",
    dataType: "json",
    data: {
      format: "json",
      lat: latitude,
      lon: longitude,
      zoom: 18,
    },
    success: function (data) {
      var address = data.display_name;
      var addressWords = address.split(",");
      addressWords.splice(-3);
      var shortenedAddress = addressWords.join(",");
      $(".address h5").text(shortenedAddress);
    },
    error: function (error) {
      console.error("Error getting address: " + error.statusText);
    },
  });
}

function handleError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.error("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.error("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.error("The request to get user location has timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.error("An unknown error occurred.");
      break;
    default:
      console.error("An error occurred while getting the user's location.");
      break;
  }
}

var options = {
  enableHighAccuracy: true,
  timeout: 10000, // 10 seconds
  maximumAge: 0,
};

var watchId = navigator.geolocation.watchPosition(
  updateLocation,
  handleError,
  options
);
