import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @Inject('MYSQL_CONNECTION') private mysql: any,
    @Inject('POSTGRES_CONNECTION') private pg: Client,
  ) {}

  public async getAlltasks(): Promise<Task[]> {
    //Regresa una promesa que se resuelve con un array de tareas obtenidas de la base de datos MySQL.
    const query = `SELECT * FROM tasks ORDER BY name ASC`;
    const results = await this.mysql.query(query);
    //postgres
    //const results = await this.pg.query(query);
    console.log(results);
    return results as Task[]; //Devuelve los resultados de la consulta a la base de datos MySQL, que se espera que sea un array de tareas ordenadas por nombre en orden ascendente. 
    //postgres
    //return results.rows as Task[]; //Devuelve los resultados de la consulta a la base de datos PostgreSQL, que se espera que sea un array de tareas ordenadas por nombre en orden ascendente.
  }
  public getTaskById(id: number): string {
    return `Obteniendo tarea: ${id}`;
  }
  public updateTask(task: any): any {
    return task;
  }
  public insertTask(task: any): any {
    return task;
  }
  public deleteTask(id: number): string {
    return `Eliminando tarea: ${id}`;
  }
}
