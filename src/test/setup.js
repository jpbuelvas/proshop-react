import "@testing-library/jest-dom/vitest";

// jsdom no implementa IntersectionObserver (usado por useReveal para animar
// secciones al hacer scroll); un stub mínimo alcanza para que los componentes
// que lo usan puedan montarse en los tests.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = IntersectionObserverStub;

// jsdom tampoco implementa window.scrollTo; el código lo llama en cada
// cambio de ruta, así que se stubea para no ensuciar la salida de los tests.
window.scrollTo = () => {};
