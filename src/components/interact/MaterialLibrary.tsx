import { useMemo, useState } from 'react'
import { Copy, Search, Shuffle } from 'lucide-react'
import type { InteractionMaterial } from '../../data/interact-materials'
import { copyToClipboard } from '../../utils/clipboard'

interface MaterialLibraryProps {
  title: string
  description: string
  materials: readonly InteractionMaterial[]
}

export function MaterialLibrary({ title, description, materials }: MaterialLibraryProps) {
  const [keyword, setKeyword] = useState('')
  const [drawn, setDrawn] = useState<InteractionMaterial | undefined>()
  const [copiedId, setCopiedId] = useState('')

  const filtered = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()
    if (!normalizedKeyword) return materials

    return materials.filter(item => item.title.toLowerCase().includes(normalizedKeyword)
      || item.content.toLowerCase().includes(normalizedKeyword)
      || item.tags.some(tag => tag.toLowerCase().includes(normalizedKeyword)))
  }, [keyword, materials])

  const drawMaterial = () => {
    if (materials.length === 0) return
    setDrawn(materials[Math.floor(Math.random() * materials.length)])
  }

  const copyMaterial = async (item: InteractionMaterial) => {
    const ok = await copyToClipboard(`${item.title}\n${item.content}`)
    if (ok) {
      setCopiedId(item.id)
      window.setTimeout(() => setCopiedId(''), 1400)
    }
  }

  return (
    <div className="pixel-page flex min-h-full flex-col gap-3 px-4 pt-4 pb-8">
      <section className="pixel-card shrink-0 p-4">
        <p className="text-xs font-black text-warm-500">{materials.length} 条素材</p>
        <h2 className="mt-1 text-xl font-black text-text-primary">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
        <button
          type="button"
          onClick={drawMaterial}
          disabled={materials.length === 0}
          className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white shadow-sm disabled:bg-warm-200 disabled:text-text-muted"
        >
          <Shuffle size={16} />
          {drawn ? '再抽一张' : '随机抽一张'}
        </button>
      </section>

      {drawn ? (
        <section className="pixel-card border-warm-200 bg-white p-4">
          <p className="text-xs font-black text-warm-500">本次抽中</p>
          <h3 className="mt-1 text-base font-black text-text-primary">{drawn.title}</h3>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-text-primary">{drawn.content}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {drawn.tags.map(tag => (
              <span key={tag} className="rounded-full bg-warm-100 px-2 py-1 text-[10px] font-black text-warm-600">{tag}</span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void copyMaterial(drawn)}
            className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-text-primary px-4 text-xs font-black text-white"
          >
            <Copy size={14} />
            {copiedId === drawn.id ? '已复制' : '复制这张'}
          </button>
        </section>
      ) : null}

      <section className="pixel-card shrink-0 space-y-3 p-3">
        <label className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-warm-100 bg-white/85 px-3">
          <Search size={16} className="shrink-0 text-warm-500" />
          <input
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            placeholder="搜索标题、内容或标签"
            className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
          />
        </label>
      </section>

      <section className="min-h-0 flex-1 space-y-2 overflow-y-auto pb-1">
        {filtered.length === 0 ? (
          <div className="pixel-card flex min-h-[160px] items-center justify-center p-5 text-center text-sm text-text-muted">
            没有找到匹配素材，换个关键词试试。
          </div>
        ) : filtered.map(item => (
          <article key={item.id} className="pixel-card p-4">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {item.tags.map(tag => (
                <span key={tag} className="rounded-full bg-warm-100 px-2 py-1 text-[10px] font-black text-warm-600">{tag}</span>
              ))}
            </div>
            <h3 className="text-sm font-black text-text-primary">{item.title}</h3>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-text-primary">{item.content}</p>
            <button
              type="button"
              onClick={() => void copyMaterial(item)}
              className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-warm-500 px-4 text-xs font-black text-white shadow-[0_8px_18px_rgba(232,115,74,0.16)]"
            >
              <Copy size={14} />
              {copiedId === item.id ? '已复制' : '复制素材'}
            </button>
          </article>
        ))}
      </section>
    </div>
  )
}
