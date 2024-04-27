type entry

val entry :
  id:string ->
  title:string ->
  summary:string ->
  href:string ->
  updated:string ->
  entry

type feed

val feed :
  id:string ->
  title:string ->
  subtitle:string ->
  href:string ->
  updated:string ->
  author:string ->
  entry list ->
  feed

val render : feed -> string
