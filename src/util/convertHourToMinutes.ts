/*Função do arquivo
 -Pega o valor em string 
 - Divide por um caracter e transforma em array
 - mapeia e cria um novo array numérico  
*/


export default function convertHourToMinutes(time:string){

    //8:00
    const [hour,minutes] = time.split(':').map(Number);
    const timeInMinutes = (hour*60) + minutes;
    return timeInMinutes;


}   