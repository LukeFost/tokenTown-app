function Skybox() {
  const size = 10 // Distance from the center
  const halfSize = size / 2

  return (
    <>
      {/* Front */}
      <mesh position={[0, 0, -halfSize]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color='skyblue' />
      </mesh>

      {/* Back */}
      <mesh position={[0, 0, halfSize]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color='skyblue' />
      </mesh>

      {/* Top - Flipped */}
      <mesh position={[0, halfSize, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color='skyblue' />
      </mesh>

      {/* Bottom - Flipped */}
      <mesh position={[0, -halfSize, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color='skyblue' />
      </mesh>

      {/* Right */}
      <mesh position={[halfSize, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color='skyblue' />
      </mesh>

      {/* Left */}
      <mesh position={[-halfSize, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color='skyblue' />
      </mesh>
    </>
  )
}

export default Skybox
