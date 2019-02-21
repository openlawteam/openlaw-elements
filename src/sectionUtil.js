// @flow

type SectionVariablesMapType = { [string]: Array<string> };

type GetSectionConfigType = {
  sectionTransform?: (any, number) => {},
  sectionVariablesMap?: (any, number) => SectionVariablesMapType,
  unsectionedTitle?: string,
};

const getVariablesForSection = (sectionVariables, variables) => (
  sectionVariables
    .map(name => variables[variables.indexOf(name)])
    // get rid of any `undefined` slots
    .filter(section => section && true)
);

export const GetSections = (
  variables: Array<string>,
  sectionVariables: SectionVariablesMapType,
  sections: Array<any>,
  config: GetSectionConfigType,
) => {
  const getUnsectionedTitle = () => {
    const { unsectionedTitle } = config;
    // set to string null value by the user
    if (unsectionedTitle === '') return '';
    // there's a value set by the user
    if (unsectionedTitle) return unsectionedTitle;
    // default
    return 'Miscellaneous';
  };

  const mappedSections: Array<any> = sections
    .map((section, index) => {
      const { sectionTransform, sectionVariablesMap } = config;
      const sectionVariablesFromConfig = sectionVariablesMap && sectionVariablesMap(section, index);

      const [ userSectionKey ] = sectionVariablesFromConfig ? Object.keys(sectionVariablesFromConfig) : [];

      const currentSectionVariables =
        (sectionVariablesFromConfig && Object.keys(sectionVariablesFromConfig).length)
          // user provided an object with the same shape via props
          ? getVariablesForSection(sectionVariablesFromConfig[userSectionKey], variables)
          // normal
          : getVariablesForSection(sectionVariables[section], variables);

      if (currentSectionVariables.length) {
        // user has a desired section data shape for display purposes
        if (sectionTransform) {
          return {
            ...sectionTransform(section, index),
            variables: currentSectionVariables,
          };
        }

        return {
          section,
          variables: currentSectionVariables,
        };
      }
    })
    // get rid of any `undefined` slots
    .filter(section => section && true);

  const orphanVariables = (
    variables
      .filter(v => {
        const flattedSectionVariables = mappedSections
          .reduce((acc, o) => acc.concat(o.variables), []);

        return flattedSectionVariables.indexOf(v) === -1;
      })
  );

  if (orphanVariables.length > 0) {
    mappedSections.push({
      section: getUnsectionedTitle(),
      variables: orphanVariables,
    });
  }

  return mappedSections;
};
