import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Api } from "@/decorators";

import { SpriteService } from "./sprite.service";

@ApiTags("sprite")
@Controller("sprite")
export class SpriteController {
    constructor(private readonly spriteService: SpriteService) {}

    @Api({
        publicRoute: true,
        method: "POST",
    })
    create() {
        // const all = this.spriteService.find();
        // all.updateMany(
        //     {},
        //     {
        //         animations: [
        //             new ObjectId("66d8343916e629667fc5f8a4"),
        //             new ObjectId("66d8343916e629667fc5f8a1"),
        //             new ObjectId("66d8343916e629667fc5f8a3"),
        //             new ObjectId("66d8343916e629667fc5f8a2"),
        //             new ObjectId("66d8343916e629667fc5f8a8"),
        //             new ObjectId("66d8343916e629667fc5f8a6"),
        //             new ObjectId("66d8343916e629667fc5f8a7"),
        //             new ObjectId("66d8343916e629667fc5f8a5"),
        //         ],
        //     },
        // );
        // return all;
    }
}
