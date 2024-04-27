(lang dune 3.11)
(name andreypopp_com)
(generate_opam_files false)
(source (github andreypopp/reactor))
(authors "Andrey Popp")
(maintainers "Andrey Popp")
(license MIT)

(dialect
 (name mlx)
 (implementation
  (extension mlx)
  (merlin_reader mlx)
  (format
   (run ocamlformat-mlx %{input-file}))
  (preprocess
   (run mlx-pp %{input-file}))))
