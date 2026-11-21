FROM node:24-alpine
WORKDIR /app
COPY server.mjs ./
COPY static ./static
USER node
ENV NODE_ENV=production PORT=8080 NODE_OPTIONS=--max-old-space-size=24
EXPOSE 8080
CMD ["node", "server.mjs"]
