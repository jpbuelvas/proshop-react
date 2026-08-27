import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "./RegisterPage";
import api from "../services/api";

vi.mock("../services/api", () => ({
  default: { post: vi.fn() },
}));

async function fillAndSubmit(user, { name = "Ana Gómez", email = "ana@example.com", password = "secret1" } = {}) {
  await user.type(screen.getByPlaceholderText("Nombre completo"), name);
  await user.type(screen.getByPlaceholderText("Correo electrónico"), email);
  await user.type(screen.getByPlaceholderText("Contraseña (mínimo 6 caracteres)"), password);
  await user.click(screen.getByRole("button", { name: "CREAR CUENTA" }));
}

describe("RegisterPage", () => {
  it("registro exitoso muestra 'CUENTA CREADA' y avisa al padre al continuar", async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValue({ data: { token: "t", user: { name: "Ana Gómez" } } });
    const onSuccess = vi.fn();

    render(<RegisterPage onSuccess={onSuccess} onGoLogin={() => {}} onClose={() => {}} />);
    await fillAndSubmit(user);

    expect(await screen.findByText("CUENTA CREADA")).toBeInTheDocument();
    expect(screen.getByText(/¡Bienvenido, Ana! Ya estás dentro\./)).toBeInTheDocument();

    await user.click(screen.getByText("CONTINUAR"));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("email duplicado muestra el error del backend, sin cerrar el modal", async () => {
    const user = userEvent.setup();
    api.post.mockRejectedValue({ response: { data: { message: "El email ya esta registrado" } } });
    const onSuccess = vi.fn();

    render(<RegisterPage onSuccess={onSuccess} onGoLogin={() => {}} onClose={() => {}} />);
    await fillAndSubmit(user);

    expect(await screen.findByText("El email ya esta registrado")).toBeInTheDocument();
    expect(screen.queryByText("CUENTA CREADA")).not.toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
