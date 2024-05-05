type 'meta t = {
  id : string;
  title : string option;
  summary : string option;
  doc : Cmarkit.Doc.t;
  meta : 'meta;
}

val of_dir :
  make_meta:(string -> Yaml.value -> ('a, [< `Msg of string ]) result) ->
  init_meta:'a ->
  path:string ->
  string ->
  unit ->
  'a t Content.coll
