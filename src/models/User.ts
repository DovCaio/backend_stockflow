import { Exclude } from 'class-transformer';
enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class User {
  id?: string;
  email: string;
  @Exclude()
  password: string;
  name: string;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
