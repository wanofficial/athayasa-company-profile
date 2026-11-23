"use client";

import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { AlertCircle, Building2, CheckCircle2, ChevronLeft, ChevronRight, Pencil, Plus, RefreshCw, Search, Trash2, Upload, X } from "lucide-react";
import AdminPageLoading from "@/components/admin/AdminPageLoading";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  getCustomerLogoUrl,
  updateCustomer,
  type Customer,
  type CustomerPayload,
} from "./customers.api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<{ current_page: number; last_page: number; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({ name: "", website_url: "", short_description: "", sort_order: 0, is_featured: false, is_active: true });
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const errorText = (error: unknown) => {
    if (isAxiosError(error)) {
      const data = error.response?.data;
      if (data?.errors) return Object.values(data.errors).flat().join(" ");
      if (data?.message) return data.message;
    }
    return "Terjadi kesalahan. Silakan coba kembali.";
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCustomers({ search: search || undefined, status: status || undefined, page });
      setCustomers(result.customers);
      setPagination(result.pagination);
    } catch (error) {
      setNotice({ type: "error", text: errorText(error) });
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    const timeout = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(timeout);
  }, [load, search]);

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timeout);
  }, [notice]);

  const openCreate = () => {
    setSelected(null);
    setForm({ name: "", website_url: "", short_description: "", sort_order: 0, is_featured: false, is_active: true });
    setLogo(null);
    setPreview(null);
    setModalOpen(true);
  };

  const openEdit = (customer: Customer) => {
    setSelected(customer);
    setForm({ name: customer.name, website_url: customer.website_url || "", short_description: customer.short_description || "", sort_order: customer.sort_order, is_featured: customer.is_featured, is_active: customer.is_active });
    setLogo(null);
    setPreview(getCustomerLogoUrl(customer.logo));
    setModalOpen(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload: CustomerPayload = { ...form, logo };
      if (selected) await updateCustomer(selected.id, payload);
      else await createCustomer(payload);
      setNotice({ type: "success", text: selected ? "Customer berhasil diperbarui." : "Customer berhasil ditambahkan." });
      setModalOpen(false);
      await load();
    } catch (error) {
      setNotice({ type: "error", text: errorText(error) });
    } finally {
      setSaving(false);
    }
  };

  const remove = (customer: Customer) => {
    setCustomerToDelete(customer);
  };

  const confirmDelete = async () => {
    if (!customerToDelete || deleting) return;
    setDeleting(true);
    try {
      await deleteCustomer(customerToDelete.id);
      setNotice({ type: "success", text: "Customer berhasil dihapus." });
      setCustomerToDelete(null);
      if (customers.length === 1 && page > 1) setPage(page - 1);
      else await load();
    } catch (error) {
      setNotice({ type: "error", text: errorText(error) });
      setCustomerToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-white/[0.08] bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500";

  if (loading && customers.length === 0) {
    return <AdminPageLoading label="Memuat pelanggan..." />;
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="fixed right-5 top-5 z-[200] flex max-w-md items-start gap-3 rounded-xl border border-white/10 bg-slate-900 p-4 shadow-2xl">
          {notice.type === "success" ? <CheckCircle2 className="text-emerald-400" size={20} /> : <AlertCircle className="text-red-400" size={20} />}
          <p className="flex-1 text-sm text-slate-200">{notice.text}</p>
          <button onClick={() => setNotice(null)}><X size={17} /></button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-3"><Building2 className="h-6 w-6 text-indigo-400" /></div>
        <div><h1 className="text-2xl font-semibold text-white">Customers Management</h1><p className="mt-1 text-sm text-slate-400">Kelola logo dan daftar customer untuk landing page.</p></div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/60">
        <div className="flex flex-col gap-3 border-b border-white/[0.06] p-5 lg:flex-row lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative flex-1 sm:max-w-md"><Search size={17} className="absolute left-3.5 top-3.5 text-slate-500" /><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari customer..." className={`${inputClass} pl-10`} /></div>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={`${inputClass} sm:w-40`}><option value="">Semua Status</option><option value="1">Active</option><option value="0">Inactive</option></select>
          </div>
          <div className="flex gap-2"><button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300"><RefreshCw size={15} className={loading ? "animate-spin" : ""} />Refresh</button><button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white"><Plus size={16} />Add Customer</button></div>
        </div>

        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-slate-500"><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Website</th><th className="px-5 py-4">Order</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-white/[0.05]">
          {loading ? <tr><td colSpan={5} className="px-5 py-16 text-center text-slate-400">Loading customers...</td></tr> : customers.length === 0 ? <tr><td colSpan={5} className="px-5 py-16 text-center"><Building2 className="mx-auto text-slate-600" /><p className="mt-3 text-sm text-slate-300">Belum ada customer</p></td></tr> : customers.map((customer) => (
            <tr key={customer.id} className="transition hover:bg-white/[0.02]"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white p-1">{getCustomerLogoUrl(customer.logo) ? <img src={getCustomerLogoUrl(customer.logo)!} alt={customer.name} className="max-h-full max-w-full object-contain" /> : <Building2 className="text-slate-400" size={20} />}</div><div><p className="text-sm font-semibold text-white">{customer.name}</p><p className="mt-1 max-w-[280px] truncate text-xs text-slate-500">{customer.short_description || "Tidak ada deskripsi"}</p></div></div></td><td className="px-5 py-4 text-xs text-slate-400">{customer.website_url ? <a href={customer.website_url} target="_blank" className="text-indigo-400 hover:underline">{customer.website_url}</a> : "-"}</td><td className="px-5 py-4 text-xs text-slate-400">{customer.sort_order}{customer.is_featured ? <span className="ml-2 rounded bg-amber-500/10 px-2 py-1 text-[10px] text-amber-400">Featured</span> : null}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] ${customer.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"}`}>{customer.is_active ? "Active" : "Inactive"}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => openEdit(customer)} className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white"><Pencil size={15} /></button><button onClick={() => remove(customer)} className="rounded-lg border border-red-500/10 p-2 text-red-400 hover:bg-red-500/10"><Trash2 size={15} /></button></div></td></tr>
          ))}
        </tbody></table></div>

        {pagination && <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-4"><p className="text-xs text-slate-500">{pagination.total} customers</p><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-white/10 p-2 disabled:opacity-30"><ChevronLeft size={16} /></button><span className="px-3 py-2 text-xs text-slate-400">{page} / {pagination.last_page}</span><button disabled={page >= pagination.last_page} onClick={() => setPage(page + 1)} className="rounded-lg border border-white/10 p-2 disabled:opacity-30"><ChevronRight size={16} /></button></div></div>}
      </section>

      {modalOpen && <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"><div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"><div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5"><div><h2 className="font-semibold text-white">{selected ? "Edit Customer" : "Create Customer"}</h2><p className="mt-1 text-xs text-slate-500">Masukkan informasi customer.</p></div><button onClick={() => setModalOpen(false)} disabled={saving} className="p-2 text-slate-400"><X size={18} /></button></div><form onSubmit={submit} className="space-y-5 p-6">
        <div><label className="mb-2 block text-xs font-semibold text-slate-400">Nama Customer *</label><input required maxLength={255} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Contoh: PT ABC" /></div>
        <div><label className="mb-2 block text-xs font-semibold text-slate-400">Website URL</label><input type="url" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} className={inputClass} placeholder="https://example.com" /></div>
        <div><label className="mb-2 block text-xs font-semibold text-slate-400">Deskripsi Customer</label><textarea maxLength={10000} rows={5} value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className={`${inputClass} resize-y`} /></div>
        <div><label className="mb-2 block text-xs font-semibold text-slate-400">Logo Customer</label><label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-white/10 bg-slate-950 p-4">{preview ? <img src={preview} alt="Preview" className="h-16 w-16 rounded-lg bg-white object-contain p-2" /> : <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400"><Upload size={20} /></div>}<div><p className="text-sm text-slate-300">Pilih logo</p><p className="text-xs text-slate-500">JPG, PNG atau WEBP, maks. 5 MB</p></div><input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const file = e.target.files?.[0] || null; if (file) setPreview(URL.createObjectURL(file)); setLogo(file); }} /></label></div>
        <div className="grid grid-cols-2 gap-4"><div><label className="mb-2 block text-xs font-semibold text-slate-400">Urutan</label><input type="number" min={0} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={inputClass} /></div><div className="flex items-end gap-5 pb-3"><label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />Featured</label><label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />Active</label></div></div>
        <div className="flex justify-end gap-3 border-t border-white/[0.07] pt-5"><button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300">Batal</button><button disabled={saving} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan Customer"}</button></div>
      </form></div></div>}

      <DeleteConfirmDialog
        open={customerToDelete !== null}
        itemName={customerToDelete?.name ?? ""}
        itemType="pelanggan"
        pending={deleting}
        onCancel={() => setCustomerToDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
