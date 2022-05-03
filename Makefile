DIRS := . ${shell find ./src -type d}
SRCS := $(foreach dir, $(DIRS), $(wildcard $(dir)/*.ts))

types: cache
	deno check -c ./deno.json ${SRCS}
.PHONY: types

fmt:
	deno fmt --check -c ./deno.json ${SRCS}
.PHONY: fmt

lint:
	deno lint -c ./deno.json ${SRCS}
.PHONY: lint

cache:
	deno cache -c ./deno.json ${SRCS}

run:
	deno run --allow-net mod.ts
.PHONY: run
