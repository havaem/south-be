import { CanActivate, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ConfigService } from "../services/config.service";

@Injectable()
export class AuthWSGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private apiConfigService: ConfigService,
    ) {}

    canActivate(context: any): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
        const bearerToken = context.args[0].handshake.headers.authorization.split(" ")[1];
        try {
            const decoded = this.jwtService.verify(bearerToken, {
                secret: this.apiConfigService.authConfig.jwtAccessSecretKey,
            });
            context.switchToWs().args[0].handshake.auth = decoded;
            return true;
        } catch (ex) {
            return false;
        }
    }
}
