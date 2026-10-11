
import * as THREE from "three";

/**
 * Sort objects from farthest to nearest using camera-space depth.
 * The camera must be updated before this function is called.
 */
export function sortBackToFront(objects, camera) {
  camera.updateMatrixWorld(true);

  const cameraPosition = new THREE.Vector3();
  const cameraForward = new THREE.Vector3();

  camera.getWorldPosition(cameraPosition);
  camera.getWorldDirection(cameraForward);

  return objects
    .map((item) => {
      const worldPosition = new THREE.Vector3(...item.position);

      // Positive distance along the camera's viewing direction.
      const depth = worldPosition
        .sub(cameraPosition)
        .dot(cameraForward);

      return { ...item, depth };
    })
    .sort((a, b) => b.depth - a.depth);
}
