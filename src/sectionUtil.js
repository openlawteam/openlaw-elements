// @flow

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

const getVariablesWithNoSection = (variables, addedVariables) => {
  return variables.filter(
    variable => addedVariables.indexOf(variable) === -1,
  );
};

export const GetSections = (
  variables: Array<string>,
  sectionVariables: {[string]: any},
  sections: Array<string>,
) => {
  let addedVariables = [];
  const collapsibles = sections
    .filter(
      section =>
        getVariablesForSection(
          section,
          variables,
          sectionVariables,
          addedVariables,
        ).length > 0,
    )
    .map(section => {
      const currentVariables = getVariablesForSection(
        section,
        variables,
        sectionVariables,
        addedVariables,
      );

      addedVariables = addedVariables.concat(currentVariables);
      return {
        section,
        variables: currentVariables,
      };
    });

  const orphanVariables = getVariablesWithNoSection(
    variables,
    addedVariables,
  );

  if (orphanVariables.length > 0) {
    collapsibles.push({
      section: 'Misc.',
      variables: orphanVariables,
    });
  }

  return collapsibles;
};
