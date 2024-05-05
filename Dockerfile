ARG BUN_VERSION=1.1.7
FROM oven/bun:${BUN_VERSION} as base

# Set up the working directory
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# Create a build stage
FROM base as build

# Install necessary system packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --link bun.lockb package.json ./
RUN bun install 

RUN bun run build

RUN find . -mindepth 1 ! -regex '^./build\(/.*\)?' -delete

FROM base

COPY --from=build /app /app

EXPOSE 3000

CMD [ "bun", "run", "start" ]
