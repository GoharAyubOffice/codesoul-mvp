// components/viz/CodeTree.tsx
"use client"
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useMemo, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'

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

interface CodeTreeProps {
  data: RepoData
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

function CodeTree({ data }: { data: RepoData }) {
  const { nodes, links } = data

  const { scale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
    delay: 200,
  })

  // Create tree-like node positions
  const nodePositions = useMemo(() => {
    const positions: { [key: string]: [number, number, number] } = {}
    
    // Find root node (main branch)
    const rootNode = nodes.find(node => node.type === 'root') || nodes[0]
    const otherNodes = nodes.filter(node => node.id !== rootNode.id)
    
    // Position root at center-top
    positions[rootNode.id] = [0, 4, 0]
    
    // Position other nodes in a tree pattern
    otherNodes.forEach((node, index) => {
      const angle = (index / otherNodes.length) * Math.PI * 2
      const radius = 3
      const height = 2 - (index * 0.5)
      
      const x = Math.cos(angle) * radius
      const y = height
      const z = Math.sin(angle) * radius
      
      positions[node.id] = [x, y, z]
    })
    
    return positions
  }, [nodes])

  return (
    <animated.group scale={scale}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, 5, -5]} intensity={0.3} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2d5016" transparent opacity={0.3} />
      </mesh>

      {/* Nodes */}
      {nodes.map((node) => {
        const position = nodePositions[node.id]
        if (!position) return null
        
        const isRoot = node.type === 'root'
        
        return (
          <group key={node.id} position={position}>
            {/* Node geometry - different shapes for different types */}
            {isRoot ? (
              <mesh>
                <cylinderGeometry args={[node.size * 0.4, node.size * 0.2, node.size * 0.8, 8]} />
                <meshStandardMaterial 
                  color={node.color} 
                  emissive={node.color} 
                  emissiveIntensity={0.3}
                />
              </mesh>
            ) : (
              <mesh>
                <sphereGeometry args={[node.size * 0.3, 12, 12]} />
                <meshStandardMaterial 
                  color={node.color} 
                  emissive={node.color} 
                  emissiveIntensity={0.2}
                />
              </mesh>
            )}
            
            {/* Node label */}
            <Text
              position={[0, node.size * 0.5 + 0.8, 0]}
              fontSize={0.25}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {node.label}
            </Text>
          </group>
        )
      })}

      {/* Tree trunk/connections */}
      {links.map((link, index) => {
        const sourcePos = nodePositions[link.source]
        const targetPos = nodePositions[link.target]
        
        if (!sourcePos || !targetPos) return null
        
        // Create a thicker connection for tree branches
        const points = [sourcePos, targetPos]
        const geometry = new THREE.BufferGeometry().setFromPoints(
          points.map(point => new THREE.Vector3(...point))
        )
        
        return (
          <line key={index} geometry={geometry}>
            <lineBasicMaterial 
              color="#8B4513" 
              opacity={0.8} 
              transparent 
              linewidth={link.weight * 2}
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
        maxDistance={25}
      />
      
      {/* Screenshot capture component */}
      <ScreenshotCapture ref={(ref) => {
        if (ref) {
          // Store the screenshot function globally for the share button
          ;(window as any).captureTreeScreenshot = ref.captureScreenshot
        }
      }} />
    </animated.group>
  )
}

export default function CodeTreeViz({ data }: CodeTreeProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
      <Canvas camera={{ position: [0, 5, 15], fov: 75 }}>
        <CodeTree data={data} />
      </Canvas>
      
      {/* Overlay info */}
      <div className="absolute top-4 left-4 text-white">
        <h2 className="text-xl font-bold mb-2">🌳 Code Tree</h2>
        <p className="text-sm opacity-80">
          Repository structure as a growing tree
        </p>
      </div>
    </div>
  )
}
