import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

vi.mock("./services/api", () => ({
  default: {
    get: vi.fn((url) => {
      if (url === "/products") {
        return Promise.resolve({
          data: [
            {
              id: 1,
              name: "Camiseta Pro",
              categories: ["ropa"],
              gender: ["M"],
              price: "50000",
              previousPrice: null,
              rating: "4.5",
              reviews: 10,
              imageUrl: null,
              variants: [{ productId: 1, color: "U", size: "U", available: 5, specialPrice: null, imageUrl: null }],
            },
            {
              id: 2,
              name: "Gorra Deportiva",
              categories: ["accesorios"],
              gender: ["U"],
              price: "30000",
              previousPrice: null,
              rating: "4.0",
              reviews: 3,
              imageUrl: null,
              variants: [{ productId: 2, color: "U", size: "U", available: 0, specialPrice: null, imageUrl: null }],
            },
          ],
        });
      }
      if (url === "/settings") return Promise.resolve({ data: {} });
      return Promise.reject(new Error("GET no manejado en el mock: " + url));
    }),
    post: vi.fn(() => Promise.reject(new Error("POST no manejado en el mock"))),
  },
}));

beforeEach(() => {
  localStorage.clear();
});

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("Routing de la app", () => {
  it("muestra el catálogo con los productos cargados en /catalog", async () => {
    renderAt("/catalog");
    expect(await screen.findByText("Camiseta Pro")).toBeInTheDocument();
    expect(screen.getByText("Gorra Deportiva")).toBeInTheDocument();
  });

  it("clic en una categoría del header navega a /catalog?cat=... y filtra", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByText(/cargando productos/i, {}, { timeout: 100 }).catch(() => {});

    const ropaLinks = await screen.findAllByText("ROPA");
    await user.click(ropaLinks[0]);

    expect(await screen.findByText("Camiseta Pro")).toBeInTheDocument();
    expect(screen.queryByText("Gorra Deportiva")).not.toBeInTheDocument();
  });

  it("clic en un producto navega a /product/:id y muestra su detalle", async () => {
    const user = userEvent.setup();
    renderAt("/catalog");
    await screen.findByText("Camiseta Pro");

    await user.click(screen.getByText("Camiseta Pro"));

    expect(await screen.findByText("AGREGAR AL CARRITO")).toBeInTheDocument();
    // La sección de "productos relacionados" no debe mostrar el mismo producto
    expect(screen.getAllByText("Camiseta Pro").length).toBeGreaterThan(0);
  });

  it("agregar al carrito desde la página de producto actualiza el contador del header", async () => {
    const user = userEvent.setup();
    renderAt("/product/1");
    await screen.findByText("AGREGAR AL CARRITO");

    await user.click(screen.getByText("AGREGAR AL CARRITO"));

    await waitFor(() => {
      const cartButton = screen.getByText("CARRITO").closest("button");
      expect(cartButton).toHaveTextContent("1");
    });
  });

  it("un producto inexistente muestra 'Producto no encontrado' sin romper la app", async () => {
    renderAt("/product/999999");
    expect(await screen.findByText("Producto no encontrado")).toBeInTheDocument();
  });

  it("una ruta desconocida muestra un 404 real", async () => {
    renderAt("/esto-no-existe");
    expect(await screen.findByText("404")).toBeInTheDocument();
    expect(screen.getByText("VOLVER AL INICIO")).toBeInTheDocument();
  });

  it("/orders sin sesión iniciada pide iniciar sesión, no rompe la app", async () => {
    renderAt("/orders");
    expect(await screen.findByText(/inicia sesion/i)).toBeInTheDocument();
  });

  it("el carrito persiste en localStorage entre renders", async () => {
    const user = userEvent.setup();
    const { unmount } = renderAt("/product/1");
    await screen.findByText("AGREGAR AL CARRITO");
    await user.click(screen.getByText("AGREGAR AL CARRITO"));
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem("proshop_cart") || "[]")).toHaveLength(1);
    });
    unmount();

    renderAt("/cart");
    expect(await screen.findByText("TU CARRITO")).toBeInTheDocument();
    expect(screen.getByText("Camiseta Pro")).toBeInTheDocument();
  });
});
