import * as bcrypt from 'bcryptjs';

import { typeOrmDatasource } from './src/config/typeOrmDatasource';
import { User } from './src/modules/user/entities/user.entity';
import { UserRole } from './src/modules/user/enum/user.enum';

async function seed() {
  try {
    await typeOrmDatasource.initialize();
    console.log('Data Source has been initialized!');

    // Create users
    const userRepository = typeOrmDatasource.getRepository(User);

    // Create admin user
    const adminUser = userRepository.create({
      email: 'admin@example.com',
      fullName: 'Admin User',
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.ADMIN,
      isActive: true,
    });

    // Create regular user
    const regularUser = userRepository.create({
      email: 'user@example.com',
      fullName: 'Regular User',
      password: await bcrypt.hash('user123', 10),
      role: UserRole.USER,
      isActive: true,
    });

    await userRepository.save([adminUser, regularUser]);
    console.log('Users created successfully!');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding: ✨✨✨', error);
  } finally {
    await typeOrmDatasource.destroy();
  }
}

seed();
