const FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const VCARD = new $rdf.Namespace("http://www.w3.org/2006/vcard/ns#");

var sessionDict = {};

// Log the user in and out on click
const popupUri = 'popup.html';
$('#login  button').click(() => solid.auth.popupLogin({ popupUri }));
$('#logout button').click(() => solid.auth.logout());

// Update components to match the user's login status
solid.auth.trackSession(session => {
  const loggedIn = !!session;
  $('#login').toggle(!loggedIn);
  $('#logout').toggle(loggedIn);
  if (loggedIn) {
    $('#user').text(session.webId);
    // Use the user's WebID as default profile
    console.log(session)
    sessionDict = session
    if (!$('#profile').val())
      $('#profile').val(session.webId);
  }
});

$('#view').click(async function loadProfile() {
  // Set up a local data store and associated data fetcher
  const store = $rdf.graph();
  const fetcher = new $rdf.Fetcher(store);

  // Load the person's data into the store
  const person = $('#profile').val();
  await fetcher.load(person);

  // Display their details
  const fullName = store.any($rdf.sym(person), FOAF('name'));
  console.log(store.any($rdf.sym(person), null, null, $rdf.sym(person).doc()).value);

  $('#fullName').text(fullName && fullName.value);

  // Display their friends
  const friends = store.each($rdf.sym(person), FOAF('knows'));
  $('#friends').empty();
  friends.forEach(async (friend) => {
    await fetcher.load(friend);
    const fullName = store.any(friend, FOAF('name'));
    $('#friends').append(
      $('<li>').append(
        $('<a>').text(fullName && fullName.value || friend.value)
                .click(() => $('#profile').val(friend.value))
                .click(loadProfile)));
  });

  getEmailAccounts(person);
});

$("#checkForUser").click(async function(){
  var xhr = new XMLHttpRequest();
  var url = $("#profile").val();

  xhr.onreadystatechange = () => {
    if( xhr.responseType == XMLHttpRequest.DONE) {
      if (xhr.status == 200) {
        console.log("Account has already been created");
      } else {
        console.log("Account is still available!");
      }
    }
  }

  xhr.open("HEAD", url);
  xhr.send();
});

$("#submitUser").click(function (){
  var username = $("#username").val();
  $("#newUserForm").attr("action", "https://" + username + ".solid.community/")
});

$("#addFriend").click(async function addFriend(){
  const friendURI = $("#friend").val();
  const personURI = $('#profile').val();

  const store = $rdf.graph();
  const fetcher = new $rdf.Fetcher(store);

  addFriendQuery = "INSERT DATA { <" + personURI  + "> <http://xmlns.com/foaf/0.1/knows> <" + friendURI + ">.}"
  console.log(addFriendQuery);
  const options = {
    noMeta: true,
    contentType: "application/sparql-update",
    body: addFriendQuery
  }

  fetcher.webOperation("PATCH", personURI, options);
})

function deleteEmail(emailId){
  const store = $rdf.graph();
  const fetcher = new $rdf.Fetcher(store);

  const profileURI = $("#profile").val();

  const url = "https://ludwigschubert.solid.community/profile/card";
  const query = "DELETE DATA { <" + profileURI  + "> <http://www.w3.org/2006/vcard/ns#hasEmail>  <https://ludwigschubert.solid.community/profile/card#" + emailId + ">.}"
  console.log(query)
  const options = {
    noMeta: true,
    contentType: "application/sparql-update",
    body: query
  }

  store.fetcher.webOperation("PATCH", url, options)
};

function getEmailAccounts(url){
  const store = $rdf.graph();
  const fetcher = new $rdf.Fetcher(store);

  let me = store.sym(url);
  let profile = me.doc();
  var emails = [];

  $("#email").empty();
  fetcher.load(profile).then(response => {
    store.each(me, VCARD("hasEmail")).forEach((emailId) => {
      var email = {}
      emailId = emailId.value;
      email["id"] = emailId.split("#")[1]
      store.each($rdf.sym(emailId), VCARD("value")).forEach((emailAddress) => {
        emailAddress = emailAddress.value;
        emailAddress = emailAddress.split(":")[1];
        email["email"] = emailAddress;
      })
      emails.push(email);
      $("#email").append(
        $("<li>").append(
          email.email + "<button id='" + email.id  + "' onclick='deleteEmail(\"" + email.id + "\")'>Delete</button>"
        ))
    });
    console.log(emails);
  });
};

$("#setProfilePic").click(async function setProfilePic(){
  var filePath = $("#profilePic").val();
  console.log(filePath);
  filePath = filePath.split("\\")[2];
  console.log(filePath);
  /*
  const friendURI = $("#friend").val();
  const personURI = $('#profile').val();

  const store = $rdf.graph();
  const fetcher = new $rdf.Fetcher(store);

  addFriendQuery = "INSERT DATA { <" + personURI  + "> <http://xmlns.com/foaf/0.1/knows> <" + friendURI + ">.}"
  console.log(addFriendQuery);
  const options = {
    noMeta: true,
    contentType: "application/sparql-update",
    body: addFriendQuery
  }

  fetcher.webOperation("PATCH", personURI, options);*/
});

$("#setEmail").click(async function setEmail(){
  const store = $rdf.graph();
  const fetcher = new $rdf.Fetcher(store);
  const updater = new $rdf.UpdateManager(store);

  const url = "https://ludwigschubert.solid.community/profile/card";

  //set the email according to its value:
  const newEmail = $('#email').val()
  const setEmailQuery = "INSERT DATA { <https://ludwigschubert.solid.community/profile/card#id1545410066782> <http://www.w3.org/2006/vcard/ns#value> <mailto:" + newEmail  + ".}"

  //link the email on the profile:
  const linkEmailQuery = "INSERT DATA { <https://ludwigschubert.solid.community/profile/card#me> <http://www.w3.org/2006/vcard/ns#hasEmail> <https://ludwigschubert.solid.community/profile/card#id1545410066782> .}"

  var options = {
    noMeta: true,
    contentType: "application/sparql-update",
    body: setEmailQuery
  }

  //send request
  store.fetcher.webOperation("PATCH", url, options)

  options = {
    noMeta: true,
    contentType: "application/sparql-update",
    body: linkEmailQuery
  }

  //send request
  store.fetcher.webOperation("PATCH", url, options)
})
