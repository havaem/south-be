import { PartialType } from '@nestjs/swagger';
import { CreateSpriteDto } from './create-sprite.dto';

export class UpdateSpriteDto extends PartialType(CreateSpriteDto) {}
