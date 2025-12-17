# 📘 Study tracker

## 🧩 Project Title

Study Tracker

---

## 📑 Table of Contents

- [📘 Study tracker](#-study-tracker)
  - [🧩 Project Title](#-project-title)
  - [📑 Table of Contents](#-table-of-contents)
  - [📄 Overview](#-overview)
  - [🚀 Features](#-features)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [1. Clone the repository](#1-clone-the-repository)
    - [2. Environment variables](#2-environment-variables)
    - [3. Start the back-end](#3-start-the-back-end)
    - [4. Start the front-end](#4-start-the-front-end)
    - [5. Running tests](#5-running-tests)
    - [6. Test login](#6-test-login)
  - [🛠️ Tech Stack](#️-tech-stack)
    - [**Core**](#core)
    - [**Tooling**](#tooling)
  - [Known Issues](#known-issues)
  - [Future Iterations](#future-iterations)

---

## 📄 Overview

This project was originally developed as part of a front-end assessment and has since been further refined as a personal project.

The application is a **study tracker** designed to help users manage and monitor courses across multiple course providers. When courses are spread over different platforms, maintaining a clear overview becomes challenging — this project aims to solve that problem through a centralized interface.

> ⚠️ **Note:** This project is still a work in progress. Some features, styling, and user flows are actively being improved.

---

## 🚀 Features

- **Main page**

  - Dynamic course listing
  - Filtering courses by provider

- **Details page**

  - Detailed course view with nested chapters and lessons (accordion-style)
  - Related courses sidebar using CSS Grid

- **Forms**

  - Add Course form with nested dynamic fields (React Hook Form)

- **Custom hooks**

  - Centralized API data fetching logic

- **Styling**

  - Vanilla CSS used for navbar, main page, filters, and course list
  - Fully responsive, mobile-first layout
  - Tailwind CSS used for detail and form pages (v4 with theme customization)

- **Testing**

  - Component and hook tests using Vitest and React Testing Library

---

## Prerequisites

- Node.js **v24**
- A running **MySQL** server

---

## Getting Started

### 1. Clone the repository

Clone the repository or download the source files.

---

### 2. Environment variables

Both the front-end and back-end require environment variables.

- Copy the `.env.example` file and rename it to `.env`
- Fill in **your own credentials** (database connection, ports, etc.) in the `.env` file

```bash
cp .env.example .env
```

---

### 3. Start the back-end

1. Navigate to the back-end folder:

   ```bash
   cd back-end
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

If the MySQL credentials in your `.env` file are correct, the server will:

- Check if the database exists
- Create and seed the database automatically if it does not
- If needed the database can be reseeded by running the database.js file directly by using the command ```node database.js```

---

### 4. Start the front-end

1. Open a new terminal (the back-end must keep running)
2. Navigate to the front-end folder:

   ```bash
   cd front-end
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The terminal will display the local URL where the application is running.

---

### 5. Running tests

From the `front-end` folder:

- Run tests:

  ```bash
  npm test
  ```

- Run tests with coverage:

  ```bash
  npm run coverage
  ```

---

### 6. Test login

To quickly view a user dashboard with existing course data, you can log in using:

```email
user2@example.com
```

---

## 🛠️ Tech Stack

### **Core**

- React 19
- React Router
- Tailwind CSS v4
- Vanilla CSS (mobile-first)
- Node.js / Express

### **Tooling**

- Vite
- Vitest
- React Testing Library
- ESLint

---

## Known Issues

- Navigation does not display correctly on the course detail page
- Folder structure can be improved
- Current color scheme does not meet optimal contrast ratios
- Some forms are not yet fully implemented or styled
- User profile page exists but is not fully finalized
- Add Provider, Login, and Register pages are not fully styled
- Related courses on the course detail page do not yet link correctly

---

## Future Iterations

- Complete Tailwind CSS implementation across the app
- Apply React Hook Form consistently to all forms
- Improve dashboard styling
- Update color scheme for better accessibility
- Migrate the project to TypeScript
- Enable course enrollment for new users
- Restrict course creation to authenticated users (role-based access)
- Add image uploads for courses (currently uses a placeholder)
