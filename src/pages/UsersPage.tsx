// src/pages/UsersPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Sheet,
  Box,
  Stack,
  Typography,
  Input,
  Button,
  Select,
  Option,
  Table,
  Chip,
  IconButton,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/joy";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import AutoFixHigh from "@mui/icons-material/AutoFixHigh";
import Edit from "@mui/icons-material/Edit";
import DeleteForever from "@mui/icons-material/DeleteForever";
import { addUser, listUsers, listRoles, deleteUser, updateUser } from "../lib/api";

/* ─────────────────────────────────── types ────────────────────────────────── */
interface NewUser {
  full_name: string;
  email: string;
  role: number;
  password: string;
}
interface updatedUser {
  full_name: string;
  email: string;
  role: number;
  password: string | null;
}
interface User {
  id: number;
  fullName: string;
  email: string;
  role: string; // role name
}
interface Role {
  id: number;
  name: string;
  description: string | null;
}
type Order = "asc" | "desc";
type OrderBy = keyof User;

/* ─────────────────────────────── helpers ──────────────────────────────────── */
const headerCell = (label: string, active: boolean, order: Order) => (
  <Stack direction="row" alignItems="center" gap={0.5} sx={{ cursor: "pointer" }}>
    {label}
    {active && (order === "asc" ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />)}
  </Stack>
);

