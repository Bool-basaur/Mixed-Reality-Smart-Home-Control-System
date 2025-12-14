# Mixed-Reality Smart Home Control System

## Backend

Backend modular para la unificación, monitorización y control de dispositivos Home Assistant, con soporte para HTTP, WebSocket y Redis.

### Tecnologías utilizadas
- Node.js con TypeScript
- Express
- WebSocket y REST
- Redis
- Jest
- Docker
- Home Assistant WebSocket API (para el Home Assistant Green)
- Se ha probado con los siguientes dispositivos de domótica: Google Home Nest mini, Enchufe inteligente TAPO, y TV Android TCL.

### Arquitectura y estructura del proyecto
Se ha realizado con arquitectura hexagonal, dividiendo la estructura del proyecto de la siguiente manera:

- api/ : Contiene toda la parte de la conexión HTTP y los WebSocket adapters.

- application/ : Contiene los casos de uso y los servicios de la aplicación.

- domain/ : Incluye toda la parte del code del modelo de dominio.

- infrastructure/ : Contiene las integraciones externas.


### Características

- Integración con Home Assistant vía WebSocket
- Registro y sincronización de dispositivos
- Ejecución de acciones por capacidades (ONGOING)
- API REST documentada con OpenAPI
- Comunicación en tiempo real vía WebSocket
- Cache opcional con Redis
- Arquitectura desacoplada y testeable
- Cobertura de tests unitarios, integración y E2E


### Modos de ejecución disponibles

- Desarrollo con un HA real: `npm run dev:ha`

- Desarrollo con un mock del HA: `npm run dev:mock`

- Ejecución de tests: `npm test`

### Docker

- Levantar entorno con HA real
1. `cp .env.ha .env`
2. `docker-compose --profile dev-ha up --build`

- Levantar entorno con un mock de un HA
1. `cp .env.mock .env`
2. `docker-compose --profile dev-mock up --build`

### Endpoints

URL principal: `http://localhost:3000`

- `GET /devices`

- `GET /devices/:id`

- `POST /devices/:id/actions/:action`

- `GET /health`
