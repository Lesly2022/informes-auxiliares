Modifica el prototipo existente del **“Sistema de Informes Diarios – Laboratorios de Cómputo”** manteniendo toda la estructura, navegación y funcionalidades solicitadas anteriormente.

## 1. CAMBIO DE PALETA DE COLORES

Eliminar completamente el color verde utilizado anteriormente.

Utilizar una **paleta predominantemente azul**, con apariencia institucional, tecnológica y profesional.

* Color principal: azul institucional.
* Azul oscuro para encabezados, barra lateral y elementos importantes.
* Azul medio para botones y elementos interactivos.
* Azul muy claro para fondos secundarios y tarjetas.
* Blanco como color principal de las tarjetas y formularios.
* Gris neutro para textos secundarios.
* Mantener sombras suaves y bordes ligeramente redondeados.

**No utilizar verde como color principal ni como elemento decorativo.**

La interfaz debe transmitir una sensación de:
**Universidad + Tecnología + Informática + Profesionalismo.**

---

# 2. LOGIN – DATOS DEL MOCKUP

Modificar el login para que el prototipo funcione con los siguientes datos ficticios:

**Código SISS:**
`202001823`

**Carnet:**
`8018935`

Cuando se introduzcan esos datos y se presione **Ingresar**, reconocer automáticamente al usuario.

Los datos que deben aparecer después del login son:

**Nombre completo:**
`Jose Alejandro Montaño Laura`

**Cargo:**
`Auxiliar de Laboratorio de Cómputo`

**Código SISS:**
`202001823`

**Carnet:**
`8018935`

No solicitar nuevamente estos datos dentro del formulario de informe.

---

# 3. DASHBOARD

Mantener el Dashboard anterior, pero actualizar los datos del usuario.

Mostrar una tarjeta:

### Datos del auxiliar

**Nombre completo**
Jose Alejandro Montaño Laura

**Cargo**
Auxiliar de Laboratorio de Cómputo

**Código SISS**
202001823

**Carnet**
8018935

Mantener las dos opciones principales:

### Elaborar informe

“Registrar las actividades realizadas durante tu turno.”

Botón:
**Elaborar informe**

### Informes pasados

“Consultar, visualizar y editar informes anteriores.”

Botón:
**Ver informes**

Mantener la navegación lateral:

* Inicio
* Elaborar informe
* Informes pasados
* Mi perfil
* Cerrar sesión

---

# 4. ELABORAR INFORME – DATOS GENERALES

Mantener la sección:

## 1. DATOS GENERALES

**Nombre completo**

Mostrar automáticamente:

`Jose Alejandro Montaño Laura`

Este campo debe estar bloqueado/no editable.

---

## FECHA

Mantener un selector de fecha para que el auxiliar seleccione la fecha correspondiente al informe.

---

## HORARIO DEL TURNO

Cambiar completamente el comportamiento anterior.

Ya NO debe existir un selector genérico para elegir el horario del turno.

En su lugar, mostrar directamente:

### Horario del turno

`09:00 - 13:00`

Este horario debe aparecer automáticamente según la información registrada para el auxiliar en la base de datos.

Por ejemplo:

**Horario del turno**
`09:00 - 13:00`

El auxiliar normalmente no tendrá que modificarlo.

Sin embargo, debe existir una opción claramente visible:

**¿Hubo un cambio de horario?**

Y una opción:

**Otro**

Cuando el usuario seleccione **Otro**, habilitar un campo para introducir manualmente el nuevo horario.

Por ejemplo:

**Nuevo horario del turno**
`14:00 - 18:00`

Esto representa una modificación temporal del horario.

Agregar una pequeña explicación visual:

“Si su horario fue modificado y el cambio aún no está registrado en la base de datos, seleccione ‘Otro’ e indique el horario correspondiente.”

La lógica futura será que el horario normal provenga de la base de datos y que cualquier modificación permanente se actualice posteriormente en la BD.

---

# 5. ACTIVIDADES ACADÉMICAS

Mantener exactamente la funcionalidad anterior.

Esta sección sigue siendo **opcional**.

Título:

## 2. ACTIVIDADES ACADÉMICAS REALIZADAS

Crear una tabla dinámica con:

* Sala
* Docente / Responsable
* Materia / Actividad
* Horario
* Observaciones
* Acción

### Sala

Desplegable:

* Sala 1
* Sala 2
* Sala 3
* Sala 4
* Laboratorio de Redes

### Docente / Responsable

Desplegable:

* Lic. Tatiana Aparicio
* Lic. Marcelo Antezana
* Lic. Jimmy Villarroel
* Otro

Si selecciona **Otro**, mostrar campo:

**Especificar docente / responsable**

### Materia / Actividad

Desplegable:

* Base de Datos I
* Informática Forense
* Métodos, Técnicas y Taller de Programación
* Otra

Si selecciona **Otra**, mostrar:

**Especificar materia / actividad**

### Horario de la actividad académica

Mantener el selector:

* 06:45 - 08:15
* 08:15 - 09:45
* 09:45 - 11:15
* 11:15 - 12:45
* 12:45 - 14:15
* 14:15 - 15:45
* 15:45 - 17:15
* 17:15 - 18:45
* 18:45 - 20:15
* 20:15 - 21:45

IMPORTANTE:

El **Horario de la actividad académica** es diferente al **Horario del turno del auxiliar**.

El horario del turno se obtiene automáticamente del auxiliar.

El horario de cada actividad académica se selecciona independientemente.

Mantener:

