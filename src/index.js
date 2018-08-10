import fs from 'fs';
import path from 'path';
import { has, union } from 'lodash';
import parser from './parser';

 const propertyActions1 = [
     {
      getNewValue: o2 => 0,
      getOldValue: o1 => 0,
      getChildren: (o1, o2) => makeAst(o1, o2),
      check: (o1, o2) => o1 instanceof Object && o2 instanceof Object,
    },
    {
      getNewValue: o2 => o2,
      getOldValue: o1 => o1,
      getChildren: (o1, o2) => [],
      check: (o1, o2) => o1 !== undefined && o2 !== undefined,
    },
    {
      getNewValue: o2 => null,
      getOldValue: o1 => o1,
      getChildren: (o1, o2) => [],
      check: (o1, o2) => o1 !== undefined,
    },
    {
      getNewValue: o2 => o2,
      getOldValue: o1 => null,
      getChildren: (o1, o2) => [],
      check: (o1, o2) => o2 !== undefined,
    },
  ];

const processItem = (o1, o2, name) => {
  const getPropertyAction = (o1, o2) => propertyActions1.find(({ check }) => check(o1, o2));
  const { 
    getOldValue,
    getNewValue,
    getChildren,
  } = getPropertyAction(o1, o2);

  return { 
    name, 
    oldValue: getOldValue(o1),
    newValue: getNewValue(o2),
    children: getChildren(o1, o2),
  };
}

const makeAst = (obj1, obj2) => {
  const commonKeys = union(Object.keys(obj1), Object.keys(obj2));
  return commonKeys.map(name => processItem(obj1[name], obj2[name], name));
};

export const genDiff = (firstFile, secondFile) => {
  const data1 = fs.readFileSync(firstFile, 'utf8');
  const data2 = fs.readFileSync(secondFile, 'utf8');
  const ext1 = path.extname(firstFile);
  const ext2 = path.extname(secondFile);
  
  const cfgData1 = parser[ext1](data1);
  const cfgData2 = parser[ext2](data2);

  return processItem(cfgData1, cfgData2, 'root');
}

//поменять 0 на что-нибудь
// const propertyActions2 = [
//   {
//     getDiff: `{children.map(render).join('')}`,
//     check: (oldValue, newValue) => oldValue === newValue === 0),
//   },
//   {
//     getDiff: `+ ${name}: ${newValue}`,
//     check: (oldValue, newValue) => oldValue === null,
//   },
//   {
//     getDiff: `- ${name}: ${oldValue}`,
//     check: (oldValue, newValue) => newValue === null,
//   },
//   {
//     getDiff: `  ${name}: ${oldValue}`,
//     check: (oldValue, newValue) => oldValue === newValue,
//   },
//     {
//     getDiff: `- ${name}: ${oldValue}\n+ ${name}: ${newValue}`,
//     check: (oldValue, newValue) => oldValue !== newValue,
//   },
// ];

// const render = (astData) => {
//   const {
//     name, 
//     oldValue, 
//     newValue,
//   } = astData;

//   const getPropertyAction = (oldValue, newValue) => propertyActions.find(({ check }) => check(oldValue, newValue));
  
//   const { getDiff } = getPropertyAction(o1, o2);

const renderObject = (object, offset = 0) => {
  const padding = '  '.repeat(offset);
  return [
    `{`,
    ...Object.keys(object).map(key => {
      const value = object[key];
      return `    ${padding}${key}: ${value}`;
    }),
    `${padding}}`,
  ].join('\n');
}

export const render = (item, offset = 0) => {
  //const result = [];
  //const structure = astData.reduce((acc, item) => {
    const padding = '  '.repeat(offset);
    const {
      name, 
      oldValue, 
      newValue,
      children
    } = item;
    //console.log(children);
    //console.log(name);
    
    // if (name === 'root') {
    //   console.log(0, acc)
    //   return children.map(el => render(el, [ ...acc, `{`]))
    // }

    if (children.length) {
      //console.log(1, acc)

      // return [
      //   ...acc,
      //   `${name}: {`,
      //   ...children.reduce(el => render(el, [])),
      //   `}`
      // ];

      // const a1 = acc;
      //children.reduce((a, child) => [...a, ...render(child)]);
      return [
        `  ${padding}${name}: {`,
        ...children.map(child => render(child, offset + 2)),
        `  ${padding}}`
      ].join('\n');
    }

    let oval = oldValue instanceof Object ? renderObject(oldValue, offset + 1) : oldValue;
    let nval = newValue instanceof Object ? renderObject(newValue, offset + 1) : newValue;

    if (oldValue === null) {
      //console.log(2, acc)
      return `${padding}+ ${name}: ${nval}`;
    }
    if (newValue === null) {
      //console.log(3, acc)
      return `${padding}- ${name}: ${oval}`;
    }
    if (oldValue === newValue) {
      //console.log(4, acc)
      return `${padding}  ${name}: ${oval}`;
    }
    //console.log(5, acc)
    return `${padding}- ${name}: ${oval}\n${padding}+ ${name}: ${nval}`;

 // });
 // return structure.join("\n");
};


// root {
//  level1 
//  {
//   level1.1
//  }
//  level2 
//  {
//   level2.2
//   level2.3
//   level2.4
//  } 
//  level3
//   level3.3
// }

// const render = (tree) => {
//   const result = [];

//   const body = (item, offset) => {
//     const padding = ' '.repeat(offset);
//     const name = `${padding}${item.name}`;
//     result.push(name);
//     if (item.children) {
//       result.push(`${padding}{`);
//     }

//     if (item.children) {
//       item.children.map(i => body(i, offset+1));
//     }

//     if (item.children) {
//       result.push(`${padding}}`);
//     }
//   }

//   body(tree, 0);
//   return result.join("\n");
// } 
  
// if (singleTagsList.has(name)) {
//     return [`<${name}${buildAttrString(attributes)}>`,
//       `${body}${children.map(render).join('')}`,
//     ].join('');
//   }
//   return [`<${name}${buildAttrString(attributes)}>`,
//       `${body}${children.map(render).join('')}`,
//       `</${name}>`,
//     ].join('')


// export default genDiff;


//   const fullDiff = commonKeys.map((key) => {
//     const cfgDataValue1 = cfgData1[key];
//     const cfgDataValue2 = cfgData2[key];
//     if (has(cfgData1, key) && has(cfgData2, key)) {
//       if (cfgDataValue1 === cfgDataValue2) {
//         return `    ${key}: ${cfgDataValue1}`;
//       }
//       return `  - ${key}: ${cfgDataValue1}\n  + ${key}: ${cfgDataValue2}`;
//     }

//     if (has(cfgData1, key)) {
//       return `  - ${key}: ${cfgDataValue1}`;
//     }
//     return `  + ${key}: ${cfgDataValue2}`;
//   });
//   return ['{', ...fullDiff, '}'].join('\n');
// };

//export default genDiff;


