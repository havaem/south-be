import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { StoredFile } from "nestjs-form-data";

import { ConfigService } from "@/shared/services/config.service";

export abstract class UploadFileServiceAbstract {
    abstract uploadFileToPublicBucket(path: string, file: StoredFile): Promise<string>;
}

@Injectable()
export class CloudflareService implements UploadFileServiceAbstract {
    private s3_client: S3Client;
    constructor(private readonly cfg: ConfigService) {
        this.s3_client = new S3Client({
            region: "auto",
            endpoint: `https://${cfg.cloudflareConfig.accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: cfg.cloudflareConfig.accessKeyId,
                secretAccessKey: cfg.cloudflareConfig.secretAccessKey,
            },
        });
    }
    async uploadFileToPublicBucket(path: string, file: StoredFile) {
        const key = `${path}/${Date.now().toString()}-${file.originalName}`;

        await this.s3_client
            .send(
                new PutObjectCommand({
                    Bucket: this.cfg.cloudflareConfig.bucketName,
                    Key: key,
                    Body: (file as any).buffer,
                    ContentType: file.mimetype,
                    ACL: "public-read",
                    ContentLength: file.size,
                }),
            )
            .then((data) => console.log(data));

        return `https://southcloud.xyz/${key}`;
    }
}
