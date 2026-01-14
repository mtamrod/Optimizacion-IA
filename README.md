El código fuente principal se encuentra en la rama [`master`](https://github.com/mtamrod/Optimizacion-IA/tree/master).


# RedSocialBuenasPrácticas

Aplicación móvil desarrollada con **Ionic y Angular** cuyo objetivo es aplicar buenas prácticas de optimización de código y analizar su impacto mediante **KPIs (Key Performance Indicators)**, siguiendo los contenidos del **Tema 5: Optimización de código con IA y análisis de KPIs**.

---

## Objetivo del proyecto

El objetivo principal de este proyecto es mejorar el **rendimiento**, la **mantenibilidad** y la **escalabilidad** de una aplicación Ionic/Angular mediante la aplicación de técnicas de optimización, evaluando posteriormente los resultados a través de métricas de rendimiento.

La aplicación se ha diseñado como una versión optimizada (*App B*), centrada en:
- Reducir peticiones HTTP innecesarias
- Mejorar la gestión de componentes y servicios
- Optimizar listas, eventos y observables
- Aplicar lazy loading y cacheo de datos

---

## Buenas prácticas aplicadas

### Optimización en Angular
- Separación clara entre componentes y lógica de negocio.
- Uso de servicios para centralizar datos y peticiones HTTP.
- Eliminación de llamadas HTTP directas desde componentes.
- Uso de `ChangeDetectionStrategy.OnPush`.
- Gestión correcta del estado y de observables mediante `async pipe`.

### Lazy loading
- Uso de rutas con `loadComponent`.
- Carga diferida de las páginas principales (`home`, `detail`, `settings`).
- Reducción del JavaScript inicial descargado.

### Optimización en Ionic
- Uso mayoritario de componentes Ionic (`ion-list`, `ion-item`, `ion-input`, etc.).
- Evita HTML puro en UI crítica.
- Uso de `trackBy` para reducir renderizados innecesarios en listas.

### Gestión de eventos
- Uso de `debounceTime` en búsquedas.
- Evita cálculos pesados en eventos frecuentes.
- Delegación de lógica compleja a servicios.

### Optimización del consumo de APIs
- Centralización de peticiones HTTP en servicios.
- Cache en memoria para reutilización de datos.
- Eliminación de peticiones duplicadas.
- Botón de *refresh* para invalidar cache manualmente.

---

## KPIs obtenidos (App B)

| Categoría | KPI | Valor |
|---------|-----|------|
| Componentes | Llamadas HTTP fuera de servicios | 0 |
| Lazy Loading | Rutas lazy cargadas | 3 |
| Servicios | Peticiones HTTP totales | 1 |
| Observables | Suscripciones activas tras navegación | 0 |
| Listas | Elementos renderizados simultáneamente | 100 |
| Ionic UI | Uso de componentes Ionic en UI crítica | 95% |
| Eventos | Coste medio handler input | ~151 ms |
| Eventos | Debounce aplicado | 150 ms |
| Cache | TTL configurado | 60 s |
| Cache | Refresh explícito | Sí |

Estos valores reflejan una aplicación estable, con bajo consumo de recursos y una arquitectura limpia.

---

## Conclusión

La aplicación presenta unos KPIs coherentes tras aplicar las buenas prácticas de optimización.  
La reducción de peticiones HTTP, la correcta gestión de observables, el uso de lazy loading y la optimización de eventos permiten una experiencia de usuario más fluida y una base de código más mantenible.

El proyecto queda preparado para escalar y añadir nuevas funcionalidades sin comprometer el rendimiento.

---

## Tecnologías utilizadas

- Ionic
- Angular (Standalone)
- RxJS
- TypeScript

---

## Ejecución del proyecto

```bash
npm install
ionic serve
