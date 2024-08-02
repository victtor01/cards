import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5436,
    username: "admin",
    password: "admin",
    database: "cards_saas",
    synchronize: true,
    logging: false,
    entities: [__dirname + '/../../**/*.entity.ts'],
    migrations: [],
    subscribers: [],
})
