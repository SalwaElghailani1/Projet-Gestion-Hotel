FROM openjdk:18-ea-1-jdk-oracle

VOLUME /tmp

COPY target/*.jar app.jar

ENTRYPOINT ["java", "-jar" , "app.jar"]