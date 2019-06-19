OUT = ./out

dev:
	@yarn next dev --hostname 0.0.0.0

build start:
	@yarn next $(@)

export: build
	@rm -rf $(OUT)
	@yarn next $(@)
	@echo andreypopp.com > $(OUT)/CNAME
	@touch $(OUT)/.nojekyll

publish: export
	@yarn gh-pages \
		--repo git@github.com:andreypopp/andreypopp.github.io.git \
		--dist $(OUT) \
		--branch master \
		--dotfiles
