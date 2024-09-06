import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function swaggerConfig(app: INestApplication, path: string): void {
    const config = new DocumentBuilder()
        .setTitle("South API Documentation")
        .setDescription("API description")
        .setVersion("1.0")
        .addBearerAuth(undefined, "bearer")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(path, app, document, {
        swaggerOptions: {
            authAction: {
                bearer: {
                    name: "bearer",
                    schema: {
                        description: "Default",
                        type: "http",
                        in: "header",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                    value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjgwZTdmYzVjNmE2NzE0YzFiOWE2YmMiLCJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWF0IjoxNzI1NjAzNjc3LCJleHAiOjE3MjU2OTAwNzd9.rJeP1-wt9FMhqYr68--O7D2kB2yRA4NtEMZBO8wTlts",
                },
            },
        },
    });
}
