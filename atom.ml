open ContainersLabels

type entry = {
  id : string;
  title : string;
  summary : string;
  href : string;
  updated : string;
}

let entry ~id ~title ~summary ~href ~updated =
  { id; title; summary; href; updated }

type feed = {
  id : string;
  title : string;
  subtitle : string;
  author : string;
  href : string;
  updated : string;
  entries : entry list;
}

let feed ~id ~title ~subtitle ~href ~updated ~author entries =
  { id; title; subtitle; author; href; updated; entries }

(* Import the Xml-light library *)
open Xml

(* Function to create a simple XML element with text content, with switched parameter order *)
let el tag attributes content =
  Element (tag, attributes, [ PCData content ])

let el' tag attributes children = Element (tag, attributes, children)

let render feed =
  let feed =
    el' "feed"
      [ "xmlns", "http://www.w3.org/2005/Atom" ]
      ([
         el "title" [] feed.title;
         el "subtitle" [] feed.subtitle;
         el "link" [ "href", feed.href; "rel", "self" ] "";
         el "updated" [] feed.updated;
         el' "author" [] [ el "name" [] feed.author ];
         el "id" [] feed.id;
       ]
      @ List.map feed.entries ~f:(fun (entry : entry) ->
            el' "entry" []
              [
                el "title" [] entry.title;
                el "link" [ "href", entry.href ] "";
                el "id" [] entry.id;
                el "updated" [] entry.updated;
                el "summary" [] entry.summary;
              ]))
  in

  Xml.to_string_fmt feed
