import { SetMetadata } from "@nestjs/common";

import { CHECK_PERMISSION_KEY } from "@/constants/aciton";
import { PermissionHandler } from "@/shared/types/casl";

export const CheckPermissions = (...handlers: PermissionHandler[]) => SetMetadata(CHECK_PERMISSION_KEY, handlers);
