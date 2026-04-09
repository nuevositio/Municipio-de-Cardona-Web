import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, Loader2, Newspaper, Pencil, Plus, Trash2, X } from 'lucide-react'
import { AdminSheet } from '../components/admin-sheet.js'
import { ConfirmModal } from '../components/confirm-modal.js'
import { EmptyState } from '../components/empty-state.js'
import { StatusBadge } from '../components/status-badge.js'
import { FormField, inputCls } from '../components/form-field.js'
import { apiGetNews, apiCreateNews, apiUpdateNews, apiDeleteNews } from '../api/news.js'
import { apiUploadImage } from '../api/upload.js'
import { newsFormSchema, type NewsFormValues } from '../schemas/content.js'
import type { NewsItem } from '../types/index.js'
import { API_BASE } from '../../lib/api-base.js'

// ─────────────────────────────────────────────────────────────────────────────

type SheetMode = 'create' | 'edit' | null

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─────────────────────────────────────────────────────────────────────────────

export function NewsAdminPage() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [sheetMode, setSheetMode] = useState<SheetMode>(null)
  const [selected, setSelected] = useState<NewsItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setLoadError(null)
    try {
      const data = await apiGetNews(50, 0)
      setItems(data.items)
      setTotal(data.total)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Error al cargar noticias.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  function openCreate() { setSelected(null); setSheetMode('create') }
  function openEdit(item: NewsItem) { setSelected(item); setSheetMode('edit') }
  function closeSheet() { setSheetMode(null); setSelected(null) }

  function handleSaved() { closeSheet(); void load() }

  async function handleDeleteConfirm() {
    if (!deletingId) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await apiDeleteNews(deletingId)
      setDeletingId(null)
      void load()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Error al eliminar.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div>
      {/* Cabecera */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[--ink-900]">Noticias</h1>
          <p className="mt-0.5 text-sm text-[--ink-600]">{total} publicacion{total !== 1 ? 'es' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-[--brand-blue] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus size={16} /> Nueva noticia
        </button>
      </div>

      {/* Error de carga */}
      {loadError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
          <button onClick={() => void load()} className="ml-3 font-medium underline">Reintentar</button>
        </div>
      )}

      {/* Cargando */}
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-[--ink-600]" size={28} />
        </div>
      )}

      {/* Vacío */}
      {!loading && !loadError && items.length === 0 && (
        <EmptyState
          title="Sin noticias"
          description="Crea la primera noticia del sitio."
          icon={Newspaper}
          action={
            <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-[--brand-blue] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
              <Plus size={16} /> Nueva noticia
            </button>
          }
        />
      )}

      {/* Tabla */}
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
                        title="Editar"
                        onClick={() => openEdit(item)}
                        className="rounded-lg p-1.5 text-[--ink-600] hover:bg-[--soft-blue] hover:text-[--brand-blue]"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        title="Eliminar"
                        onClick={() => setDeletingId(item.id)}
                        className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-700"
                      >
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

      {/* Sheet */}
      <AdminSheet
        open={sheetMode !== null}
        onClose={closeSheet}
        title={sheetMode === 'create' ? 'Nueva noticia' : 'Editar noticia'}
        width="w-full sm:w-[580px]"
      >
        <NewsForm key={selected?.id ?? 'new'} selected={selected} mode={sheetMode ?? 'create'} onSaved={handleSaved} onClose={closeSheet} />
      </AdminSheet>

      {/* Modal de borrado */}
      <ConfirmModal
        open={deletingId !== null}
        title="¿Eliminar noticia?"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        loading={deleteLoading}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => { setDeletingId(null); setDeleteError(null) }}
      />
      {deleteError && (
        <div className="mt-2 text-xs text-red-600">{deleteError}</div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Formulario de noticia (crear / editar)
// ─────────────────────────────────────────────────────────────────────────────

function NewsForm({
  selected, mode, onSaved, onClose,
}: { selected: NewsItem | null; mode: SheetMode; onSaved: () => void; onClose: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: selected
      ? {
          title:       selected.title,
          slug:        selected.slug ?? '',
          excerpt:     selected.excerpt ?? '',
          content:     selected.content ?? '',
          imageUrl:    selected.imageUrl ?? '',
          publishedAt: selected.publishedAt ? selected.publishedAt.slice(0, 10) : '',
        }
      : { title: '', slug: '', excerpt: '', content: '', imageUrl: '', publishedAt: '' },
  })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [imageFile, setImageFile]     = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    selected?.imageUrl ? `${API_BASE}${selected.imageUrl}` : null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  function clearImage() {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function onSubmit(values: NewsFormValues) {
    setSubmitError(null)
    try {
      let imageUrl = values.imageUrl || undefined

      // Si hay un archivo nuevo, subirlo primero
      if (imageFile) {
        imageUrl = await apiUploadImage(imageFile)
      }

      const payload = {
        title:       values.title,
        excerpt:     values.excerpt,
        content:     values.content,
        slug:        values.slug || undefined,
        imageUrl,
        publishedAt: values.publishedAt || null,
      }
      if (mode === 'create') {
        await apiCreateNews(payload)
      } else if (selected) {
        await apiUpdateNews(selected.id, payload)
      }
      onSaved()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al guardar.')
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
      <FormField label="Título" required error={errors.title?.message}>
        <input type="text" placeholder="Título de la noticia" {...register('title')} className={inputCls(!!errors.title)} />
      </FormField>
      <FormField label="Slug (opcional)" error={errors.slug?.message}>
        <input type="text" placeholder="ej. mi-noticia (generado automáticamente si vacío)" {...register('slug')} className={inputCls(!!errors.slug)} />
      </FormField>
      <FormField label="Extracto" required error={errors.excerpt?.message}>
        <textarea rows={3} placeholder="Resumen breve de la noticia" {...register('excerpt')} className={inputCls(!!errors.excerpt)} />
      </FormField>
      <FormField label="Contenido" required error={errors.content?.message}>
        <textarea rows={8} placeholder="Cuerpo completo de la noticia" {...register('content')} className={inputCls(!!errors.content) + ' min-h-[180px]'} />
      </FormField>

      {/* ── Imagen de portada ───────────────────────────────────────────── */}
      <div>
        <p className="mb-1.5 text-sm font-medium text-[--ink-800]">Imagen de portada <span className="text-[--ink-500]">(opcional)</span></p>
        {imagePreview ? (
          <div className="relative w-full overflow-hidden rounded-xl border border-[--line]">
            <img src={imagePreview} alt="Vista previa" className="h-40 w-full object-cover" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              title="Quitar imagen"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[--line] py-6 text-sm text-[--ink-600] hover:border-[--brand-blue] hover:text-[--brand-blue]"
          >
            <ImagePlus size={18} />
            Seleccionar imagen (JPG, PNG, WEBP · máx 2 MB)
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <FormField label="Fecha de publicación (vacío = borrador)" error={errors.publishedAt?.message}>
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
