export const bestPrediction = (faces: any[]) => {
    return faces.reduce(
      (prev, curr) => (curr.confidence > prev.confidence ? curr : prev),
      faces[0]
    );
  };

export const bestDetection = (detections: any[]) => {
  return detections.reduce(
    (prev, curr) =>
      curr.categories[0].score > prev.categories[0].score ? curr : prev,
    detections[0]
  );
}