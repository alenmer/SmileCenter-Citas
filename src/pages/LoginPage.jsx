import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { loginApi } from "../services/api";
import { useAuth } from "../components/AuthProvider";
import ErrorBanner from "../components/ErrorBanner";

export default function LoginPage() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const { token, usuario } = await loginApi(username, password);
      login(token, usuario);
      navigate("/dashboard");
    } catch (error) {
      setErrorLogin("Credenciales incorrectas");
    }
  };

  return (
    <>
      {errorLogin && (
        <ErrorBanner mensaje={errorLogin} onClose={() => setErrorLogin("")} />
      )}

      <div className="d-flex flex-column flex-md-row vh-100">
        <div
          className="d-none d-md-block"
          style={{
            flex: "0 0 75%",
            backgroundImage: "url('/login-photo.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <div
          className="d-flex align-items-center justify-content-center flex-column px-4"
          style={{ flex: "0 0 25%" }}
        >
          <img
            src="/logo-smile-center.png"
            alt="Smile Center"
            className="logo-login"
          />

          <div className="w-100" style={{ maxWidth: "300px" }}>
            <div className="mb-3">
              <label className="form-label">Correo:</label>
              <InputText
                value={username}
                onChange={(e) => setUser(e.target.value)}
                className="w-100 input-sistema"
                placeholder="Ingrese el correo con que se registró"
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Contraseña:</label>
              <InputText
                type="password"
                value={password}
                onChange={(e) => setPass(e.target.value)}
                className="w-100 input-sistema"
                placeholder="Ingrese su contraseña"
              />
            </div>

            <div className="text-end mb-3">
              <a href="#" className="link-recuperar">
                ¿Olvidaste la contraseña?
              </a>
            </div>

            <button type="button" className="btn-sistema" onClick={handleLogin}>
              Continuar
            </button>

            <div className="texto-registro">
              <div>¿No tienes una cuenta?</div>
              <a href="#" className="link-registro">
                Regístrate aquí
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
