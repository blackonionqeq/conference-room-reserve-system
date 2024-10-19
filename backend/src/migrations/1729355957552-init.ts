import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1729355957552 implements MigrationInterface {
  name = 'Init1729355957552'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(24) NOT NULL COMMENT '权限码', \`description\` varchar(100) NOT NULL COMMENT '权限描述', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL COMMENT '角色名', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(40) NOT NULL COMMENT '用户名', \`password\` varchar(40) NOT NULL COMMENT '密码', \`nick_name\` varchar(40) NOT NULL COMMENT '昵称', \`email\` varchar(60) NOT NULL COMMENT '邮箱', \`avatar\` varchar(120) NULL COMMENT '头像', \`phoneNumber\` varchar(20) NULL COMMENT '手机号', \`isFrozen\` tinyint NOT NULL COMMENT '是否冻结' DEFAULT 0, \`isAdmin\` tinyint NOT NULL COMMENT '是管理员与否' DEFAULT 0, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`conference_rooms\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT '会议室id', \`name\` varchar(30) NOT NULL COMMENT '会议室名字', \`capacity\` int NOT NULL COMMENT '会议室容量', \`location\` varchar(50) NOT NULL COMMENT '位置', \`equipment\` varchar(50) NOT NULL COMMENT '设备' DEFAULT '', \`description\` varchar(100) NOT NULL COMMENT '描述' DEFAULT '', \`isReserved\` tinyint NOT NULL COMMENT '是否已被预订' DEFAULT 0, \`createTime\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updateTime\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`reservations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`startTime\` datetime NOT NULL COMMENT '开始时间', \`endTime\` datetime NOT NULL COMMENT '结束时间', \`status\` varchar(20) NOT NULL COMMENT '状态（申请中0、已审核1、驳回2、已解除3）' DEFAULT '0', \`note\` varchar(150) NOT NULL COMMENT '备注' DEFAULT '', \`createTime\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updateTime\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, \`roomId\` int NULL COMMENT '会议室id', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`role_permissions\` (\`rolesId\` int NOT NULL, \`permissionsId\` int NOT NULL, INDEX \`IDX_0cb93c5877d37e954e2aa59e52\` (\`rolesId\`), INDEX \`IDX_d422dabc78ff74a8dab6583da0\` (\`permissionsId\`), PRIMARY KEY (\`rolesId\`, \`permissionsId\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`user_roles\` (\`usersId\` int NOT NULL, \`rolesId\` int NOT NULL, INDEX \`IDX_99b019339f52c63ae615358738\` (\`usersId\`), INDEX \`IDX_13380e7efec83468d73fc37938\` (\`rolesId\`), PRIMARY KEY (\`usersId\`, \`rolesId\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `ALTER TABLE \`reservations\` ADD CONSTRAINT \`FK_aa0e1cc2c4f54da32bf8282154c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`reservations\` ADD CONSTRAINT \`FK_73fa8fb7243b56914e00f8a0b14\` FOREIGN KEY (\`roomId\`) REFERENCES \`conference_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_0cb93c5877d37e954e2aa59e52c\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_d422dabc78ff74a8dab6583da02\` FOREIGN KEY (\`permissionsId\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_99b019339f52c63ae6153587380\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_13380e7efec83468d73fc37938e\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_13380e7efec83468d73fc37938e\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_99b019339f52c63ae6153587380\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_d422dabc78ff74a8dab6583da02\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_0cb93c5877d37e954e2aa59e52c\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`reservations\` DROP FOREIGN KEY \`FK_73fa8fb7243b56914e00f8a0b14\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`reservations\` DROP FOREIGN KEY \`FK_aa0e1cc2c4f54da32bf8282154c\``,
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_13380e7efec83468d73fc37938\` ON \`user_roles\``,
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_99b019339f52c63ae615358738\` ON \`user_roles\``,
    )
    await queryRunner.query(`DROP TABLE \`user_roles\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_d422dabc78ff74a8dab6583da0\` ON \`role_permissions\``,
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_0cb93c5877d37e954e2aa59e52\` ON \`role_permissions\``,
    )
    await queryRunner.query(`DROP TABLE \`role_permissions\``)
    await queryRunner.query(`DROP TABLE \`reservations\``)
    await queryRunner.query(`DROP TABLE \`conference_rooms\``)
    await queryRunner.query(`DROP TABLE \`users\``)
    await queryRunner.query(`DROP TABLE \`roles\``)
    await queryRunner.query(`DROP TABLE \`permissions\``)
  }
}
