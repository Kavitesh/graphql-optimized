const { parse, print, visit, visitWithTypeInfo, TypeInfo } = require('graphql');
const accessRules = require('./accessRules');
const executableSchema = require('./executableSchema');

function filterQueryBasedOnRole(query, userRole) {
  const typeInfo = new TypeInfo(executableSchema);

  const visitor = {
    Field(node) {
      const parentType = typeInfo.getParentType();
      const fieldDef = typeInfo.getFieldDef();

      if (fieldDef) {
        const requiredRoles = accessRules[parentType.name] && accessRules[parentType.name][fieldDef.name];
        if (!requiredRoles || !requiredRoles.includes(userRole)) {
          return null; // Remove field if user role does not have access
        }
      }

      return {
        ...node,
        selectionSet: node.selectionSet
      };
    },
  };

  const ast = parse(query);
  const filteredAst = visit(ast, visitWithTypeInfo(typeInfo, visitor));
  return print(filteredAst);
}

module.exports = filterQueryBasedOnRole;
