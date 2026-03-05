import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class TasksService {
  constructor(
    //@Inject('MYSQL_CONNECTION') private mysql: any,
    @Inject('POSTGRES_CONNECTION') private pg: Client,
    private prisma: PrismaService,
  ) {}

  public async getAlltasks(): Promise<Task[]> {
    //Regresa una promesa que se resuelve con un array de tareas obtenidas de la base de datos MySQL.
    //const query = `SELECT * FROM tasks ORDER BY name ASC`;
    //const results = await this.mysql.query(query);

    const tasks = await this.prisma.task.findMany({
      orderBy: [{ name: 'asc' }],
    });

    //POSTGRES
    //const results = await this.pg.query(query);
    //console.log(results);
    //return results as Task[]; //Devuelve los resultados de la consulta a la base de datos MySQL, que se espera que sea un array de tareas ordenadas por nombre en orden ascendente.
    //postgres
    //return results.rows as Task[]; //Devuelve los resultados de la consulta a la base de datos PostgreSQL, que se espera que sea un array de tareas ordenadas por nombre en orden ascendente.
    return tasks as Task[];
  }
  public async getTaskById(id: number): Promise<Task | null> {
    //const query = `SELECT * FROM tasks WHERE id = ${id}`;
    //const results = await this.mysql.query(query);
    //return results[0] as Task;

    //POSTGRES
    //const results = await this.pg.query(query);
    //return results.rows[0] as Task;
    const task = await this.prisma.task.findUnique({
      where: { id: id },
    });
    return task as Task;
  }

  public async insertTask(task: CreateTaskDto): Promise<Task> {
    //const sql = `INSERT INTO tasks (name, description, priority, user_id)
    //VALUES ('${task.name}', '${task.description}', ${task.priority}, ${task.user_id})`;
    //const result = await this.mysql.query(sql);
    //const insertId = result.insertId; // Obtener el ID de la tarea recién insertada
    //return await this.getTaskById(insertId); // Devolver la tarea recién insertada utilizando su ID

    const newTask = await this.prisma.task.create({
      data: { task },
    });
    return newTask as Task;
  }

  public async updateTask(
    id: number,
    taskUpdated: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.getTaskById(id);
    //task.name = taskUpdated.name ?? task.name;
    //task.description = taskUpdated.description ?? task.description;
    // task.priority = taskUpdated.priority ?? task.priority;

    // const query = `
    // UPDATE tasks
    // SET name = '${task.name}',
    // description = '${task.description}',
    // priority = ${task.priority}
    // WHERE id = ${id}
    // `;
    //await this.mysql.query(query);
    //return await this.getTaskById(id);
    const task = await this.prisma.task.update({
      where: { id: id },
      data: { taskUpdated },
    });
    return task as Task;
  }

  public async deleteTask(id: number): Promise<Task> {
    //const query = `DELETE FROM tasks WHERE id = ${id}`;
    //const [result] = await this.mysql.query(query);
    //return result.affectedRows > 0;
    // Devuelve true si se eliminó al menos una fila, o false si no se eliminó ninguna fila.
    const task = await this.prisma.task.delete({
      where: { id: id },
    });
    return task as Task;
  }
}
