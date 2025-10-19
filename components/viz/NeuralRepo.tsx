// components/viz/NeuralRepo.tsx
"use client"
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useMemo, useRef, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'

interface Node {
  id: string
  size: number
  color: string
  type: string
  label: string
}

interface Link {
  source: string
  target: string
  weight: number
}

interface RepoData {
  nodes: Node[]
  links: Link[]
  metadata: {
    repoName: string
    totalBranches: number
    totalCommits: number
    lastUpdated: string
  }
}

interface NeuralRepoProps {
  data: RepoData
}

function GlowingNode({ node, position }: { node: Node, position: [number, number, number] }) {
  const spriteRef = useRef<THREE.Sprite>(null)

  useFrame(({ clock }) => {
    if (spriteRef.current) {
      const scale = 1.5 + Math.sin(clock.getElapsedTime() * 2) * 0.5
      spriteRef.current.scale.set(node.size * scale, node.size * scale, 1)
    }
  })

  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const context = canvas.getContext('2d')!
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.2, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.2)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(canvas)
  }, [])

  return (
    <group position={position}>
      {/* Node sphere */}
      <mesh>
        <sphereGeometry args={[node.size * 0.3, 16, 16]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Glow sprite */}
      <sprite ref={spriteRef} scale={[node.size * 2, node.size * 2, 1]}>
        <spriteMaterial
          map={glowTexture}
          color={node.color}
          transparent
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* Node label */}
      <Text
        position={[0, node.size * 0.5 + 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {node.label}
      </Text>
    </group>
  )
}

// Component to expose screenshot functionality
const ScreenshotCapture = forwardRef<{ captureScreenshot: () => string | null }>((props, ref) => {
  const { gl, scene, camera } = useThree()
  
  useImperativeHandle(ref, () => ({
    captureScreenshot: () => {
      try {
        // Render the scene
        gl.render(scene, camera)
        
        // Get the canvas data
        const canvas = gl.domElement
        return canvas.toDataURL('image/png', 0.9)
      } catch (error) {
        console.error('Error capturing screenshot:', error)
        return null
      }
    }
  }))
  
  return null
})

function NeuralNetwork({ data }: { data: RepoData }) {
  const { nodes, links } = data

  // Create node positions in a neural network pattern
  const nodePositions = useMemo(() => {
    const positions: { [key: string]: [number, number, number] } = {}
    
    // Arrange nodes in layers
    const layers = 3
    const nodesPerLayer = Math.ceil(nodes.length / layers)
    
    nodes.forEach((node, index) => {
      const layer = Math.floor(index / nodesPerLayer)
      const positionInLayer = index % nodesPerLayer
      
      const x = (layer - 1) * 4 // Spread layers horizontally
      const y = (positionInLayer - nodesPerLayer / 2) * 2 // Spread vertically within layer
      const z = Math.sin(index) * 2 // Add some depth variation
      
      positions[node.id] = [x, y, z]
    })
    
    return positions
  }, [nodes])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Nodes */}
      {nodes.map((node) => {
        const position = nodePositions[node.id]
        if (!position) return null
        
        return <GlowingNode key={node.id} node={node} position={position} />
      })}

      {/* Connections */}
      {links.map((link, index) => {
        const sourcePos = nodePositions[link.source]
        const targetPos = nodePositions[link.target]
        
        if (!sourcePos || !targetPos) return null
        
        const points = [sourcePos, targetPos]
        const geometry = new THREE.BufferGeometry().setFromPoints(
          points.map(point => new THREE.Vector3(...point))
        )
        
        return (
          <line key={index} geometry={geometry}>
            <lineBasicMaterial 
              color="#ffffff" 
              opacity={0.6} 
              transparent 
              linewidth={link.weight}
            />
          </line>
        )
      })}

      {/* Controls */}
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
      />
      
      {/* Screenshot capture component */}
      <ScreenshotCapture ref={(ref) => {
        if (ref) {
          // Store the screenshot function globally for the share button
          ;(window as any).captureNeuralScreenshot = ref.captureScreenshot
        }
      }} />
    </>
  )
}

export default function NeuralRepoViz({ data }: NeuralRepoProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <NeuralNetwork data={data} />
      </Canvas>
      
      {/* Overlay info */}
      <div className="absolute top-4 left-4 text-white">
        <h2 className="text-xl font-bold mb-2">🧠 Neural Repository</h2>
        <p className="text-sm opacity-80">
          Branches as neurons, connections as merge relationships
        </p>
      </div>
    </div>
  )
}
