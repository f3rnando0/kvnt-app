import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { api } from "../api/api.js";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
  [HANDLERS.UPDATE_USER]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = window.localStorage.getItem("authenticated") === "true";
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      try {
        const userDetails = await api.get("/users/@me", {});

        if (userDetails.data._id) {
          dispatch({
            type: HANDLERS.INITIALIZE,
            payload: userDetails.data,
          });
        }
      } catch (error) {
        if (error.message === "Request failed with status code 401") {
          try {
            const refresh = await api.post("/auth/refresh");
            if (refresh.status === 200) {
              const userDetails = await api.get("/users/@me");

              dispatch({
                type: HANDLERS.INITIALIZE,
                payload: userDetails.data,
              });
            }
          } catch (error) {
            if (error.message === "Request failed with status code 400") {
              dispatch({
                type: HANDLERS.INITIALIZE,
              });
            } else if (error.message === "Request failed with status code 404") {
              localStorage.setItem("authenticated", false);
              dispatch({
                type: HANDLERS.SIGN_OUT,
              });
            }
          }
        }
      }
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const signIn = async (email, password) => {
    try {
      const req = await api.post(`/auth/login`, {
        email: email,
        password: password,
      });
      if (req.status === 200) {
        try {
          localStorage.setItem("authenticated", true);
        } catch (err) {
          console.error(err);
        }
      }

      const userDetails = await api.get("/users/@me");

      if (!userDetails) {
        return dispatch({
          type: HANDLERS.INITIALIZE,
        });
      }

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: userDetails.data,
      });
    } catch (error) {
      if (error.message === "Request failed with status code 401")
        throw new Error(error.response.data.message);
      if (error.message === "Request failed with status code 400") {
        if (error.response.data.message === "Você foi banido. Contate o suporte.") {
          throw new Error(`Você foi banido. Contate o suporte.`);
        }
        throw new Error(error.response.data.message[0]);
      }
      throw new Error(error.message);
    }
  };

  const signUp = async (email, name, password) => {
    try {
      const req = await api.post(`/auth/register`, {
        email: email,
        name: name,
        password: password,
      });
      if (req.status === 201) {
        return " .";
      }
    } catch (error) {
      if (error.message === "Request failed with status code 400") {
        if (error.response.data.message === "Já existe um usuário com este email.") {
          throw new Error(`Já existe um usuário com este email.`);
        }
        throw new Error(error.response.data.message[0]);
      }
      throw new Error(error.message);
    }
  };

  const signOut = () => {
    localStorage.setItem("authenticated", false);
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  const updateUser = (user) => {
    dispatch({
      type: HANDLERS.UPDATE_USER,
      payload: user,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
