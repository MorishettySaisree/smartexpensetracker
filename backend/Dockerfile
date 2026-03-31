FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

COPY backend/target/smartexpense-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]