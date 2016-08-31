(function (Firebase, $) {
  console.log('Hello, It\'s me...');
  var db = new Firebase('https://vivid-inferno-7636.firebaseio.com/');
  /* Data is not fetched until a read or write operation is invoked.
     Once it is retrieved, it stays cached locally until the last event listener is removed.
  */
  var test = db.child('test');
  console.log('Here\'s test: ' + test);

  var users = db.child('users');
  users.on('child_removed', function (snapshot) {
    console.log(snapshot.val());
  });
  users.set({
    'Iron Man': {
      firstname: 'Tony',
      lastname: 'Stark'
    },
    'Black Widow': {
      firstname: 'Natasha',
      lastname: 'Romanoff'
    }
  });

  users.update({
    'Iron Man/strength': '85',
    'Black Widow/strength': '75'
  }, function (error) {
    console.log((error) ? "Error on commit" : "Succesful commit");
  });

  var books = db.child('books').push();
  books.set({
    'title': 'Harry Potter and the secret chamber',
    'cost': '20'
  });

  var booksKey = books.push().key();
  console.log("Chiave: " + booksKey);

  users.child('Black Widow/likes').transaction(function (value) {
    return new Date().getTime();
  });
  // Remove item
  users.child('Black Widow').set({});

  var shelf = db.child('/shelf');
  shelf.set({
    book1: {
      title: 'Hunger Games',
      pages: 50,
      vote: 8,
      chapterTitles: {
        first: 'Chapter One',
        second: 'Chapter Two',
        group: 'A'
      }
    },
    book2: {
      title: 'Fight Club',
      pages: 150,
      vote: 5,
      chapterTitles: {
        first: 'Primo capitolo',
        second: 'Secondo capitolo',
        group: 'A'
      }
    },
    book3: {
      title: '50 sfumature',
      pages: 450,
      vote: 7,
      chapterTitles: {
        first: 'Premier chapitre',
        second: 'Seconde chapitre',
        group: 'B'
      }
    },
    book4: {
      title: 'Design patterns details',
      pages: 20,
      vote: 4,
      chapterTitles: {
        first: 'Lallalal',
        second: 'Secoundum asd',
        group: 'B'
      }
    }
  });

  books.on('value', function(snapshot){
    snapshot.forEach(function(value){
      console.log("here -> " + value.key() + " " + value.val());
    });
  });

  var usersList = $('#dataEntry > ul');
  shelf.on('child_changed', function (snapshot) {
    var html = '<li>' + snapshot.key() + '<ol>';

    snapshot.forEach(function (data) {
      html += '<li>' + data.key() + ' -> ' + data.val() + '</li>'
    });
    html += '</ol></li>';
    usersList.append(html);
  });

  shelf.update({
    'book1/title': 'test',
    'book2/title': 'another one..'
  });

  shelf.orderByChild('title').equalTo('test').on('child_added', function (snapshot) {
    console.log("Titles': " + snapshot.val().title);
  });
  shelf.orderByChild('pages').startAt(100).on('value', function (snapshot) {
    snapshot.forEach(function (snapshot) {
      console.log("Pages number: " + snapshot.val().pages + " - are more than 100? " + (snapshot.val().pages >= 100));
    });
    // console.log("Pages number: " + snapshot.val().pages +  " - are less than 100? "  + (snapshot.val().pages <= 100));
  });

  db.child('groups').set({
    A: {
      members: 250
    },
    B: {
      members: 100
    }
  });

  shelf.orderByChild('chapterTitles/group').equalTo('B').on('value', function (snapshot) {
    snapshot.forEach(function (snapshot) {
      console.log("Title: " + snapshot.val().title);
    });
    db.child('groups').orderByKey().equalTo('B').once('value', function (snapshot) {
      console.log("Group members: " + snapshot.val().B.members);
    });
  });

  var names = db.child('names');
  names.set({});
  // names.push({name: 'Valentina'});
  // names.push({name: 'Andrea'});
  // names.push({name: 'Enrico'});
  // names.orderByChild('name').on('value', function(snapshot){
  //   snapshot.forEach(function(data){
  //     console.log('Name: ' + data.val().name);
  //   });
  // });

  // var i = 0;
  // var usersList = $('#dataEntry > ul');
  // users = db.child('users');
  // while(i < users.length) {
  //   usersList.appendChild('<li>' + i + ' - ' + users[i].name + '</li>');
  //   i++;
  // }

  // Auth
  // db.createUser({
  //   email: 'prova-2@yopmail.com',
  //   password: 'test1234'
  // }, function(error, data){
  //   if(error) {
  //     console.log('Error on registration' + error);
  //   } else {
  //     console.log('Registration OK!');
  //   }
  // });

  // db.authWithPassword({
  //   email: "*******@yopmail.com",
  //   password: "********"
  // }, function(errorData, authData){
  //   if(errorData) {
  //     console.log("Auth failed .. " + errorData);
  //   } else {
  //     console.log("Auth OK");
  //     console.log(
  //       "Uid: " + authData.uid + "\n" +
  //       "Provider: " + authData.provider + "\n" +
  //       "Token: " + authData.token + "\n" +
  //       "Expires: " + new Date(authData.expires * 1000) + "\n" +
  //       "Mail: " + authData.password.email + "\n" +
  //       "Avatar: " + authData.password.profileImageURL + "\n"
  //     );
  //   }
  // });

  $('button.login-btn').on('click', function (event) {
    event.preventDefault();
    var $form = $('#userAuth .login-form');
    var username = $form.find('#username').val();
    var password = $form.find('#password').val();

    if (username.length > 0 && password.length > 0) {
      // Fire login
      db.authWithPassword({
        email: username,
        password: password
      }, function (error, data) {
        var result = $('.auth-result');
        result.removeClass('success').removeClass('fail');
        if (error) {
          switch (error.code) {
          case "INVALID_EMAIL":
            result.html("The email is invalid");
            break;
          case "INVALID_PASSWORD":
            result.html("The password is incorrect");
            break;
          case "INVALID_USER":
            result.html("The user is does not exist");
            break;
          default:
            result.html("Auth failed");
          }
          result.addClass('fail');
        } else {
          result.addClass('success');
          result.html('Logged in!');
          $(event.currentTarget).hide();
          $('button.logout-btn').show();

          var uid = data.uid;
          db.child('authWithPassword/' + uid).set({
            uid: 'userId: ' + uid
          }, function (error) {
            console.log((error) ? 'No write permissions' : 'Write ok!');
          });
        }
      });
    } else {
      alert('Username and/or password are empty');
    }
  });

  $('button.logout-btn').on('click', function (event) {
    event.preventDefault();

    db.unauth();
    $(event.currentTarget).hide();
    $('button.login-btn').show();
    $('.auth-result').html('');
  });

  db.child('.info/connected').on("value", function (snap) {
    console.log((snap.val() === true) ? 'Client connected' : 'Client disconnected');
  });

})(Firebase, jQuery);
