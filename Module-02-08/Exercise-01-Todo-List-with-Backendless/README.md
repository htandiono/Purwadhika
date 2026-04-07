# Todo List with Backendless Integration

## 1. The Application Flow

When we open the application, several layers of logic work together to ensure a smooth experience:

### Step 1: Boot & Initialization
The app starts at `main.jsx`, which wraps our `App.jsx` in a `ThemeProvider` and `ErrorBoundary`. As soon as `App.jsx` mounts, it triggers the `fetchState()` action from our global store.

### Step 2: Session Recovery (Auth Flow)
Before showing any tasks, we check if we were previously logged in. The app looks for a `user-token` in `localStorage`. If found, it asks Backendless to validate the token. If valid, we are automatically signed in, and our specific tasks are fetched.

### Step 3: Data Retrieval
Once authenticated, we fetch our tasks from the `Todo` table, sorted by their `orderIndex`. This ensures that even if we refresh, our tasks appear exactly in the order we left them.

### Step 4: Display & Interaction
Our `App.jsx` coordinates the rendering. It uses the `useFilteredTodos` hook to decide which tasks to show based on our current search query, filter (All, Active, Completed), and sort preference. 

---

## 2. Project Structure

We organized our project for clarity and scalability:

- **`src/api/`**: Contains our database connection logic.
- **`src/components/`**: The visual building blocks of our application.
- **`src/context/`**: Handles global UI states like the Color Theme (Light/Dark mode).
- **`src/hooks/`**: Reusable logic, specifically for filtering and sorting our data on the fly.
- **`src/store/`**: Our centralized "brain," powered by Zustand, which manages all our tasks and user information.

---

## 3. Component Breakdown

Each component in our app has a specialized role:

### Core UI
- **`App.jsx`**: The command center. It manages the background theme, handles drag-and-drop events, and decides whether to show the `AuthModal`.
- **`Header.jsx`**: Displays our title and provides controls for theme toggling and user profile access.

### Task Management
- **`TodoInput.jsx`**: Captures our new tasks. When we press enter, it triggers a chain reaction that saves the task to the cloud.
- **`TodoList.jsx`**: The container for our tasks. It integrates with `@dnd-kit` to enable reordering.
- **`TodoItem.jsx`**: A complex component that handles checking off a task, editing text, and deleting. It uses "optimistic updates" to feel instantaneous.
- **`TodoControls.jsx`**: Our search bar and sorting dropdown. 
- **`TodoFilters.jsx`**: Positioned at the bottom of the list, it shows our active count and provides status-based filters.

### Authentication
- **`AuthModal.jsx`**: A dual-purpose modal for logging in or registering. It communicates directly with our `authSlice` to manage our identity.

---

## 4. Data & API Management

### How we share info (Zustand)
We split our global state into three "slices" to keep things tidy:
- **`authSlice`**: Manages our login status, user details, and initial loading state.
- **`todoSlice`**: Manages the list of tasks and all actions related to them (add, edit, delete, reorder).
- **`uiSlice`**: Manages search filters and sorting preferences.

### How we talk to the Cloud (Backendless)
We use a library called **Axios** to send messages to the server. There are 3 implementation pattern for Backendless API calls based on the documentation that can be found here https://backendless.com/docs/rest/setup.html and we use the third pattern **Backendless native endpoint** for its ease of implementation and clarity. Here’s the breakdown of our API calls:

1.  **The Security Interceptor**: We never manually add our login key to every request. Instead, we have a "helper" that does it automatically. Please refer to the key logic code snippets on point 5 below.
2.  **Relational Linking**: When we create a task, we don't just save it; we tell Backendless to "link" it specifically to our user account.
3.  **Bulk Deletion**: When we "Clear Completed," we use a single efficient command that tells the database to find and remove multiple tasks at once.

---

## 5. Key Logic Code Snippets

Here are some of the most important logic blocks that make our app work:

### The Security Interceptor
Based on the documentation that can be found here https://axios-http.com/docs/interceptors this code automatically adds our login token to every message before we send it to the database.
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("user-token");
  if (token) {
    config.headers["user-token"] = token;
  }
  return config;
});
```

### Session Recovery
This logic runs the moment the app opens to check if we are already logged in.
```javascript
fetchState: async () => {
  const token = localStorage.getItem("user-token");
  if (!token) {
    set({ isAuthReady: true });
    return;
  }
  try {
    // Validate the token and fetch our data
    await api.get(`/users/isvalidusertoken/${token}`);
    const res = await api.get("/data/Todo", { params: { sortBy: "orderIndex ASC" } });
    set({
      currentUserEmail: localStorage.getItem("user-email"),
      todos: res.data.map((t) => ({ ...t, id: t.objectId })),
      isAuthReady: true
    });
  } catch (error) {
    // Clear data if the session expired
    localStorage.clear();
    set({ isAuthReady: true, currentUserEmail: null, todos: [] });
  }
}
```

### Persistence Logic (Drag and Drop)
When we move a task, we update the local list immediately and then tell the database the new order of *all* tasks.
```javascript
reorderTodos: async (activeId, overId) => {
  let todos = [...get().todos];
  const oldIndex = todos.findIndex((item) => item.id === activeId);
  const newIndex = todos.findIndex((item) => item.id === overId);
  
  // Re-calculate the order for every item
  todos = arrayMove(todos, oldIndex, newIndex);
  todos = todos.map((t, index) => ({ ...t, orderIndex: index }));
  
  set({ todos }); // Update UI immediately

  // Save the new order back to Backendless
  await Promise.all(
    todos.map((t) => api.put(`/data/Todo/${t.id}`, { orderIndex: t.orderIndex }))
  );
}
```

### Adding Tasks with Relations
When we add a task, we save it and then "link" it to our user account.
```javascript
addTodo: async (text) => {
  const newTodo = { text, completed: false, orderIndex: -1 };
  const res = await api.post("/data/Todo", newTodo);
  const savedTodo = res.data;
  
  const userId = localStorage.getItem("user-id");
  if (userId) {
    // Link the new Todo to our specific User account
    await api.put(`/data/Users/${userId}/todos`, [savedTodo.objectId]);
  }
  set({ todos: [savedTodo, ...get().todos] });
}
```

---

## 6. Backendless Table Schema

Below is the database schema for our `Users` and `Todo` tables, showing the one-to-many relationship where each user can own multiple todo items.

![Backendless Table Schema](./src/assets/users-schema.png)

