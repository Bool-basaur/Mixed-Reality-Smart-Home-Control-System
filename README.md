# Mixed-Reality Smart Home Control System

## Backend

Modular backend that was built for the unification, monitoring, and control of Home Assistant devices, supporting HTTP, WebSocket, and Redis.

### Technologies Used
- Node.js con TypeScript
- Express
- WebSocket y REST
- Redis
- Jest
- Docker
- Home Assistant WebSocket API (para el Home Assistant Green)
- It has been tested with the following smart home devices: Google Home Nest Mini, TAPO Smarty Plug, and TCL Android TV.

### Architecture and Project Structure
It was build using a hexagonal architecture, dividing the project structure as it's showed below:

- api/ : It contains the HTTP connection and WebSocket adapters.

- application/ : It contains the use cases and application services.

- domain/ : It includes the core domain model.

- infrastructure/ : It contains external integrations..


### Features

- Integration with Home Assistant via WebSocket

- Device registration and synchronization

- Action execution by capabilities (ONGOING)

- REST API documented with OpenAPI

- Real-time communication via WebSocket

- Optional Redis caching

- Decoupled and testable architecture

- Unit, integration, and E2E test coverage


### Available Execution Modes

- Development with a real HA instance: `npm run dev:ha`

- Development with a mock HA: `npm run dev:mock`

- Running tests: `npm test`

### Docker

- Start environment with real HA
1. `cp .env.ha .env`
2. `docker-compose --profile dev-ha up --build`

- Start environment with a mock HA
1. `cp .env.mock .env`
2. `docker-compose --profile dev-mock up --build`

### Endpoints

Base URL: `http://localhost:3000`

- `GET /devices`

- `GET /devices/:id`

- `POST /devices/:id/actions/:action`

- `GET /health`
