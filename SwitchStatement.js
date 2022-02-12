export default function (babel) {
  const { types: t } = babel;

  const condList = [];

  return {
    name: "ast-transform", // not required
    visitor: {
      // SwitchStatement
      SwitchStatement(path) {
        const casesList = path.node.cases;
        casesList.map((c) => {
          const callFunList = c.consequent;
          callFunList.map((cFunction) => {
            if (
              cFunction.type === "ExpressionStatement" &&
              cFunction.expression.type === "CallExpression"
            ) {
              const args = cFunction.expression.arguments[0].properties;
              condList.push({
                key: c.test.value,
                serviceName: cFunction.expression.callee.name,
                serviceParams: args.map((arg) => {
                  return {
                    key: arg.key.name,
                    value: arg.value.value,
                  };
                }),
              });
            }
          });
        });
        console.log(condList);
      },
    },
  };
}
