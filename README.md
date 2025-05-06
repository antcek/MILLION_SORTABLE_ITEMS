# Test Task - Large Data List Application

This is a full-stack application that demonstrates handling a large dataset (1,000,000 items) with various features:

- Item selection (single and multiple)
- Search filtering
- Drag and drop sorting
- Infinite scrolling (20 items at a time)
- Server-side state persistence
- Sort and selection state preservation on page reload

## Technologies Used

- **Backend**: Express.js
- **Frontend**: React, Material UI
- **Features**: react-beautiful-dnd for drag-and-drop, Intersection Observer for infinite scrolling

## Project Structure

```
test-task/
├── client/         # React frontend
└── server/         # Express backend
```

## How to Run

### Backend Setup

```bash
cd test-task/server
npm install
npm start
```

The server will run on http://localhost:5000

### Frontend Setup

```bash
cd test-task/client
npm install
npm start
```

The client application will run on http://localhost:3000

## Features

1. **Selection**: Click checkboxes to select items (single or multiple)
2. **Search**: Type in the search box to filter items
3. **Drag & Drop**: Use the drag handles to reorder items
4. **Infinite Scrolling**: Scroll down to load more items (20 at a time)
5. **State Persistence**: Refresh the page to see that your selections and sorting are preserved

## API Endpoints

- `GET /api/items`: Get paginated items with optional search
- `POST /api/selection`: Update selected items
- `POST /api/sort`: Update sort order
- `GET /api/state`: Get current user state (selections and sort order)
