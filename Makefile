.PHONY: all

GIT_TAG=$(shell git describe --always --tag)

all: chrome

chrome:
	BROWSER=chrome NODE_ENV=production webpack
	mkdir -p dist/chrome
	(cd build/chrome && zip -r ../../dist/chrome/TwitterMuter_$(GIT_TAG).zip .)

