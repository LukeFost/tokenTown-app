import { Text } from '@react-three/drei'

const ChanceBox = ({ position }) => {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1, 0.2, 0.5]} />
        <meshStandardMaterial color='orange' />
      </mesh>
      <Text position={[0, 0.11, 0]} fontSize={0.08}>
        Chance
      </Text>
    </group>
  )
}

export default ChanceBox