**+ Agregar actividad académica**

---

# 6. ACTIVIDADES REALIZADAS EN EL LABORATORIO

Mantener la sección anterior.

Título:

## 3. ACTIVIDADES REALIZADAS EN EL LABORATORIO

Esta sección es **OBLIGATORIA**.

Crear inicialmente:

**Actividad 1**

**Actividad 2**

**Actividad 3**

**Actividad 4**

Cada una con un campo de texto amplio.

Botón:

**+ Agregar actividad**

Permitir agregar tantas actividades como sean necesarias.

---

# 7. INCIDENCIAS Y OBSERVACIONES

Mantener esta sección como **OPCIONAL**.

## 4. INCIDENCIAS Y OBSERVACIONES

Campos:

**Equipo / Sala / Situación**

**Descripción**

**Acción realizada**

Permitir:

**+ Agregar otra incidencia**

Si no existen incidencias, el auxiliar puede dejar toda esta sección vacía.

---

# 8. PENDIENTES

Mantener esta sección como **OPCIONAL**.

## 5. PENDIENTES

Campos:

**Pendiente 1**

**Pendiente 2**

**Pendiente 3**

Botón:

**+ Agregar pendiente**

Y:

**Estado / recomendación para el siguiente turno**

Si no existen pendientes, se puede dejar vacío.

---

# 9. GUARDAR INFORME

Mantener el botón:

**Guardar informe**

Validar únicamente los campos obligatorios:

* Fecha
* Horario del turno
* Al menos una actividad en “Actividades Realizadas en el Laboratorio”

Las actividades académicas, incidencias y pendientes son opcionales.

Si se utiliza “Otro” para el horario del turno, validar que el nuevo horario haya sido introducido.

Después de guardar mostrar:

**Informe guardado correctamente**

Y regresar a:

**Informes Pasados**

---

# 10. INFORMES PASADOS

Mantener la pantalla anterior.

Mostrar una lista de informes con:

* Fecha
* Horario del turno
* Cantidad de actividades
* Estado
* Visualizar
* Editar

Ejemplos:

`05/09/2026 | 09:00 - 13:00 | 4 actividades | Guardado`

`03/09/2026 | 09:00 - 13:00 | 6 actividades | Guardado`

`01/09/2026 | 09:00 - 13:00 | 3 actividades | Guardado`

Mantener:

**Visualizar**

**Editar**

Y:

**+ Elaborar nuevo informe**

---

# 11. VISUALIZAR INFORME

Modificar el encabezado del documento.

NO utilizar:

“Universidad — Carrera de Informática y Sistemas”

Utilizar:

# UNIVERSIDAD MAYOR DE SAN SIMÓN

Debajo:

## LABORATORIO DE CÓMPUTO – INFORMÁTICA Y SISTEMAS

Después mantener exactamente la estructura del informe:

### 1. DATOS GENERALES

**Nombre completo:**
Jose Alejandro Montaño Laura

**Fecha:**
Fecha registrada

**Horario:**
09:00 - 13:00

Si el auxiliar utilizó la opción “Otro”, mostrar el horario modificado que registró.

---

### 2. ACTIVIDADES ACADÉMICAS REALIZADAS

Mostrar la tabla:

| Sala | Docente / Responsable | Materia / Actividad | Horario | Observaciones |
| ---- | --------------------- | ------------------- | ------- | ------------- |

Utilizar los datos que fueron registrados.

---

### 3. ACTIVIDADES REALIZADAS EN EL LABORATORIO

Mostrar todas las actividades registradas.

---

### 4. INCIDENCIAS Y OBSERVACIONES

Si existen, mostrar:

**Equipo / Sala / Situación**

**Descripción**

**Acción realizada**

Si no existen:

“No se registraron incidencias durante el turno.”

---

### 5. PENDIENTES

Mostrar los pendientes registrados.

Si no existen:

“No se registraron pendientes.”

Al final:

**Responsable del informe:**
Jose Alejandro Montaño Laura

Mantener los botones:

**← Volver**

**Editar informe**

**Imprimir / Exportar PDF**

---

# 12. EDITAR INFORME

Mantener exactamente la funcionalidad anterior.

Al seleccionar:

**Editar**

abrir el formulario de elaboración con todos los datos existentes.

Los campos deben aparecer rellenados.

Por ejemplo:

Nombre:
`Jose Alejandro Montaño Laura`

Fecha:
`05/09/2026`

Horario del turno:
`09:00 - 13:00`

Sala:
`Sala 2`

Docente:
`Lic. Tatiana Aparicio`

Materia:
`Base de Datos I`

Horario de actividad:
`09:45 - 11:15`

Etc.

Todos los datos deben poder modificarse.

El botón final debe ser:

**Guardar cambios**

Mostrar:

**Informe actualizado correctamente**

---

# 13. IDENTIDAD VISUAL FINAL

La aplicación completa debe utilizar la nueva identidad azul.

No utilizar verde.

Utilizar:

* Azul oscuro para encabezados.
* Azul principal para botones.
* Azul claro para fondos y estados seleccionados.
* Blanco para tarjetas.
* Gris para textos secundarios.
* Rojo únicamente para errores o acciones destructivas.
* Verde únicamente si fuera necesario para indicar “guardado correctamente”, pero no como color de identidad visual.

El resultado debe parecer un sistema institucional real de la:

**Universidad Mayor de San Simón**
**Carrera de Informática y Sistemas**
**Laboratorios de Cómputo**

Mantener todas las interacciones y navegación del prototipo existente.
