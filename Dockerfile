# Stage 0: UI Build Stage
FROM node:12.14.1-alpine3.11 as build-stage

WORKDIR /app

COPY ./frontend/package*.json /app/
RUN npm install

COPY ./frontend/ /app/

# Build the frontend
RUN npm run build

# Stage 2: Backend code and UI serving
FROM python:3.8-alpine3.11

RUN apk add --no-cache libev libev-dev

RUN wget https://github.com/kubeflow/kfctl/releases/download/v1.0-rc.1/kfctl_v1.0-rc.1-0-g963c787_linux.tar.gz && \
  tar xvf kfctl_v1.0-rc.1-0-g963c787_linux.tar.gz && \
  mv kfctl /usr/local/bin/kfctl && \
  rm kfctl_v1.0-rc.1-0-g963c787_linux.tar.gz

# Backend code
COPY ./backend/platiagro /app/platiagro
COPY ./backend/setup.py /app/setup.py

RUN pip install /app/

# Frontend code
COPY --from=build-stage /app/build /app/platiagro/build/

WORKDIR /app/

EXPOSE 8080

CMD ["python", "-m", "platiagro.api"]
