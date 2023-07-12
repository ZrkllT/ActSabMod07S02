/*
- Crear una base de datos de gesti�n de veh�culos.
- Debe gestionar Tipos de Veh�culos (Sedan, Coup�, Carga)
- Debe gestionar Marcas,
- Debe gestionar Modelos.
- Por cada veh�culo debe gestionar marca, modelo, tipo, a�o y precio.
- La tabla veh�culos debe contener una llave �nica entre marca, modelo y a�o.
- Crear una aplicaci�n con NodeJs configurada con PG para acceder a los datos.
- Crear una funci�n que inserte al menos 3 marcas.
- Crear una funci�n que inserte al menos 2 modelos por marca.
- Crear una funci�n que inserte los tipos de veh�culos.
- Crear una funci�n que registre al menos 10 veh�culos.
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
- Intentar registrar un veh�culo con la misma marca, modelo, a�o.
- Intentar registrar un veh�culo con un id de marca no existente.
- Intentar eliminar una marca que ya est� asociada a un veh�culo.
- Asumiendo que el id_marca en la tabla veh�culos es obligatorio, intentar modificar un registro y asignar el id_marca como null.
- Intentar modificar un veh�culo con un id_modelo que no exista.
*/