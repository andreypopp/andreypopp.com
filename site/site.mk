OUT = ./out
# DOMAIN = example.com
# GH_PAGES_REPO = git@github.com:example/example

dev:
	@yarn next dev --hostname 0.0.0.0

build start:
	@yarn next $(@)

export:
ifndef DOMAIN
	$(error "DOMAIN is not defined")
endif
	@$(MAKE) build
	@rm -rf $(OUT)
	@yarn next $(@)
	@echo $(DOMAIN) > $(OUT)/CNAME
	@touch $(OUT)/.nojekyll

publish:
ifndef GH_PAGES_REPO
	$(error "GH_PAGES_REPO is not defined")
endif
	@$(MAKE) export
	@yarn gh-pages \
		--repo $(GH_PAGES_REPO) \
		--dist $(OUT) \
		--branch master \
		--dotfiles

