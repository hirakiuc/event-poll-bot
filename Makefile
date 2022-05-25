DIRS := . ${shell find ./src -type d}
SRCS := $(foreach dir, $(DIRS), $(wildcard $(dir)/*.ts))

.PHONY: types, fmt, lint, check, cache, docs, build, run, run-webhook

types: cache
	deno check -c ./deno.json ${SRCS}

fmt:
	deno fmt --check -c ./deno.json ${SRCS}

lint:
	deno lint -c ./deno.json ${SRCS}

check: fmt lint types

cache:
	deno cache -c ./deno.json ${SRCS}

docs:
	deno doc -c ./deno.json ${SRCS}

# NOTE: Use this task only for building your local container image.
build:
	docker build -t hirakiuc/event-poll-bot:latest --platform linux/amd64 .

# NOTE: Use this task only for running this app locally.
run:
	docker run --env-file ./env.list --platform linux/amd64 hirakiuc/event-poll-bot:latest

run-webhook:
	deno run --allow-net --allow-env webhook.ts
