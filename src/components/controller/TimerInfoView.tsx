import { useStore } from '@nanostores/solid'
import { Play, Asterisk } from 'lucide-solid'
import { $autoPlay } from '@/stores/mainState'
import { parseTime } from '@/logic/time'
import { $timeServer, $mainState } from '@/composables'
import { Show } from 'solid-js'

export default () => {
  const currentTime = useStore($timeServer.$currentTime)
  const currentLyricLine = $mainState.currentLyricLine
  const isTimerRunning = useStore($timeServer.$isTimerRunning)
  const autoPlay = useStore($autoPlay)

  const handleStartOrPauseTimer = () => {
    if (isTimerRunning()) {
      $mainState.triggerAction({ type: 'set_start_pause', payload: 'pause' })
    } else {
      $mainState.triggerAction({ type: 'set_start_pause', payload: 'start' })
    }
  }

  return (
    <div class="flex items-stretch h-full">
      <div class="flex-1 flex items-center px-4">
        <div class="text-sm op-50 line-clamp-2 select-none">{currentLyricLine()?.data.text}</div>
      </div>
      <Show when={autoPlay()}>
        <div
          class="flex items-center gap-1 px-4 border-l border-base hv-base select-none"
          onClick={handleStartOrPauseTimer}
        >
          { isTimerRunning() ? <Play size={16} /> : <Asterisk size={16} /> }
          <div class="text-sm font-mono">{parseTime(currentTime())}</div>
        </div>
      </Show>
    </div>
  )
}
