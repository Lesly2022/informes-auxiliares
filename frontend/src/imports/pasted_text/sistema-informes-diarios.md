## ESTILO VISUAL

Diseña una interfaz institucional, moderna, profesional y limpia.

* Fondo general: gris muy claro / blanco.
* Color principal: verde institucional oscuro.
* Utilizar blanco para tarjetas y formularios.
* Bordes ligeramente redondeados.
* Sombras suaves.
* Tipografía moderna y legible.
* Iconografía sencilla y consistente.
* Diseño desktop-first, pero responsive.
* Evitar una apariencia excesivamente corporativa o recargada.
* Priorizar facilidad de uso, ya que los auxiliares utilizarán el sistema diariamente.
* Utilizar una barra lateral o navegación superior consistente en las pantallas internas.
* Mostrar claramente títulos, subtítulos, botones primarios y estados.

El sistema debe sentirse como una aplicación web real, no como una presentación.

---

# 1. PANTALLA DE LOGIN

Crear una pantalla de inicio de sesión centrada.

Título:

**Sistema de Informes Diarios**

Subtítulo:

**Laboratorios de Cómputo – Informática y Sistemas**

Formulario:

**Código SISS**
Campo de texto con placeholder:
“Ingresa tu código SISS”

**Número de Carnet**
Campo de texto con placeholder:
“Ingresa tu número de carnet”

Botón principal:

**Ingresar**

Agregar debajo una pequeña nota:

“Ingresa tus datos institucionales para acceder al sistema.”

Al hacer clic en “Ingresar”, llevar al Dashboard.

Para el prototipo utilizar estos datos ficticios:

Código SISS:
`202400123`

Carnet:
`12345678`

Al ingresar correctamente, reconocer automáticamente al auxiliar.

---

# 2. DASHBOARD / INICIO

Crear una pantalla principal después del login.

En la parte superior mostrar:

**Sistema de Informes Diarios**

Y el usuario conectado.

Crear una tarjeta de información del auxiliar:

**Datos del auxiliar**

Nombre completo:
**Juan Pérez López**

Cargo:
**Auxiliar de Laboratorio de Cómputo**

Código SISS:
**202400123**

Carnet:
**12345678**

Estos datos deben aparecer automáticamente después del login.

Debajo crear dos tarjetas grandes como opciones principales:

### Elaborar informe

Icono relacionado con documento o formulario.

Texto:

“Registrar las actividades realizadas durante el turno.”

Botón:
**Elaborar informe**

### Informes pasados

Icono relacionado con historial/documentos.

Texto:

“Consultar, visualizar y editar informes anteriores.”

Botón:
**Ver informes**

Agregar una barra lateral con:

* Inicio
* Elaborar informe
* Informes pasados
* Mi perfil
* Cerrar sesión

---

# 3. PANTALLA “ELABORAR INFORME”

Título:

**Elaborar informe diario**

Subtítulo:

“Registra las actividades realizadas durante tu turno.”

Mostrar un indicador de progreso opcional:

**1. Datos generales → 2. Actividades → 3. Incidencias → 4. Guardar**

## SECCIÓN 1 – DATOS GENERALES

Crear una tarjeta titulada:

**1. Datos Generales**

Campo:

**Nombre completo**

Debe estar automáticamente rellenado:

`Juan Pérez López`

El campo debe aparecer bloqueado/no editable.

Campo:

**Fecha**

Input de tipo fecha.

Campo:

**Horario**

Input o selector para registrar el horario del auxiliar.

Estos campos deben ser visibles y claros.

---

# 4. SECCIÓN 2 – ACTIVIDADES ACADÉMICAS REALIZADAS

Crear una tarjeta titulada:

**2. Actividades Académicas Realizadas**

Debajo mostrar una pequeña descripción:

“Registra las clases, prácticas, talleres, cursos u otras actividades desarrolladas en los laboratorios.”

Esta sección NO es obligatoria.

Crear una tabla/formulario dinámico con las siguientes columnas:

