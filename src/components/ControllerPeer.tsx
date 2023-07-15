import { createSignal } from 'solid-js'
import { Peer } from 'peerjs'
import { $controllerConnect } from '@/stores/peer'
import type { ConnectState } from '@/types'

export default () => {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())
  const [connectStatus, setConnectStatus] = createSignal<ConnectState>('none')
  const serverOptions = {
    host: '192.168.0.200',
    port: 9000,
  }
  const peer = new Peer('ddiu-peer-controller', serverOptions)

  peer.on('open', (id) => {
    console.log('peer open', id)
    const conn = peer.connect('ddiu-peer-presenter')
    $controllerConnect.set(conn)
    conn.on('open', () => {
      console.log('conn open')
      setConnectStatus('connected')
    })
    conn.on('close', () => {
      console.log('conn close')
      setConnectStatus('none')
    })
    conn.on('error', (err) => {
      console.log('conn error', err)
      setConnectStatus('error')
    })
  })

  peer.on('disconnected', (err) => {
    setConnectStatus('none')
    console.log('peer disconnected', err)
  })
  peer.on('error', (err) => {
    setConnectStatus('error')
    console.log('peer error', err)
  })

  const dotClass = () => ({
    'none': 'bg-gray',
    'connected': 'bg-green-700',
    'error': 'bg-red',
  }[connectStatus()])

  return (
    <div class={`absolute bottom-2 left-2 h-1 w-1 rounded-full ${dotClass()}`} />
  )
}