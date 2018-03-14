import Component from './component'

export function getDOM(comp) {
  let rendered = comp.__rendered
  while (rendered instanceof Component) {
    rendered = rendered.__rendered
  }
  return rendered
}

/**
 *
 * @param leftProps {object} newProps
 * @param rightProps {object} oldProps
 */
export function diffObject(leftProps, rightProps) {
  const onlyInLeft = {}, // 只存在于left
        onlyInRight = {}, // 只存在于right
        bothLeft = {}, // 两者都有
        bothRight = {} // 两者都有

  for (let key in leftProps) {
    if (!rightProps[key]) {
      onlyInLeft[key] = leftProps[key]
    } else {
      bothLeft[key] = leftProps[key]
      bothRight[key] = rightProps[key]
    }
  }

  for (let key in rightProps) {
    if (!leftProps[key]) {
      onlyInRight[key] = rightProps[key]
    }
  }

  return {
    onlyInRight,
    onlyInLeft,
    bothIn: {
      left: bothLeft,
      right: bothRight
    }
  }
}
