export class Task {
  id!: number;
  name!: string;
  description!: string;
  priority!: boolean;
  user_id!: number;
}
//dto son datos de entrada a partir del usuario

//entity es como lo trabajamos de manera interna, es decir, como lo guardamos en la base de datos.
// Es una representación de la tabla en la base de datos. Es un modelo de datos que se utiliza para mapear los datos de la base de datos a objetos en el código.
// En este caso, la clase Task representa una tarea con sus propiedades correspondientes.
