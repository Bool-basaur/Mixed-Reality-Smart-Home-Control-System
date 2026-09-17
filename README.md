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
- It has been tested with the following smart home devices: Google Home Nest Mini, TAPO Smart Plug, TAPO C210 cameras, and TCL Android TV.

### Responsibilities
The backend is responsible for:

- Retrieving devices from Home Assistant.
- Building unified IoT entities.
- Managing capabilities and actions.
- Storing spatial information.
- Creating spatial contexts.
- Generating spatial digital twins.
- Synchronizing updates in real time through WebSockets.

### Architecture and Project Structure
It was build using a hexagonal architecture, dividing the project structure as it's showed below:

- api/ : It contains the REST controllers, routes, and WebSocket communication.

- application/ : It contains the use cases and application services.

- domain/ : It includes the core business entities and domain models.

- infrastructure/ : It contains Home Assistant integration and persistence mechanisms.


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

#### Health

- `GET /health`

#### Entities

- `GET /entities`

- `GET /entities/count`

- `GET /entities/:id`

- `GET /entities/:id/state`

- `GET /entities/:id/attributes`

- `GET /entities/:id/capabilities`

- `GET /entities/:id/actions`

- `GET /entities/:id/relations`

- `POST /devices/:entityId/actions/:action`


#### Spatial Information

- `POST /spatial-information`

- `GET /spatial-informatio/:entityId`


#### Spatial Contexts

- `GET /spatial-contexts`

- `GET /spatial-contexts/unconfigured`

- `GET /spatial-contexts/:entityId`


#### Spatial Digital Twins

- `GET /spatial-digital-twins`

- `GET /spatial-digital-twins/:entityId`


## Mixed Reality Client

The client application was developed using Unity and Meta Quest 3. The project was initially created from the Unity MR Template and subsequently extended with the functionality required for the implementation of Spatial Digital Twins and Mixed Reality interaction.

### Technologies Used

- Unity
- C#
- Meta Quest 3
- Meta XR SDK
- Mixed Reality Toolkit components

### Responsibilities

The client application is responsible for:

- Retrieving spatial digital twins from the backend.
- Visualizing IoT devices in Mixed Reality.
- Managing spatial configuration.
- Displaying contextual interfaces.
- Executing actions on devices.
- Receiving updates through WebSocket communication.

### Architecture and Project Structure

The Mixed Reality client was developed using Unity and was initially built upon the Unity MR Template, extending the provided functionality with custom components for device visualization, spatial configuration and interaction.

The project structure is organized as follows:

- Api/ : It contains the communication layer used to interact with the backend services.

- Configuration/ : It contains the components responsible for device spatial configuration and configuration state management.

- Devices/ : It contains the logic related to device creation, positioning, visualization and management inside the Mixed Reality environment.

- Models/ : It includes the data models used to represent entities, spatial information and digital twins.

- UI/ : It contains the user interface components and contextual interaction panels.



### Supported Device Categories

The prototype currently supports:

- Sensors
- Actuators
- Hybrid devices