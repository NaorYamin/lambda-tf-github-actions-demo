export const parseStageVarsToEnv = (stageVariables) => {
  if (!stageVariables) return;
  Object.keys(stageVariables).forEach((key) => {
    process.env[key] = stageVariables[key];
  });
};
