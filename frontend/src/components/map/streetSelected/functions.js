export const findComponentAddress = (names, streetSelected) => {
  const componentFound = streetSelected[0].address_components.find(
    (component) => {
      let componentName = names.find((name) => component.types.includes(name));

      if (componentName) return component;
    }
  );
  return componentFound;
};
