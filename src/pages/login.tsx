"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAuth } from "../contexts/auth-context"
// import {loginAPI} from "../services/auth-service"
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWineBottle } from "@fortawesome/free-solid-svg-icons"

type SignupFormData = {
  email: string;
  password: string;
 
};
const signupSchema = Yup.object().shape({
  email: Yup.string().required("Correo Requerido").email("Correo invalido"),
  password: Yup.string().trim().min(8, 'Debe tener minimo 8 letras').required("Contrasena requerida"),
});

  
const LoginPage: React.FC = () => { 
  const [showPassword, setShowPassword] = useState(false) 
  const [error, setError] = useState<string | null>(null);
  const { loginUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (form: SignupFormData) => {
    try {
      setError(null);
      // console.log("onSubmit: Login API", {email: form.email, });
      await loginUser(form.email, form.password);          
    } catch (error) {
      console.error("Error during login:", error);
    } 
  };

  

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="card shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="fs-2 fw-bold"><span><FontAwesomeIcon icon={faWineBottle} /></span>MADPOS</h2>
            <p className="text-secondary">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email-address" className="form-label">
                Correo electrónico
              </label>
              <input
                id="email-address"               
                type="email"
                autoComplete="email"
                required
                className="form-control"
                {...register("email")}
                placeholder="ejemplo@correo.com"
              />
               {errors.email && <p className="error-message">{errors.email.message}</p>}
              {/* <div className="form-text">
                Prueba con admin@example.com / password123 o cashier@example.com / password123
              </div> */}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="input-group">
                <input
                  id="password"                 
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="form-control"
                  {...register("password")}
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input id="remember-me" type="checkbox" className="form-check-input" />
                <label htmlFor="remember-me" className="form-check-label">
                  Recordarme
                </label>
              </div>

              <a href="#" className="text-decoration-none text-success">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className="btn btn-success w-100">
              {
                "Iniciar sesión"
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;