FROM java:8

ENV JAVA_OPTS ""
ENV JAR_NAME short-url-dapp

COPY target/${JAR_NAME}.jar /app.jar
EXPOSE 8080
CMD ["/bin/sh", "-c", "java $JAVA_OPTS -jar /app.jar"]
