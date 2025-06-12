// src/pages/RolesPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Sheet,
  Box,
  Stack,
  Typography,
  Input,
  Textarea,
  Button,
  Table,
  IconButton,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/joy";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Edit from "@mui/icons-material/Edit";
import DeleteForever from "@mui/icons-material/DeleteForever";
import {
  listRoles,
  addRole,
  updateRole,
  deleteRole,
} from "../lib/api";

/* ───────────────────────── types ───────────────────────── */
interface Role {
  id: number;
  name: string;
  description: string | null;
}
type Order = "asc" | "desc";
type OrderBy = keyof Role;

/* ────────────────────── helpers ────────────────────────── */
const headerCell = (label: string, active: boolean, order: Order) => (
  <Stack direction="row" alignItems="center" gap={0.5} sx={{ cursor: "pointer" }}>
    {label}
    {active && (order === "asc" ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />)}
  </Stack>
);

/* ───────────────────── component ───────────────────────── */
const RolesPage: React.FC = () => {
  /* data */
  const [roles, setRoles] = useState<Role[]>([]);

  /* add-role form */
  const [form, setForm] = useState({ name: "", description: "" });

  /* sort */
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<OrderBy>("id");

  /* dialogs */
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  /* ─ fetch roles ─ */
  useEffect(() => {
    (async () => {
      const res = await listRoles();
      if (res.status !== 200) {
        console.error("Error fetching roles:", res.status);
        return;
      }
      setRoles(
        res.data.map((r: any) => ({
          id: r.id,
          name: r.name,
          description: r.description,
        }))
      );
    })();
  }, []);

  /* ─ sorting ─ */
  const sortedRoles = useMemo(() => {
    const cmp = (a: Role, b: Role) => {
      const k = orderBy;
      const av = a[k] ?? "";
      const bv = b[k] ?? "";
      return order === "desc" ? (bv > av ? 1 : -1) : av > bv ? 1 : -1;
    };
    return [...roles].sort(cmp);
  }, [roles, order, orderBy]);

  const toggleSort = (key: OrderBy) => {
    setOrderBy(key);
    setOrder(orderBy === key && order === "asc" ? "desc" : "asc");
  };

  /* ─ validation ─ */
  const nameValid = form.name.trim().length >= 3;
  const isAddValid = nameValid;

  const editNameValid = editForm.name.trim().length >= 3;
  const isEditValid = editNameValid;

  /* ─ handlers: add ─ */
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddRole = async () => {
    const payload = {
        name: form.name,
        description: form.description,
    }
    console.log(payload);
    const res = await addRole(payload);
    if (res.status !== 200) return console.error("Error adding role:", res);
    window.location.reload();
  };

  /* ─ handlers: open dialogs ─ */
  const openEdit = (r: Role) => {
    setCurrentRole(r);
    setEditForm({ name: r.name, description: r.description ?? "" });
    setEditOpen(true);
  };
  const openDelete = (r: Role) => {
    setCurrentRole(r);
    setDeleteOpen(true);
  };

  /* ─ handlers: edit ─ */
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleUpdateRole = async () => {
    if (!currentRole) return;
    const payload = { ...editForm };
    const res = await updateRole(currentRole.id, payload);
    if (res.status !== 200) return console.error("Error updating role:", res);
    window.location.reload();
  };

  /* ─ handlers: delete ─ */
  const handleDeleteRole = async () => {
    if (!currentRole) return;
    const res = await deleteRole(currentRole.id);
    if (res.status !== 200) return console.error("Error deleting role:", res);
    window.location.reload();
  };

  /* ─────────────────────── UI ─────────────────────── */
  return (
    <>
      <Stack spacing={3} sx={{ p: 3, width: "100%", maxWidth: 900, mx: "auto" }}>
        {/* ─── Add-role form ─── */}
        <Sheet variant="outlined" sx={{ p: 3, borderRadius: "lg", bgcolor: "background.level1", boxShadow: "sm" }}>
          <Typography level="h5" fontWeight="lg" mb={2}>
            Add Role
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} useFlexGap flexWrap="wrap">
            <Input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleAddChange}
              sx={{ flex: 1, minWidth: 200 }}
              color={nameValid || form.name === "" ? "neutral" : "danger"}
              error={!nameValid && form.name !== ""}
            />
            <Textarea
              name="description"
              placeholder="Description (optional)"
              value={form.description}
              onChange={handleAddChange}
              minRows={1}
              sx={{ flex: 2, minWidth: 250 }}
            />
            <Button variant="solid" onClick={handleAddRole} disabled={!isAddValid}>
              Add
            </Button>
          </Stack>
        </Sheet>

        {/* ─── Roles table ─── */}
        <Sheet variant="outlined" sx={{ p: 2, borderRadius: "lg", bgcolor: "background.level1", boxShadow: "sm" }}>
          <Typography level="h5" fontWeight="lg" mb={2}>
            Roles
          </Typography>
          <Box
            sx={{
              maxHeight: 400,
              overflow: "auto",
              borderRadius: "sm",
              "--Scrollbar-thumbColor": "var(--joy-palette-neutral-400)",
              "&::-webkit-scrollbar": { width: 8 },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "var(--joy-palette-neutral-400)", borderRadius: 4 },
              scrollbarWidth: "thin",
            }}
          >
            <Table stickyHeader hoverRow>
              <thead>
                <tr>
                  {(
                    [
                      { id: "id", label: "ID" },
                      { id: "name", label: "Name" },
                      { id: "description", label: "Description" },
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
                {sortedRoles.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td style={{ whiteSpace: "pre-wrap" }}>{r.description}</td>
                    <td>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="sm" color="primary" onClick={() => openEdit(r)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="sm" color="danger" onClick={() => openDelete(r)}>
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

      {/* ─── Edit dialog ─── */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <ModalDialog sx={{ minWidth: 400 }}>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Input
                name="name"
                placeholder="Name"
                value={editForm.name}
                onChange={handleEditChange}
                color={editNameValid || editForm.name === "" ? "neutral" : "danger"}
                error={!editNameValid && editForm.name !== ""}
              />
              <Textarea
                name="description"
                placeholder="Description"
                value={editForm.description}
                onChange={handleEditChange}
                minRows={2}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="plain" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" onClick={handleUpdateRole} disabled={!isEditValid}>
              Save
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      {/* ─── Delete dialog ─── */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <ModalDialog>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Delete role <b>{currentRole?.name ?? "this role"}</b>?
          </DialogContent>
          <DialogActions>
            <Button variant="plain" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" color="danger" onClick={handleDeleteRole}>
              Delete
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default RolesPage;
