import { Injectable } from '@nestjs/common';
import { CreateGameObjectDto } from './dto/create-game-object.dto';
import { UpdateGameObjectDto } from './dto/update-game-object.dto';

@Injectable()
export class GameObjectService {
  create(createGameObjectDto: CreateGameObjectDto) {
    return 'This action adds a new gameObject';
  }

  findAll() {
    return `This action returns all gameObject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gameObject`;
  }

  update(id: number, updateGameObjectDto: UpdateGameObjectDto) {
    return `This action updates a #${id} gameObject`;
  }

  remove(id: number) {
    return `This action removes a #${id} gameObject`;
  }
}
