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
                    value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDBiZWU1MGY5ZGEyOTYzOGQzZGMzMDYiLCJ1c2VybmFtZSI6InZobnZvaG9haW5hbSIsImlhdCI6MTY5NTExNzk3MiwiZXhwIjoxNjk4NzE3OTcyfQ.ycNDHtijf8T2s9t8boY2pNk8KAjYdtS_ykdTwyuP7s8",
                },
            },
        },
    });
}
