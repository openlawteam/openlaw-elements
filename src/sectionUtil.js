// @flow

type GetSectionConfigType = {
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
  sections: Array<string>,
  config: GetSectionConfigType,
) => {
  const getUnsectionedTitle = () => {
    const { unsectionedTitle } = config;
    // set to string null value by the user
    if (unsectionedTitle === '') return null;

    // there's a value set by the user
    if (unsectionedTitle) return unsectionedTitle;

    // default
    return 'Miscellaneous';
  };

  const mappedSections: Array<any> = sections
    .map(section => {
      const currentVariables = getVariablesForSection(section, variables, sectionVariables, []);
      if (currentVariables.length > 0) {
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
