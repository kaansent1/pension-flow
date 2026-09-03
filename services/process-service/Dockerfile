FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

COPY . .

RUN chmod +x gradlew
RUN ./gradlew bootJar --no-daemon

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

RUN useradd --system --uid 10001 spring
USER spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
