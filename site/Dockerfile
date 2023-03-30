FROM node:18-alpine

ARG VITE_CMS
ARG VITE_AUTH_TOKEN

ENV NODE_ENV=production
ENV PORT=5000
ENV VITE_CMS=${VITE_CMS}
ENV VITE_AUTH_TOKEN=${VITE_AUTH_TOKEN}

WORKDIR /app

COPY ./ ./

RUN npm install --production=false
RUN npm run build

CMD [ "node", "build/index.js" ]

EXPOSE 5000