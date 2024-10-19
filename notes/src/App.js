import { useState, useEffect } from "react";
import uuid from "react-uuid";
import "./App.css";
import Sidebar from "./Sidebar";
import Main from "./Main";

// Credenciales por defecto (usuarios registrados)
const initialUsers = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [
  {
    username: "usuario",
    password: "contraseña123",
  },
];

function App() {

  const [notes, setNotes] = useState(
    localStorage.notes ? JSON.parse(localStorage.notes) : []
  );
  const [activeNote, setActiveNote] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de autenticación
  const [loginError, setLoginError] = useState(""); // Mensaje de error de login
  const [users, setUsers] = useState(initialUsers); // Estado para usuarios registrados
  const [isCreatingAccount, setIsCreatingAccount] = useState(false); // Estado para manejar el registro

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("users", JSON.stringify(users)); // Guardar usuarios en localStorage
  }, [notes, users]);

  // Función para agregar una nueva nota
  const onAddNote = () => {
    const newNote = {
      id: uuid(),
      title: "Untitled Note",
      body: "",
      lastModified: Date.now(),
    };

    setNotes([newNote, ...notes]);
  };

  // Función para actualizar una nota existente
  const onUpdateNote = (updatedNote) => {
    const updatedNotesArray = notes.map((note) => {
      if (note.id === activeNote) {
        return updatedNote;
      }
      return note;
    });

    setNotes(updatedNotesArray);
  };

  // Función para eliminar una nota
  const onDeleteNote = (idToDelete) => {
    setNotes(notes.filter((note) => note.id !== idToDelete));
  };

  // Obtener la nota activa
  const getActiveNote = () => {
    return notes.find((note) => note.id === activeNote);
  };

  // Función para manejar el login
  const handleLogin = (username, password) => {
    const foundUser = users.find(user => user.username === username && user.password === password);
    if (foundUser) {
      setIsLoggedIn(true); // El usuario está autenticado
      setLoginError(""); // Resetear el mensaje de error
    } else {
      setLoginError("Credenciales incorrectas"); // Mostrar mensaje de error
    }
  };

  // Función para crear una cuenta
  const handleCreateAccount = (username, password) => {
    const userExists = users.find(user => user.username === username);
    if (userExists) {
      setLoginError("El nombre de usuario ya existe");
    } else {
      const newUser = { username, password };
      setUsers([...users, newUser]);
      setLoginError("Cuenta creada con éxito. Ahora inicia sesión.");
      setIsCreatingAccount(false); // Volver a la pantalla de login
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setIsLoggedIn(false); // Cerrar sesión
  };

  // Pantalla de inicio de sesión y registro
  const LoginScreen = () => (
    <div className="login-screen">
      <h2>{isCreatingAccount ? "Crear Cuenta" : "Iniciar Sesión"}</h2>
      {loginError && <p style={{ color: "red" }}>{loginError}</p>}
      <input type="text" placeholder="Usuario" id="username" />
      <input type="password" placeholder="Contraseña" id="password" />
      <button
        onClick={() =>
          isCreatingAccount
            ? handleCreateAccount(
                document.getElementById("username").value,
                document.getElementById("password").value
              )
            : handleLogin(
                document.getElementById("username").value,
                document.getElementById("password").value
              )
        }
      >
        {isCreatingAccount ? "Registrar" : "Iniciar Sesión"}
      </button>
      <button onClick={() => setIsCreatingAccount(!isCreatingAccount)}>
        {isCreatingAccount ? "Volver a Iniciar Sesión" : "Crear Cuenta"}
      </button>
    </div>
  );

  return (
    <div className="App">
      {isLoggedIn ? (
        <>
          <Sidebar
            notes={notes}
            onAddNote={onAddNote}
            onDeleteNote={onDeleteNote}
            activeNote={activeNote}
            setActiveNote={setActiveNote}
          />
          <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} />
          <button onClick={handleLogout} style={{ position: "absolute", top: "10px", right: "10px" }}>
            Cerrar Sesión
          </button>
        </>
      ) : (
        <LoginScreen />
      )}
    </div>
  );
}

export default App;
