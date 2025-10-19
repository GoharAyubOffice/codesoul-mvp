// components/viz/NeuralRepo.tsx
"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useMemo } from 'react'
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
        
        return (
          <group key={node.id} position={position}>
            {/* Node sphere */}
            <mesh>
              <sphereGeometry args={[node.size * 0.3, 16, 16]} />
              <meshStandardMaterial 
                color={node.color} 
                emissive={node.color} 
                emissiveIntensity={0.2}
              />
            </mesh>
            
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
