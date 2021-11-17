FROM node:17
COPY ./ ./
ENV LB_PORT 9000
ENV LB_SCHEDULE '*/5 * * * * *'
EXPOSE 9000

ENTRYPOINT ["npm"]
CMD ["run", "start"]