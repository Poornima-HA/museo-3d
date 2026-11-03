import * as THREE from "three";

/**
 * PAINTER'S ALGORITHM — VISIBILITY DETERMINATION UTILITY
 * 
 * In computer graphics, Painter's Algorithm solves the hidden-surface removal
 * problem in object/polygon space by sorting surfaces by depth and rasterizing
 * them from farthest to nearest (back-to-front).
 * 
 * Mathematical Formulation:
 * Given a camera with world position P_cam and normalized forward vector v_fwd,
 * the depth d of an object with world position P_obj is the scalar projection
 * of the displacement vector onto the viewing direction:
 * 
 *    d = (P_obj - P_cam) · v_fwd
 * 
 * Sorting Rule for Back-to-Front:
 * For two objects A and B with depths d_A and d_B:
 * If d_A > d_B, then object A is farther from the camera plane than object B.
 * Object A must be rasterized prior to object B.
 */

/**
 * Calculates camera-space depth along the camera's viewing ray.
 * @param {THREE.Vector3} objectPosition 
 * @param {THREE.Camera} camera 
 * @returns {number} scalar depth value
 */
export function calculateCameraDepth(objectPosition, camera) {
  camera.updateMatrixWorld(true);

  const cameraPosition = new THREE.Vector3();
  const cameraForward = new THREE.Vector3();

  camera.getWorldPosition(cameraPosition);
  camera.getWorldDirection(cameraForward);

  const worldPos = objectPosition instanceof THREE.Vector3 
    ? objectPosition.clone() 
    : new THREE.Vector3(...objectPosition);

  // Projection of (P_obj - P_cam) onto camera forward vector
  return worldPos.sub(cameraPosition).dot(cameraForward);
}

/**
 * Sorts an array of 3D objects from farthest to nearest (back-to-front).
 * Each object should have a `position` property: [x, y, z].
 * 
 * @param {Array} objects - Array of items with position: [x, y, z]
 * @param {THREE.Camera} camera - Active Three.js perspective camera
 * @returns {Array} Sorted array with attached `depth` values
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
      const depth = worldPosition.sub(cameraPosition).dot(cameraForward);
      return { ...item, depth };
    })
    .sort((a, b) => b.depth - a.depth); // Descending order: largest depth first
}

/**
 * Evaluates whether an ordered sequence of objects satisfies
 * the strict back-to-front drawing order based on their true depths.
 * 
 * @param {Array} currentOrder - Array of objects as arranged by user
 * @param {Array} trueSortedOrder - Ground-truth back-to-front sorted objects
 * @returns {boolean} true if sequence is strictly sorted
 */
export function verifyBackToFrontOrder(currentOrder, trueSortedOrder) {
  if (currentOrder.length !== trueSortedOrder.length) return false;
  return currentOrder.every((item, idx) => item.id === trueSortedOrder[idx].id);
}
