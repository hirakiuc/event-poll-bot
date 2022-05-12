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
.PHONY: cache

docs:
	deno doc -c ./deno.json ${SRCS}
.PHONY: docs

# NOTE: Use this task only for building your local container image.
build:
	docker build -t hirakiuc/event-poll-bot:latest --platform linux/amd64 .
.PHONY: build

# NOTE: Use this task only for running this app locally.
run:
	docker run --env-file ./env.list --platform linux/amd64 hirakiuc/event-poll-bot:latest
.PHONY: run
