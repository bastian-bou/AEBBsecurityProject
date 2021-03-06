/**
 * Author : Bastian Bouchardon
 *          Axel Eyraud
 * Polytech Tours DII 5
 * Date : 13/12/2018
 */


//firebase references
var db = firebase.database(); //realtime database on firebase
var auth = firebase.auth();   //authentication on firebase

/**
 * Function to add item in database
 * @param {String} id - id of the item for the database
 * @param {int} price - price of this item
 * @param {String} name - name of the vinyle or the record player
 */
function addItemIntoBasket(id, price, name) {
  if (!auth.currentUser) {
    alert('please login before adding an item to your shopping cart');
    return;
  } else {
    db.ref('Clients/' + remChara(auth.currentUser.email)).once('value').then(function(snapshot){
      if(snapshot.child("Basket/" + id).exists()) {
        db.ref('Clients/' + remChara(auth.currentUser.email) + "/Basket/" + id).update({quantity: snapshot.child("Basket/" + id).val().quantity + 1});
      } else {
        db.ref('Clients/' + remChara(auth.currentUser.email) + "/Basket/" + id).set({
          price: price,
          name: name,
          quantity: 1
        });
      }
    });
  }
}

function totalPrice() {

}
/**
 * Reduce email, remove [@,.,1, 2, 3, ...]
 * @param {String} string - email to reduce
 */
function remChara(string) {
  return string.replace(/[^a-zA-Z ]/g, "");
}

/**
 * When you click on sign in, to connect or disconnect
 */
