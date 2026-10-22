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

### Banco.js

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

v0.6.0 — Registro, autenticación, sesión y SweetAlert2.
