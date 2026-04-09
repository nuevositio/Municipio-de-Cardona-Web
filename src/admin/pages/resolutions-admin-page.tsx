import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, FileCheck2, Loader2, Paperclip, Pencil, Plus, Trash2, X } from 'lucide-react'
import { AdminSheet } from '../components/admin-sheet.js'
import { ConfirmModal } from '../components/confirm-modal.js'
import { EmptyState } from '../components/empty-state.js'
import { StatusBadge } from '../components/status-badge.js'
import { FormField, inputCls } from '../components/form-field.js'
import { apiGetResolutions, apiCreateResolution, apiUpdateResolution, apiDeleteResolution } from '../api/resolutions.js'
import { apiUploadPdf } from '../api/upload.js'
import { resolutionFormSchema, type ResolutionFormValues } from '../schemas/content.js'
import type { ResolutionItem } from '../types/index.js'

// ─────────────────────────────────────────────────────────────────────────────

type SheetMode = 'create' | 'edit' | null

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─────────────────────────────────────────────────────────────────────────────

export function ResolutionsAdminPage() {
  const [items, setItems] = useState<ResolutionItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [sheetMode, setSheetMode] = useState<SheetMode>(null)
  const [selected, setSelected] = useState<ResolutionItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setLoadError(null)
    try {
      const data = await apiGetResolutions(50, 0)
      setItems(data.items)
      setTotal(data.total)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Error al cargar resoluciones.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  function openCreate() { setSelected(null); setSheetMode('create') }
  function openEdit(item: ResolutionItem) { setSelected(item); setSheetMode('edit') }
  function closeSheet() { setSheetMode(null); setSelected(null) }
  function handleSaved() { closeSheet(); void load() }

  async function handleDeleteConfirm() {
    if (!deletingId) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await apiDeleteResolution(deletingId)
      setDeletingId(null)
      void load()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Error al eliminar.')
    } finally {
      setDeleteLoading(false)
    }
  }

  async function handleTogglePublish(item: ResolutionItem) {
    const newPublishedAt = item.publishedAt ? null : new Date().toISOString().slice(0, 10)
    try {
      await apiUpdateResolution(item.id, { publishedAt: newPublishedAt })
      void load()
    } catch {
      // silencioso — el usuario verá que no cambió el estado
    }
  }

  return (
    <div>
      {/* Cabecera */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[--ink-900]">Resoluciones</h1>
          <p className="mt-0.5 text-sm text-[--ink-600]">{total} resolución{total !== 1 ? 'es' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-[--brand-blue] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus size={16} /> Nueva resolución
        </button>
      </div>

      {loadError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
          <button onClick={() => void load()} className="ml-3 font-medium underline">Reintentar</button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-[--ink-600]" size={28} />
        </div>
      )}

      {!loading && !loadError && items.length === 0 && (
        <EmptyState
          title="Sin resoluciones"
          description="Publica la primera resolución municipal."
          icon={FileCheck2}
          action={
            <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-[--brand-blue] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
              <Plus size={16} /> Nueva resolución
            </button>
          }
        />
      )}

      {!loading && items.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-[--line] bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-[--line] bg-[--soft-gray] text-xs uppercase tracking-wider text-[--ink-600]">
              <tr>
                <th className="px-4 py-3 text-left">Título</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Fecha</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--line]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[--soft-blue]/50">
                  <td className="px-4 py-3">
                    <p className="max-w-xs truncate font-semibold text-[--ink-900]">{item.title}</p>
                    <p className="truncate text-xs text-[--ink-600]">{item.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge publishedAt={item.publishedAt} />
                  </td>
                  <td className="hidden px-4 py-3 text-[--ink-600] md:table-cell">
                    {fmtDate(item.publishedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title={item.publishedAt ? 'Despublicar' : 'Publicar ahora'}
                        onClick={() => void handleTogglePublish(item)}
                        className={`rounded-lg p-1.5 hover:bg-[--soft-blue] ${
                          item.publishedAt ? 'text-[--brand-green] hover:text-[--brand-blue]' : 'text-[--ink-400] hover:text-[--brand-green]'
                        }`}
                      >
                        {item.publishedAt ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button title="Editar" onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-[--ink-600] hover:bg-[--soft-blue] hover:text-[--brand-blue]">
                        <Pencil size={14} />
                      </button>
                      <button title="Eliminar" onClick={() => setDeletingId(item.id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-700">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminSheet
        open={sheetMode !== null}
        onClose={closeSheet}
        title={sheetMode === 'create' ? 'Nueva resolución' : 'Editar resolución'}
      >
        <ResolutionForm
          key={selected?.id ?? 'new'}
          selected={selected}
          mode={sheetMode ?? 'create'}
          onSaved={handleSaved}
          onClose={closeSheet}
        />
      </AdminSheet>

      <ConfirmModal
        open={deletingId !== null}
        title="¿Eliminar resolución?"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        loading={deleteLoading}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => { setDeletingId(null); setDeleteError(null) }}
      />
      {deleteError && <div className="mt-2 text-xs text-red-600">{deleteError}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Formulario de resolución (crear / editar)
// ─────────────────────────────────────────────────────────────────────────────

function ResolutionForm({
  selected, mode, onSaved, onClose,
}: { selected: ResolutionItem | null; mode: SheetMode; onSaved: () => void; onClose: () => void }) {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ResolutionFormValues>({
    resolver: zodResolver(resolutionFormSchema),
    defaultValues: selected
      ? {
          title:       selected.title,
          slug:        selected.slug ?? '',
          summary:     selected.summary ?? '',
          fileUrl:     selected.fileUrl ?? '',
          publishedAt: selected.publishedAt ? selected.publishedAt.slice(0, 10) : '',
        }
      : { title: '', slug: '', summary: '', fileUrl: '', publishedAt: new Date().toISOString().slice(0, 10) },
  })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [pdfFile, setPdfFile]         = useState<File | null>(null)
  const [pdfName, setPdfName]         = useState<string | null>(
    selected?.fileUrl ? selected.fileUrl.split('/').pop() ?? null : null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setPdfFile(file)
    if (file) {
      setPdfName(file.name)
      setValue('fileUrl', file.name, { shouldValidate: true })
    }
  }

  function clearPdf() {
    setPdfFile(null)
    setPdfName(null)
    setValue('fileUrl', '')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function onSubmit(values: ResolutionFormValues) {
    setSubmitError(null)
    try {
      let fileUrl = values.fileUrl

      if (pdfFile) {
        fileUrl = await apiUploadPdf(pdfFile)
      }

      if (!fileUrl) {
        setSubmitError('Debe seleccionar un archivo PDF.')
        return
      }

      const payload = {
        title:       values.title,
        fileUrl,
        slug:        values.slug || undefined,
        summary:     values.summary || undefined,
        publishedAt: values.publishedAt || null,
      }
      if (mode === 'create') {
        await apiCreateResolution(payload)
      } else if (selected) {
        await apiUpdateResolution(selected.id, payload)
      }
      onSaved()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al guardar.')
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
      <FormField label="Título" required error={errors.title?.message}>
        <input type="text" placeholder="Ej. Resolución N° 47 – Aprobación de presupuesto" {...register('title')} className={inputCls(!!errors.title)} />
      </FormField>
      <FormField label="Slug (opcional)" error={errors.slug?.message}>
        <input type="text" placeholder="Generado automáticamente si se deja vacío" {...register('slug')} className={inputCls(!!errors.slug)} />
      </FormField>
      <FormField label="Resumen (opcional)" error={errors.summary?.message}>
        <textarea rows={3} placeholder="Breve descripción de la resolución…" {...register('summary')} className={inputCls(!!errors.summary)} />
      </FormField>

      {/* ── Archivo PDF ────────────────────────────────────────────────── */}
      <div>
        <p className="mb-1.5 text-sm font-medium text-[--ink-800]">Archivo PDF <span className="text-red-500">*</span></p>
        {pdfName ? (
          <div className="flex items-center gap-3 rounded-xl border border-[--line] bg-[--soft-blue] px-4 py-2.5">
            <FileCheck2 size={16} className="shrink-0 text-[--brand-blue]" />
            <span className="min-w-0 flex-1 truncate text-sm text-[--ink-900]">{pdfName}</span>
            <button type="button" onClick={clearPdf} className="shrink-0 rounded-lg p-1 text-[--ink-600] hover:text-red-600" title="Quitar">
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[--line] py-5 text-sm text-[--ink-600] hover:border-[--brand-blue] hover:text-[--brand-blue]"
          >
            <Paperclip size={16} />
            Seleccionar PDF (máx 5 MB)
          </button>
        )}
        {errors.fileUrl && !pdfFile && !pdfName && (
          <p className="mt-1 text-xs text-red-600">{errors.fileUrl.message}</p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <FormField label="Fecha de publicación (borrar para guardar como borrador)" error={errors.publishedAt?.message}>
        <input type="date" {...register('publishedAt')} className={inputCls(!!errors.publishedAt)} />
      </FormField>
      {submitError && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{submitError}</p>}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-[--line] px-4 py-2.5 text-sm font-semibold text-[--ink-800] hover:bg-[--soft-blue]">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[--brand-blue] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          {mode === 'create' ? 'Publicar' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
