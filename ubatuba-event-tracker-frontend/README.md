# Ubatuba Event Tracker 🌊

## Project Overview

Ubatuba Event Tracker is a web application built with React and TypeScript that allows users to discover, create, and manage events in Ubatuba. The application provides a user-friendly interface for viewing upcoming events, with features for authentication and event management.

### Key Features
- View upcoming events in Ubatuba
- Search events by title or location
- Create new events with images and categories
- Edit and delete existing events
- User authentication system
- Responsive design for mobile and desktop

## Deployment

The application is deployed on Vercel and can be accessed at:
[https://ubatuba-event-tracker-frontend.vercel.app/]

### Deployment Process
1. The application is automatically deployed to Vercel when changes are pushed to the main branch
2. Vercel handles the build process using the `npm run build` command
3. Environment variables are configured in the Vercel dashboard
4. The deployment is automatically updated with each push to the main branch

## Setup Instructions

### Prerequisites
- Node.js (v19.0.0 or higher)
- npm, yarn, or pnpm package manager
- Modern web browser
- Internet connection

### Installation

1. Clone the repository:

```bash
git clone git@github.com:gustavolemesleitebarbosa/ubatuba-event-tracker-frontend.git
```

2. Navigate to the project directory:

```bash
cd ubatuba-event-tracker-frontend
```

3. Install dependencies:

```bash
npm install
```
or

```bash
yarn
```
or

```bash
pnpm install
```

4. Create a `.env` file in the root directory with the following content:

```env
VITE_BASE_URL=your_api_base_url
```

5. Start the development server:

```bash
npm run dev
```
or

```bash
yarn dev
```
or

```bash
pnpm dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

### Building for Production

To create a production build:

```bash
npm run build
```
or

```bash
yarn build
```
or

```bash
pnpm build
```

## API Documentation

### Authentication Endpoints

#### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:

```json
{
  "email": "string",
  "password": "string"
}
```

- **Response**: JWT token

#### Signup
- **URL**: `/auth/signup`
- **Method**: `POST`
- **Body**:

```json
{
  "email": "string",
  "password": "string"
}
```

- **Response**: JWT token

### Event Endpoints

#### Get All Events
- **URL**: `/events`
- **Method**: `GET`
- **Response**: Array of events

#### Get Single Event
- **URL**: `/events/:id`
- **Method**: `GET`
- **Response**: Event object

#### Create Event
- **URL**: `/events`
- **Method**: `POST`
- **Authentication**: Required
- **Body**:

```json
{
  "title": "string",
  "description": "string",
  "location": "string",
  "date": "string",
  "category": "string",
  "image": "string"
}
```

#### Update Event
- **URL**: `/events/:id`
- **Method**: `PUT`
- **Authentication**: Required
- **Body**: Same as Create Event

#### Delete Event
- **URL**: `/events/:id`
- **Method**: `DELETE`
- **Authentication**: Required

## Technical Details

### Built With
- React 19
- TypeScript
- Vite
- TailwindCSS
- Shadcn/ui Components
- React Router DOM
- Zod for validation
- React Hot Toast for notifications

### Project Structure

```text
src/
├── components/    # Reusable UI components
├── contexts/      # React contexts
├── pages/         # Page components
├── schemas/       # Validation schemas
├── types/         # TypeScript types
├── utils/         # Utility functions
└── constants/     # Constants and configurations
```

### Authentication
- JWT-based authentication
- Tokens stored in cookies
- Protected routes for authenticated users

### Event Categories
- Music
- Sports
- Education
- Food
- Art
- Literature
- Surf

## Assumptions and Limitations
- Users must be authenticated to create, edit, or delete events
- Image uploads are handled through base64 encoding
- Events are displayed in chronological order
- The application requires a modern browser with JavaScript enabled
- API endpoints must be configured through environment variables

## Testing

The project uses Vitest and React Testing Library for testing. The test suite covers components and pages with unit and integration tests.

### Running Tests

```bash
npm test
```

or

```bash
yarn test
```
or


```bash
pnpm test
```

### Test Structure

The tests are organized by component/page and follow these patterns:

1. **Component Setup**
   - Mock external dependencies (AuthContext, React Router)
   - Define test data
   - Create render helper with providers

2. **Common Test Cases**
   - Initial rendering
   - Loading states
   - Error handling
   - User interactions
   - Authentication-dependent UI elements
