.DEFAULT: help

define HELP

 Run "make bootstrap" first.

 Common tasks:

   bootstrap           Bootstrap the development environment
   help                Show this message

 Site tasks:

   site-dev            Run site development
   site-build          Build site
   site-start          Start site
   site-export         Export site
   site-publish        Publish site

 Other tasks:

   cosmos              Runs component playgroud which is useful when working on
                       React components in isolation

endef
export HELP

help:
	@echo "$$HELP"

bootstrap:
	@yarn

cosmos:
	@yarn cosmos

site-dev:
	@yarn --cwd site next dev --hostname 0.0.0.0

site-build site-start:
	@yarn --cwd site next $(@:site-%=%)

site-export: site-build
	@rm -rf site/out
	@yarn --cwd site next $(@:site-%=%)
	@echo andreypopp.com > site/out/CNAME
	@touch site/out/.nojekyll

site-publish: site-export
	@yarn --cwd site gh-pages \
		--repo git@github.com:andreypopp/andreypopp.github.io.git \
		--dist ./out \
		--branch master \
		--dotfiles
