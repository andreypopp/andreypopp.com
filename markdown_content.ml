type 'meta t = {
  id : string;
  title : string option;
  summary : string option;
  doc : Cmarkit.Doc.t;
  meta : 'meta;
}

let read_meta ic =
  let rec loop state =
    let line = In_channel.input_line ic in
    let line = Option.map String.trim line in
    match line, state with
    | None, _ -> state
    | Some "---", `start -> loop (`meta [])
    | Some "---", `meta meta -> `meta meta
    | Some line, `meta meta -> loop (`meta (line :: meta))
    | Some _, _ -> `start
  in
  match loop `start with
  | `start -> None
  | `meta meta -> (
      let meta = String.concat ~sep:"\n" (List.rev meta) in
      let meta = String.trim meta in
      match meta with
      | "" -> Some (`O [])
      | meta ->
          let yaml = Yaml.of_string_exn meta in
          Some yaml)

let read_content ic =
  let rec loop state =
    let line = In_channel.input_line ic in
    match line, state with
    | None, _ -> state
    | Some "---", `start -> loop `meta
    | Some "---", `meta -> loop (`content [])
    | Some _, `meta -> loop `meta
    | Some line, `start -> loop (`content [ line ])
    | Some line, `content content -> loop (`content (line :: content))
  in
  match loop `start with
  | `start | `meta -> None
  | `content meta -> Some (String.concat ~sep:"\n" (List.rev meta))

let extract_title_summary doc =
  let open Cmarkit in
  let h1 = ref None in
  let summary = ref None in
  let inline_to_text inline =
    let concat = String.concat ~sep:"" in
    Inline.to_plain_text ~break_on_soft:false inline |> fun r ->
    concat (List.map ~f:concat r)
  in
  let block _mapper = function
    | Block.Heading (h, _meta)
      when Block.Heading.level h = 1 && Option.is_none !h1 ->
        let text = Block.Heading.inline h in
        h1 := Some (inline_to_text text);
        Mapper.delete
    | Block.Paragraph (p, _meta) 
      when Option.is_none !summary ->
        let text = Block.Paragraph.inline p in
        summary := Some (inline_to_text text);
        Mapper.default
    | _ -> Mapper.default
  in
  let mapper = Mapper.make ~block () in
  let doc = Mapper.map_doc mapper doc in
  !h1, !summary, doc

let of_dir ~make_meta ~init_meta ~path name () =
  let files = Sys.readdir path in
  let items =
    Array.to_list files
    |> List.filter_map ~f:(fun file ->
           match String.suffix ~suf:".md" file with
           | false -> None
           | true ->
               let path = Filename.concat path file in
               let meta =
                 match In_channel.with_open_bin path read_meta with
                 | None -> init_meta
                 | Some yaml -> (
                     match make_meta path yaml with
                     | Ok meta -> meta
                     | Error (`Msg msg) ->
                         print_endline
                           (Printf.sprintf "error parsing %s: %s" path msg);
                         init_meta)
               in
               let id = Filename.chop_suffix file ".md" in
               let value =
                 lazy
                   (let data =
                      In_channel.with_open_bin path read_content
                    in
                    let data = Option.value ~default:"" data in
                    let doc = Cmarkit.Doc.of_string ~layout:true ~strict:false data in
                    let title, summary, doc = extract_title_summary doc in
                    { id; title; doc; summary; meta })
               in
               Some { Content.value; id })
  in
  { Content.name; items }
