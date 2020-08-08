/*Função do arquivo
 - O arquivo foi criado por causa os comandos em knex são em javascript puro, no entanto estamos utilizando o typescript
*/

import path from 'path';


module.exports ={
    client:'sqlite3',
    connection:{
        filename:path.resolve(__dirname,"src","database","database.sqlite")
    },
    migrations:{
       directory:path.resolve(__dirname,"src","database","migrations") 
    },
    useNullAsDefault:true,
};