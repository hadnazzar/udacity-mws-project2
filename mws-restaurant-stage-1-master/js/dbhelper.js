/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {

    //IndexedDB
    var request = window.indexedDB.open("indexedDB", 1);

    request.onerror = function (event) {
      // Handle errors!
      let xhr = new XMLHttpRequest();
      xhr.open('GET', DBHelper.DATABASE_URL);
      xhr.onload = () => {
        if (xhr.status === 200) { // Got a success response from server!
          const json = JSON.parse(xhr.responseText);
          // const restaurants = json.restaurants;
          const restaurants = json;
          callback(null, restaurants);
        } else { // Oops!. Got an error from server.
          const error = (`Request failed. Returned status of ${xhr.status}`);
          callback(error, null);
        }
      };
      xhr.send();
    };
    request.onsuccess = function (event) {
      // Do something with the request.result!
      db.transaction("restaurants").objectStore("restaurants").getAll().onsuccess = function (event) {
        var restaurants = event.target.result;
        if (restaurants.length > 0) {
          callback(null, restaurants);
        }
        else {
          let xhr = new XMLHttpRequest();
          xhr.open('GET', DBHelper.DATABASE_URL);
          xhr.onload = () => {
            if (xhr.status === 200) { // Got a success response from server!
              const json = JSON.parse(xhr.responseText);
              // const restaurants = json.restaurants;
              const restaurants = json;
              callback(null, restaurants);
            } else { // Oops!. Got an error from server.
              const error = (`Request failed. Returned status of ${xhr.status}`);
              callback(error, null);
            }
          };
          xhr.send();
        }
      };
    };


  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/imgSrc/${restaurant.photograph}`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    }
    );
    return marker;
  }

}


//IndexedDB
var request = window.indexedDB.open("indexedDB", 1);

request.onerror = function (event) {
  // Generic error handler for all errors targeted at this database's
  // requests!
  alert("Database error: " + event.target.errorCode);
};
request.onsuccess = function (event) {
  // Do something with request.result!
  db = event.target.result;
};


// This event is only implemented in recent browsers   
request.onupgradeneeded = function (event) {
  // Save the IDBDatabase interface 
  var db = event.target.result;

  // Create an objectStore for this database
  var objectStore = db.createObjectStore("restaurants", { keyPath: "id" });

  // Use transaction oncomplete to make sure the objectStore creation is 
  // finished before adding data into it.
  objectStore.transaction.oncomplete = function (event) {
    // Store values in the newly created objectStore.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        var restaurantObjectStore = db.transaction("restaurants", "readwrite").objectStore("restaurants");
        restaurants.forEach(function (restaurant) {
          restaurantObjectStore.add(restaurant);
        });
      }
    });
  };
};
