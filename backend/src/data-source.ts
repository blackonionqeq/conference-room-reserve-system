import { DataSource } from 'typeorm'
import { User } from './user/entities/user.entity'
import { Role } from './user/entities/role.entity'
import { Permission } from './user/entities/permission.entity'
import { ConferenceRoom } from './conference-room/entities/conference-room.entity'
import { Reservation } from './reservation/entities/reservation.entity'

// config
export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'shidi666',
  database: 'conference_room_reserve_system',
  synchronize: false,
  logging: true,
  entities: [User, Role, Permission, ConferenceRoom, Reservation],
  poolSize: 10,
  migrations: ['src/migrations/**.ts', './migrations/**.js'],
  connectorPackage: 'mysql2',
  extra: {
    authPlugin: 'sha256_password',
  },
})
