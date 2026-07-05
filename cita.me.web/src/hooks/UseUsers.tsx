import { useState, useEffect } from "react";
import { getUsers } from "../services/UsersService";

export const useUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "Error fetching users");
      }
        setLoading(false);
    };
    fetchUsers();
  }, []);

  return { users, loading, error };
}