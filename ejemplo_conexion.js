import pkg from 'pg'
const  { Client } = pkg


export const conexion = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'clave por defecto',
    port: 5432,
    database: 'nombre base de datos'
})
