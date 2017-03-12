FROM local/node7-base

ENV DB_PATH /var/db/data.json
ENV PORT 8080

RUN echo {} > $DB_PATH

VOLUME /var/db

EXPOSE $PORT
