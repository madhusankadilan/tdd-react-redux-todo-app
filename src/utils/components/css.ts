export const getClassNames = (
   defaultClass: string,
   properties: string[],
   customClasses?: string,
) => {
   const prefix = `dc-${defaultClass}`;
   const classes = [
      prefix,
      ...properties.map((property) => `${prefix}-${property}`),
      customClasses,
   ]
      .join(" ")
      .trim();
   return classes;
};
