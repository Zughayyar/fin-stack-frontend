# Multi-stage build for Angular application
# Stage 1: Build the Angular application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files from web directory
COPY web/package.json web/pnpm-lock.yaml web/pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build argument for API URL (provided by build-web.sh)
ARG FRONTEND_API_URL

# Copy source code from web directory
COPY web/ .

# Set environment variable from build arg so it's available to the build process
ENV FRONTEND_API_URL=$FRONTEND_API_URL

# Replace the API URL placeholder in the config file before building
RUN sed -i "s|FRONTEND_API_URL_PLACEHOLDER|$FRONTEND_API_URL|g" src/app/config/app.config.ts

# Build the application for production
RUN pnpm run build --configuration=production

# Stage 2: Serve with nginx
FROM nginx:alpine AS runtime

# Copy custom nginx config from web directory
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage (Angular 19+ outputs to browser subdirectory)
COPY --from=builder /app/dist/fin-stack-web/browser /usr/share/nginx/html

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 