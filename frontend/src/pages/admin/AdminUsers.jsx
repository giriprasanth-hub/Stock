import { useEffect, useMemo, useState } from "react";
import {
  getUsers,
  changeUserRole,
  toggleUserStatus,
} from "../../services/userService";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();

      setUsers(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        user.username?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.active) ||
        (statusFilter === "INACTIVE" && !user.active);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  const handleRoleChange = async (user, role) => {
    if (role === user.role) return;

    const confirmed = window.confirm(
      `Change ${user.username}'s role to ${role}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(user.id);
      setError("");
      setSuccess("");

      const updated = await changeUserRole(
        user.id,
        role
      );

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? updated
            : item
        )
      );

      setSuccess(
        `${user.username}'s role updated successfully.`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to change user role."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusToggle = async (user) => {
    const action = user.active
      ? "deactivate"
      : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.username}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(user.id);
      setError("");
      setSuccess("");

      const updated = await toggleUserStatus(
        user.id
      );

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? updated
            : item
        )
      );

      setSuccess(
        `${user.username} is now ${
          updated.active ? "active" : "inactive"
        }.`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update user status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="admin-users">

      {/* HEADER */}

      <div className="admin-users-header">

        <div>
          <span className="eyebrow">
            USER MANAGEMENT
          </span>

          <h1>Users</h1>

          <p>
            Manage SmartStock accounts and permissions.
          </p>
        </div>

        <div className="admin-user-count">
          {filteredUsers.length} users
        </div>

      </div>

      {/* MESSAGES */}

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}

      {success && (
        <div className="auth-success">
          {success}
        </div>
      )}

      {/* FILTERS */}

      <div className="admin-users-toolbar">

        <div className="search-box">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Search username or email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          className="filter-select"
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value)
          }
        >
          <option value="ALL">
            All roles
          </option>

          <option value="USER">
            Users
          </option>

          <option value="ADMIN">
            Admins
          </option>
        </select>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="ALL">
            All status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>
        </select>

      </div>

      {/* TABLE */}

      {loading ? (
        <div className="admin-loading">
          Loading users...
        </div>
      ) : (

        <div className="admin-users-table-wrapper">

          <table className="admin-users-table">

            <thead>

              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredUsers.map((user) => (

                <tr key={user.id}>

                  <td>

                    <div className="admin-user-cell">

                      <div className="user-table-avatar">
                        {user.username
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {user.username}
                        </strong>

                        <small>
                          ID #{user.id}
                        </small>
                      </div>

                    </div>

                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>

                    <select
                      className="role-select"
                      value={user.role}
                      disabled={
                        actionLoading === user.id
                      }
                      onChange={(e) =>
                        handleRoleChange(
                          user,
                          e.target.value
                        )
                      }
                    >
                      <option value="USER">
                        USER
                      </option>

                      <option value="ADMIN">
                        ADMIN
                      </option>
                    </select>

                  </td>

                  <td>

                    <span
                      className={`status-badge ${
                        user.active
                          ? "confirmed"
                          : "cancelled"
                      }`}
                    >
                      {user.active
                        ? "ACTIVE"
                        : "INACTIVE"}
                    </span>

                  </td>

                  <td>
                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "-"}
                  </td>

                  <td>

                    <button
                      className={
                        user.active
                          ? "deactivate-button"
                          : "activate-button"
                      }
                      disabled={
                        actionLoading === user.id
                      }
                      onClick={() =>
                        handleStatusToggle(user)
                      }
                    >
                      {actionLoading === user.id
                        ? "..."
                        : user.active
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredUsers.length === 0 && (
            <div className="admin-empty">
              No users found.
            </div>
          )}

        </div>

      )}

    </div>
  );
}