function labelGenerator(targetClass) {
  let ifLabelCount = 0;
  let whileLabelCount = 0;
  let funcLabel = '';
  let funcType = '';

  getIfElseLabels = () => {
    const labels = {
      ifTrue: `${targetClass}_IF_TRUE${ifLabelCount}`,
      ifFalse: `${targetClass}_IF_FALSE${ifLabelCount}`,
      ifEnd: `${targetClass}_IF_END${ifLabelCount}`,
    }
    ifLabelCount++;
    return labels;
  }

  getIfLabels = () => {
    const labels = {
      endLabel_L2: `${targetClass}_IF_L2_${ifLabelCount}`,
    }
    ifLabelCount++;
    return labels;
  }

  getWhileLabels = () => {
    const labels = {
      startLabel_L1: `${targetClass}_WHILE_EXP${whileLabelCount}`,
      exitLabel_L2: `${targetClass}_WHILE_END${whileLabelCount}`,
    }
    whileLabelCount++;
    return labels;
  }

  setFunctionLabel = (functionName) => {funcLabel = `${targetClass}.${functionName}`};
  getFunctionLabel = () => funcLabel;

  setFunctionType = (type) => {funcType = type};
  getFunctionType = () => funcType

  return {
    getIfElseLabels,
    getIfLabels,
    getWhileLabels,
    setFunctionLabel,
    getFunctionLabel,
    setFunctionType,
    getFunctionType,
  }
}

module.exports = labelGenerator;
