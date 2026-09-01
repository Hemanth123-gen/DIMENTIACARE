# ==============================================================================
# STAGE 1: Build pinned whisper.cpp v1.5.4 native Linux binary
# ==============================================================================
FROM ubuntu:22.04 AS whisper-builder

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Clone pinned whisper.cpp release v1.5.4
WORKDIR /whisper-src
RUN git clone -b v1.5.4 --single-branch https://github.com/ggerganov/whisper.cpp.git .

# Build whisper-cli / main binary
RUN cmake -B build && cmake --build build --config Release

# Verify compiled Linux executable
RUN if [ -f "/whisper-src/build/bin/whisper-cli" ]; then \
        /whisper-src/build/bin/whisper-cli --help > /dev/null; \
    elif [ -f "/whisper-src/build/bin/main" ]; then \
        /whisper-src/build/bin/main --help > /dev/null; \
    else \
        echo "Error: Neither whisper-cli nor main executable found after build"; exit 1; \
    fi

# ==============================================================================
# STAGE 2: Node.js application builder (installs devDependencies for compilation)
# ==============================================================================
FROM node:20-slim AS app-builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy package files for both root and backend
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install ALL dependencies (including devDependencies like typescript & vite)
RUN npm ci && npm ci --prefix backend

# Copy full application source
COPY . .

# Copy compiled Linux whisper binary from STAGE 1
COPY --from=whisper-builder /whisper-src/build/bin/ /app/whisper-bin/
RUN mkdir -p /app/backend/models/whisper && \
    if [ -f "/app/whisper-bin/whisper-cli" ]; then \
        cp /app/whisper-bin/whisper-cli /app/backend/models/whisper/whisper-cli; \
    elif [ -f "/app/whisper-bin/main" ]; then \
        cp /app/whisper-bin/main /app/backend/models/whisper/whisper-cli; \
    fi && \
    chmod +x /app/backend/models/whisper/whisper-cli && \
    rm -rf /app/whisper-bin

# Verify Git LFS ggml-tiny.bin model size inside builder
RUN MODEL_PATH="/app/backend/models/whisper/ggml-tiny.bin" && \
    if [ -f "$MODEL_PATH" ]; then \
        FILE_SIZE=$(wc -c < "$MODEL_PATH"); \
        echo "[Docker Build] ggml-tiny.bin size: ${FILE_SIZE} bytes"; \
        if [ "$FILE_SIZE" -lt 1000000 ]; then \
            echo "[Docker Build] LFS pointer detected (${FILE_SIZE} bytes). Fetching full ggml-tiny.bin model..."; \
            curl -L -o "$MODEL_PATH" "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin"; \
        fi \
    else \
        echo "[Docker Build] Downloading ggml-tiny.bin model..."; \
        mkdir -p /app/backend/models/whisper && \
        curl -L -o "$MODEL_PATH" "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin"; \
    fi

# Build React frontend & Express backend (tsc and vite are available!)
RUN npm run build

# ==============================================================================
# STAGE 3: Minimal production runner
# ==============================================================================
FROM node:20-slim AS runner

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5000

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install production dependencies only
RUN npm ci --omit=dev && npm ci --prefix backend --omit=dev

# Copy compiled build artifacts from STAGE 2
COPY --from=app-builder /app/dist ./dist
COPY --from=app-builder /app/backend/dist ./backend/dist
COPY --from=app-builder /app/backend/models ./backend/models

# Ensure Linux whisper executable is executable in final image
RUN chmod +x /app/backend/models/whisper/whisper-cli

EXPOSE 5000

CMD ["npm", "run", "start"]
