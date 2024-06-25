import { Injectable } from "@nestjs/common";
import { ConfigService as NestJsConfigService } from "@nestjs/config";

@Injectable()
export class ConfigService {
    constructor(private configService: NestJsConfigService) {}

    private getNumber(key: string): number {
        const value = this.get(key);

        try {
            return Number(value);
        } catch {
            throw new Error(key + " environment variable is not a number");
        }
    }

    private getBoolean(key: string): boolean {
        const value = this.get(key);

        try {
            return Boolean(JSON.parse(value));
        } catch {
            throw new Error(key + " env var is not a boolean");
        }
    }

    private getString(key: string): string {
        const value = this.get(key);

        return value.replace(/\\n/g, "\n");
    }

    get authConfig() {
        return {
            jwtAccessSecretKey: this.getString("JWT_ACCESS_SECRET_KEY"),
            jwtAccessExpirationTime: this.getString("JWT_ACCESS_EXPIRATION_TIME"),

            jwtRefreshSecretKey: this.getString("JWT_REFRESH_SECRET_KEY"),
            jwtRefreshExpirationTime: this.getString("JWT_REFRESH_EXPIRATION_TIME"),

            // jwtVerifySecretKey: this.getString("JWT_VERIFY_SECRET_KEY"),
            // jwtVerifyExpirationTime: this.getString("JWT_VERIFY_EXPIRATION_TIME"),

            // jwtForgotPasswordSecretKey: this.getString("JWT_FORGOT_PASSWORD_SECRET_KEY"),
            // jwtForgotPasswordExpirationTime: this.getString("JWT_FORGOT_PASSWORD_EXPIRATION_TIME"),
        };
    }

    get mailConfig() {
        return {
            service: this.getString("MAIL_SERVICE"),
            user: this.getString("MAIL_USER"),
            password: this.getString("MAIL_PASSWORD"),
        };
    }

    get mongoUri(): string {
        return this.getString("MONGO_URI");
    }

    get appConfig() {
        return {
            port: this.getString("PORT"),
            prefix: this.getString("PREFIX"),
            clientUrl: this.getString("CLIENT_URL"),
            saltRounds: this.getNumber("SALT_ROUNDS"),
            //* Swagger Config
            swaggerPath: this.getString("PREFIX") + this.getString("SWAGGER_PATH"),
            documentEnabled: this.getBoolean("ENABLE_DOCUMENTATION"),
        };
    }

    get cloudflareConfig() {
        return {
            accountId: this.getString("CLOUDFLARE_ACCOUNT_ID"),
            accessKeyId: this.getString("CLOUDFLARE_R2_ACCESS_KEY_ID"),
            secretAccessKey: this.getString("CLOUDFLARE_R2_SECRET_ACCESS_KEY"),
            bucketName: this.getString("CLOUDFLARE_R2_BUCKET_NAME"),
        };
    }

    get defaultConfig() {
        return {
            defaultPassword: this.getString("DEFAULT_PASSWORD"),
            defaultAvatar: this.getString("DEFAULT_AVATAR"),
        };
    }

    get googleConfig() {
        return {
            recaptchaSecretKey: this.getString("GOOGLE_RECAPTCHA_SECRET_KEY"),
        };
    }

    get githubConfig() {
        return {
            clientId: this.getString("GITHUB_CLIENT_ID"),
            clientSecret: this.getString("GITHUB_CLIENT_SECRET"),
        };
    }

    private get(key: string): string {
        const value = this.configService.get<string>(key);

        if (!value) {
            console.error(key + " environment variable does not set");
            return process.exit(1);
        }

        return value;
    }
}
