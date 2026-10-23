# Sistema de Gestión Bancaria

Proyecto integrador correspondiente al Módulo 4.
El objetivo es desarrollar progresivamente un sistema bancario utilizando
JavaScript moderno, arquitectura modular, programación orientada a objetos y
programación funcional.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- ECMAScript Modules
- Node.js
- npm
- Git
- GitHub

## Arquitectura

El proyecto utilizará las siguientes capas:

- Models
- Services
- UI
- Utils
- Tests
- AuthService
- registro
- login
- logout
- sesión
- SweetAlert2
- DOM
- eventos
- dashboard.html

## Funcionalidades previstas

Durante las siguientes versiones se desarrollarán:

- Registro de usuarios.
- Inicio de sesión.
- Gestión de cuentas.
- Depósitos.
- Transferencias.
- Historial de movimientos.
- Persistencia con LocalStorage.
- Manipulación del DOM.
- Manejo de eventos.
- Validaciones.
- Formateadores.
- Librerías visuales.
- Pruebas automatizadas con Jest.
- Git y GitHub.

## Modelos

### Usuario

Representa a una persona registrada en el sistema.

### Cuenta

Representa una cuenta bancaria perteneciente a un usuario.

### Movimiento

Representa una operación bancaria.

### Banco

Coordina usuarios, cuentas y movimientos y contiene reglas del dominio bancario.

## Services

### StorageService

Centraliza la comunicación con LocalStorage.

Métodos principales:

- `guardar()`
- `obtener()`
- `eliminar()`
- `limpiar()`

### AuthService

Gestiona autenticación y sesión.

Métodos principales:

- `login()`
- `logout()`
- `getCurrentUser()`
- `protegerRuta()`

### BancoService

Conecta los datos persistidos con los modelos del dominio.

Métodos principales:

- `cargarBanco()`
- `obtenerInstanciaBanco()`
- `recargarBanco()`
- `guardarBanco()`
- `obtenerDatosUsuario()`
- `obtenerResumenUsuario()`

## Dashboard

El dashboard permite mostrar información correspondiente al usuario autenticado.

Actualmente muestra:

- Nombre del usuario.
- Saldo total.
- Cantidad de cuentas.
- Cantidad de movimientos.
- Número de cuenta principal.
- Tipo de cuenta.
- Saldo disponible.

Sus responsabilidades:

- `agregarUsuario()`
- `buscarUsuarioPorId()`
- `agregarCuenta()`
- `buscarCuentaPorId()`
- `buscarCuentaPorNumero()`
- `obtenerCuentasDeUsuario()`
- `registrarMovimiento()`
- `obtenerMovimientosDeCuenta()`
- `realizarDeposito()`

## Versión actual

v0.10.0 — Historial de movimientos y filtros.
