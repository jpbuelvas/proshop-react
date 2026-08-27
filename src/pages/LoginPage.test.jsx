import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage";
import api from "../services/api";

vi.mock("../services/api", () => ({
  default: { post: vi.fn() },
}));

async function fillAndSubmit(user, { email = "user@example.com", password = "secret1" } = {}) {
  await user.type(screen.getByPlaceholderText("Correo electrónico"), email);
  await user.type(screen.getByPlaceholderText("Contraseña"), password);
  await user.click(screen.getByRole("button", { name: "ENTRAR" }));
}

describe("LoginPage", () => {
  it("login exitoso muestra 'SESIÓN INICIADA' y avisa al padre al continuar", async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValue({ data: { token: "t", user: { name: "Juan Pérez" } } });
    const onSuccess = vi.fn();

    render(<LoginPage onSuccess={onSuccess} onGoRegister={() => {}} onClose={() => {}} />);
    await fillAndSubmit(user);

    expect(await screen.findByText("SESIÓN INICIADA")).toBeInTheDocument();
    expect(screen.getByText(/¡Bienvenido de nuevo, Juan! Ya estás dentro\./)).toBeInTheDocument();

    await user.click(screen.getByText("CONTINUAR"));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("login fallido muestra el mensaje de error del backend, sin cerrar el modal", async () => {
    const user = userEvent.setup();
    api.post.mockRejectedValue({ response: { data: { message: "Credenciales invalidas" } } });
    const onSuccess = vi.fn();

    render(<LoginPage onSuccess={onSuccess} onGoRegister={() => {}} onClose={() => {}} />);
    await fillAndSubmit(user);

    expect(await screen.findByText("Credenciales invalidas")).toBeInTheDocument();
    expect(screen.queryByText("SESIÓN INICIADA")).not.toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
