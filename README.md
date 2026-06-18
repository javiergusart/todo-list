# My Todos

My Todos is a task manager built with React and Vite. It includes login, protected routes, and full CRUD for todos.

## Live Demo

Not deployed.

## Video Walkthrough

https://youtu.be/qIpF0QVujoM

## GitHub Repository

https://github.com/javiergusart/todo-list

## Features

- Protected routes for login, todos, and profile pages
- Create, edit, delete, and toggle todo completion status
- Filter by status and search by title
- Sort by creation date or title in ascending or descending order
- Friendly loading, empty, and error states
- Input validation plus DOMPurify sanitization for todo titles
- Responsive layout with accessible focus states and touch-friendly controls

## Technologies Used

- React 19
- React Router 7
- Vite 8
- CSS Modules
- DOMPurify
- ESLint

## Getting Started

### Installation

```bash
git clone https://github.com/javiergusart/todo-list.git
cd todo-list
npm install
```

### Environment Setup

Create a local `.env` file in the project root with:

```bash
VITE_TARGET=https://ctd-learns-node-l42tx.ondigitalocean.app
```

### Run Locally

```bash
npm run dev
```

The app runs on http://127.0.0.1:3001.

## Available Scripts

- `npm run dev`: starts the Vite development server
- `npm run build`: creates the production build in `dist`
- `npm run preview`: serves the production build locally for a final check
- `npm run lint`: runs ESLint on the project

## Design Decisions

I used CSS Modules to keep the styling simple and organized. I also added validation and sanitization so todo input is checked before it is sent to the API.

## Future Improvements

- Add tests
- Add more profile details
- Deploy to Vercel

## License

This project is available under the MIT License. See [LICENSE](./LICENSE).

## Contact

- GitHub: https://github.com/javiergusart
