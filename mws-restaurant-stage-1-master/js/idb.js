

var dbPromise = idb.open('idb-db',1,function(upgradeDb){
  switch(upgradeDb.oldVersion){
    case 0:
    var keyValStore = upgradeDb.createObjectStore('keyval')
    keyValStore.put('world','hello')
    case 1:
    var keyValStore = upgradeDb.createObjectStore('restaurants', keypath: 'id')
  }
})

// dbPromise.then(function(db){
//   var tx = db.transaction('keyval');
//   var keyValStore = tx.objectStore('keyval');
//   return keyValStore.get('hello')
// }).then(function(val){
//   console.log(val)
// })



// dbPromise.then(function(db){
//   var tx = db.transaction('keyval', "readwrite");
//   var keyValStore = tx.objectStore('keyval');
//   keyValStore.put('bar','foo')
//   return tx.complete()
// }).then(function(){
//   console.log('Added foo:bar')  
// })

dbPromise.then(function(db){
  var tx = db.transaction('restaurants', "readwrite");
  var restaurantsStore = tx.objectStore('restaurants');
  restaurantsStore.put()
  return tx.complete()
}).then(function(){
  console.log('restaurant added')  
})