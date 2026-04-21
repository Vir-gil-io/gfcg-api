import { Client } from 'pg';

export const pgProvider = {
  //Retornará un objeto con la configuración necesaria para establecer una conexión a una base de datos PostgreSQL utilizando el módulo `pg` de Node.js.
  provide: 'POSTGRES_CONNECTION', //Especifica el token de inyección que se utilizará para identificar esta conexión en otras partes de la aplicación.
  useFactory: async () => {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'T0st4dasDeTing4!',
      database: 'gids6081_db',
    });
    await client.connect(); //Establece la conexión con la base de datos utilizando los parámetros proporcionados.
    return client; //Devuelve el cliente de PostgreSQL para que pueda ser inyectado en otros lugares de la aplicación.
  },
};
