export const bestPrediction = (faces: any[]) => {
    return faces.reduce(
      (prev, curr) => (curr.confidence > prev.confidence ? curr : prev),
      faces[0]
    );
  };