import { Text } from '@react-three/drei'
const CommunityChestBox = ({ position }) => {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1, 0.2, 0.5]} />
        <meshStandardMaterial color='lightblue' />
      </mesh>
      <Text position={[0, 0.11, 0]} fontSize={0.08}>
        Community Chest
      </Text>
    </group>
  )
}
export default CommunityChestBox
