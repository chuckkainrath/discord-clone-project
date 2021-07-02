// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";

const setUser = (user) => ({
    type: SET_USER,
    payload: user
})

const removeUser = () => ({
    type: REMOVE_USER
})



// thunks
export const authenticate = () => async (dispatch) => {
    const response = await fetch('/api/auth/', {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    if (data.errors) {
        return false;
    }
    dispatch(setUser(data))
    return true;
}

export const login = (email, password) => async (dispatch) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    const data = await response.json();
    if (data.errors) {
        return data;
    }
    dispatch(setUser(data));
    return {};
}

export const logout = () => async (dispatch) => {
    const response = await fetch("/api/auth/logout", {
        headers: {
            "Content-Type": "application/json",
        }
    });
    const data = await response.json();
    dispatch(removeUser());
};


export const signUp = (username, email, password, picture) => async (dispatch) => {
    const signupForm = new FormData();
    signupForm.append('username', username);
    signupForm.append('email', email);
    signupForm.append('password', password);
    if (picture) {
        const picType = picture.type;
        const ext = picType.split('/')[1];
        const pictureFile = new File([picture], `profile-pic.${ext}`);
        signupForm.append('profile_img', pictureFile);
      }
    const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: signupForm
    });
    const data = await response.json();
    dispatch(setUser(data));
}

// reducer

const initialState = { user: null };

// useSelector(state => state.session.user)

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return { user: action.payload };
        case REMOVE_USER:
            return { user: null };
        default:
            return state;
    }
}
