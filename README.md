<!DOCTYPE html>
<html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
        <meta charset="utf-8" />
  </head>
<h1>Documentation</h1>This is the official documentation of the software used within this project.<div><br/>
<p><h2><b>(CREATING, UPDATING, DELETING) Inserting information into a Solid pod:</b></h2></p><p>To insert information, like adding a friend, into a Solid pod we first need the address of the resource we want to insert information into (In this case the address of the webId and the address of the friends webId, which we will insert): </p><div><pre>const bobsWebId = "https://bob.solid.community/profile/card#me"; //own pod
const alicesWebId = "https://alice.solid.community/profile/card#me"; //pod of our friend</pre>Then we need to get the graph of the pod in which we want to insert information: <br /><pre>const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store);</pre>Next, we build the SPARQL-Query that inserts information into our Pod:<br /><pre>addFriendQuery = "INSERT DATA { <" + bobsWebId  + "> <http: 0.1="" foaf="" knows="" xmlns.com=""> &lt;" + alicesWebId + "&gt;.}"<http: 0.1="" foaf="" knows="" xmlns.com="">
const options = {
  noMeta: true,
  contentType: "application/sparql-update",
  body: addFriendQuery
}</http:></http:></pre>Last, we send our request to the Solid pod:<br /><pre>fetcher.webOperation("PATCH", bobsWebId, options);<br /></http:></pre><p><http: 0.1="" foaf="" knows="" xmlns.com="">
<br/><h2><b>(READING) Getting information from a Solid pod:</b></h2></p>
<p>To read information from a Solid pod, you will again, need the address of the resource you want to read. After initializing the graph and loading the resource into it:</http:></p>
<pre>const person = "https://bob.solid.community/profile/card#me";
const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store);
await fetcher.load(person);</pre>
<p>Now we can query the graph using 3 different methods of querying:</p>
<li>.statementsMatching() will return an array of triples that match the requested pattern:
<pre>store.statementsMatching(undefined, FOAF("knows"), undefined);
//Will return an array of triples that have the predicate: FOAF("knows")</pre></li>
<li>.each() will return an array of nodes or edges (instead of the full triple) that match the requested pattern. It is only allowed to match for a pattern with one wildcard (wildcard = the part of the pattern that you leave as undefined) at most:</li>
<p><b>Note: </b>$rdf.sym(person) turns the address into the respective node on the graph</p>
<pre>store.each($rdf.sym(person), FOAF("knows"))
//Will return an array of objects that the subject ($rdf.sym(person)) is related to via FOAF("knows")</pre>
<li>.any() in comparison, will only return one node or edge that matches the requested pattern. Again, queries can only contain one wildcard at a time.</li>
<pre>store.any($rdf.sym(person), FOAF("knows"))
//Will return one object that the subject ($rdf.sym(person)) is related to via FOAF("knows")</pre>

<h2>Intro to Ontologies:</h2>
<p>The ontologies we use within our project define a standard way of referencing resources within the Semantic Web. They are useful because they allow data exchange between web applications using a shared vocabulary. An Instead of inventing vocabulary for our use, we can mostly use vocabularies or ontologies that already exist. If I would like to add a friend to my webId-profile I can use the FOAF ontology (Friend of a Friend) to build a triple:</p>
<pre>&lthttps://ludwigschubert.solid.community/profile/card#me> &lthttp://xmlns.com/foaf/0.1/knows> &lthttps://malte18.solid.community/profile/card#me>.</pre>
<p>Or an abbreviated version using a prefix:</p>
<pre>@prefix foaf: &lthttp://xmlns.com/foaf/0.1/knows>.
&lthttps://ludwigschubert.solid.community/profile/card#me> &ltfoaf:knows> &lthttps://malte18.solid.community/profile/card#me>.</pre>
<p>I could then insert this triple into my webId with SPARQL for example. There are thousands of ontologies out there for all kinds of different purposes. Here's a slightly more complex example using the ldp ontology (Linked Data Platform), that indicates where my inbox can be found:</p>
<pre>@prefix : &lt#>.
@prefix ldp: &lthttp://www.w3.org/ns/ldp#>.
@prefix inbox: &lt/inbox/>.
&lt:me> &ltldp:inbox> &ltinbox:>.</pre>

<h2>Intro to webID:</h2>
<p>A webId is:</p>
<li>A URI for a person:
  <p>For example: &lthttps://ludwigschubert.solid.community/profile/card#me></p>
</li>
<li>A document that holds information of a person (a Triplestore):</li>
<p>The profile that is created when registering for solid contains information about my name, where my storage, account or my inbox are: </p>
<b>Note:</b><p>The subject can be reused when writing triples by separating triples that reference the same subject with a semicolon.</p>
<pre>@prefix : &lt#>.
@prefix solid: %lthttp://www.w3.org/ns/solid/terms#>.
@prefix pro: &lt./>.
@prefix n0: &lthttp://xmlns.com/foaf/0.1/>.
@prefix schem: &lthttp://schema.org/>.
@prefix ldp: &lthttp://www.w3.org/ns/ldp#>.
@prefix inbox: &lt/inbox/>.
@prefix sp: &lthttp://www.w3.org/ns/pim/space#>.
@prefix lud: &lt/>.

pro:card a n0:PersonalProfileDocument; n0:maker :me; n0:primaryTopic :me.

:me
    a schem:Person, n0:Person;
    ldp:inbox inbox:;
    sp:preferencesFile &lt/settings/prefs.ttl>;
    sp:storage lud:;
    solid:account lud:;
    solid:privateTypeIndex &lt/settings/privateTypeIndex.ttl>;
    solid:publicTypeIndex &lt/settings/publicTypeIndex.ttl>;
    n0:name "Ludwig Schubert".
</pre>
<p>---------------------------------HAVE TO'S--------------------------------</p>
<p>+    Add .acl basic</p>
</html>
