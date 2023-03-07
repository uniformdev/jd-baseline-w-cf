import { enhance, EnhancerBuilder, RootComponentInstance } from '@uniformdev/canvas';
import { extendEnhancerByCanvasComponents } from './enhancers/canvasComponentsEnhancer';
import { getBundledEnhancers } from './enhancers/bundledEnhancers';

export const enhanceComposition = async ({
  composition,
  preEnhancer,
  extendEnhancer,
  preview = false,
}: {
  composition: RootComponentInstance;
  preEnhancer?: EnhancerBuilder;
  extendEnhancer?: (enhancer: EnhancerBuilder) => void;
  preview?: boolean;
}) => {
  // 1. apply pre enhancers
  if (preEnhancer) {
    await enhance({
      composition,
      enhancers: preEnhancer,
      context: { preview },
    });
  }

  // 2. apply bundled enhancers
  const bundledEnhancers = await getBundledEnhancers(composition);

  // 3. extend enhancer by app specific params
  if (extendEnhancer) extendEnhancer(bundledEnhancers);

  // 4. extend enhancer by common params
  extendEnhancerByCanvasComponents(bundledEnhancers);

  await enhance({
    composition,
    enhancers: bundledEnhancers,
    context: { preview },
  });
};
