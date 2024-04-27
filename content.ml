type 'v item = { id : string; value : 'v Lazy.t }
type 'a coll = { name : string; items : 'a item list }

let find id coll =
  List.find_opt coll.items ~f:(fun item -> String.equal id item.id)
