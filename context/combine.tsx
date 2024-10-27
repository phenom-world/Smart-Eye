import React, { ReactNode } from 'react';

type ComponentFunction = React.FC<{ children: ReactNode }>;

export const combineComponents = (...components: ComponentFunction[]): React.FC<{ children: ReactNode }> => {
  return components.reduce(
    (AccumulatedComponents, CurrentComponent) => {
      return ({ children }) => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }) => <>{children}</>
  );
};
