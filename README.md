# FirebaseTest

This is a simple test with :fire:base which has a study purpose.
The matter is simple: understand what is able to do a _realtime distributed NoSQL database_, which recently acquired by Google, who can send global updates about data to all subscribers.

----

## Setup
### Create a Firebase DB
Go to [Firebase website](https://firebase.google.com) and create an new profile.
They'll provide you an URL for database access with a pattern like:
> https://someFancyNameHere.firebaseio.com/

### Connect to the db
Create a simple connection to the database using:
`var db = new Firebase('https://firebaseDbFancyNameHere.firebaseio.com/');`

----

## Usage
### Get element reference
`var collection = db.child('students');`

### Write data
To perform a database write there are 4 methods: set(), update(), transition() e push().
- set(): writes or overwrites data, used also to remove data
``` javascript
db.child('name').set('Andrea');
db.child('poets').set({
  BBrecht: {
    firstName: 'Bertolt',
    lastName: 'Brecht',
    age: 55
  },
  OWilde: {
    firstName: 'Oscar',
    lastName: 'Wilde',
    age 35
  }
});
db.child('poets/OWilde').set({});
```

- update(): updates data overwriting data nested in
``` javascript
db.child('poets').update({
  'BBrecht/firstname': 'B.',
  'OWilde/firstname': 'O.'
});
```

- push(): adds and object to a collection using an auto generated key
``` javascript
db.child('posts').push({
  author: 'BBrecht',
  text: 'Hello to everyone'
});
```

- transaction(): perform a database transaction, preventing race conditions
``` javascript
db.child('fixNumber').transaction(function(value){
  return (value || 0) + 1;
});
```


### Events
On every set / update an event will be fired letting the other clients to get updated data.

### Data read
Event handlers allow to receive updates from other clients using event handlers like `value, child_added, child_changed, child_removed or child_moved`. Every callback will receive a DataSnapshot object with a _snapshot_ of the situation at that time.
DataSnapshot can be inspected with `key() and val()` methods to gain key and value associated.

``` javascript
db.child('poets').on('value', function(snapshot){
  snapshot.forEach(function(poet){
    console.log("Key: " + poet.key() + " Value: " + poet.val());
  });
});
```
