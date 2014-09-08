import ast


code = '''
class Base(object):
    first = "Hello"
    second = "World"
    full = first + " " + second

class Derived(Base):
    first = "Hi"
    
print Derived().full
'''

class IdentifierToMemberTransformer(ast.NodeTransformer):
    def visit_Name(self, node):
        return ast.Attribute(
            value=ast.Name(id='self', ctx=ast.Load(), lineno=node.lineno, col_offset=node.col_offset), attr=node.id, ctx=ast.Load(),
            lineno = node.lineno, col_offset = node.col_offset
            )

class ValueToPropertyTransformer(ast.NodeTransformer):
    def visit_Assign(self, node):
        def _(t, *args, **kwargs):
            return t(*args, lineno=node.lineno, col_offset=node.col_offset, **kwargs)
        
        expression = IdentifierToMemberTransformer().visit(node.value)
        
        return _(ast.FunctionDef,
          name=node.targets[0].id,
          args=ast.arguments(args=[_(ast.Name, id='self', ctx=ast.Param())], vararg=None, kwarg=None, defaults=[]),
          body=[_(ast.Return, value=expression)],
          decorator_list=[_(ast.Name, id='property', ctx=ast.Load())])
        
tree = ast.parse(code)
converted_tree = ValueToPropertyTransformer().visit(tree)

module = compile(tree, '<string>', 'exec')
exec module