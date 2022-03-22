import { connection } from './database'
function insertSRate(data: any, isXml: boolean){
    try{
        connection.query(querySelecter(isXml, data), function (err: any, result: any) {
            if (err){
                throw err;
            }
            console.log("1 record inserted");
        });
        return true;
    } catch (e) {
        console.log(e)
    }
}

function querySelecter(isXml: boolean, data: any){
    switch (isXml) {
        case true:
            return `INSERT INTO suiciderates(country,year,sex,age,suicides_no,population,suicides100k_pop,countryyear,HDI_for_year,gdp_per_capita_,generation) VALUES ('${data.data.country[0]}',${data.data.year[0]},'${data.data.sex[0]}','${data.data.age[0]}',${data.data.suicide_no[0]},${data.data.population[0]},${data.data.suicides100k_pop[0]},'${data.data.countryyear[0]}',NULL,NULL,NULL);`

        case false:
            return `INSERT INTO suiciderates(country,year,sex,age,suicides_no,population,suicides100k_pop,countryyear,HDI_for_year,gdp_per_capita_,generation) VALUES ('${data.country}',${data.year},'${data.sex}','${data.age}',${data.suicide_no},${data.population},${data.suicides100k_pop},'${data.countryyear}',NULL,NULL,NULL);`
    }
}

function deleteSRate(id: number){
    try{

    }catch (e) {
        console.log(e)
    }
}

export default { insertSRate, deleteSRate }