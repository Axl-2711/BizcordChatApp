# BizCord

## Overview
BizCord is a real-time chat application with chat rooms, built with React and Socket.IO. Open it in several browser tabs to chat live between different users.

## Features
- Username join screen with validation (remembered in LocalStorage)
- Default rooms (General, Technology, Gaming, Movies, Random) plus create/join/switch rooms
- Real-time messaging, timestamps, sender names, message grouping, auto-scroll
- Online users per room and typing indicators
- Enter to send, Shift+Enter for a new line, 500 character limit
- Connection status (connected / reconnecting / server unavailable) and automatic re-join
- Empty and error states, responsive layout with a collapsible mobile sidebar, keyboard-friendly and accessible UI

## Tech Stack
React (Vite), JavaScript ES6+, React Router, Context API, HTML/CSS, Socket.IO client, Node.js, Express, Socket.IO, LocalStorage.

## React Concepts Demonstrated
Functional components and props, `useState`, `useEffect` (with cleanup), `useRef`, `useCallback`, `useContext` and a Context provider (`ChatContext`), a custom hook (`useTyping`), React Router (`/` and `/chat`, redirects), conditional rendering, lists and keys, controlled inputs.

## Socket.IO Concepts
Client/server connection, rooms (`socket.join` / `socket.leave`), broadcasting (`io.to(room)`, `socket.to(room)`), acknowledgements (join callback), automatic reconnection, cleaning up listeners on unmount. Events: `join_room`, `leave_room`, `send_message`, `receive_message`, `user_joined`, `user_left`, `typing`, `stop_typing`, `room_users` (plus `room_list` to sync newly created rooms).

## Project Structure
```
server/server.js        Express + Socket.IO server (in-memory rooms and history)
src/
  components/           Sidebar, RoomList, RoomItem, ChatHeader, MessageList,
                        MessageBubble, MessageInput, TypingIndicator, OnlineUsers, EmptyChat
  pages/                JoinPage, ChatPage
  context/              ChatContext.jsx (shared chat state + socket listeners)
  hooks/                useTyping.js
  services/             socket.js
  utils/                storage.js, format.js
  App.jsx, main.jsx, index.css
```

## How It Works
1. The user picks a username, saved in LocalStorage, and goes to `/chat`.
2. `ChatContext` opens one Socket.IO connection and joins the last used room.
3. The server keeps rooms, users and up to 200 messages per room in memory and broadcasts events to everyone in a room.
4. The context updates messages, online users and typing users; components just read them with `useChat()`.
5. If the connection drops, the client shows the status and re-joins the room automatically on reconnect. Restarting the server clears all rooms and messages.

## Installation
```bash
npm install
```

## Running Frontend
```bash
npm run dev
```
Opens at http://localhost:5173.

## Running Backend
```bash
npm run server
```
Runs at http://localhost:4000. Run it in a second terminal. Optional env vars: `PORT`, `CLIENT_URL` (server) and `VITE_SERVER_URL` (frontend).

## Future Improvements
Persistent storage, authentication, private messages, read receipts, message editing, automated tests.

## Author
Your Name - [GitHub](https://github.com/Axl-2711)
