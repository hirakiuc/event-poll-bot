# https://github.com/denoland/deno_docker
FROM denoland/deno:alpine

# The port that this app listens to.
EXPOSE 8080

USER deno

WORKDIR /app

# Cache the dependencies as a layer (the following 2 steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY deps.ts .
RUN deno cache deps.ts

# These steps will be re-run upon each file change in the working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache mod.ts

CMD ["run", "--allow-net", "--allow-env", "--allow-run", "mod.ts"]
