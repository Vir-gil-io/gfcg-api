import { createConnection } from 'mysql2/promise';

export const mysqlProvider = {
  provide: 'MYSQL_CONNECTION',
  useFactory: async () => {
    const connection = await createConnection({
      host: 'localhost',
      port: 3306,
      user: 'admin',
      password: 'admin',
      database: 'gids6081_db',
    });
    return connection; //cuando se reciba la conexión, se devuelve para que pueda ser inyectada en otros lugares
  },
};
//aquí se define un proveedor de MySQL que se puede usar para inyectar la conexión a la base de datos en otros lugares de la aplicación.
// El método `userFactory` se encarga de crear la conexión utilizando los parámetros proporcionados y devolverla para su uso posterior.
