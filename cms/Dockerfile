FROM directus/directus:9.23.1

WORKDIR /directus

COPY directus-config.js directus-config.js
COPY ./extensions /directus/extensions
COPY ./snapshots/snapshot.yaml /directus/snapshot.yaml

# necessary for node-vibrant
RUN npm install @jimp/custom @jimp/types @jimp/plugin-resize

ENV CONFIG_PATH="/directus/directus-config.js"
CMD npx directus bootstrap && npx directus schema apply --yes snapshot.yaml && npx directus start

EXPOSE 5000
