import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { LogOut, PencilLine, Plus, Trash2 } from 'lucide-react'

import { clearAdminToken } from '@/lib/auth-storage'
import {
  createAdminNews,
  deleteAdminNews,
  getAdminNews,
  getImagePreviewUrl,
  type ApiNewsItem,
  updateAdminNews,
  validateImageFile,
} from '@/lib/news-api'

interface NewsFormState {
  title: string
  slug: string
  excerpt: string
  content: string
  date: string
}

const initialFormState: NewsFormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  date: new Date().toISOString().slice(0, 10),
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function AdminPage() {
  const [news, setNews] = useState<ApiNewsItem[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [selectedItem, setSelectedItem] = useState<ApiNewsItem | null>(null)
  const [form, setForm] = useState<NewsFormState>(initialFormState)
  const [slugTouched, setSlugTouched] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isEditing = Boolean(selectedItem)

  const listTitle = useMemo(() => {
    if (loadingList) {
      return 'Cargando noticias...'
    }

    return `${news.length} noticia${news.length === 1 ? '' : 's'} cargada${news.length === 1 ? '' : 's'}`
  }, [loadingList, news.length])

  function setSuccess(text: string) {
    setMessage({ type: 'success', text })
  }

  function setError(text: string) {
    setMessage({ type: 'error', text })
  }

  function resetForm() {
    setForm(initialFormState)
    setSelectedItem(null)
    setSlugTouched(false)
    setImageFile(null)
    setImagePreview('')
  }

  const loadNews = useCallback(async () => {
    setLoadingList(true)

    try {
      const data = await getAdminNews()
      setNews(data)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'No se pudo cargar el listado.',
      })
    } finally {
      setLoadingList(false)
    }
  }, [])

  useEffect(() => {
    loadNews()
  }, [loadNews])

  function handleTitleChange(value: string) {
    setForm((previous) => ({
      ...previous,
      title: value,
      slug: slugTouched ? previous.slug : slugify(value),
    }))
  }

  function handleSelectImage(file: File | null) {
    if (!file) {
      setImageFile(null)
      setImagePreview(selectedItem ? getImagePreviewUrl(selectedItem.image) : '')
      return
    }

    const validationError = validateImageFile(file)

    if (validationError) {
      setError(validationError)
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function editItem(item: ApiNewsItem) {
    setSelectedItem(item)
    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      date: item.date,
    })
    setSlugTouched(true)
    setImageFile(null)
    setImagePreview(getImagePreviewUrl(item.image))
    setMessage(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSubmitting(true)
    setMessage(null)

    const payload = new FormData()
    payload.append('title', form.title.trim())
    payload.append('slug', form.slug.trim())
    payload.append('excerpt', form.excerpt.trim())
    payload.append('content', form.content.trim())
    payload.append('date', form.date)

    if (imageFile) {
      payload.append('image', imageFile)
    }

    try {
      if (!isEditing) {
        if (!imageFile) {
          setError('Debes seleccionar una imagen destacada.')
          setSubmitting(false)
          return
        }

        await createAdminNews(payload)
        setSuccess('Noticia creada correctamente.')
      } else if (selectedItem) {
        await updateAdminNews(selectedItem.id, payload)
        setSuccess('Noticia actualizada correctamente.')
      }

      await loadNews()
      resetForm()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo guardar la noticia.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(item: ApiNewsItem) {
    const shouldDelete = window.confirm(`Se eliminara la noticia "${item.title}". Esta accion no se puede deshacer.`)

    if (!shouldDelete) {
      return
    }

    try {
      await deleteAdminNews(item.id)
      setSuccess('Noticia eliminada correctamente.')
      if (selectedItem?.id === item.id) {
        resetForm()
      }
      await loadNews()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo eliminar la noticia.')
    }
  }

  function logout() {
    clearAdminToken()
    window.location.href = '/admin/login'
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[--line] bg-white/90 p-6 shadow-xl shadow-[rgba(15,76,129,0.10)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[--brand-green]">Administracion</p>
          <h1 className="mt-1 font-heading text-3xl text-[--ink-900] md:text-4xl">Panel de Noticias</h1>
          <p className="mt-2 text-sm text-[--ink-700]">{listTitle}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-xl border border-[--line] bg-white px-4 py-2 text-sm font-semibold text-[--ink-800] transition hover:border-[--brand-blue] hover:text-[--brand-blue]"
        >
          <LogOut size={16} />
          Cerrar sesion
        </button>
      </header>

      {message ? (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-[--line] bg-white/90 p-5 shadow-lg shadow-[rgba(15,76,129,0.08)] md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-2xl text-[--ink-900]">Noticias</h2>
          </div>

          {loadingList ? (
            <p className="text-sm text-[--ink-700]">Cargando listado...</p>
          ) : news.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[--line] bg-[--soft-gray] p-4 text-sm text-[--ink-700]">
              Aun no hay noticias cargadas.
            </p>
          ) : (
            <ul className="space-y-3">
              {news.map((item) => (
                <li key={item.id} className="rounded-2xl border border-[--line] bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-[--ink-900]">{item.title}</h3>
                      <p className="mt-1 text-xs text-[--ink-600]">/{item.slug} · {item.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => editItem(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[--line] px-3 py-2 text-xs font-semibold text-[--ink-700] transition hover:border-[--brand-blue] hover:text-[--brand-blue]"
                      >
                        <PencilLine size={14} />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-[--line] bg-white/90 p-5 shadow-lg shadow-[rgba(15,76,129,0.08)] md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="font-heading text-2xl text-[--ink-900]">
              {isEditing ? 'Editar noticia' : 'Crear noticia'}
            </h2>
            {isEditing ? (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-lg border border-[--line] px-3 py-2 text-xs font-semibold text-[--ink-700]"
              >
                <Plus size={14} />
                Nueva
              </button>
            ) : null}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[--ink-800]">Titulo</span>
              <input
                className="w-full rounded-xl border border-[--line] px-4 py-3 text-sm outline-none transition focus:border-[--brand-blue]"
                value={form.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[--ink-800]">Slug</span>
              <input
                className="w-full rounded-xl border border-[--line] px-4 py-3 text-sm outline-none transition focus:border-[--brand-blue]"
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true)
                  setForm((previous) => ({ ...previous, slug: slugify(event.target.value) }))
                }}
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[--ink-800]">Resumen</span>
              <textarea
                className="min-h-24 w-full rounded-xl border border-[--line] px-4 py-3 text-sm outline-none transition focus:border-[--brand-blue]"
                value={form.excerpt}
                onChange={(event) => setForm((previous) => ({ ...previous, excerpt: event.target.value }))}
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[--ink-800]">Contenido</span>
              <textarea
                className="min-h-44 w-full rounded-xl border border-[--line] px-4 py-3 text-sm outline-none transition focus:border-[--brand-blue]"
                value={form.content}
                onChange={(event) => setForm((previous) => ({ ...previous, content: event.target.value }))}
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[--ink-800]">Fecha</span>
              <input
                type="date"
                className="w-full rounded-xl border border-[--line] px-4 py-3 text-sm outline-none transition focus:border-[--brand-blue]"
                value={form.date}
                onChange={(event) => setForm((previous) => ({ ...previous, date: event.target.value }))}
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[--ink-800]">Imagen destacada</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(event) => handleSelectImage(event.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-[--line] bg-white px-4 py-3 text-sm text-[--ink-700]"
              />
              <p className="text-xs text-[--ink-600]">
                Formatos: JPG, JPEG, PNG o WEBP. Maximo 1 MB (recomendado entre 512 KB y 1 MB).
              </p>
            </label>

            {imagePreview ? (
              <div className="overflow-hidden rounded-2xl border border-[--line]">
                <img src={imagePreview} alt="Vista previa" className="h-44 w-full object-cover" />
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[--brand-blue] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[--brand-blue-700] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Publicar noticia'}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
