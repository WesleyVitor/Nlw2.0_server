/*Função do arquivo
 - Fazer uma conexão com o banco de dados utiliando o Knex
*/
import knex from 'knex';
import path from 'path';
const db = knex({
    client:'sqlite3',
    connection:{
        filename:path.resolve(__dirname,"database.sqlite")
    },
    useNullAsDefault:true,
});

export default db;