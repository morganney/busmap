const getPredsKey = (agencyTitle: string, routeTitle: string, stopId: string) => {
  return `${agencyTitle}::${routeTitle}::${stopId}`
}

export { getPredsKey }
