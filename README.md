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
<p>---------------------------------HAVE TO'S--------------------------------</p>
<p>+    Add basic intro to ontologies</p>
<p>+    Add webID basics</p>
<p>+    Add .acl basic</p>
</html>
