/**
 * Author : Bastian Bouchardon
 *          Axel Eyraud
 * Polytech Tours DII 5
 * Date : 13/12/2018
 */


//database reference
var db = firebase.database();
var auth = firebase.auth();

function addItemIntoBasket(name, price) {
  if (!auth.currentUser) {
    alert('please login before adding an item to your shopping cart');
    return;
  } else {
    db.ref('Clients/' + remChara(auth.currentUser.email) + "/Basket/" + name).set({
        price: price
    });
  }
}

function totalPrice() {

}

function remChara(string) {
  return string.replace(/[^a-zA-Z ]/g, "");
}

function toggleSignIn() {
    if (auth.currentUser) {
      // [START signout]
      auth.signOut();
      // [END signout]
    } else {

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
        //document.getElementById('auth_signin').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authwithemail]
    }
    //document.getElementById('auth_signin').disabled = true;
    $('#login-modal').modal('toggle');
  }

  /**
   * Handles the sign up button press.
   */
  function handleSignUp() {
    var email = $('#signUp_email').val();
    var password = $('#signUp_pass').val();
    var username = $('#signUp_name').val();
    var add = $('#signUp_add').val();
    var zip = $('#signUp_zip').val();
    var city = $('#signUp_city').val();
    var country = $('#signUp_country').val();

    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
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
     * initApp handles setting up UI event listeners and registering Firebase auth listeners:
     *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
     *    out, and that is where we update the UI.
     */
    function initApp() {
        // Listening for auth state changes.
        // [START authstatelistener]
        firebase.auth().onAuthStateChanged(function(user) {
            // [START_EXCLUDE silent]
            //document.getElementById('quickstart-verify-email').disabled = true;
            // [END_EXCLUDE]
            if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // [START_EXCLUDE]
            //document.getElementById('auth_signin-status').textContent = 'Signed in';
            //document.getElementById('auth_signin').textContent = 'Sign out';
            // document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            if (!emailVerified) {
                //document.getElementById('quickstart-verify-email').disabled = false;
            }
            // [END_EXCLUDE]
            } else {
            // User is signed out.
            // [START_EXCLUDE]
            // document.getElementById('auth_signin-status').textContent = 'Signed out';
            // document.getElementById('auth_signin').textContent = 'Sign in';
            // document.getElementById('quickstart-account-details').textContent = 'null';
            // [END_EXCLUDE]
            }
            // [START_EXCLUDE silent]
            // document.getElementById('auth_signin').disabled = false;
            // [END_EXCLUDE]
        });
        // [END authstatelistener]jk

        //document.getElementById('auth_signin').addEventListener('click', toggleSignIn, false);
        // document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
        // document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
        // document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
    }


  window.onload = function() {
    initApp();
  };