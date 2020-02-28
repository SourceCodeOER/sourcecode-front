FROM node:13-alpine

# Create app directory
WORKDIR /frontend

##################################
#        NEEDED TOOL(S)          #
##################################

# Needed tool to export ENV variables into a json file
RUN apk --no-cache add jq

##################################
#         BUILDING STEP          #
##################################

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied where available (npm@5+)
COPY package*.json ./

# For building, we need all the dependancies
RUN npm ci

# Bundle app sources
COPY . .

# Generate the project
RUN npm run build

##################################
#         RELEASE STEP           #
##################################

# For production, we need only production dependancies to be able to run the project
# npm ci will clean the inherited node_module ( if you forgot to put that in .dockerignore )
RUN npm ci --only=production

##################################
#      SET ENVIRONNEMENT         #
##################################

# Default port for docker
EXPOSE 3000
# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=3000

# start the app
CMD jq -n env > config/production.json && npm run prod
