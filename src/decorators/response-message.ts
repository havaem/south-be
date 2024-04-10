import { SetMetadata } from "@nestjs/common";

import { MESSAGE_KEY } from "@/constants";

export const ResponseMessage = (message: string) => SetMetadata(MESSAGE_KEY, message);
