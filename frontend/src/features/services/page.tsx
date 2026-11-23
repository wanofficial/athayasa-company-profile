
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Wrench,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Layers3,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { isAxiosError } from "axios";
import AdminPageLoading from "@/components/admin/AdminPageLoading";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";

import {
  createService,
  deleteService,
  getServices,
  updateService,
  type Service,
  type ServicePayload,
} from "@/features/services/services.api";

import ServicesTable from "@/features/services/components/ServicesTable";
import ServiceFormModal from "@/features/services/components/ServiceFormModal";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (isAxiosError(error)) {
      if (error.response?.status === 422) {
        return Object.values(error.response.data.errors || {})
          .flat()
          .join(" ");
      }

      if (error.response?.status === 401) {
        return "Your session has expired. Please login again.";
      }

      if (error.response?.status === 403) {
        return "You do not have permission to perform this action.";
      }

      return error.response?.data?.message || fallback;
    }

    return fallback;
  };

  const loadServices = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getServices({
        search,
        status,
        page: currentPage,
      });

      setServices(result.services);
      setCurrentPage(result.pagination.current_page);
      setLastPage(result.pagination.last_page);
      setTotal(result.pagination.total);
    } catch (error) {
      setMessage(getErrorMessage(error, "Unable to load services."));
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [search, status, currentPage]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadServices();
    }, search ? 350 : 0);

    return () => clearTimeout(timeout);
  }, [loadServices, search]);

  const openCreateModal = () => {
    setSelectedService(null);
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleSave = async (payload: ServicePayload) => {
    setSaving(true);
    setMessage("");

    try {
      if (selectedService) {
        await updateService(selectedService.id, payload);
        setMessage("Service has been updated successfully.");
      } else {
        await createService(payload);
        setMessage("New service has been created successfully.");
      }

      setMessageType("success");
      setModalOpen(false);
      setSelectedService(null);

      await loadServices();
    } catch (error) {
      setMessage(getErrorMessage(error, "Unable to save service."));
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (service: Service) => {
    setServiceToDelete(service);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete || deleting) return;
    setDeleting(true);
    setMessage("");

    try {
      await deleteService(serviceToDelete.id);

      setMessage("Service has been deleted successfully.");
      setMessageType("success");
      setServiceToDelete(null);

      if (services.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        await loadServices();
      }
    } catch (error) {
      setMessage(getErrorMessage(error, "Unable to delete service."));
      setMessageType("error");
      setServiceToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  if (loading && services.length === 0) {
    return <AdminPageLoading label="Memuat layanan..." />;
  }

  return (
    <div className="mx-auto max-w-[1450px] space-y-7 pb-12 text-white">

      {/* Header */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
              <Wrench size={17} />
            </span>

            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Website Management
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[34px]">
            Services Management
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Manage your company's services and control how they appear on the
            public website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#111827] px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            <span className="text-xs text-slate-400">
              Service Management
            </span>
          </div>

          <button
            onClick={loadServices}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/[0.09] bg-[#111827] px-4 py-3 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:bg-[#182235] disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827] p-5">
          <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-indigo-500/[0.08] blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Total Services</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {total}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Registered services
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
              <Layers3 size={21} />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827] p-5">
          <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-emerald-500/[0.07] blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Current Page</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {currentPage}
                <span className="ml-2 text-base font-medium text-slate-500">
                  / {lastPage}
                </span>
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Service list pagination
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {message && (
        <div
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            messageType === "success"
              ? "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-400"
              : "border-red-500/20 bg-red-500/[0.07] text-red-400"
          }`}
        >
          {messageType === "success" ? (
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
          )}
          <span>{message}</span>

          <button
            onClick={() => setMessage("")}
            className="ml-auto text-current opacity-60 hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}

      {/* Table */}
      <ServicesTable
        services={services}
        loading={loading}
        search={search}
        status={status}
        currentPage={currentPage}
        lastPage={lastPage}
        total={total}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setCurrentPage(1);
        }}
        onRefresh={loadServices}
        onAdd={openCreateModal}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onPageChange={setCurrentPage}
      />

      {/* Information */}
      <div className="flex items-start gap-3 rounded-2xl border border-indigo-500/15 bg-indigo-500/[0.04] p-5">
        <Sparkles size={17} className="mt-0.5 shrink-0 text-indigo-400" />
        <div>
          <p className="text-xs font-semibold text-indigo-300">
            Service Management Information
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Only services marked as Active should be displayed on the public
            website. Use Display Order to control their arrangement.
          </p>
        </div>
      </div>

      {/* Form Modal */}
      <ServiceFormModal
        open={modalOpen}
        service={selectedService}
        saving={saving}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setSelectedService(null);
          }
        }}
        onSubmit={handleSave}
      />

      <DeleteConfirmDialog
        open={serviceToDelete !== null}
        itemName={serviceToDelete?.title ?? ""}
        itemType="layanan"
        pending={deleting}
        onCancel={() => setServiceToDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
