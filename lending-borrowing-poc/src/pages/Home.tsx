import React, { useState, useEffect } from 'react'
import { useTrail, a } from '@react-spring/web'
import { useNavigate } from 'react-router-dom'


import styles from './styles.module.css'

const Trail: React.FC<{ open: boolean }> = ({ open, children }) => {
  const items = React.Children.toArray(children)
  const trail = useTrail(items.length, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    height: open ? 110 : 0,
    from: { opacity: 0, x: 20, height: 0 },
  })
  return (
    <div>
      {trail.map(({ height, ...style }, index) => (
        <a.div key={index} className={styles.trailsText} style={{ ...style, marginBottom: '20px' }}>
          <a.div style={{ height }}>{items[index]}</a.div>
        </a.div>
      ))}
    </div>
  )
}

export default function Home() {
  const [open, set] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        navigate('/main')
      }, 1000) 
    }
  }, [open, navigate])

  return (
    <div className={styles.container} onClick={() => set(state => !state)}>
      <Trail open={open}>
        <span>Lending</span>
        <span>Borrowing</span>
        <span>NFT</span>
        <span>Collateralized</span>
      </Trail>
    </div>
  )
}