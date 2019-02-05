const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const VCARD = $rdf.Namespace("http://http://www.w3.org/2006/vcard/ns#");

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

  var email = store.any($rdf.sym(person), VCARD("hasEmail"));
  console.log(email)
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
  const person = $('#profile').val();
  const store = $rdf.graph();
  const fetcher = new $rdf.Fetcher(store);
  const updater = new $rdf.UpdateManager(store);

  let doc = $rdf.sym($("#profile").val());

  let ins = $rdf.st(person, FOAF("knows"), friend, doc);
  let del = [];
  updater.update(del, ins, (uri, ok, message) => {
    if (ok) console.log("Friend added");
    else alert(message);
  });
})

$("#editAge").click(async function editAge(){
  const person = $('#profile').val();
  const store = $rdf.graph();
  const fetcher = new $rdf.Fetcher(store);
  const updater = new $rdf.UpdateManager(store);
  let doc = $rdf.sym($("#profile").val());

  age = $("#age").val();

  let ins = $rdf.st(person, FOAF("age"), age, doc);
  let del = store.statementsMatching(person, FOAF("age"), null, doc);
  updater.update(del, ins, (uri, ok, message) => {
    if (ok) console.log("Age edited");
    else alert(message);
  });
})