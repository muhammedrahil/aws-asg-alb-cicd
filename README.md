# Production-Ready Microservices Test Project

This project contains 3 isolated microservices and a Next.js frontend, all containerized with Docker.

## Architecture
- **User Service (Port 8000)**: FastAPI + PostgreSQL. Manages user data.
- **Product Service (Port 8001)**: FastAPI + PostgreSQL. Manages product inventory.
- **Order Service (Port 8002)**: FastAPI + PostgreSQL. Manages orders and validates with User/Product services.
- **Frontend (Port 3000)**: Next.js + Tailwind CSS. A unified dashboard to interact with all services.

## Prerequisites
- Docker and Docker Compose installed.

## How to Run
1. From the root directory, run:
   ```bash
   docker-compose up --build
   ```
2. Wait for all services to start (including databases).
3. Access the services:
   - Dashboard: [http://localhost:3000](http://localhost:3000)
   - User API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
   - Product API Docs: [http://localhost:8001/docs](http://localhost:8001/docs)
   - Order API Docs: [http://localhost:8002/docs](http://localhost:8002/docs)

## Testing the Flow
1. Open the [Dashboard](http://localhost:3000).
2. Click the **"Seed All Services"** button.
3. This will proactively:
   - Create a User in the User Service.
   - Create a Product in the Product Service.
   - Create an Order in the Order Service (which internally verifies the User and Product).
4. Refresh the page to see the data update across all three services.
