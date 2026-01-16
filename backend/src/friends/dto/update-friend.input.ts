import { CreateFriendInput } from './create-friend.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateFriendInput extends PartialType(CreateFriendInput) {

}
