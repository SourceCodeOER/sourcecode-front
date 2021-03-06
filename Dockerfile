################################################
#                 BUILD                        #
################################################

FROM node:12-alpine AS Build

# Create app directory
WORKDIR /frontend

# Install app dependencies ( everything )
# A wildcard is used to ensure both package.json AND package-lock.json are copied where available (npm@5+)
COPY package*.json ./
RUN npm ci --no-optional

# copy every file
COPY . .

# Build everything
RUN npm run build


################################################
#                 PRODUCTION                   #
################################################

FROM node:12-alpine AS Package

# Create app directory
WORKDIR /frontend

# Needed tool to export ENV variables into a json file
RUN apk --no-cache add jq

# Copy generated files from build
COPY --from=Build /frontend ./
COPY package*.json ./

# TODO Only Install production dependancies (later)
#RUN npm ci --only=production
RUN npm ci --no-optional

# Removes unnecessary files/folders in node modules
# Files
RUN find "$(pwd)/node_modules" -type f \( \
    -name "*.ts" -o \
    -name "*.md" -o \
    -name "*.swp" -o \
    -name "*.tgz" -o \
    -name ".npm*" -o \
    -name "LICENSE" -o \
    -name "AUTHORS" -o \
    -name "CONTRIBUTORS" -o \
    -name "CHANGES" -o \
    -name ".DS_Store" -o \
    -name ".babelrc" -o \
    -name "jest.config.js" -o \
    -name "tslint.json" -o \
    -name "eslint" -o \
    -name ".eslintrc.js" -o \
    -name ".eslintrc.json" -o \
    -name ".eslintrc.yml" -o \
    -name ".prettierrc*" -o \
    -name ".travis.yml" -o \
    -name ".gitlab-ci.yml" -o \
    -name "appveyor.yml" -o \
    -name ".coveralls.yml" \
\) -exec rm -f {} \;

# Folders
RUN find "$(pwd)/node_modules" -type d \( \
    -name "docs" -o \
    -name "doc" -o \
    -name "tests" -o \
    -name "test" -o \
    -name "__tests__" -o \
    -name "example" -o \
    -name "examples" -o \
    -name ".nyc_output" -o \
    -name ".idea" -o \
    -name ".vscode" -o \
    -name "coverage" -o \
    -name ".github" -o \
    -name ".circleci" \
\) -prune -exec rm -rf {} +;

# Default port
EXPOSE 3000
# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=3000

# start the app
CMD jq -n env > config/production.json && npm run prod
