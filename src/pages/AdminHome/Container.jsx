import { useAuth } from "../../context/AuthContext";

export function useAdminHomeContainer() {
  const { user, empresas } = useAuth();

  return { user, empresas };
}
