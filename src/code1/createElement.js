export function createElement(type, props, ...args) {
  let children = []
  for (let i = 0; i < args.length; i++) {
    if (Array.isArray(args[i])) {
      children = [ ...children, ...args[i] ]
    } else {
      children = [ ...children, args[i] ]
    }
  }

  return {
    type,
    children,
    props: props || {},
  }
}