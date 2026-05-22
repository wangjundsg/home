import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export function Toast({ message, type, onClose }: {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500)
    return () => clearTimeout(timer)
  }, [onClose])

  const t = type || 'success'
  let colorClass = 'bg-green-100 text-green-800 border-green-300'
  if (t === 'error') colorClass = 'bg-red-100 text-red-800 border-red-300'
  if (t === 'info') colorClass = 'bg-blue-100 text-blue-800 border-blue-300'

  const cls = 'fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl border text-sm font-medium shadow-lg ' + colorClass

  return createPortal(
    React.createElement('div', {
      className: cls,
      style: { animation: 'slideDown 0.3s ease' }
    }, message),
    document.body
  )
}

export function Modal({ title, children, onClose }: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return createPortal(
    React.createElement('div', {
      className: 'fixed inset-0 z-40 flex items-end justify-center bg-black/30 backdrop-blur-sm',
      onClick: onClose
    },
      React.createElement('div', {
        className: 'w-full max-w-[480px] bg-white rounded-t-3xl max-h-[75vh] overflow-y-auto p-6',
        style: { animation: 'slideUp 0.3s ease' },
        onClick: (e: React.MouseEvent) => e.stopPropagation()
      },
        React.createElement('div', { className: 'flex items-center justify-between mb-4' },
          React.createElement('h2', { className: 'text-lg font-bold text-text-primary' }, title),
          React.createElement('button', {
            onClick: onClose,
            className: 'w-8 h-8 flex items-center justify-center rounded-full hover:bg-warm-100 text-text-muted'
          }, '✕')
        ),
        children
      )
    ),
    document.body
  )
}

export function ConfirmDialog({ title, message, onConfirm, onCancel }: {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return createPortal(
    React.createElement('div', {
      className: 'fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm',
      onClick: onCancel
    },
      React.createElement('div', {
        className: 'bg-white rounded-2xl p-6 mx-6 max-w-sm shadow-xl',
        style: { animation: 'scaleIn 0.2s ease' },
        onClick: (e: React.MouseEvent) => e.stopPropagation()
      },
        React.createElement('h3', { className: 'text-lg font-bold text-text-primary mb-2' }, title),
        React.createElement('p', { className: 'text-text-secondary mb-5' }, message),
        React.createElement('div', { className: 'flex gap-3 justify-end' },
          React.createElement('button', {
            onClick: onCancel,
            className: 'px-5 py-2.5 rounded-full border border-warm-300 text-text-secondary text-sm'
          }, '取消'),
          React.createElement('button', {
            onClick: onConfirm,
            className: 'px-5 py-2.5 rounded-full bg-warm-500 text-white text-sm font-medium'
          }, '确认')
        )
      )
    ),
    document.body
  )
}

export function Particles({ emoji = '💕' }: { emoji?: string }) {
  const [items, setItems] = useState<{ id: number; x: number; delay: number }[]>(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      delay: Math.random() * 0.3
    }))
  })

  useEffect(() => {
    const timer = setTimeout(() => setItems([]), 2000)
    return () => clearTimeout(timer)
  }, [])

  return createPortal(
    React.createElement('div',
      { className: 'fixed inset-0 z-50 pointer-events-none overflow-hidden' },
      items.map(item =>
        React.createElement('span', {
          key: item.id,
          className: 'absolute bottom-1/3 text-2xl',
          style: { left: item.x + '%', animationDelay: item.delay + 's', animation: 'particleUp 1.5s ease-out forwards' }
        }, emoji)
      )
    ),
    document.body
  )
}

export function SyncStatus({ status }: { status: 'synced' | 'pending' | 'offline' }) {
  let dotClass = 'bg-green-500'
  let text = '已同步'
  if (status === 'pending') { dotClass = 'bg-yellow-500'; text = '同步中' }
  if (status === 'offline') { dotClass = 'bg-red-400'; text = '离线' }

  return React.createElement('div', { className: 'flex items-center gap-1.5' },
    React.createElement('span', { className: 'w-2 h-2 rounded-full ' + dotClass }),
    React.createElement('span', { className: 'text-xs text-text-muted' }, text)
  )
}
