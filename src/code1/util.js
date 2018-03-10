import Component from './component'

export function getDOM (comp) {
  let rendered = comp.__rendered
  while (rendered instanceof Component) {
    rendered = rendered.__rendered
  }
  return rendered
}