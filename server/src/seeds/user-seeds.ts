import { User } from '../models/user.js';

export const seedUsers = async () => {
  await User.bulkCreate([
    { username: 'LucyDog', password: 'password' },
    { username: 'LuluKitty', password: 'password' },
    { username: 'ScrufflesTheCat', password: 'password' },
  ], { individualHooks: true });
};
