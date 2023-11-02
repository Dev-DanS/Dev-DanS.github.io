function getPublicIPAddress() {
  fetch("http://ifconfig.me/ip")
    .then((response) => response.text())
    .then((data) => {
      const ipAddress = data.trim(); // Remove any leading/trailing whitespace
      document.getElementById("ip-address").textContent = ipAddress;
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("ip-address").textContent =
        "Error fetching IP address";
    });
}

// Call the function to get the public IP address
getPublicIPAddress();
