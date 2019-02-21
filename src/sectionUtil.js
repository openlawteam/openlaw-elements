// @flow

type SectionCollectionType = Array<any>;

type GetSectionConfigType = {
  transform?: (SectionCollectionType, number) => {},
  unsectionedTitle?: string,
};

const getVariablesForSection = (
  section: string,
  variables: Array<string>,
  sectionVariables: {[string]: Array<string>},
  addedVariables: Array<string>,
) => {
  return sectionVariables[section]
    .map(name => variables.filter(variable => variable === name)[0])
    .filter(
      variable => !!variable && addedVariables.indexOf(variable) === -1,
    );
};

export const GetSections = (
  variables: Array<string>,
  sectionVariables: {[string]: any},
  sections: SectionCollectionType,
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
      const currentVariables = getVariablesForSection(section, variables, sectionVariables, []);
      const { transform } = config;

      if (currentVariables.length > 0) {
        // user has a desired section data shape
        if (transform) {
          return {
            ...transform(section, index),
            variables: currentVariables,
          };
        }

        return {
          section,
          variables: currentVariables,
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
