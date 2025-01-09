import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface User {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
}

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      setError("Error fetching users");
      console.error("Failed to fetch users", error);
    }
  };

  const handlePermissionChange = async (
    id: number,
    field: string,
    value: boolean
  ) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user permissions");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, [field]: value } : user
        )
      );
    } catch (error) {
      setError("Error updating user permissions");
      console.error("Failed to update user permissions", error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex w-full h-full p-10 justify-center">
        <div className="flex flex-col justify-center items-center w-full max-w-[1840px]">
          <div className="text-3xl">
            Nie masz uprawnień do przeglądania tej strony.
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex w-full h-full p-10 justify-center">
      <div className="flex flex-col justify-center items-center w-full max-w-[1840px] gap-8 relative">
        <p className="text-3xl">Panel Administracji</p>
        <div className="relative flex flex-col border border-artwena-yellow rounded px-10 py-5 flex-wrap shadow-sm shadow-black gap-4">
          <p className="text-xl">Użytkownicy</p>
          <table className="table-fixed">
            <thead>
              <tr className="">
                <th className="text-start text-artwena-yellow pr-2">Email</th>
                <th className="text-start text-artwena-yellow hidden lg:block pr-2">
                  Imię
                </th>
                <th className="text-start text-artwena-yellow pr-2">Admin</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-artwena-yellow last:border-none"
                >
                  <td className="py-4 pr-2 max-w-[250px] break-words">
                    {user.email}
                  </td>
                  <td className="py-4 pr-2 hidden lg:table-cell max-w-[100px] truncate">
                    {user.name}
                  </td>
                  <td className="py-4 pr-2 text-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-artwena-red hover:accent-artwena-yellow duration-300 cursor-pointer"
                      checked={user.isAdmin}
                      onChange={(e) =>
                        handlePermissionChange(
                          user.id,
                          "isAdmin",
                          e.target.checked
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
