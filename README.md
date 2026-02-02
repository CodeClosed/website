# ⚡ Vihaan Varshney - Interactive Portfolio

A high-performance, responsive, and interactive personal portfolio website built with **Vanilla JavaScript, HTML5, and CSS3**. This project demonstrates advanced frontend techniques without relying on external frameworks.

## 🚀 Live Demo
[**Click here to view the live site**](https://codeclosed.github.io/portfolio)

## ✨ Key Features

### 🎨 Visuals & UI
*   **Glassmorphism Aesthetic**: Modern, translucent UI elements using `backdrop-filter: blur`, simulating frosted glass.
*   **Interactive Particle Engine**: Custom-built HTML5 Canvas animation where particles repel from the cursor and form connections dynamically.
*   **Dark/Light Mode**: System-aware theme switching with manual override and `localStorage` persistence.
*   **Scroll & Reveal Animations**: Content glides in using `IntersectionObserver` for an immersive scrolling experience.

### 📱 Responsive & Mobile-First
*   **Touch-Friendly Navigation**: A completely custom hamburger menu and sidebar optimized for mobile devices.
*   **Draggable Timeline**: The education section features a horizontal scrolling timeline that supports touch swiping and drag-to-scroll on desktop.
*   **Adaptive Layouts**: Fluid grids and flexbox layouts ensure the site looks perfect on 4K monitors, laptops, tablets, and phones.

## 🛠️ Technical Deep Dive

### Frontend Architecture
*   **Structure**: Semantic HTML5 for accessibility and SEO.
*   **Styling**:
    *   **CSS Custom Properties (Variables)**: Used extensively for consistent theming (colors, spacing, fonts).
    *   **Flexbox & Grid**: For complex, responsive layouts.
    *   **Keyframe Animations**: Pulse effects and transitions.
*   **Scripting**:
    *   **Classes**: Object-Oriented approach for the Particle system.
    *   **Observers**: `IntersectionObserver` used for performance-friendly scroll animations (no scroll event listeners).
    *   **Event Delegation**: Efficient handling of dynamic DOM elements.

### Performance Optimizations
*   **Canvas Optimization**: Particle animation uses efficient frame rendering and clears only necessary areas.
*   **Asset Loading**: Minified images and deferred script loading.
*   **Typing Effect**: Lightweight custom implementation without heavy libraries like Typed.js.

## 📂 Project Structure

```bash
├── index.html         # Main entry point (Semantic Structure)
├── style.css          # Design System, Themes, and Components
├── script.js          # Logic (Particles, Theme, Observers, Typing)
├── dark-hero-bg.png   # Optimized background asset
├── light-hero-bg.png  # Optimized background asset
└── favicon/           # PWA Manifest and Icons effect
```

## ⚙️ How to Run Locally

Since this is a static site, you don't need `npm` or a build process!

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/CodeClosed/portfolio.git
    cd portfolio
    ```

2.  **Launch**
    *   Simply open `index.html` in Chrome, Firefox, or Edge.
    *   *Optional (for best experience)*: Use VS Code "Live Server" extension or Python:
        ```bash
        python -m http.server 8000
        ```
        Then visit `http://localhost:8000`.

## 📬 Connect

*   **LinkedIn**: [Vihaan Varshney](https://www.linkedin.com/in/vihaan-varshney/)
*   **Email**: [vihaan.varshney@outlook.com](mailto:vihaan.varshney@outlook.com)
*   **GitHub**: [CodeClosed](https://github.com/CodeClosed)

---
© 2026 Vihaan Varshney. Built with ❤️ and Code.