function toggleSignIn() {
    if (auth.currentUser) {
      // [START signout]
      db.ref('Clients/' + remChara(auth.currentUser.email)).once('value').then(function(snapshot){
        alert('Bye ' + snapshot.val().name + '! See you soon :)');
        auth.signOut();
      });
      return;
      // [END signout]
    } else {
      //Test email and password
      var email = $('#email_login').val();
      var password = $('#pass_login').val();

      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START authwithemail]
      auth.signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(errorCode + " : " + errorMessage);
        
        // [END_EXCLUDE]
      });
      //close the modal
      $('#login-modal').modal('toggle');
    }
  }

  /**
   * Handles the sign up button press.
   */
  function handleSignUp() {
    $('.signup-help').html('');
    //get all the values
    var email = $('#signUp_email').val();
    var password = $('#signUp_pass').val();
    var username = $('#signUp_name').val();
    var add = $('#signUp_add').val();
    var zip = $('#signUp_zip').val();
    var city = $('#signUp_city').val();
    var country = $('#signUp_country').val();
    //Test all the values
    if(username == '') {
      $('.signup-help').html("<p>Add a user name please.</p>");
      return;
    }
    if (email.length < 4 || email.search("@") == -1) {
      $('.signup-help').html("<p>Add a valid email please.</p>");
      return;
    }
    if (password.length < 4) {
      $('.signup-help').html("<p>Add a valid password please.</p>");
      return;
    }
    if(add == '') {
      $('.signup-help').html("<p>Add a street please.</p>");
      return;
    }
    if(zip == '' || zip.search(/[^a-zA-Z ]/g)) {
      $('.signup-help').html("<p>Add a valid zip code please.</p>");
      return;
    }
    if(city == '') {
      $('.signup-help').html("<p>Add a city please.</p>");
      return;
    }
    if(country == '') {
      $('.signup-help').html("<p>Add a country please.</p>");
      return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      // [END_EXCLUDE]
    });
    //connect on the website with the new account
    auth.signInWithEmailAndPassword(email, password).catch(function(error) {});
    db.ref('Clients/' + remChara(email)).set({
      name: username,
      address: add,
      zip: zip,
      city: city,
      country: country
    });

    // [END createwithemail]
    $('#sign-in').modal('toggle');
  }

  /**
   * Sends an email verification to the user.
   */
  function sendEmailVerification() {
    // [START sendemailverification]
    auth.currentUser.sendEmailVerification().then(function() {
      // Email Verification sent!
      // [START_EXCLUDE]
      alert('Email Verification Sent!');
      // [END_EXCLUDE]
    });
    // [END sendemailverification]
  }
  /**
   * Send password reset email
   */
  function sendPasswordReset() {
    var email = $('#email_login').val();
    // [START sendpasswordemail]
    auth.sendPasswordResetEmail(email).then(function() {
      // Password Reset Email Sent!
      // [START_EXCLUDE]
      alert('Password Reset Email Sent!');
      $('#login-modal').modal('toggle');
      // [END_EXCLUDE]
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/invalid-email') {
        alert(errorMessage);
      } else if (errorCode == 'auth/user-not-found') {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
  }
  /**
   * Function to add 1 quantity of the item in param
   * @param {String} id - id of the item
   */
  function addQuantity(id) {
    db.ref('Clients/' + remChara(auth.currentUser.email)).once('value').then(function(snapshot){
      var quant = snapshot.child('Basket/' + id).val().quantity + 1;
      db.ref('Clients/' + remChara(auth.currentUser.email) + "/Basket/" + id).update({quantity: quant});
    });
  }
  /**
   * Function to remove 1 quantity of the item in param
   * @param {String} id - id of the item
   */
  function removeQuantity(id) {
    db.ref('Clients/' + remChara(auth.currentUser.email)).once('value').then(function(snapshot){
      var quantity = snapshot.child('Basket/' + id).val().quantity;
      if(quantity == 1) {
        db.ref('Clients/' + remChara(auth.currentUser.email) + "/Basket/" + id).remove();
      } else {
        db.ref('Clients/' + remChara(auth.currentUser.email) + "/Basket/" + id).update({quantity: quantity - 1});
      }
    });
  }
  /**
   * Function listener on modification in basket
   * @param {Object} starCountRef - User branch in database
   */
  function eventBasket(starCountRef) {
    starCountRef.on('value', function(snapshot) {
      if(snapshot.child("Basket").exists()) {
        $('.modal-body').html(`
        <article class ="ArticleTitre">
          <div class = "row">
              <div class="col-sm-3 text-center">Article name</div>
              <div class="col-sm-3 text-center">Quantity</div>  
              <div class="col-sm-3 text-center">Add</div>
              <div class="col-sm-3 text-center">Delete</div>
          </div>
        </article>`);
        //for each item in the basket
        snapshot.child("Basket").forEach(function(childSnapshot) {
          $('.modal-body').append(`
            <article class ="ArticleArticle">
              <div class = "row">
                  <div class="col-sm-3">` + childSnapshot.val().name + `</div>
                  <div class="col-sm-3">` + childSnapshot.val().quantity + `</div>  
                  <div class="col-sm-3 text-center"><a href="" onclick="addQuantity('` + childSnapshot.key + `');"><img src="img/ModalBasket/Add.png" alt="Basket" width="10%" height="10%" /></div>
                  <div class="col-sm-3 text-center"><a href="" onclick="removeQuantity('` + childSnapshot.key + `');"><img src="img/ModalBasket/Delete.jpg" alt="Basket" width="10%" height="10%" /></div>
              </div>
            </article>
          `);
        });
      }
    });
  }


  /**
   * initApp handles setting up UI event listeners and registering Firebase auth listeners:
   *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
   *    out, and that is where we update the UI.
  */
  function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    auth.onAuthStateChanged(function(user) {
        
        if (user) {
          // User is signed in.

          $('#logoutButton').prop("disabled",false);
          //event listener on basket
          eventBasket(db.ref('Clients/' + remChara(user.email)));
        
          /*if (!emailVerified) {
              //document.getElementById('quickstart-verify-email').disabled = false;
          }*/

        } else {
          // User is signed out.
          $('#logoutButton').prop("disabled",true);
          //clear the basket 
          $('.modal-body').html(`
            <article class ="ArticleTitre">
              <div class = "row">
                  <div class="col-sm-3 text-center">Article name</div>
                  <div class="col-sm-3 text-center">Quantity</div>  
                  <div class="col-sm-3 text-center">Add</div>
                  <div class="col-sm-3 text-center">Delete</div>
              </div>
            </article>`);
      
        }
    });
  }

  window.onload = function() {
    initApp();
  };