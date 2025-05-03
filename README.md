

# 📦 REPOSITORIO GPI – Gestión de Configuración

Este repositorio forma parte del proyecto de Gpi del equipo 3 – Blablacar de alquiler de coches.  
Aquí se gestiona el desarrollo de código, documentación y entregas del sistema.

---

## 🧠 ¿Por qué tenemos esta estructura?

Estamos aplicando control de configuración como dice el tema 3 de la asignatura. Eso significa:
- Hay una versión oficial congelada (línea base) por cada ciclo.
- No todo se puede tocar libremente.
- Seguimos un sistema de ramas para no pisarnos y poder revisar lo que se hace.

---

## 🌿 ESTRUCTURA DE RAMAS

- `main`:  
  Versión oficial y estable. Solo se actualiza con autorización del Comité de Configuración (CCC).  
  Aquí están las **líneas base del ciclo 1 (`v1.0_Ciclo1`) y ciclo 2 (`v2.0_Ciclo2`)**.

- `dev`:  
  Aquí trabajamos todos en el código que está en desarrollo. Todo lo nuevo se hace sobre esta rama, mediante mergeo de los tipos de ramas siguientes.

- `feat/XX_descripcion`:  
  Nueva funcionalidad. Ej: `feat/US02_insertar_coches`  
  Donde `XX` es el ID de la historia de usuario (US), si aplica.

- `fix/BUG_descripcion`:  
  Corrección de error. Ej: `fix/BUG01_filtro_oficinas_US01`  
  Donde `BUGxx` identifica errores detectados. Recomendable poner la US relacionada para mayor trazabilidad.

- `docs/DOC_descripcion`:  
  Cambios en documentación. Ej: `docs/DOC01_actualizar_readme`

---

## 🔁 ¿Cómo trabajar correctamente con GitHub?

### 🔧 PASOS:

1. Cambia a la rama `dev` (si no lo has hecho ya):
   ```bash
   git checkout dev
   git pull
   ```

2. Crea una rama nueva a partir de `dev` con el nombre correcto:
   ```bash
   git checkout -b feat/US05_buscador_coches
   ```

3. Haz tus cambios, añade y haz commit:
   ```bash
   git add .
   git commit -m "US05: añadido buscador de coches por marca"
   ```

4. Sube tu rama al repositorio remoto:
   ```bash
   git push origin feat/US05_buscador_coches
   ```

5. Ve a GitHub y haz clic en **"Compare & pull request"** para crear un PR hacia `dev`.

---

## 🧪 ¿Y si encuentro un error después de subir el Pull Request?

| Situación | Qué hacer |
|-----------|-----------|
| ❗ El PR aún no fue aprobado | ✅ Puedes seguir commiteando en la misma rama y haciendo push. GitHub actualiza el PR automáticamente. |
| ✅ El PR ya fue mergeado a `dev` | ❌ No trabajes más en esa rama. Crea una nueva `fix/...` para corregir el error y haz otro PR. |

---

## ✅ Reglas clave

- 🚫 No subas nada a `main`. Está protegido.
- ✔ Trabaja siempre en tu propia rama.
- 🔀 Solo se hace `merge` a `dev` a través de Pull Request.
- 🛠 Los cambios a `main` requieren **Petición de Cambio (PC)** y aprobación del CCC.

---

## 🏷️ Versiones importantes (tags)

| Tag | Qué representa |
|-----|----------------|
| `v1.0_Ciclo1` | Línea base oficial al final del ciclo 1 |
| `v2.0_Ciclo2` | Línea base final del ciclo 2 (cuando se congele) |

---

## 🧰 Recursos útiles

- `VERSION.txt` → contiene la versión actual activa
- `/4_CONFIGURACION/Formularios_PC` → para registrar cambios importantes
- `README_Linea_Base_*` → documentación de cada línea base

---

Si tienes dudas sobre Git, ramas, versiones o control de cambios, pregunta al responsable de configuración (Alejandro).
