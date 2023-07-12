/*
- Crear una base de datos de gestión de vehículos.
- Debe gestionar Tipos de Vehículos (Sedan, Coupé, Carga)
- Debe gestionar Marcas,
- Debe gestionar Modelos.
- Por cada vehículo debe gestionar marca, modelo, tipo, año y precio.
- La tabla vehículos debe contener una llave única entre marca, modelo y año.
- Crear una aplicación con NodeJs configurada con PG para acceder a los datos.
- Crear una función que inserte al menos 3 marcas.
- Crear una función que inserte al menos 2 modelos por marca.
- Crear una función que inserte los tipos de vehículos.
- Crear una función que registre al menos 10 vehículos.
*//*
crear base de datos primero
*/
create table public.TIPO_VEHICULO(
	tve_id			serial	not null
,	tve_descripcion	varchar(100) unique
,	primary key(tve_id)
)

create table public.MARCA(
	mar_id			serial not null
,	mar_descripcion	varchar(100) unique
,	primary key(mar_id)
)

create table public.MODELO(
	mar_id			int not null
,	mod_id			serial not null
,	mod_descripcion	varchar(100) unique
,	primary key(mar_id,mod_id)
,	foreign key(mar_id) references public.MARCA(mar_id)
)

create table public.VEHICULO(
	tve_id			int not null
,	mar_id			int not null
,	mod_id			int not null
,	veh_anio		int not null
,	veh_precio		numeric(9)
,	vhe_descripcion	varchar(2000)
,	primary key(mar_id,mod_id,veh_anio)
,	foreign key(tve_id) references public.TIPO_VEHICULO(tve_id)
,	foreign key(mar_id,mod_id) references public.MODELO(mar_id,mod_id)
)

/*
Requerimientos de Captura de Errores.
- Intentar registrar un vehículo con la misma marca, modelo, año.
- Intentar registrar un vehículo con un id de marca no existente.
- Intentar eliminar una marca que ya esté asociada a un vehículo.
- Asumiendo que el id_marca en la tabla vehículos es obligatorio, intentar modificar un registro y asignar el id_marca como null.
- Intentar modificar un vehículo con un id_modelo que no exista.
*/