const generateRandomPassword = (length = 12) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ───────────────────────────── component ──────────────────────────────────── */
const UsersPage: React.FC = () => {
  /* ─────────── state ─────────── */
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState<NewUser>({
    full_name: "",
    email: "",
    password: "",
    role: 3,
  });

  /* sort */
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<OrderBy>("id");

  /* edit & delete dialogs */
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<NewUser>({
    full_name: "",
    email: "",
    password: "",
    role: 3,
  });

  /* ─────── fetch data ─────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await listUsers();
        if (res.status !== 200) return console.error("Error fetching users:", res.status);
        const mapped: User[] = res.data.map((u: any) => ({
          id: u.id,
          fullName: u.full_name,
          email: u.email,
          role: u.role.name,
        }));
        setUsers(mapped);
      } catch (err) {
        console.error("General error fetching users:", err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await listRoles();
        if (res.status !== 200) return console.error("Error fetching roles:", res.status);
        const rs: Role[] = res.data.map((r: any) => ({
          id: r.id,
          name: r.name,
          description: r.description,
        }));
        setRoles(rs);
      } catch (err) {
        console.error("General error fetching roles:", err);
      }
    })();
  }, []);

  /* ─────── sorting ─────── */
  const sortedUsers = useMemo(() => {
    const cmp = (a: User, b: User) => {
      const k = orderBy;
      return order === "desc"
        ? (b[k] as any) > (a[k] as any)
          ? 1
          : -1
        : (a[k] as any) > (b[k] as any)
        ? 1
        : -1;
    };
    return [...users].sort(cmp);
  }, [users, order, orderBy]);

  const toggleSort = (key: OrderBy) => {
    setOrderBy(key);
    setOrder(orderBy === key && order === "asc" ? "desc" : "asc");
  };

  /* ─────── validation (new user) ─────── */
  const isEmailValid = emailRegex.test(form.email);
  const isFullNameValid = form.full_name.trim().length >= 3 && form.full_name.includes(" ");
  const isFormValid = isEmailValid && isFullNameValid && form.password.length > 0;

  /* ─────── handlers: add user ─────── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.SyntheticEvent | any
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeneratePassword = () =>
    setForm((p) => ({ ...p, password: generateRandomPassword() }));

  const handleAddUser = async () => {
    try {
      const res = await addUser(form);
      if (res.status !== 200) return console.error("Error adding user:", res);
      window.location.reload();
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  /* ─────── handlers: open dialogs ─────── */
  const openEdit = (u: User) => {
    setCurrentUser(u);
    const role = roles.find((r) => r.name === u.role)
    console.log(role)
    const roleId = role?.id ?? 3;
    setEditForm({
      full_name: u.fullName,
      email: u.email,
      password: "",
      role: roleId,
    });
    setEditOpen(true);
  };

  const openDelete = (u: User) => {
    setCurrentUser(u);
    setDeleteOpen(true);
  };

  /* ─────── validation (edit) ─────── */
  const editEmailValid = emailRegex.test(editForm.email);
  const editFullNameValid =
    editForm.full_name.trim().length >= 3 && editForm.full_name.includes(" ");
  const isEditValid = editEmailValid && editFullNameValid;

  /* ─────── handlers: edit ─────── */
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.SyntheticEvent | any
  ) => {
    const { name, value } = e.target;
    console.log(name, value)
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditGeneratePassword = () =>
    setEditForm((p) => ({ ...p, password: generateRandomPassword() }));

  const buildUpdatePayload = () => {
    const payload: Partial<updatedUser> = {
      full_name: editForm.full_name,
      email: editForm.email,
      role: editForm.role,   
    };
    if (editForm.password.trim().length > 0) {
      payload.password = editForm.password; 
    } else payload.password = null;
    return payload;
  };

  const handleUpdateUser = async () => {
    if (!currentUser) return;
    try {
      const payload = buildUpdatePayload()
      console.log("Update payload:", payload);
      const res = await updateUser(currentUser.id, payload);
      console.log("Update response:", res.status);
      if (res.status !== 200) {
        console.error("Error updating user:", res);
        return;
      }
      window.location.reload();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  /* ─────── handlers: delete ─────── */
  const handleDeleteUser = async () => {
    if (!currentUser) return;
    try {
      const res = await deleteUser(currentUser.id);
      if (res.status !== 200) return console.error("Error deleting user:", res);
      window.location.reload();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  /* ──────────────────────────── UI ──────────────────────────── */
  return (
    <>
      {/* Main page */}
      <Stack spacing={3} sx={{ p: 3, width: "100%", maxWidth: 1100, mx: "auto" }}>
        {/* ─── Add-user form ─── */}
        <Sheet variant="outlined" sx={{ p: 3, borderRadius: "lg", bgcolor: "background.level1", boxShadow: "sm" }}>
          <Typography level="h5" fontWeight="lg" mb={2}>
            Add User
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} useFlexGap flexWrap="wrap">
            <Input
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              sx={{ flex: 1, minWidth: 200 }}
              color={isFullNameValid || form.full_name === "" ? "neutral" : "danger"}
              error={!isFullNameValid && form.full_name !== ""}
            />
            <Input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              sx={{ flex: 1, minWidth: 200 }}
              color={isEmailValid || form.email === "" ? "neutral" : "danger"}
              error={!isEmailValid && form.email !== ""}
            />
            <Input
              name="password"
              placeholder="Password"
              type="text"
              value={form.password}
              onChange={handleChange}
              sx={{ flex: 1, minWidth: 180 }}
              startDecorator={
                <IconButton variant="plain" size="sm" onClick={handleGeneratePassword} aria-label="Generate password">
                  <AutoFixHigh />
                </IconButton>
              }
            />
            <Select
              name="role"
              value={form.role}
              onChange={(e, val) => setForm((p) => ({ ...p, role: val as number }))}
              sx={{ minWidth: 150 }}
            >
              {roles.map((r) => (
                <Option key={r.id} value={r.id}>
                  {r.name}
                </Option>
              ))}
            </Select>
            <Button variant="solid" onClick={handleAddUser} disabled={!isFormValid} sx={{ alignSelf: "stretch" }}>
              Add
            </Button>
          </Stack>
        </Sheet>

        {/* ─── Users table ─── */}
        <Sheet variant="outlined" sx={{ p: 2, borderRadius: "lg", bgcolor: "background.level1", boxShadow: "sm" }}>
          <Typography level="h5" fontWeight="lg" mb={2}>
            Users
          </Typography>
          <Box
            sx={{
              maxHeight: 400,
              overflow: "auto",
              borderRadius: "sm",
              "--Scrollbar-thumbColor": "var(--joy-palette-neutral-400)",
              "&::-webkit-scrollbar": { width: 8 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "var(--joy-palette-neutral-400)",
                borderRadius: 4,
              },
              scrollbarWidth: "thin",
            }}
          >
            <Table stickyHeader hoverRow>
              <thead>
                <tr>
                  {(
                    [
                      { id: "id", label: "ID" },
                      { id: "fullName", label: "Full Name" },
                      { id: "email", label: "Email" },
                      { id: "role", label: "Role" },
                      { id: "actions", label: "Actions" },
                    ] as { id: OrderBy | "actions"; label: string }[]
                  ).map((h) => (
                    <th
                      key={h.id}
                      onClick={h.id !== "actions" ? () => toggleSort(h.id as OrderBy) : undefined}
                      style={{ width: h.id === "id" ? 70 : undefined }}
                    >
                      {h.id === "actions" ? h.label : headerCell(h.label, orderBy === h.id, order)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>
                      <Chip color="primary" size="sm" variant="soft">
                        {u.role}
                      </Chip>
                    </td>
                    <td>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="sm" color="primary" onClick={() => openEdit(u)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="sm" color="danger" onClick={() => openDelete(u)}>
                          <DeleteForever />
                        </IconButton>
                      </Stack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>
        </Sheet>
      </Stack>

      {/* ────────────────── Edit dialog ────────────────── */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <ModalDialog sx={{ minWidth: 400 }}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Input
                name="full_name"
                placeholder="Full Name"
                value={editForm.full_name}
                onChange={handleEditChange}
                color={editFullNameValid || editForm.full_name === "" ? "neutral" : "danger"}
                error={!editFullNameValid && editForm.full_name !== ""}
              />
              <Input
                name="email"
                placeholder="Email"
                value={editForm.email}
                onChange={handleEditChange}
                color={editEmailValid || editForm.email === "" ? "neutral" : "danger"}
                error={!editEmailValid && editForm.email !== ""}
              />
              <Input
                name="password"
                placeholder="Password (leave blank to keep current)"
                value={editForm.password}
                onChange={handleEditChange}
                startDecorator={
                  <IconButton variant="plain" size="sm" onClick={handleEditGeneratePassword} aria-label="Generate">
                    <AutoFixHigh />
                  </IconButton>
                }
              />
              <Select
                name="role"
                value={editForm.role}
                onChange={(e, val) => setEditForm((p) => ({ ...p, role: val as number }))}
              >
                {roles.map((r) => (
                  <Option key={r.id} value={r.id}>
                    {r.name}
                  </Option>
                ))}
              </Select>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="plain" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" onClick={handleUpdateUser} disabled={!isEditValid}>
              Save
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      {/* ────────────────── Delete dialog ────────────────── */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <ModalDialog>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete{" "}
            <b>{currentUser?.fullName ?? "this user"}</b>?
          </DialogContent>
          <DialogActions>
            <Button variant="plain" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" color="danger" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default UsersPage;
