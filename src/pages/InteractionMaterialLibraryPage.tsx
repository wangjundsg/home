import { MaterialLibrary } from '../components/interact/MaterialLibrary'
import { MATERIAL_LEVEL_META, getMaterialsByLevel, type MaterialLevel } from '../data/interact-materials'

interface InteractionMaterialLibraryPageProps {
  level: MaterialLevel
  navigate?: (route: string) => void
}

export function InteractionMaterialLibraryPage({ level, navigate }: InteractionMaterialLibraryPageProps) {
  const meta = MATERIAL_LEVEL_META.find(item => item.key === level)

  if (!meta) {
    return (
      <div className="pixel-page flex min-h-full items-center justify-center px-6 text-center">
        <div className="pixel-card p-5">
          <h2 className="text-lg font-black text-text-primary">阶段不存在</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">这个阶段还没有准备好，可以返回互动素材库重新选择。</p>
          {navigate ? (
            <button
              type="button"
              onClick={() => navigate('/interact/materials')}
              className="mt-4 min-h-[44px] rounded-2xl bg-warm-500 px-5 text-sm font-black text-white"
            >
              返回素材库
            </button>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <MaterialLibrary
      title={meta.title}
      description={meta.description}
      materials={getMaterialsByLevel(level)}
    />
  )
}
