# Vite React App
This is a React application bootstrapped with Vite, a fast and lightweight build tool. This project includes a multiplayer grid feature with real-time updates via Socket.IO.

## Requirements
Node.js (version >= 14.0)
npm (or yarn)

## Getting Started
Follow the steps below to set up and run the app locally.

### Installing

### 1. Clone the repo

```bash
  git clone https://github.com/Vignes07/candidate-app.git
```
```bash
   cd multiplayer-grid-game
```
```bash
   cd client
```

## 2. Install NPM packages

```bash
  npm install
```

## 3. Set up environment variables
   Create a .env file in the root of your project and add the following:

```
VITE_APP_SOCKET_URL=<your-socket-url>
```
Replace <your-socket-url> with the URL of your backend Socket.IO server.

## 4. Run the development server
   Once the dependencies are installed and the environment variables are set up, start the development server using the following command:

```bash
  npm run dev
```
Or, if using yarn:
```bash
  yarn dev
```
This will start the Vite development server, and you can access your app at http://localhost:5173.

### 5. Open the app in your browser
   Once the server is running, open your browser and navigate to:

http://localhost:5173
You should see the app running locally.

### 6. Build for production
   To build the project for production, run:

```bash
  npm run build
```
Or, if using yarn:

```bash
    yarn build
```
This will create an optimized production build in the dist/ folder.

### 7. Preview the production build
   To preview the production build locally, run:

```bash
  npm run preview
```
Or, if using yarn:

```bash
    yarn preview
```
This will start a preview server and allow you to test the production version of the app.

# Features
- Real-Time Updates: The grid updates in real-time for all connected players via Socket.IO.
- Timed Restriction: After submitting a block, players must wait 1 minute before they can make another update.
- Grid Updates: Players can select and update a block with a Unicode character in a 10x10 grid.
- Historical Updates: View the historical updates made to the grid.
