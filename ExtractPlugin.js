let babel = require('babel-core');
let types = require('babel-types');
let visitor = {
    ImportDeclaration(path, ref = { opts: {} }) {
        ref.opts = { "library": "lodash" }; // 测试时用，正常应该是 bebel 传入
        const { node } = path;
        if (!node) return;
        // ImportDeclaration.source 即开发者 import 引入的包名称，此处是 lodash
        const { value } = node.source;
        // 从 .babelrc 中配置的参数项，获取插件作用库的范围，此处是 lodash
        const { library } = ref.opts;
        // 获取转换前的 specifiers ，遍历它来生成对应数量的 importDeclaration (即新的导入语句)
        const { specifiers } = node;
        if (value == library && !types.isImportDefaultSpecifier(specifiers[0])) {
            let newImports = specifiers.map(specifier => (
                // 语法：t.importDeclaration(specifiers, source)
                types.importDeclaration(
                    // 此处 specifiers 就只有一个元素
                    // 语法：t.importDefaultSpecifier(local) 
                    [ types.importDefaultSpecifier(specifier.local) ], 
                    // source 的值是拼接出来的
                    // 语法：t.stringLiteral(value)
                    types.stringLiteral(`${node.source.value}/${specifier.local.name}`)
                )
            ));
            path.replaceWithMultiple(newImports);
        }
    }
};

// 测试代码
let result = babel.transform(`import { flatten, concat } from 'lodash';`, {
    plugins: [{
        visitor
    }]
});
console.log(result.code);

// 发布代码
module.exports = { visitor };