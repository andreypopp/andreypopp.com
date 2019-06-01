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

site-dev site-build site-start:
	@yarn --cwd site next $(@:site-%=%)
