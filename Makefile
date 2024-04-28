watch:
	dune build --watch ./main.exe
build:
	dune build ./main.exe
gen:
	rm -rf ./public && dune exec ./main.exe -- generate
pub:
	(cd public \
	&& git init .  \
	&& git remote add origin git@github.com:andreypopp/andreypopp.github.io.git \
	&& git add .  \
	&& git commit -m "update" \
	&& git push -f -u origin main)
serve:
	while true; do ls _build/default/main.exe blog/* | entr -d -r ./_build/default/main.exe serve; done
