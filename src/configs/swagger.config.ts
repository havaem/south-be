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
                    value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY5YmQ2NDhiMGUwZmEwZGRmODIxMDQiLCJlbWFpbCI6ImV4YW1wbGUyQGdtYWlsLmNvbSIsImlhdCI6MTcxOTE0NjAzOCwiZXhwIjoxNzE5MjMyNDM4fQ.snNtzYQ0gVIigfkiBXsAiBLeKc8VBJqxoH1m3tW4wQg",
                },
            },
        },
    });
}
