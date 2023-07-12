import { conexion } from './conexion.js'
conexion.connect()

import _yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
const yargs = _yargs(hideBin(process.argv))

/*
Requerimientos de Captura de Errores.
*- Intentar registrar un vehículo con la misma marca, modelo, año.
*- Intentar registrar un vehículo con un id de marca no existente.
*- Intentar eliminar una marca que ya esté asociada a un vehículo.
*- Asumiendo que el id_marca en la tabla vehículos es obligatorio, 
intentar modificar un registro y asignar el id_marca como null.
- Intentar modificar un vehículo con un id_modelo que no exista.
*/
function diccErr(cod){
    switch(cod){
        case '23505':
            console.log('El dato que intenta ingresar ya se encuentra registrado')
        break;

        case '23502':
            console.log('La clave foranea no existe')
        break;

        case '23503':
            console.log('La marca o modelo de vehiculo NO existe')
        break;
    }
}

/*
- Crear una aplicación con NodeJs configurada con PG para acceder a los datos.
- Crear una función que inserte al menos 3 marcas.
- Crear una función que inserte al menos 2 modelos por marca.
- Crear una función que inserte los tipos de vehículos.
- Crear una función que registre al menos 10 vehículos.
*/
async function ejecutarConsulta(consulta){
    try{
         const resp = await conexion.query(consulta)
        conexion.end()
    }catch(error){
        //console.log(error)
        diccErr(error.code)
        conexion.end()
    }
}

/* funciones para crear */
function crearTipoVehiculo(tipo){
    const consulta = {
        text: 'insert into public.TIPO_VEHICULO (tve_descripcion) values($1)',
        values: [tipo]
    }
    ejecutarConsulta(consulta)
}

function crearMarca(marca){
    const consulta = {
        text: 'insert into public.MARCA (mar_descripcion) values($1)',
        values: [marca]
    }
    ejecutarConsulta(consulta)
}

function crearModelo(marca,modelo){
    const consulta = {
        text: 'insert into public.MODELO(mar_id,mod_descripcion) values($1,$2)',
        values: [marca,modelo]
    }
    ejecutarConsulta(consulta)
}

function crearVehiculo(tipo,marca,modelo,anio,precio){
    const consulta = {
        text: 'insert into public.VEHICULO(tve_id,mar_id,mod_id,veh_anio,veh_precio) values($1,$2,$3,$4,$5)',
        values: [tipo,marca,modelo,anio,precio]
    }
    ejecutarConsulta(consulta)
}
/* funciones para editar */
function updateTipoVehiculo(id,tipo){
    if(tipo === undefined || tipo === ''){
        return console.log('debe indicar el nombre/tipo de vehiculo')
    }
    const consulta = {
        text: 'update public.TIPO_VEHICULO set tve_descripcion = $2 where tve_id = $1',
        values: [id,tipo]
    }
    ejecutarConsulta(consulta)
}

/* funciones para eliminar */
function eliminarMarca(marca){
    const consulta = {
        text: 'delete from public.MARCA where mar_id = $1',
        values: [marca]
    }
    ejecutarConsulta(consulta)
}

/* funciones para consultar */
async function consutaTable(tabla){
    const consulta = {
        text: `select * from public.${tabla}`
    }
    try{
        const respuesta = await conexion.query(consulta)
        console.log(`*** ${tabla.toUpperCase()} ***`)
        console.table(respuesta.rows)
    }catch(err){
        console.log(err.message)
    }finally{
        conexion.end()
    }
}

/* comandos consola */
yargs
    /* insertar datos */
    .command('crearTipo','crea un tipo de vehiculo',{
        tipo: {
                alias: 't',
                describe: 'tipo de vehiculo a registrar',
                type: 'string',
                demandedOptions: true
            }
    },({tipo}) =>{crearTipoVehiculo(tipo)})

    .command('crearMarca','crea una marca de vehiculo',{
        marca: {
            alias: 'm',
            describe: 'marca de vehiculo a registrar',
            type: 'string',
            demandedOptions: true
        }
    },({marca}) =>{crearMarca(marca)})

    .command('crearModelo','crea un modelo de vehiculo',{
        marca: {
            alias: 'im',
            describe: 'id de marca del vehiculo',
            type: 'number',
            demandedOptions: true
        },
        modelo: {
            alias: 'm',
            describe: 'modelo del vehiculo a registrar',
            type: 'string',
            demandedOptions: true
        }
    },({marca,modelo}) =>{crearModelo(marca,modelo)})

    .command('crearVehiculo','crea un registro de vehiculo',{
        tipo: {
            alias: 'it',
            describe: 'id del tipo de vehiculo',
            type: 'number',
            demandedOptions: true
        },
        marca: {
            alias: 'im',
            describe: 'id de la marca de vehiculo',
            type: 'number',
            demandedOptions: true
        },
        modelo: {
            alias: 'mo',
            describe: 'id del modelo de vehiculo',
            type: 'number',
            demandedOptions: true
        },
        anio: {
            alias: 'a',
            describe: 'año del vehiculo',
            type: 'number',
            demandedOptions: true
        },
        precio: {
            alias: 'p',
            describe: 'precio de venta del vehiculo',
            type: 'number',
            demandedOptions: false
        }
    },({tipo,marca,modelo,anio,precio}) =>{crearVehiculo(tipo,marca,modelo,anio,precio)})

    /* actualizar registros */
    .command('updTipoVehiculo','actualizar registro de vehiculo',{
        id: {
            alias: 'i',
            describe: 'id / codigo del registro que se desea actualizar',
            type: 'number',
            demandedOptions: true
        },
        tipo: {
            alias: 't',
            describe: 'nuevo tipo a registrar',
            type: 'string',
            demandedOptions: true
        }
    },({id,tipo}) =>{updateTipoVehiculo(id,tipo)})

    .command('updMarca','actualizar registro de marca',{

    })

    /* eliminar registros */
    .command('elimMarca','elimina el registro de una marca',{
        marca: {
            alias: 'im',
            describe: 'id / codigo de la marca a eliminar',
            type: 'number',
            demandedOptions: true
        }
    },({marca}) =>{eliminarMarca(marca)})

    /* consultar registros */
    .command('consultar','consulta cualquier tabla que se indique',{
        tabla: {
            alias: 't',
            describe: 'nombre de la tabla que queremos consultar',
            type: 'string',
            demandedOptions: true
        }
    },({tabla}) =>{consutaTable(tabla)})
    .help().argv