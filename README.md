# Mini RRHH — Módulo de Capacitaciones

Proyecto base con el módulo de **Empleados** (provisto por el docente) y el nuevo módulo de
**Capacitaciones**, implementado siguiendo el mismo patrón de arquitectura, componentes y estilo
de código ya usado en la aplicación.

## Descripción del módulo de Capacitaciones

Ruta protegida `/capacitaciones` que funciona como un dashboard para la gestión de capacitaciones
de la empresa. Permite:

- Ver tarjetas de estadísticas: total de capacitaciones, en curso y finalizadas.
- Buscar capacitaciones por nombre y filtrar por estado (`programada`, `en_curso`, `finalizada`,
  `cancelada`).
- Visualizar cada capacitación en un componente tipo tarjeta (`TrainingCard`), con instructor,
  fechas, cupo/inscritos y categoría.
- Crear y editar capacitaciones mediante un modal con formulario validado (React Hook Form + Zod),
  reutilizando el mismo componente `Modal` del módulo de Empleados.
- Eliminar una capacitación, con confirmación previa.
- Manejo de estados de carga, error y "sin resultados".

### Entidad `Training`

```ts
interface Training {
  id: number;
  nombre: string;
  categoria: TrainingCategory; // 'Tecnología' | 'Liderazgo' | 'Seguridad' | 'Ventas' | 'Habilidades Blandas' | 'Cumplimiento'
  instructor: string;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string;    // YYYY-MM-DD
  cupoMaximo: number;
  inscritos: number;
  estado: 'programada' | 'en_curso' | 'finalizada' | 'cancelada';
  descripcion?: string;
}
```

## Tecnologías utilizadas

- React 19 + TypeScript
- Vite
- TailwindCSS (mobile-first)
- React Router DOM (rutas protegidas)
- TanStack Query (fetching, cache e invalidación)
- React Hook Form + Zod (formularios y validación)
- Zustand (estado de autenticación)
- Axios (cliente HTTP)
- json-server (mock API, usando `db.json`)

## Instalación y ejecución local

1. Clonar el repositorio e instalar dependencias:

   ```bash
   git clone https://github.com/Vielman-18/p2-desarrollo.git
   cd p2-desarrollo
   npm install
   ```

2. Levantar el **mock API** (json-server) en una terminal:

   ```bash
   npm run mock-api
   ```

   Esto sirve `db.json` en `http://localhost:3001` (incluye las colecciones `employees` y
   `trainings`).

3. En otra terminal, levantar el frontend:

   ```bash
   npm run dev
   ```

4. Abrir `http://localhost:5173` en el navegador. Login de prueba:

   | Email | Contraseña |
   |---|---|
   | admin@empresa.com | 123456 |
   | rrhh@empresa.com | 123456 |
   | empleado@empresa.com | 123456 |

5. Ir al menú **Capacitaciones** en el header para usar el nuevo módulo.

## Despliegue

- Frontend desplegado en: _(agregar aquí el enlace de Vercel/Netlify/Render una vez desplegado)_
- Nota: el mock API (`json-server`) corre solo en local. Para producción, considerar desplegar
  `db.json` con un servicio como [json-server en Render](https://render.com) o migrar a un backend
  real, y actualizar la variable `VITE_API_URL` apuntando a esa URL.

## Capturas de pantalla

_(agregar aquí capturas de la aplicación funcionando: dashboard, módulo de Empleados y módulo de
Capacitaciones con el modal de creación/edición)_
