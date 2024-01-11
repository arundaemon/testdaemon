import CubeDataset from "../../config/interface"

export const getLeadCount = (data) => {
  let count = []

  if (data && data?.[CubeDataset.BdeactivitiesBq.count]) {
    count.push(data?.[CubeDataset.BdeactivitiesBq.count]/100)
    count.push("#FA9E2D")
    return count
  }
}

export const getBuAvg = (data) => {
  let count = []

  if (data && data?.[CubeDataset.BdeactivitiesBq.count]) {
    let avgCCount = data?.[CubeDataset.BdeactivitiesBq.buAverage]
    if (avgCCount > 0) {
      count.push(avgCCount/100)
      count.push("#4482FF")
      return count
    }
    else {
      return count
    }
  }
}

export const getNationalAvg = (data) => {
  let count = []

  if (data && data?.[CubeDataset.BdeactivitiesBq.count]) {
    let avgCCount = data?.[CubeDataset.BdeactivitiesBq.nationalAverage]
    
    if (avgCCount > 0) {
      count.push(avgCCount/100)
      count.push("#E46179")
      return count
    }
    else {
      return count
    }
  }
}

export const getMaxAttendance = (data) => {
  if (data) {
    return data
  }
  else {
    return 0
  }
}

export const getMinAttendance = (data) => {
  if (data) {
    return data
  }
  else {
    return 0
  }
}

export const getTargetPosition = (target, max) => {
  return ((100 * target) / max)
}

export const getCurrentStatus = (current, max) => {
  if (current > max) {
    return ((100 * max) / max)
  }
  else {
    return ((100 * current) / max)
  }
}