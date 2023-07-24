import { PartialType } from '@nestjs/mapped-types';
import { UserSignUpDto } from '../../auth/dto/user-signup.dto';

export class UserUpdateDto extends PartialType(UserSignUpDto) {}
