import { useAuthStore } from '../store/authStore';

const useAuth = () => {
  const { user, token, setAuth, logout, updateUser } = useAuthStore();

  const isAdmin = user?.role === 'ADMIN';
  const isFaculty = user?.role === 'FACULTY';
  const isStudent = user?.role === 'STUDENT';
  const isRegistrar = user?.role === 'REGISTRAR';

  return {
    user,
    token,
    setAuth,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin,
    isFaculty,
    isStudent,
    isRegistrar,
    role: user?.role
  };
};

export default useAuth;
