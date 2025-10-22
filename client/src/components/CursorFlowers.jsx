import { useEffect, useRef } from 'react'

function CursorFlowers() {
  const canvasRef = useRef(null)
  const animationRef = useRef(0)
  const particlesRef = useRef([])
  const lastSpawnTimeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const flowerChars = ['✿', '❀', '❁', '✾']

    function spawnParticles(x, y) {
      const now = performance.now()
      if (now - lastSpawnTimeRef.current < 16) return // 限流 ~60fps
      lastSpawnTimeRef.current = now

      const count = 8 + Math.floor(Math.random() * 6)
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.5 + Math.random() * 1.5
        const size = 12 + Math.random() * 12
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          life: 0,
          maxLife: 800 + Math.random() * 600,
          char: flowerChars[(Math.random() * flowerChars.length) | 0],
          size,
          hue: Math.floor(300 + Math.random() * 60) // 柔和的粉/紫区间
        })
      }
    }

    function onMove(e) {
      const x = e.clientX
      const y = e.clientY
      spawnParticles(x, y)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        spawnParticles(e.touches[0].clientX, e.touches[0].clientY)
      }
    }, { passive: true })

    function draw() {
      const particles = particlesRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const now = performance.now()
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life += 16
        if (p.life > p.maxLife) {
          particles.splice(i, 1)
          continue
        }
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.01 // 轻微下坠
        p.rotation += p.rotationSpeed

        const alpha = 1 - p.life / p.maxLife
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = Math.max(0, alpha)
        ctx.font = `${p.size}px system-ui, -apple-system, Segoe UI, emoji`
        ctx.fillStyle = `hsl(${p.hue}, 70%, 70%)`
        ctx.shadowColor = 'rgba(0,0,0,0.15)'
        ctx.shadowBlur = 2
        ctx.fillText(p.char, 0, 0)
        ctx.restore()
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999
      }}
      aria-hidden="true"
    />
  )
}

export default CursorFlowers


