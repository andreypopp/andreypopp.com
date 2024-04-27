watch:
	dune build --watch ./main.exe
gen:
	dune exec ./main.exe -- generate
serve:
	ls _build/default/main.exe blog/* | entr -r ./_build/default/main.exe serve
