import { useState, useRef, useEffect, useCallback } from 'react'
import type { Identity } from '../../hooks/useIdentity'
import { doodlePrompts } from '../../data/questions-doodle'
import { supabase } from '../../supabase'

interface DoodleCanvasProps {
  identity: Identity
  partnerName: string
}

interface SavedDoodle {
  id: string
  author: string
  date: string
  prompt: string
  image_base64: string
}

const COLORS = ['#E8734A', '#F4A261', '#7FB069', '#6BA3BE', '#E05555', '#9B7FC1', '#3D2C2E', '#F4D03F']
const BRUSH_SIZES = [2, 4, 6, 8, 12]

export function DoodleCanvas({ identity, partnerName }: DoodleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#E8734A')
  const [brushSize, setBrushSize] = useState(4)
  const [prompt, setPrompt] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [history, setHistory] = useState<SavedDoodle[]>([])
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const loadHistory = useCallback(async () => {
    const { data } = await supabase
      .from('doodles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setHistory(data as SavedDoodle[])
  }, [])

  useEffect(() => { void Promise.resolve().then(loadHistory) }, [loadHistory])

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return
    const size = Math.min(parent.clientWidth - 32, 360)
    const dpr = window.devicePixelRatio || 1
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    canvas.width = size * dpr
    canvas.height = size * dpr
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, size, size)
    }
  }, [])

  useEffect(() => {
    setupCanvas()
    window.addEventListener('resize', setupCanvas)
    return () => window.removeEventListener('resize', setupCanvas)
  }, [setupCanvas])

  const getPos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      const touch = e.touches[0]
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const pos = getPos(e)
    if (!pos) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    lastPos.current = pos
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing) return
    const pos = getPos(e)
    if (!pos) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.strokeStyle = color
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    if (lastPos.current) ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPos.current = pos
  }

  const endDraw = () => {
    setIsDrawing(false)
    lastPos.current = null
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const size = Math.min(canvas.parentElement?.clientWidth ?? 360 - 32, 360)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, size, size)
    setSaved(false)
  }

  const drawPrompt = () => {
    const p = doodlePrompts[Math.floor(Math.random() * doodlePrompts.length)]
    setPrompt(p.text)
  }

  const saveDrawing = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    setSaving(true)
    const imageBase64 = canvas.toDataURL('image/png')
    if (editMode && editingId) {
      await supabase.from('doodles').update({
        image_base64: imageBase64,
        prompt,
      }).eq('id', editingId)
      setSaved(true)
      setEditMode(false)
      setEditingId(null)
    } else {
      await supabase.from('doodles').insert({
        author: identity,
        date: new Date().toISOString().split('T')[0],
        prompt,
        image_base64: imageBase64,
      })
      setSaved(true)
    }
    setSaving(false)
    loadHistory()
  }

  const deleteDoodle = async (id: string) => {
    if (!confirm('确定要删除这幅涂鸦吗？')) return
    setDeleting(id)
    await supabase.from('doodles').delete().eq('id', id)
    setHistory(prev => prev.filter(d => d.id !== id))
    setDeleting(null)
  }

  const startEdit = async (doodle: SavedDoodle) => {
    setEditMode(true)
    setEditingId(doodle.id)
    setPrompt(doodle.prompt)
    setSaved(false)
    await new Promise(r => requestAnimationFrame(r))
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return
    const size = Math.min(parent.clientWidth - 32, 360)
    const dpr = window.devicePixelRatio || 1
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    canvas.width = size * dpr
    canvas.height = size * dpr
    const img = new Image()
    img.onload = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.scale(dpr, dpr)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
    }
    img.src = doodle.image_base64
  }

  const cancelEdit = () => {
    setEditMode(false)
    setEditingId(null)
    clearCanvas()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary text-center">
        {prompt || '点击下方按钮获取涂鸦主题'}
      </p>
      <div className="flex gap-2">
        <button onClick={drawPrompt} className="flex-1 py-2.5 rounded-full bg-warm-100 text-warm-600 text-sm font-medium">
          🎨 换个主题
        </button>
        <button onClick={clearCanvas} className="px-4 py-2.5 rounded-full bg-warm-50 text-text-secondary text-sm border border-warm-200">
          清除画布
        </button>
      </div>

      <div className="flex items-center gap-2 justify-center flex-wrap">
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className="w-8 h-8 rounded-full border-2 transition-transform"
            style={{
              backgroundColor: c,
              borderColor: color === c ? '#3D2C2E' : '#FFFFFF',
              transform: color === c ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        ))}
        <div className="w-px h-6 bg-warm-200 mx-1" />
        <select
          value={brushSize}
          onChange={e => setBrushSize(Number(e.target.value))}
          className="text-xs rounded-lg border border-warm-200 px-2 py-1.5 bg-white min-h-[44px]"
        >
          {BRUSH_SIZES.map(s => <option key={s} value={s}>{s}px</option>)}
        </select>
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          className="border border-warm-200 rounded-xl bg-white touch-none"
        />
      </div>

      {/* Cancel edit button */}
      {editMode && (
        <button onClick={cancelEdit} className="w-full py-2.5 rounded-full border border-warm-300 text-text-secondary text-sm">
          取消编辑
        </button>
      )}

      <button
        onClick={saveDrawing}
        disabled={saving || (!editMode && saved)}
        className={`w-full py-3 rounded-full font-medium text-sm ${
          (saved && !editMode) ? 'bg-green-100 text-green-600' : 'bg-warm-500 text-white'
        }`}
      >
        {saving ? '保存中...' : editMode ? '更新涂鸦' : saved ? '已保存 ✅' : '保存涂鸦'}
      </button>

      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h4 className="font-semibold text-sm text-text-primary mb-3">🖼️ 涂鸦记录</h4>
          <div className="grid grid-cols-3 gap-2">
            {history.map(d => (
              <div key={d.id} className="bg-warm-50 rounded-xl p-1.5 relative group">
                <img src={d.image_base64} alt={d.prompt} className="w-full rounded-lg" />
                <div className="flex items-center justify-between mt-1 px-0.5">
                  <span className="text-[10px] text-text-muted truncate">{d.date}</span>
                  <span className={`text-[10px] px-1 py-0.5 rounded-full ${
                    d.author === identity ? 'bg-warm-100 text-warm-600' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {d.author === identity ? '我' : (partnerName || 'TA')}
                  </span>
                </div>
                {d.author === identity && (
                  <div className="absolute right-2 top-2 flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(d); }}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/85 px-3 text-xs font-medium text-text-secondary shadow-[0_8px_18px_rgba(61,44,46,0.12)]"
                      aria-label="编辑涂鸦"
                    >
                      编辑
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteDoodle(d.id); }}
                      disabled={deleting === d.id}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/85 px-3 text-xs font-medium text-red-400 shadow-[0_8px_18px_rgba(61,44,46,0.12)] disabled:opacity-60"
                      aria-label="删除涂鸦"
                    >
                      {deleting === d.id ? '...' : '删除'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
