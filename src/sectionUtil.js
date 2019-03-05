// @flow

type SectionVariablesMapType = { [string]: Array<string> };

type GetSectionConfigType = {
  sectionTransform?: (any, number) => {},
  sectionVariablesMap?: (any, number, Array<string>) => SectionVariablesMapType,
  unsectionedTitle?: string,
};

const getVariablesForSection = (sectionVariables, variables) => (
  sectionVariables
    .map(name => variables[variables.indexOf(name)])
    // get rid of any `undefined` slots
    .filter(section => section && true)
);

const getUnsectionedTitle = (unsectionedTitle) => {
  // set to string null value by the user
  if (unsectionedTitle === '') return '';
  // there's a value set by the user
  if (unsectionedTitle) return unsectionedTitle;
  // default
  return 'Miscellaneous';
};

export const GetSections = (
  variables: Array<string>,
  sectionVariables: SectionVariablesMapType,
  sections: Array<any>,
  config: GetSectionConfigType,
) => {
  const { sectionTransform, sectionVariablesMap } = config;

  const mappedSections: Array<any> = sections
    .map((section, index) => {
      const sectionVariablesFromConfig = sectionVariablesMap && sectionVariablesMap(section, index, variables);

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

  const unsectionedVariables = (
    variables
      .filter(v => {
        const flattedSectionVariables = mappedSections
          .reduce((acc, o) => acc.concat(o.variables), []);

        return flattedSectionVariables.indexOf(v) === -1;
      })
  );

  // give the unsectioned variables a home in their own section
  if (unsectionedVariables.length) {
    let sectionData;

    // user has a desired section data shape for display purposes
    if (sectionTransform) {
      const index = mappedSections.length;

      sectionData = {
        ...sectionTransform(getUnsectionedTitle(config.unsectionedTitle), index),
        variables: unsectionedVariables,
      };
    } else {
      sectionData = {
        section: getUnsectionedTitle(config.unsectionedTitle),
        variables: unsectionedVariables,
      };
    }

    mappedSections.push(sectionData);
  }

  return mappedSections;
};