* Sala
* Docente / Responsable
* Materia / Actividad
* Horario
* Observaciones
* Acción

## SALA

Crear un menú desplegable con:

* Sala 1
* Sala 2
* Sala 3
* Sala 4
* Laboratorio de Redes

## DOCENTE / RESPONSABLE

Crear un menú desplegable con:

* Lic. Tatiana Aparicio
* Lic. Marcelo Antezana
* Lic. Jimmy Villarroel
* Otro

Cuando el usuario seleccione **“Otro”**, mostrar automáticamente un campo de texto:

**Especificar docente / responsable**

Placeholder:

“Escriba el nombre del docente o responsable”

## MATERIA / ACTIVIDAD

Menú desplegable:

* Base de Datos I
* Informática Forense
* Métodos, Técnicas y Taller de Programación
* Otra

Cuando seleccione “Otra”, mostrar:

**Especificar materia / actividad**

## HORARIO

Menú desplegable con:

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

## OBSERVACIONES

Campo de texto opcional.

Placeholder:

“Escriba alguna observación si corresponde…”

Al final de la fila colocar un botón pequeño para eliminar la actividad.

Debajo de la tabla colocar:

**+ Agregar actividad académica**

Este botón debe permitir agregar otra fila para registrar varias actividades durante el mismo turno.

---

# 5. SECCIÓN 3 – ACTIVIDADES REALIZADAS EN EL LABORATORIO

Crear una tarjeta titulada:

**3. Actividades Realizadas en el Laboratorio**

Descripción:

“Detalla las tareas de administración, soporte y funcionamiento de los Laboratorios de Cómputo realizadas durante el turno.”

Esta sección es OBLIGATORIA.

Crear varios campos tipo textarea.

Mostrar inicialmente 4 campos numerados:

**Actividad 1**
Placeholder:
“Describa la actividad realizada…”

**Actividad 2**
Placeholder:
“Describa la actividad realizada…”

**Actividad 3**
Placeholder:
“Describa la actividad realizada…”

**Actividad 4**
Placeholder:
“Describa la actividad realizada…”

Permitir agregar más actividades mediante:

**+ Agregar actividad**

Las actividades pueden incluir ejemplos como:

* Instalación o actualización de software.
* Configuración de equipos.
* Revisión de computadoras.
* Apoyo a estudiantes o docentes.
* Configuración de red.
* Mantenimiento básico.
* Organización de ambientes.
* Preparación de laboratorios para clases.

Mostrar la palabra:

**Obligatorio**

junto al título de esta sección.

---

# 6. SECCIÓN 4 – INCIDENCIAS Y OBSERVACIONES

Crear una tarjeta:

**4. Incidencias y Observaciones**

Descripción:

“Registra problemas, fallas, novedades o situaciones relevantes presentadas durante el turno.”

Esta sección es OPCIONAL.

Agregar tres campos:

### Equipo / Sala / Situación

Campo de texto.

Placeholder:

“Ej.: PC-15 / Sala 2 / Problema de conexión”

### Descripción

Textarea.

Placeholder:

“Describa la incidencia o situación presentada…”

### Acción realizada

Textarea.

Placeholder:

“Describa las acciones realizadas para solucionar o atender la situación…”

Agregar una opción:

**+ Agregar otra incidencia**

Debe poder existir cero, una o varias incidencias.

Mostrar:

**Opcional**

---

# 7. SECCIÓN 5 – PENDIENTES

Crear una tarjeta:

**5. Pendientes**

Descripción:

“Registra actividades, problemas o requerimientos que no pudieron ser concluidos y deberán ser atendidos posteriormente.”

Esta sección es OPCIONAL.

Crear varios campos:

**Pendiente 1**
Textarea.

**Pendiente 2**
Textarea.

**Pendiente 3**
Textarea.

Botón:

**+ Agregar pendiente**

Al final agregar:

### Estado / recomendación para el siguiente turno

Textarea.

Placeholder:

“Indique el estado actual o la recomendación para el siguiente turno…”

Mostrar:

**Opcional**

---
