/*Função do arquivo
 - Controla toda a parte de criar um novo usuário,aula e horários

*/

import {Request,Response} from 'express';
import db from '../database/connection';
import convertHourToMinutes from '../util/convertHourToMinutes';
//Cria um interface para o valor de cada item
//Então Cada Item do Schedule terá esse tipo 
interface ScheduleItem{
    week_day:number;
    from:string;
    to:string;
 }
export default class ClassesController{
    async index(request:Request,response:Response){
        const filters = request.query;
        
        const week_day = filters.week_day as string;
        const subject = filters.subject as string;
        const time = filters.time as string;


        if(!filters.week_day || !filters.subject || !filters.time){
            return response.status(400).json({
                erro:"Missing information for conclude operation!"
            });
        }

        const timeInMinutes = convertHourToMinutes(time);


        //O whereExists me permite criar um subQuery
        //Verificar se existe as informações passadas
        //Ou seja, relaciona as informações no db com as informações passadas pelo
        //usuario
        const classes = await db('classes')
        .whereExists(function(){
            this.select('class_schedule.*')
            .from('class_schedule')
            .whereRaw('`class_schedule`.`classes_id` = `classes`.`id`')
            .whereRaw('`class_schedule`.`week_day` = ?? ',[Number(week_day)])
            .whereRaw('`class_schedule`.`from` <= ??',[timeInMinutes])
            .whereRaw('`class_schedule`.`to` > ??',[timeInMinutes])

            
        })
        .where("classes.subject","=",subject)
        .join('users','classes.user_id',"=","users.id")
        .select(['classes.*','users.*']);



        return response.json(classes);


    }



    async create(request:Request,response:Response){
        const {
          name,
          avatar,
          whatsapp,
          bio,
          subject,
          cost,
          schedule,
        } = request.body;
        //Transaction é uma forma de inserir apenas se todas as inserções //funcionarem
        const tsx = await db.transaction();
        try{
           
          
    
          //Pegando os valores de request.body utilizando a shortSyntax
          //name = x.name  => name 
          //A função insert retorna um array de ids
          const insertUsersIds = await tsx('users').insert({
             name,
             avatar,
             whatsapp,
             bio, 
          });
          const user_id = insertUsersIds[0];
    
    
          const insertClassesIds = await tsx('classes').insert({
             subject,
             cost,
             user_id,
          });
          const classes_id = insertClassesIds[0]
    
          const classSchedule = schedule.map((scheduleItem:ScheduleItem)=>{
             return{
                classes_id,
                week_day:scheduleItem.week_day,
                from:convertHourToMinutes(scheduleItem.from),
                to:convertHourToMinutes(scheduleItem.to),
             }
          })
    
          await tsx('class_schedule').insert(classSchedule);
    
    
          //Insere todas as informações de uma só vez sem erros
          await tsx.commit();
    
    
          
    
    
          return response.status(201).send();
        }
        catch(err){
           //Caso ocorra um erro voltará tudo
           await tsx.rollback();
           return response.status(400).json({
              error:"Error at create a class"
           })
        }
    
    }
}