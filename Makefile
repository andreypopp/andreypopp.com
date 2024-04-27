watch:
	dune build --watch ./main.exe
build:
	dune build ./main.exe
gen:
	dune exec ./main.exe -- generate
serve:
	while true; do ls _build/default/main.exe blog/* | entr -d -r ./_build/default/main.exe serve; done
