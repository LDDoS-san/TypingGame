FROM exlipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN ./mvnw package -DskipTests

EXPOSE 8080

CMD["COMD", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]